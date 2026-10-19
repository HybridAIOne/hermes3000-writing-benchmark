'use strict';
/**
 * TTCW — Torrance Test of Creative Writing (Chakrabarty et al., CHI 2024) applied to a run.
 *
 * 13 of the 14 yes/no tests (the narrative-ending test is left out: the benchmark's literary
 * tasks are openings and scenes, not complete stories), with the authors' prompt and expanded
 * test descriptions, administered by the run's three judges to every German literary text of
 * the run and to the human anchor (anchors/de-classics: openings of German novellas at the
 * task lengths). A text passes a test when the majority of judges says Yes.
 *
 * Calibration (calibration/ttcw): judges reproduce the experts' pass LEVELS well and rank texts
 * by tests passed about as well as one expert ranks them against two others; WHICH test a text
 * fails is not reliable. So the report leads with the share of tests passed, not per-test
 * verdicts.
 */
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./spec');
const { callModel, costOf } = require('./providers');
const { pooled, runDir, loadGenerations } = require('./run');

const RAW = 'https://raw.githubusercontent.com/salesforce/creativity_eval/main/Art_or_Artifice/';
const CACHE = path.join(ROOT, 'calibration', 'ttcw', 'data');
const ANCHORS = path.join(ROOT, 'anchors', 'de-classics');
const SKIP_TESTS = new Set([1]); // Narrative Ending — not applicable to openings
// Anchor length per task: the 900-word excerpts stand against the chapter opening.
const ANCHOR_FOR_TASK = { 'lit-chapter': 900 };
const anchorLength = (task) => ANCHOR_FOR_TASK[task] || 300;

async function loadTtcw({ allTests = false } = {}) {
  fs.mkdirSync(CACHE, { recursive: true });
  const get = async (rel) => {
    const f = path.join(CACHE, path.basename(rel));
    if (!fs.existsSync(f)) {
      const r = await fetch(RAW + rel);
      if (!r.ok) throw new Error(`download ${rel}: ${r.status}`);
      fs.writeFileSync(f, await r.text());
    }
    return fs.readFileSync(f, 'utf8');
  };
  const tests = JSON.parse(await get('tests/ttcw_all_tests.json')).filter(
    (t) => allTests || !SKIP_TESTS.has(t.ttcw_idx)
  );
  const stories = JSON.parse(await get('stories/ttcw_short_stories.json'));
  const prompt = (await get('prompts/with_background.txt')).trim();
  return { tests, prompt, stories };
}

/** The authors' transformation: the test's full prompt minus its last two lines. */
function expandedContext(fullPrompt) {
  const lines = fullPrompt.trim().split('\n');
  return lines.slice(0, -1).join('\n').trim().split('\n').slice(0, -1).join('\n').trim();
}

