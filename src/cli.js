#!/usr/bin/env node
'use strict';
/**
 * hermes3000 Writing Benchmark — command line.
 *
 *   npm run bench -- run --id 2026-10-17-v1-prelim [--stage prelim] [--models a,b] [--tasks x,y]
 *   npm run bench -- run --id 2026-10-24-v1-final --stage final --models a,b,c
 *   npm run bench -- report --id <runId>
 *   npm run bench -- finalists --id <prelimRunId>
 *   npm run bench -- generate-only --id <runId> ...   (no judging, e.g. for a smoke test)
 *   npm run bench -- human --id <runId> --file <arena-export.json>   (human panel votes)
 *
 * `run` is resumable: re-running the same command only does what is missing.
 */
const fs = require('fs');
const path = require('path');
const { loadBenchmark, ROOT } = require('./spec');
const { writeManifest, generate, loadGenerations } = require('./run');
const { judgeRanked, judgeChecklists } = require('./judge');
const { report, finalists } = require('./report');

function loadEnv() {
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function args(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--'))
      a[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    else a._.push(argv[i]);
  }
  return a;
}

async function main() {
  loadEnv();
  const a = args(process.argv.slice(2));
  const cmd = a._[0];
  const bench = loadBenchmark(a.version || 'v1', {
    privateDir: process.env.PRIVATE_TASKS_DIR || undefined,
  });
  if (!a.id) throw new Error('--id <runId> is required');

  if (cmd === 'report') {
    const r = report(a.id, bench);
    console.log(`report written to results/${a.id}/report.md (${r.arenaPairs} arena pairs)`);
    return;
  }
  if (cmd === 'human') {
    // The arena's export (GET /api/bench/export?runId=…) is stored verbatim next to the run,
    // minus nothing: judges are named people who agreed to be named, reasons stay with the vote.
    if (!a.file) throw new Error('--file <arena-export.json> is required');
    const data = JSON.parse(fs.readFileSync(a.file, 'utf8'));
    if (data.runId !== a.id) throw new Error(`export is for run ${data.runId}, not ${a.id}`);
    if (!Array.isArray(data.votes)) throw new Error('export has no votes');
    fs.writeFileSync(
      path.join(ROOT, 'results', a.id, 'human-votes.json'),
      JSON.stringify(data, null, 2) + '\n'
    );
    const r = report(a.id, bench);
    console.log(
      `${data.votes.length} human votes stored; report rewritten (${r.arenaPairs} arena pairs)`
    );
    return;
  }
  if (cmd === 'finalists') {
    const n = Number(a.n) || bench.spec.stages.final.finalists;
    for (const f of finalists(a.id, bench, n))
      console.log(`${f.key}\t(mean rank ${(f.meanRank + 1).toFixed(1)})`);
    return;
  }
  if (cmd !== 'run' && cmd !== 'generate-only') throw new Error(`unknown command ${cmd}`);

  const stage = a.stage || 'prelim';
  const runs = Number(a.runs) || bench.spec.stages[stage].runs;
  const pick = (list, csv, key) =>
    csv ? list.filter((x) => csv.split(',').includes(x[key])) : list;
  const models = pick(bench.models, a.models, 'key');
  const tasks = pick(bench.tasks, a.tasks, 'id');
  if (!models.length || !tasks.length) throw new Error('no models or tasks selected');

  writeManifest(a.id, bench, { models, stage, runs });
  console.log(
    `run ${a.id}: ${models.length} models × ${tasks.length} tasks × ${runs} runs, fingerprint ${bench.fingerprint}`
  );
  await generate(a.id, bench, { models, tasks, runs });
  if (cmd === 'generate-only') return;

  const generations = loadGenerations(a.id).filter((g) => models.some((m) => m.key === g.model));
  await judgeRanked(a.id, bench, { tasks, generations, passes: bench.spec.stages[stage].passes });
  await judgeChecklists(a.id, bench, { tasks, generations });
  const r = report(a.id, bench);
  console.log(
    `done — results/${a.id}/report.md · generation $${r.R.generationCostUsd.toFixed(2)} · judging $${r.R.judgeCostUsd.toFixed(2)}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
