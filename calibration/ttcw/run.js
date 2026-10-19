#!/usr/bin/env node
'use strict';
/**
 * TTCW calibration: can our judges administer the Torrance Test of Creative Writing?
 *
 * Chakrabarty et al., "Art or Artifice? Large Language Models and the False Promise of
 * Creativity" (CHI 2024) define 14 yes/no tests of literary quality and release 2,016 expert
 * verdicts on 48 stories (12 New Yorker, 36 by GPT-3.5 / GPT-4 / Claude 1.3):
 * github.com/salesforce/creativity_eval (BSD-3). In their study LLM judges did not agree with
 * the experts (mean Cohen's kappa ~0). Before TTCW enters this benchmark we measure whether
 * today's judges do — per test, against the expert majority, with the authors' own prompt.
 *
 *   node calibration/ttcw/run.js              # judge everything missing, then report
 *   node calibration/ttcw/run.js --report     # report only
 *
 * The New Yorker stories are not redistributable: the release only links them. Put the
 * texts (one file per story, `<story_id>.txt`, e.g. `0_NewYorker.txt`) in TTCW_PRIVATE_DIR
 * (default ../ttcw-private/newyorker). Without them the 36 LLM stories are used. Raw judge
 * answers go to calibration/ttcw/out/ (git-ignored: they may quote the stories); only the
 * aggregate figures in calibration/ttcw/results.json and REPORT.md are published.
 */
const fs = require('fs');
const path = require('path');
const { ROOT, loadBenchmark } = require('../../src/spec');
const { callModel, costOf } = require('../../src/providers');
const { pooled } = require('../../src/run');

const HERE = __dirname;
const CACHE = path.join(HERE, 'data');
const OUT = path.join(HERE, 'out');
const RAW = 'https://raw.githubusercontent.com/salesforce/creativity_eval/main/Art_or_Artifice/';
const FILES = {
  stories: 'stories/ttcw_short_stories.json',
  tests: 'tests/ttcw_all_tests.json',
  majority: 'annotations/ttcw_majority.json',
  annotations: 'annotations/ttcw_annotations.json',
  prompt: 'prompts/with_background.txt',
};
const PRIOR = ['gpt4', 'claude3-opus', 'claudev21', 'gemini-pro', 'cgpt'];

