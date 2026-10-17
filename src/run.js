'use strict';
/**
 * A run lives in results/<runId>/ and is append-only:
 *   manifest.json                 version, fingerprint, models, judges, stage, environment
 *   generations/<task>__<model>__r<n>.json
 *   judgments/<judge>__<task>__p<pass>__g<i>.json
 *   checks/<judge>__<task>__<model>__r<n>.json
 * Every step skips files that already exist, so an interrupted run resumes where it
 * stopped and nothing is paid for twice. The report is computed from these files alone.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { callModel, costOf } = require('./providers');
const { renderPrompt, ROOT } = require('./spec');
const { metaText } = require('./score/deterministic');

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJson = (f, d) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
};

function runDir(runId) {
  return path.join(ROOT, 'results', runId);
}

function gitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function writeManifest(runId, bench, { models, stage, runs }) {
  const f = path.join(runDir(runId), 'manifest.json');
  if (fs.existsSync(f)) {
    const m = readJson(f);
    if (m.fingerprint !== bench.fingerprint) {
      throw new Error(
        `run ${runId} was started with benchmark fingerprint ${m.fingerprint}, current is ${bench.fingerprint}`
      );
    }
    // Models may be added to a run; record them.
    m.models = [...new Set([...m.models, ...models.map((x) => x.key)])];
    writeJson(f, m);
    return m;
  }
  const m = {
    benchmark: `hermes3000-writing-benchmark/${bench.version}`,
    fingerprint: bench.fingerprint,
    privateTasks: bench.privateFingerprint,
    stage,
    runs,
    passes: bench.spec.stages[stage].passes,
    models: models.map((x) => x.key),
    judges: bench.spec.judging.judges,
    started: new Date().toISOString(),
    node: process.version,
    commit: gitCommit(),
  };
  writeJson(f, m);
  return m;
}

/** Run async tasks with a concurrency limit per provider. */
async function pooled(jobs, keyOf, limit, worker) {
  const byKey = new Map();
  for (const j of jobs) {
    const k = keyOf(j);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(j);
  }
  await Promise.all(
    [...byKey.values()].map(async (list) => {
      let i = 0;
      await Promise.all(
        Array.from({ length: Math.min(limit, list.length) }, async () => {
          while (i < list.length) await worker(list[i++]);
        })
      );
    })
  );
}

const genFile = (runId, task, model, run) =>
  path.join(runDir(runId), 'generations', `${task}__${model}__r${run}.json`);

/** Generate every (task × model × run) that is not on disk yet. */
async function generate(runId, bench, { models, tasks, runs, log = console.log }) {
  const g = bench.spec.generation;
  const jobs = [];
  for (const t of tasks)
    for (const m of models)
      for (let r = 1; r <= runs; r++)
        if (!fs.existsSync(genFile(runId, t.id, m.key, r))) jobs.push({ t, m, r });
  log(`generate: ${jobs.length} texts to write`);
  await pooled(
    jobs,
    (j) => j.m.provider,
    g.concurrency_per_provider,
    async ({ t, m, r }) => {
      const prompt = renderPrompt(t);
      try {
        const res = await callModel(m, {
          system: t.system,
          prompt,
          maxTokens: g.max_output_tokens,
          timeoutMs: g.timeout_seconds * 1000,
        });
        writeJson(genFile(runId, t.id, m.key, r), {
          task: t.id,
          model: m.key,
          run: r,
          text: res.text,
          usage: res.usage,
          costUsd: costOf(m, res.usage),
          finish: res.finish,
          reportedModel: res.reportedModel,
          upstream: res.upstream ?? null,
          latencyMs: res.latencyMs,
          meta: metaText(res.text),
          at: new Date().toISOString(),
        });
        log(`  ✓ ${m.key} ${t.id} r${r} ${(res.latencyMs / 1000).toFixed(0)}s`);
      } catch (err) {
        // Not written: the next invocation retries it. Persistent failures show up in the
        // report as missing texts.
        log(`  ✗ ${m.key} ${t.id} r${r}: ${String(err.message).slice(0, 160)}`);
      }
    }
  );
}

function loadGenerations(runId) {
  const dir = path.join(runDir(runId), 'generations');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((f) => readJson(path.join(dir, f)));
}

module.exports = {
  runDir,
  readJson,
  writeJson,
  writeManifest,
  pooled,
  generate,
  loadGenerations,
};
