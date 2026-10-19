#!/usr/bin/env node
'use strict';
/**
 * Have LLMs become better writers since 2023?
 *
 * Repeats the story generation of Chakrabarty et al. (CHI 2024) with 2026 models: the same 12
 * one-sentence plots of New Yorker stories, the same prompt ("Write a New Yorker-style story
 * given the plot below …"), the same length matching (rewrite until within 200 words of the
 * original). Then the benchmark's three judges administer all 14 TTCW tests — the same judges
 * whose verdicts on the New Yorker originals and on the 2023 GPT-3.5 / GPT-4 / Claude 1.3
 * stories are in calibration/ttcw. Same judges, same plots, same length: the comparison rests on
 * what the calibration showed judges do well (pass levels, ranking), not on per-test diagnosis.
 *
 *   node experiments/ttcw-2026/run.js [--models a,b] [--report]
 *
 * Target lengths come from the New Yorker texts in TTCW_PRIVATE_DIR (not redistributed); the
 * generated stories are published in stories/.
 */
const fs = require('fs');
const path = require('path');
const { ROOT, loadBenchmark } = require('../../src/spec');
const { callModel, costOf } = require('../../src/providers');
const { pooled } = require('../../src/run');
const { loadTtcw, expandedContext, verdictOf } = require('../../src/ttcw');

const HERE = __dirname;
const STORIES = path.join(HERE, 'stories');
const VERDICTS = path.join(HERE, 'verdicts');
const CAL_OUT = path.join(ROOT, 'calibration', 'ttcw', 'out');
const DEFAULT_MODELS = [
  'gpt-6.1-sol',
  'claude-opus-5.5',
  'claude-sonnet-5.5',
  'gpt-6-luna',
  'gemini-4-argon',
  'kimi-k3',
];
const MAX_ROUNDS = 6;

const WRITE = (plot, n) =>
  `Write a New Yorker-style story given the plot below. Make sure it is atleast ${n} words. Directly start with the story, do not say things like 'Here's the story [...]:'\n\nPlot: ${plot}`;
const LONGER = (n, cur, story) =>
  `You wrote the story I gave you below. I requested a story with ${n} words, but the story only has ${cur} words. Can you rewrite the story to make it longer, and closer to the ${n} word target I gave you. Directly start with the story, do not say things like 'Here's the story [...]:'\n\nCurrent story: ${story}`;
const SHORTER = (n, cur, story) =>
  `You wrote the story I gave you below. I requested a story with ${n} words, but the story has ${cur} words. Can you rewrite the story to make it shorter, and closer to the ${n} word target I gave you. Directly start with the story, do not say things like 'Here's the story [...]:'\n\nCurrent story: ${story}`;
const words = (t) => (String(t).match(/\S+/g) || []).length;