function loadEnv() {
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

async function fetchData() {
  fs.mkdirSync(CACHE, { recursive: true });
  const out = {};
  for (const [k, rel] of Object.entries(FILES)) {
    const f = path.join(CACHE, path.basename(rel));
    if (!fs.existsSync(f)) {
      const r = await fetch(RAW + rel);
      if (!r.ok) throw new Error(`download ${rel}: ${r.status}`);
      fs.writeFileSync(f, await r.text());
    }
    out[k] =
      k === 'prompt' ? fs.readFileSync(f, 'utf8').trim() : JSON.parse(fs.readFileSync(f, 'utf8'));
  }
  for (const m of PRIOR) {
    const f = path.join(CACHE, `annotations_${m}.jsonl`);
    if (!fs.existsSync(f)) {
      const r = await fetch(`${RAW}data/annotations_${m}.jsonl`);
      if (r.ok) fs.writeFileSync(f, await r.text());
    }
  }
  return out;
}

/** The authors' own transformation: the test's full prompt minus its last two lines. */
function expandedContext(fullPrompt) {
  const lines = fullPrompt.trim().split('\n');
  return lines.slice(0, -1).join('\n').trim().split('\n').slice(0, -1).join('\n').trim();
}

/** Same rule as the authors: an answer starting with Yes is a pass. */
const verdictOf = (text) => {
  const t = String(text || '')
    .trim()
    .replace(/^[*#\s"'`]+/, '');
  if (/^yes\b/i.test(t)) return 1;
  if (/^no\b/i.test(t)) return 0;
  return null;
};

function storyTexts(stories, privateDir) {
  const texts = {};
  for (const s of stories) {
    if (!s.content.startsWith('http')) texts[s.story_id] = s.content;
    else {
      const f = path.join(privateDir, `${s.story_id}.txt`);
      if (fs.existsSync(f) && fs.statSync(f).size > 1000)
        texts[s.story_id] = fs.readFileSync(f, 'utf8');
    }
  }
  return texts;
}

// --- statistics --------------------------------------------------------------------------
const mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
function kappa(pred, gold) {
  const n = pred.length;
  if (!n) return null;
  const po = pred.filter((p, i) => p === gold[i]).length / n;
  const p1 = mean(pred);
  const g1 = mean(gold);
  const pe = p1 * g1 + (1 - p1) * (1 - g1);
  return pe === 1 ? null : (po - pe) / (1 - pe);
}
function pearson(x, y) {
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  return dx && dy ? num / Math.sqrt(dx * dy) : null;
}
function balancedAccuracy(pred, gold) {
  const tp = pred.filter((p, i) => p && gold[i]).length;
  const tn = pred.filter((p, i) => !p && !gold[i]).length;
  const pos = gold.filter(Boolean).length;
  const neg = gold.length - pos;
  return pos && neg ? (tp / pos + tn / neg) / 2 : null;
}

function evaluate(name, verdicts, gold, tests, storyIds) {
  // verdicts: Map key `${story}|${test}` → 0/1
  const keys = [...gold.keys()].filter((k) => verdicts.has(k) && storyIds.has(k.split('|')[0]));
  const p = keys.map((k) => verdicts.get(k));
  const g = keys.map((k) => gold.get(k));
  const perTest = tests.map((t) => {
    const ks = keys.filter((k) => k.endsWith(`|${t.ttcw_idx}`));
    return {
      test: t.ttcw_idx,
      category: t.category,
      dimension: t.torrance_dimension,
      n: ks.length,
      kappa: kappa(
        ks.map((k) => verdicts.get(k)),
        ks.map((k) => gold.get(k))
      ),
      passRate: mean(ks.map((k) => verdicts.get(k))),
      expertPassRate: mean(
        [...gold.keys()]
          .filter((k) => k.endsWith(`|${t.ttcw_idx}`) && storyIds.has(k.split('|')[0]))
          .map((k) => gold.get(k))
      ),
    };
  });
  // Aggregate: number of tests passed per story — where the experts agree strongly (r 0.69).
  const stories = [...storyIds].filter((s) =>
    tests.every((t) => verdicts.has(`${s}|${t.ttcw_idx}`))
  );
  const count = (src, s) => tests.reduce((n, t) => n + src.get(`${s}|${t.ttcw_idx}`), 0);
  return {
    judge: name,
    n: keys.length,
    stories: stories.length,
    kappa: kappa(p, g),
    meanTestKappa: mean(perTest.filter((t) => t.kappa !== null).map((t) => t.kappa)),
    balancedAccuracy: balancedAccuracy(p, g),
    passRate: mean(p),
    storyCountPearson: pearson(
      stories.map((s) => count(verdicts, s)),
      stories.map((s) => count(gold, s))
    ),
    perTest,
  };
}

async function main() {
  loadEnv();
  const reportOnly = process.argv.includes('--report');
  const bench = loadBenchmark('v1');
  const D = await fetchData();
  const privateDir =
    process.env.TTCW_PRIVATE_DIR || path.join(ROOT, '..', 'ttcw-private', 'newyorker');
  const texts = storyTexts(D.stories, privateDir);
  const ids = new Set(Object.keys(texts));
  const ny = [...ids].filter((s) => s.endsWith('_NewYorker')).length;
  console.log(`stories with text: ${ids.size} (${ny} New Yorker)`);

  const gold = new Map(
    D.majority.map((m) => [`${m.story_id}|${m.ttcw_idx}`, m.binary_verdict === 'Yes' ? 1 : 0])
  );
  const judges = bench.spec.judging.judges.map((k) => ({ key: k, ...bench.spec.judges[k] }));
  fs.mkdirSync(OUT, { recursive: true });
  const fileOf = (judge, story, test) => path.join(OUT, `${judge}__${story}__t${test}.json`);

  if (!reportOnly) {
    const jobs = [];
    for (const j of judges)
      for (const s of ids)
        for (const t of D.tests)
          if (!fs.existsSync(fileOf(j.key, s, t.ttcw_idx))) jobs.push({ j, s, t });
    console.log(`judge: ${jobs.length} verdicts to request`);
    let done = 0;
    await pooled(
      jobs,
      (x) => x.j.key,
      6,
      async ({ j, s, t }) => {
        const prompt = D.prompt
          .replace('[STORY]', texts[s])
          .replace('[BACKGROUND]', expandedContext(t.full_prompt))
          .replace('[QUESTION]', t.question);
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const r = await callModel(j, { prompt, maxTokens: 4000, timeoutMs: 180000 });
            const v = verdictOf(r.text);
            if (v === null && attempt === 0) continue;
            fs.writeFileSync(
              fileOf(j.key, s, t.ttcw_idx),
              JSON.stringify({
                judge: j.key,
                story: s,
                test: t.ttcw_idx,
                verdict: v,
                text: r.text,
                usage: r.usage,
                costUsd: costOf(j, r.usage),
              })
            );
            if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`);
            return;
          } catch (e) {
            if (attempt === 1)
              console.log(`  ✗ ${j.key} ${s} t${t.ttcw_idx}: ${String(e.message).slice(0, 120)}`);
          }
        }
      }
    );
  }

  // --- report ------------------------------------------------------------------------------
  const ours = judges.map((j) => {
    const v = new Map();
    let cost = 0;
    let unparsed = 0;
    for (const s of ids)
      for (const t of D.tests) {
        const f = fileOf(j.key, s, t.ttcw_idx);
        if (!fs.existsSync(f)) continue;
        const r = JSON.parse(fs.readFileSync(f, 'utf8'));
        cost += r.costUsd || 0;
        if (r.verdict === null) unparsed++;
        else v.set(`${s}|${t.ttcw_idx}`, r.verdict);
      }
    return { ...evaluate(`${j.key} (${j.model})`, v, gold, D.tests, ids), costUsd: cost, unparsed };
  });
  // Majority of our three judges, like the experts' majority.
  const maj = new Map();
  for (const k of gold.keys()) {
    const vs = judges
      .map((j) => {
        const [s, t] = k.split('|');
        const f = fileOf(j.key, s, t);
        return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).verdict : null;
      })
      .filter((x) => x !== null);
    if (vs.length === judges.length) maj.set(k, vs.filter(Boolean).length * 2 > vs.length ? 1 : 0);
  }
  ours.push(evaluate('majority of our 3 judges', maj, gold, D.tests, ids));

  // Earlier judges from the authors' release, on the same stories.
  const prior = PRIOR.map((m) => {
    const f = path.join(CACHE, `annotations_${m}.jsonl`);
    if (!fs.existsSync(f)) return null;
    const v = new Map();
    for (const line of fs.readFileSync(f, 'utf8').split('\n').filter(Boolean)) {
      const a = JSON.parse(line);
      const [, idx, origin, test] = a.id.split('_');
      const verdict = verdictOf(a.response);
      if (verdict !== null) v.set(`${idx}_${origin}|${Number(test.replace('test', ''))}`, verdict);
    }
    return evaluate(`${m} (authors' release)`, v, gold, D.tests, ids);
  }).filter(Boolean);

  // Expert ceiling: one annotator against the other two, on the items where those two agree
  // (per test), and one annotator's count of tests passed against the mean of the other two.
  const byKey = {};
  for (const a of D.annotations)
    (byKey[`${a.story_id}|${a.ttcw_idx}`] ||= []).push(a.binary_verdict === 'Yes' ? 1 : 0);
  const testCount = (s, pick) =>
    D.tests.reduce((n, t) => n + pick(byKey[`${s}|${t.ttcw_idx}`] || [0, 0, 0]), 0);
  function expertCeiling(stories) {
    const ex = [];
    const eg = [];
    for (const s of stories)
      for (const t of D.tests) {
        const vs = byKey[`${s}|${t.ttcw_idx}`];
        if (!vs || vs.length !== 3) continue;
        for (let i = 0; i < 3; i++) {
          const o = vs.filter((_, j) => j !== i);
          if (o[0] === o[1]) {
            ex.push(vs[i]);
            eg.push(o[0]);
          }
        }
      }
    const countR = mean(
      [0, 1, 2].map((i) =>
        pearson(
          stories.map((s) => testCount(s, (vs) => vs[i])),
          stories.map((s) => testCount(s, (vs) => (vs.reduce((a, b) => a + b, 0) - vs[i]) / 2))
        )
      )
    );
    return { kappa: kappa(ex, eg), countR };
  }

  // Within each origin. New Yorker stories pass ~90 % of the tests and 2023 LLM stories ~15 %,
  // so a judge that only tells human from machine already scores a high kappa overall. A
  // benchmark of LLM texts needs agreement INSIDE a group.
  const verdictsOf = (judgeKey) => {
    const v = new Map();
    for (const k of gold.keys()) {
      const [s, t] = k.split('|');
      const f = fileOf(judgeKey, s, t);
      if (!fs.existsSync(f)) continue;
      const r = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (r.verdict !== null) v.set(k, r.verdict);
    }
    return v;
  };
  const countOf = (src, s) => D.tests.reduce((n, t) => n + (src.get(`${s}|${t.ttcw_idx}`) ?? 0), 0);
  const within = {};
  for (const g of ['New Yorker', 'LLM']) {
    const ss = [...ids].filter((s) => s.endsWith('_NewYorker') === (g === 'New Yorker'));
    const keys = [...gold.keys()].filter((k) => ss.includes(k.split('|')[0]));
    const row = {
      stories: ss.length,
      expertPassRate: mean(keys.map((k) => gold.get(k))),
      experts: expertCeiling(ss),
      judges: {},
    };
    for (const j of judges) {
      const v = verdictsOf(j.key);
      const ks = keys.filter((k) => v.has(k));
      row.judges[j.key] = {
        kappa: kappa(
          ks.map((k) => v.get(k)),
          ks.map((k) => gold.get(k))
        ),
        passRate: mean(ks.map((k) => v.get(k))),
        countR: pearson(
          ss.map((s) => countOf(v, s)),
          ss.map((s) => countOf(gold, s))
        ),
      };
    }
    within[g] = row;
  }

  const results = {
    stories: ids.size,
    newYorker: ny,
    expertPassRate: mean(
      [...gold.entries()].filter(([k]) => ids.has(k.split('|')[0])).map(([, v]) => v)
    ),
    experts: expertCeiling([...ids]),
    within,
    ours,
    prior,
    at: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(HERE, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  writeReport(results, D.tests);
  console.log('report → calibration/ttcw/REPORT.md');
}

const f2 = (x) => (x === null || x === undefined || Number.isNaN(x) ? '–' : x.toFixed(2));
const pct = (x) => (Number.isFinite(x) ? `${Math.round(x * 100)} %` : '–');

function writeReport(R, tests) {
  const md = [
    '# TTCW calibration — can our judges administer the Torrance Test of Creative Writing?',
    '',
    `${R.stories} stories (${R.newYorker} New Yorker, ${R.stories - R.newYorker} LLM-written), 14 tests, compared with the majority of three expert annotators (Chakrabarty et al., CHI 2024). κ = Cohen's kappa; 0 is chance, 0.4 moderate, 0.6 substantial agreement.`,
    '',
    '| Judge | κ (all verdicts) | mean κ per test | Balanced accuracy | Pass rate | r (tests passed per story) |',
    '|---|---|---|---|---|---|',
  ];
  for (const r of [...R.ours, ...R.prior])
    md.push(
      `| ${r.judge} | **${f2(r.kappa)}** | ${f2(r.meanTestKappa)} | ${f2(r.balancedAccuracy)} | ${pct(r.passRate)} | ${f2(r.storyCountPearson)} |`
    );
  md.push(
    '',
    `Expert pass rate on these stories: ${pct(R.expertPassRate)}. Expert ceiling (one annotator against the other two where they agree): κ ${f2(R.experts.kappa)}, r ${f2(R.experts.countR)} on tests passed per story; the paper reports Fleiss κ 0.41 and r 0.69.`,
    '',
    '## Within each group — the figure that matters',
    '',
    'The overall κ above mostly measures whether a judge tells a New Yorker story from a 2023 LLM story: the first pass ~90 % of the tests, the second ~15 %. A benchmark of LLM texts needs agreement inside a group. "experts" = one annotator against the other two, on the same stories.',
    '',
    '| Group | Who | κ per test | Pass rate | r (tests passed per story) |',
    '|---|---|---|---|---|',
    ...Object.entries(R.within).flatMap(([g, row]) => [
      `| ${g} (${row.stories} stories) | experts | ${f2(row.experts.kappa)} | ${pct(row.expertPassRate)} | ${f2(row.experts.countR)} |`,
      ...Object.entries(row.judges).map(
        ([j, x]) => `| | ${j} | ${f2(x.kappa)} | ${pct(x.passRate)} | ${f2(x.countR)} |`
      ),
    ]),
    '',
    '## Per test (κ against the expert majority)',
    '',
    '| Test | Dimension | Experts pass | ' +
      R.ours.map((r) => r.judge.split(' (')[0]).join(' | ') +
      ' |',
    '|---|---|---|' + R.ours.map(() => '---').join('|') + '|'
  );
  for (const t of tests) {
    const row = R.ours.map((r) => r.perTest.find((p) => p.test === t.ttcw_idx));
    md.push(
      `| ${t.category} | ${t.torrance_dimension} | ${pct(row[0].expertPassRate)} | ${row.map((p) => f2(p.kappa)).join(' | ')} |`
    );
  }
  md.push(
    '',
    `Cost: ${R.ours
      .filter((r) => r.costUsd)
      .map((r) => `${r.judge.split(' (')[0]} $${r.costUsd.toFixed(2)}`)
      .join(' · ')}. Unparsed answers: ${R.ours
      .filter((r) => r.unparsed !== undefined)
      .map((r) => `${r.judge.split(' (')[0]} ${r.unparsed}`)
      .join(' · ')}.`,
    ''
  );
  fs.writeFileSync(path.join(HERE, 'REPORT.md'), md.join('\n'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
