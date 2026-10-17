'use strict';
/**
 * Judging.
 *
 * Ranked tasks (literary, non-fiction): every judge sees small groups of anonymised texts
 * for the same task, scores each on the track rubric and ranks the group. Groups are
 * re-shuffled per judge and pass with a seed derived from (task, judge, pass), so the same
 * run always produces the same groups. Two texts of one model are kept apart where possible.
 *
 * Checklist tasks (ed-feedback): every judge checks each set of editorial notes against the
 * known list of planted problems.
 *
 * Verdicts are requested as schema-valid JSON (tool call / json_schema / responseJsonSchema),
 * and a malformed ranking is retried — free-form JSON cost the earlier ad-hoc runs verdicts.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { callModel, costOf } = require('./providers');
const { renderPrompt } = require('./spec');
const { runDir, writeJson, readJson, pooled } = require('./run');
const { rng } = require('./rank');

const LETTERS = 'ABCDEFGHIJ';
const rubric = (bench, name) =>
  fs.readFileSync(path.join(bench.dir, 'rubrics', `${name}.md`), 'utf8').trim();

function seedOf(...parts) {
  return crypto.createHash('sha256').update(parts.join('|')).digest().readUInt32LE(0);
}

/** Deterministic shuffle into groups of `size`; no group smaller than 2. */
function makeGroups(items, size, seed) {
  const rand = rng(seed);
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  const groups = [];
  for (let i = 0; i < a.length; i += size) groups.push(a.slice(i, i + size));
  if (groups.length > 1 && groups[groups.length - 1].length < 2) {
    const last = groups.pop();
    groups[groups.length - 1].push(...last);
  }
  // Keep two runs of the same model apart: swap a duplicate with an item of another group.
  for (let g = 0; g < groups.length; g++) {
    for (let i = 0; i < groups[g].length; i++) {
      const dupe = groups[g].findIndex((x, k) => k !== i && x.model === groups[g][i].model);
      if (dupe < 0) continue;
      outer: for (let h = 0; h < groups.length; h++) {
        if (h === g) continue;
        for (let k = 0; k < groups[h].length; k++) {
          const cand = groups[h][k];
          const fitsHere = !groups[g].some((x, n) => n !== dupe && x.model === cand.model);
          const fitsThere = !groups[h].some((x, n) => n !== k && x.model === groups[g][dupe].model);
          if (fitsHere && fitsThere) {
            [groups[g][dupe], groups[h][k]] = [cand, groups[g][dupe]];
            break outer;
          }
        }
      }
    }
  }
  return groups;
}

function rankingSchema(labels) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['texts', 'ranking'],
    properties: {
      texts: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['label', 'sprache', 'stil', 'aufgabe', 'fehler', 'unsupported', 'violations'],
          properties: {
            label: { type: 'string', enum: labels },
            sprache: { type: 'integer' },
            stil: { type: 'integer' },
            aufgabe: { type: 'integer' },
            fehler: { type: 'array', items: { type: 'string' } },
            unsupported: { type: 'array', items: { type: 'string' } },
            violations: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      ranking: { type: 'array', items: { type: 'string', enum: labels } },
    },
  };
}

function rankingPrompt(bench, task, group, labels) {
  const parts = [];
  parts.push('AUFGABE, die alle Texte erfüllen sollten:');
  if (task.system) parts.push(task.system.trim());
  parts.push(renderPrompt(task));
  if (task.checklist) {
    parts.push(
      'VORGABEN-CHECKLISTE:\n' + task.checklist.map((c, i) => `c${i + 1}: ${c}`).join('\n')
    );
  }
  parts.push(
    group.map((g, i) => `=== TEXT ${labels[i]} ===\n${g.text}`).join('\n\n'),
    rubric(bench, task.track === 'nonfiction' ? 'nonfiction' : 'literary')
  );
  if (task.source) parts.push(rubric(bench, 'source-check'));
  else parts.push('Lass "unsupported" leer.');
  if (task.checklist) parts.push(rubric(bench, 'checklist'));
  else parts.push('Lass "violations" leer.');
  parts.push(`"ranking" enthält alle Labels (${labels.join(', ')}) genau einmal, bester zuerst.`);
  return parts.join('\n\n');
}

const judgmentFile = (runId, judge, task, pass, gi) =>
  path.join(runDir(runId), 'judgments', `${judge}__${task}__p${pass}__g${gi}.json`);