function loadEnv() {
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const args = (argv) => {
  const a = {};
  for (let i = 0; i < argv.length; i++)
    if (argv[i].startsWith('--'))
      a[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  return a;
};
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);

async function main() {
  loadEnv();
  const a = args(process.argv.slice(2));
  const bench = loadBenchmark('v1');
  const { tests, prompt, stories } = await loadTtcw({ allTests: true });
  const privateDir =
    process.env.TTCW_PRIVATE_DIR || path.join(ROOT, '..', 'ttcw-private', 'newyorker');
  const plots = stories
    .filter((s) => s.story_id.endsWith('_NewYorker'))
    .map((s) => {
      const f = path.join(privateDir, `${s.story_id}.txt`);
      if (!fs.existsSync(f))
        throw new Error(`missing ${f} — target length comes from the original`);
      return { idx: s.story_idx, plot: s.plot, target: words(fs.readFileSync(f, 'utf8')) };
    });
  // Models outside benchmark v1 (models.yaml is part of the v1 fingerprint) live here.
  const extra = JSON.parse(fs.readFileSync(path.join(HERE, 'extra-models.json'), 'utf8'));
  const known = [...bench.models, ...extra];
  const models = (a.models ? a.models.split(',') : DEFAULT_MODELS).map((k) => {
    const m = known.find((x) => x.key === k);
    if (!m) throw new Error(`unknown model ${k}`);
    return m;
  });
  const judges = bench.spec.judging.judges.map((k) => ({ key: k, ...bench.spec.judges[k] }));
  fs.mkdirSync(STORIES, { recursive: true });
  fs.mkdirSync(VERDICTS, { recursive: true });
  const storyFile = (p, m) => path.join(STORIES, `${p.idx}_${m.key}.json`);

  if (!a.report) {
    // 1) Write the stories, length-matched like the original study.
    const gen = [];
    for (const p of plots)
      for (const m of models) if (!fs.existsSync(storyFile(p, m))) gen.push({ p, m });
    console.log(`write: ${gen.length} stories`);
    await pooled(
      gen,
      (x) => x.m.provider,
      4,
      async ({ p, m }) => {
        try {
          let cost = 0;
          let r = await callModel(m, {
            prompt: WRITE(p.plot, p.target),
            maxTokens: 16000,
            timeoutMs: 600000,
          });
          cost += costOf(m, r.usage);
          let text = r.text;
          let rounds = 1;
          while (Math.abs(words(text) - p.target) > 200 && rounds < MAX_ROUNDS && text) {
            const ask = words(text) < p.target ? LONGER : SHORTER;
            r = await callModel(m, {
              prompt: ask(p.target, words(text), text),
              maxTokens: 16000,
              timeoutMs: 600000,
            });
            cost += costOf(m, r.usage);
            if (r.text) text = r.text;
            rounds++;
          }
          fs.writeFileSync(
            storyFile(p, m),
            JSON.stringify(
              {
                plot: p.idx,
                model: m.key,
                target: p.target,
                words: words(text),
                rounds,
                costUsd: cost,
                text,
              },
              null,
              1
            )
          );
          console.log(
            `  ✓ ${m.key} plot ${p.idx}: ${words(text)}/${p.target} words, ${rounds} round(s)`
          );
        } catch (e) {
          console.log(`  ✗ ${m.key} plot ${p.idx}: ${String(e.message).slice(0, 140)}`);
        }
      }
    );

    // 2) Judge them with all 14 tests.
    const jobs = [];
    for (const p of plots)
      for (const m of models) {
        if (!fs.existsSync(storyFile(p, m))) continue;
        for (const j of judges)
          for (const t of tests) {
            const f = path.join(VERDICTS, `${j.key}__${p.idx}_${m.key}__t${t.ttcw_idx}.json`);
            if (!fs.existsSync(f)) jobs.push({ p, m, j, t, f });
          }
      }
    console.log(`judge: ${jobs.length} verdicts`);
    let done = 0;
    await pooled(
      jobs,
      (x) => x.j.key,
      6,
      async ({ p, m, j, t, f }) => {
        const story = JSON.parse(fs.readFileSync(storyFile(p, m), 'utf8')).text;
        const q = prompt
          .replace('[STORY]', story)
          .replace('[BACKGROUND]', expandedContext(t.full_prompt))
          .replace('[QUESTION]', t.question);
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const r = await callModel(j, { prompt: q, maxTokens: 4000, timeoutMs: 180000 });
            const v = verdictOf(r.text);
            if (v === null && attempt === 0) continue;
            fs.writeFileSync(
              f,
              JSON.stringify(
                {
                  judge: j.key,
                  story: `${p.idx}_${m.key}`,
                  test: t.ttcw_idx,
                  verdict: v,
                  answer: r.text,
                  costUsd: costOf(j, r.usage),
                },
                null,
                1
              )
            );
            if (++done % 100 === 0) console.log(`  ${done}/${jobs.length}`);
            return;
          } catch (e) {
            if (attempt === 1)
              console.log(
                `  ✗ ${j.key} ${p.idx}_${m.key} t${t.ttcw_idx}: ${String(e.message).slice(0, 120)}`
              );
          }
        }
      }
    );
  }
  const withStories = known.filter((m) => plots.some((p) => fs.existsSync(storyFile(p, m))));
  report({ plots, models: withStories, judges, tests, bench: { models: known } });
}