const verdictOf = (text) => {
  const t = String(text || '')
    .trim()
    .replace(/^[*#\s"'`]+/, '');
  if (/^yes\b/i.test(t)) return 1;
  if (/^no\b/i.test(t)) return 0;
  return null;
};

const RECOGNITION =
  'Below is the opening of a work of German literature. Do you recognise it? Answer with the author and title if you do, or with "unknown" if you do not. Do not guess.\n\n';

/** Items: the run's German literary texts plus the anchor excerpts. */
function itemsFor(runId, bench) {
  const litTasks = bench.tasks.filter((t) => t.track === 'literary' && t.language === 'de');
  const gens = loadGenerations(runId).filter(
    (g) => g.text && litTasks.some((t) => t.id === g.task)
  );
  const items = gens.map((g) => ({
    id: `${g.task}__${g.model}__r${g.run}`,
    kind: 'model',
    model: g.model,
    task: g.task,
    text: g.text,
  }));
  const index = JSON.parse(fs.readFileSync(path.join(ANCHORS, 'index.json'), 'utf8'));
  for (const a of index)
    items.push({
      id: `anchor__${a.file.replace(/\.txt$/, '')}`,
      kind: 'anchor',
      model: `anchor-${a.target_words}`,
      anchor: a,
      text: fs.readFileSync(path.join(ANCHORS, a.file), 'utf8').trim(),
    });
  return items;
}

async function runTtcw(runId, bench, { log = console.log } = {}) {
  const { tests, prompt } = await loadTtcw();
  const judges = bench.spec.judging.judges.map((k) => ({ key: k, ...bench.spec.judges[k] }));
  const dir = path.join(runDir(runId), 'ttcw');
  fs.mkdirSync(dir, { recursive: true });
  const items = itemsFor(runId, bench);
  const fileOf = (j, item, t) => path.join(dir, `${j}__${item}__t${t}.json`);
  const recFile = (j, item) => path.join(dir, `recognition__${j}__${item}.json`);

  const jobs = [];
  for (const j of judges)
    for (const it of items) {
      for (const t of tests)
        if (!fs.existsSync(fileOf(j.key, it.id, t.ttcw_idx))) jobs.push({ j, it, t });
      if (it.kind === 'anchor' && !fs.existsSync(recFile(j.key, it.id)))
        jobs.push({ j, it, rec: true });
    }
  log(
    `ttcw: ${items.length} texts × ${tests.length} tests × ${judges.length} judges — ${jobs.length} calls to make`
  );
  let done = 0;
  await pooled(
    jobs,
    (x) => x.j.key,
    6,
    async ({ j, it, t, rec }) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (rec) {
            const r = await callModel(j, {
              prompt: RECOGNITION + it.text,
              maxTokens: 2000,
              timeoutMs: 120000,
            });
            fs.writeFileSync(
              recFile(j.key, it.id),
              JSON.stringify(
                { judge: j.key, item: it.id, answer: r.text, costUsd: costOf(j, r.usage) },
                null,
                1
              )
            );
          } else {
            const p = prompt
              .replace('[STORY]', it.text)
              .replace('[BACKGROUND]', expandedContext(t.full_prompt))
              .replace('[QUESTION]', t.question);
            const r = await callModel(j, { prompt: p, maxTokens: 4000, timeoutMs: 180000 });
            const v = verdictOf(r.text);
            if (v === null && attempt === 0) continue;
            fs.writeFileSync(
              fileOf(j.key, it.id, t.ttcw_idx),
              JSON.stringify(
                {
                  judge: j.key,
                  item: it.id,
                  test: t.ttcw_idx,
                  verdict: v,
                  answer: r.text,
                  costUsd: costOf(j, r.usage),
                },
                null,
                1
              )
            );
          }
          if (++done % 100 === 0) log(`  ${done}/${jobs.length}`);
          return;
        } catch (e) {
          if (attempt === 1)
            log(
              `  ✗ ${j.key} ${it.id} ${rec ? 'recognition' : `t${t.ttcw_idx}`}: ${String(e.message).slice(0, 120)}`
            );
        }
      }
    }
  );
  return summarise(runId, bench, { tests, judges, items, dir });
}

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);

function summarise(runId, bench, { tests, judges, items, dir }) {
  const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
  const label = Object.fromEntries(bench.models.map((m) => [m.key, m.label]));
  const perItem = {};
  let cost = 0;
  for (const it of items) {
    const row = { item: it, tests: {}, byJudge: {} };
    for (const j of judges) row.byJudge[j.key] = [];
    for (const t of tests) {
      const vs = judges.map((j) => {
        const r = read(path.join(dir, `${j.key}__${it.id}__t${t.ttcw_idx}.json`));
        if (r) cost += r.costUsd || 0;
        return r ? r.verdict : null;
      });
      vs.forEach((v, k) => v !== null && row.byJudge[judges[k].key].push(v));
      const known = vs.filter((v) => v !== null);
      if (known.length === judges.length)
        row.tests[t.ttcw_idx] = known.filter(Boolean).length * 2 > known.length ? 1 : 0;
    }
    perItem[it.id] = row;
  }
  // Share of tests passed (majority of judges) per group: model × length class, anchors.
  const groups = {};
  for (const row of Object.values(perItem)) {
    const it = row.item;
    const len = it.kind === 'anchor' ? it.anchor.target_words : anchorLength(it.task);
    const key = it.kind === 'anchor' ? `anchor|${len}` : `${it.model}|${len}`;
    const g = (groups[key] ||= {
      key,
      model: it.model,
      kind: it.kind,
      len,
      passed: [],
      byJudge: {},
      byTest: {},
      byTask: {},
    });
    const vals = Object.values(row.tests);
    if (vals.length === tests.length) g.passed.push(mean(vals));
    for (const [j, vs] of Object.entries(row.byJudge)) (g.byJudge[j] ||= []).push(...vs);
    for (const [t, v] of Object.entries(row.tests)) (g.byTest[t] ||= []).push(v);
    if (it.task && vals.length === tests.length) (g.byTask[it.task] ||= []).push(mean(vals));
  }
  for (const it of items) cost += 0;
  const recognition = {};
  for (const it of items.filter((x) => x.kind === 'anchor'))
    for (const j of judges) {
      const r = read(path.join(dir, `recognition__${j.key}__${it.id}.json`));
      if (!r) continue;
      cost += r.costUsd || 0;
      const a = String(r.answer || '');
      const author = it.anchor.author.split(' ').pop();
      const titleWord =
        it.anchor.title.split(' ').filter((w) => w.length > 4)[0] || it.anchor.title;
      const hit = new RegExp(author, 'i').test(a) || new RegExp(titleWord, 'i').test(a);
      (recognition[j.key] ||= []).push(hit ? 1 : 0);
    }
  return { tests, judges, groups, recognition, cost, label, items: items.length };
}