/** Rank every judged task with every judge. */
async function judgeRanked(runId, bench, { tasks, generations, log = console.log }) {
  const J = bench.spec.judging;
  const jobs = [];
  for (const task of tasks.filter((t) => bench.spec.tracks[t.track].judged)) {
    const texts = generations.filter((g) => g.task === task.id && g.text);
    if (texts.length < 2) continue;
    for (const judgeKey of J.judges) {
      for (let pass = 1; pass <= J.passes; pass++) {
        const groups = makeGroups(texts, J.group_size, seedOf(runId, task.id, judgeKey, pass));
        groups.forEach((group, gi) => {
          const file = judgmentFile(runId, judgeKey, task.id, pass, gi);
          if (!fs.existsSync(file)) jobs.push({ task, judgeKey, pass, gi, group, file });
        });
      }
    }
  }
  log(`judge: ${jobs.length} group verdicts to request`);
  await pooled(
    jobs,
    (j) => j.judgeKey,
    3,
    async ({ task, judgeKey, pass, gi, group, file }) => {
      const judge = bench.spec.judges[judgeKey];
      const labels = group.map((_, i) => LETTERS[i]);
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await callModel(judge, {
            system: rubric(bench, 'judge-system'),
            prompt: rankingPrompt(bench, task, group, labels),
            maxTokens: 12000,
            timeoutMs: 300000,
            schema: rankingSchema(labels),
          });
          const v = res.json;
          const ranked = new Set(v.ranking);
          if (ranked.size !== labels.length || !labels.every((l) => ranked.has(l))) {
            throw new Error(`ranking is not a permutation: ${JSON.stringify(v.ranking)}`);
          }
          writeJson(file, {
            task: task.id,
            judge: judgeKey,
            judgeFamily: judge.family,
            pass,
            group: gi,
            labels: Object.fromEntries(
              group.map((g, i) => [labels[i], { model: g.model, run: g.run }])
            ),
            verdict: v,
            usage: res.usage,
            costUsd: costOf(judge, res.usage),
          });
          log(`  ✓ ${judgeKey} ${task.id} p${pass} g${gi}`);
          return;
        } catch (err) {
          if (attempt === 3)
            log(`  ✗ ${judgeKey} ${task.id} p${pass} g${gi}: ${String(err.message).slice(0, 160)}`);
        }
      }
    }
  );
}

function checklistSchema(ids) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['found', 'false_alarms'],
    properties: {
      found: { type: 'array', items: { type: 'string', enum: ids } },
      false_alarms: { type: 'integer' },
    },
  };
}

const checkFile = (runId, judge, task, model, run) =>
  path.join(runDir(runId), 'checks', `${judge}__${task}__${model}__r${run}.json`);

function violationSchema(ids) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['violated', 'evidence'],
    properties: {
      violated: { type: 'array', items: { type: 'string', enum: ids } },
      evidence: { type: 'array', items: { type: 'string' } },
    },
  };
}

/** The judge request for a checklist task: found-problems (issues) or violated assertions. */
function checklistRequest(bench, task, g) {
  if (task.issues) {
    return {
      prompt: [
        rubric(bench, 'feedback'),
        `MANUSKRIPT-AUSSCHNITT:\n${task.text.trim()}`,
        'PROBLEME:\n' + task.issues.map((i) => `${i.id}: ${i.desc}`).join('\n'),
        `ANMERKUNGEN:\n${g.text}`,
      ].join('\n\n'),
      schema: checklistSchema(task.issues.map((i) => i.id)),
    };
  }
  // Assertions: the judge sees the chapter and the checks, not the whole book context —
  // every assertion states the fact it needs.
  return {
    prompt: [
      rubric(bench, 'context-check'),
      'PRÜFPUNKTE:\n' + task.assertions.map((a) => `${a.id} [${a.dim}]: ${a.rule}`).join('\n'),
      `KAPITELTEXT:\n${g.text}`,
    ].join('\n\n'),
    schema: violationSchema(task.assertions.map((a) => a.id)),
  };
}

/** Checklist tasks, every judge: editorial notes (issues) and book-context assertions. */
async function judgeChecklists(runId, bench, { tasks, generations, log = console.log }) {
  const jobs = [];
  for (const task of tasks.filter((t) => t.issues || t.assertions)) {
    for (const g of generations.filter((x) => x.task === task.id && x.text)) {
      for (const judgeKey of bench.spec.judging.judges) {
        const file = checkFile(runId, judgeKey, task.id, g.model, g.run);
        if (!fs.existsSync(file)) jobs.push({ task, g, judgeKey, file });
      }
    }
  }
  log(`checklists: ${jobs.length} checks to request`);
  await pooled(
    jobs,
    (j) => j.judgeKey,
    3,
    async ({ task, g, judgeKey, file }) => {
      const judge = bench.spec.judges[judgeKey];
      const { prompt, schema } = checklistRequest(bench, task, g);
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await callModel(judge, {
            system: rubric(bench, 'judge-system'),
            prompt,
            maxTokens: 6000,
            timeoutMs: 180000,
            schema,
          });
          writeJson(file, {
            task: task.id,
            model: g.model,
            run: g.run,
            judge: judgeKey,
            verdict: res.json,
            usage: res.usage,
            costUsd: costOf(judge, res.usage),
          });
          log(`  ✓ ${judgeKey} check ${task.id} ${g.model} r${g.run}`);
          return;
        } catch (err) {
          if (attempt === 3)
            log(
              `  ✗ ${judgeKey} check ${task.id} ${g.model} r${g.run}: ${String(err.message).slice(0, 160)}`
            );
        }
      }
    }
  );
}

function loadDir(runId, sub) {
  const dir = path.join(runDir(runId), sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((f) => readJson(path.join(dir, f)));
}

module.exports = { judgeRanked, judgeChecklists, makeGroups, loadDir };