/** Majority-of-judges pass rate per story group, with the 2023 groups from the calibration. */
function report({ plots, models, judges, tests, bench }) {
  const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
  const label = Object.fromEntries(bench.models.map((m) => [m.key, m.label]));
  const groups = [
    {
      key: 'NewYorker',
      name: 'New Yorker (human, original)',
      year: '—',
      dir: CAL_OUT,
      id: (p) => `${p.idx}_NewYorker`,
    },
    { key: 'GPT3.5', name: 'GPT-3.5', year: 2023, dir: CAL_OUT, id: (p) => `${p.idx}_GPT3.5` },
    { key: 'GPT4', name: 'GPT-4', year: 2023, dir: CAL_OUT, id: (p) => `${p.idx}_GPT4` },
    { key: 'Claude', name: 'Claude 1.3', year: 2023, dir: CAL_OUT, id: (p) => `${p.idx}_Claude` },
    ...models.map((m) => ({
      key: m.key,
      name: label[m.key],
      year: 2026,
      dir: VERDICTS,
      id: (p) => `${p.idx}_${m.key}`,
    })),
  ];
  const fileOf = (g, j, sid, t) =>
    g.dir === CAL_OUT
      ? path.join(CAL_OUT, `${j}__${sid}__t${t}.json`)
      : path.join(VERDICTS, `${j}__${sid}__t${t}.json`);
  let cost = 0;
  const rows = groups.map((g) => {
    const perStory = [];
    const perJudge = Object.fromEntries(judges.map((j) => [j.key, []]));
    const perDim = {};
    for (const p of plots) {
      const sid = g.id(p);
      const maj = [];
      for (const t of tests) {
        const vs = judges.map((j) => {
          const r = read(fileOf(g, j.key, sid, t.ttcw_idx));
          if (r && g.dir === VERDICTS) cost += r.costUsd || 0;
          if (r && r.verdict !== null) perJudge[j.key].push(r.verdict);
          return r ? r.verdict : null;
        });
        if (vs.some((v) => v === null)) continue;
        const v = vs.filter(Boolean).length * 2 > vs.length ? 1 : 0;
        maj.push(v);
        (perDim[t.torrance_dimension] ||= []).push(v);
      }
      if (maj.length === tests.length) perStory.push(mean(maj));
    }
    return { ...g, n: perStory.length, pass: mean(perStory), perStory, perJudge, perDim };
  });
  for (const m of models)
    for (const p of plots) {
      const s = read(path.join(STORIES, `${p.idx}_${m.key}.json`));
      if (s) cost += s.costUsd || 0;
    }
  const pct = (x) => (Number.isFinite(x) ? `${Math.round(x * 100)} %` : '–');
  const dims = ['Fluency', 'Flexibility', 'Originality', 'Elaboration'];
  const md = [
    '# Have LLMs become better writers since 2023?',
    '',
    'The story experiment of Chakrabarty et al. (CHI 2024) repeated with 2026 models: the same 12 one-sentence plots of New Yorker stories, the same prompt, the same length matching. All stories — the New Yorker originals, the 2023 stories and the 2026 stories — judged by the same three judges (Claude Opus 5.5, GPT-6.1 Sol, Gemini 4 Argon) with all 14 TTCW tests; a test counts as passed when the majority says Yes.',
    '',
    "Calibration ([calibration/ttcw](../../calibration/ttcw/README.md)): these judges reproduce the experts' pass levels for New Yorker and 2023 stories and rank LLM stories about as well as one expert ranks them against two others. They do not reliably name WHICH test a story fails. Read the table as levels, not diagnoses. Two of the judges are also authors here (Sol, Opus); the per-judge columns show whether that matters.",
    '',
    '| Stories | Year | Tests passed (judge majority) | ' +
      dims.join(' | ') +
      ' | ' +
      judges.map((j) => `${j.key} alone`).join(' | ') +
      ' |',
    '|---|---|---|' +
      dims.map(() => '---').join('|') +
      '|' +
      judges.map(() => '---').join('|') +
      '|',
  ];
  for (const r of rows)
    md.push(
      `| ${r.year === 2026 ? '**' + r.name + '**' : r.name} | ${r.year} | **${pct(r.pass)}** (${r.n} stories) | ${dims.map((d) => pct(mean(r.perDim[d] || []))).join(' | ')} | ${judges.map((j) => pct(mean(r.perJudge[j.key]))).join(' | ')} |`
    );
  md.push(
    '',
    'For reference, the experts in the original study: New Yorker 84.7 %, GPT-4 27.9 %, Claude 1.3 30.0 %, GPT-3.5 8.7 %.',
    '',
    `Cost of the 2026 part (writing and judging): $${cost.toFixed(2)}.`,
    ''
  );
  fs.writeFileSync(path.join(HERE, 'REPORT.md'), md.join('\n'));
  fs.writeFileSync(
    path.join(HERE, 'results.json'),
    JSON.stringify(
      rows.map(({ dir, id, ...r }) => r),
      null,
      2
    ) + '\n'
  );
  console.log('report → experiments/ttcw-2026/REPORT.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