const pct = (x) => (Number.isFinite(x) ? `${Math.round(x * 100)} %` : '–');

function writeTtcwReport(runId, S) {
  const md = [
    `# TTCW — Torrance Test of Creative Writing on run \`${runId}\``,
    '',
    `${S.tests.length} of the 14 TTCW yes/no tests (Chakrabarty et al., CHI 2024; the narrative-ending test is left out — the tasks are openings, not complete stories), the authors' prompt, the run's three judges; a test counts as passed when the majority of judges says Yes. Human anchor: openings of twelve German novellas (Kafka, Musil, Zweig, Fontane, Thomas Mann, Schnitzler) at the task lengths — see [anchors/de-classics](../../anchors/de-classics/README.md).`,
    '',
    "**Read this as a coarse level, not a diagnosis.** [Calibration](../../calibration/ttcw/README.md) against 2,016 expert verdicts: the judges reproduce the experts' pass levels and rank texts by tests passed about as well as one expert ranks them against two others; which individual test a text fails is not reliable.",
    '',
    '## Share of tests passed',
    '',
    '| | Scenes, dialogue, continuation (~300 words) | Chapter opening (~900 words) |',
    '|---|---|---|',
  ];
  const models = [
    ...new Set(
      Object.values(S.groups)
        .filter((g) => g.kind === 'model')
        .map((g) => g.model)
    ),
  ];
  const share = (m, len) => mean(S.groups[`${m}|${len}`]?.passed || []);
  const rows = models
    .map((m) => ({ name: S.label[m] || m, a: share(m, 300), b: share(m, 900) }))
    .sort((x, y) => y.a + y.b - (x.a + x.b));
  rows.unshift({
    name: '**German classics (anchor)**',
    a: mean(S.groups['anchor|300']?.passed || []),
    b: mean(S.groups['anchor|900']?.passed || []),
  });
  for (const r of rows) md.push(`| ${r.name} | ${pct(r.a)} | ${pct(r.b)} |`);
  md.push(
    '',
    '## Per judge (share of Yes over all tests)',
    '',
    '| | ' + S.judges.map((j) => j.key).join(' | ') + ' |',
    '|---|' + S.judges.map(() => '---').join('|') + '|'
  );
  const keys = Object.keys(S.groups).sort();
  const byModel = {};
  for (const g of Object.values(S.groups)) {
    const name = g.kind === 'anchor' ? 'German classics (anchor)' : S.label[g.model] || g.model;
    for (const [j, vs] of Object.entries(g.byJudge)) ((byModel[name] ||= {})[j] ||= []).push(...vs);
  }
  for (const [name, js] of Object.entries(byModel))
    md.push(`| ${name} | ${S.judges.map((j) => pct(mean(js[j.key] || []))).join(' | ')} |`);
  md.push(
    '',
    '## Per test (majority of judges, all lengths) — indicative only',
    '',
    '| Test | Dimension | ' +
      ['German classics (anchor)', ...models.map((m) => S.label[m] || m)].join(' | ') +
      ' |',
    '|---|---|' + [0, ...models].map(() => '---').join('|') + '|'
  );
  for (const t of S.tests) {
    const cell = (prefix) =>
      pct(
        mean(
          Object.values(S.groups)
            .filter((g) => (prefix === 'anchor' ? g.kind === 'anchor' : g.model === prefix))
            .flatMap((g) => g.byTest[t.ttcw_idx] || [])
        )
      );
    md.push(
      `| ${t.category} | ${t.torrance_dimension} | ${cell('anchor')} | ${models.map((m) => cell(m)).join(' | ')} |`
    );
  }
  md.push(
    '',
    '## Do the judges recognise the anchors?',
    '',
    'Each judge was asked to name author and title of each anchor excerpt. A recognised classic may get the benefit of the doubt.',
    ''
  );
  for (const [j, hits] of Object.entries(S.recognition))
    md.push(`- **${j}**: recognised ${hits.filter(Boolean).length} of ${hits.length} excerpts`);
  md.push('', `Cost: $${S.cost.toFixed(2)}.`, '');
  fs.writeFileSync(path.join(runDir(runId), 'TTCW.md'), md.join('\n'));
}

module.exports = {
  runTtcw,
  writeTtcwReport,
  summarise,
  itemsFor,
  loadTtcw,
  expandedContext,
  verdictOf,
};
