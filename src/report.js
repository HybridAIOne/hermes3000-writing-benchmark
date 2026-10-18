'use strict';
/**
 * Report: computed from the files of a run alone, so anyone can re-compute it.
 * Writes report.md, ratings.json, blind/index.html (+ key.html) and arena-pairs.json.
 * Context tasks are left out of the blind page and the arena (their prompt is a whole book).
 */
const fs = require('fs');
const path = require('path');
const { runDir, readJson, writeJson, loadGenerations } = require('./run');
const { loadDir } = require('./judge');
const { pairsFromRanking, rateWithCI, withoutOwnFamily, rng } = require('./rank');
const { renderPrompt } = require('./spec');
const det = require('./score/deterministic');

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const median = (a) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '–');
const f2 = (x) => (Number.isFinite(x) ? x.toFixed(2) : '–');
const pct = (x) => (Number.isFinite(x) ? `${Math.round(x * 100)} %` : '–');

/** Group-level pairwise outcomes for a set of judgments, mapped to model keys. */
function groupsOf(judgments) {
  return judgments.map((j) =>
    pairsFromRanking(
      j.verdict.ranking.map((l) => j.labels[l].model),
      { judge: j.judge, judgeFamily: j.judgeFamily }
    )
  );
}

function ratings(models, judgments, familyOf, samples, failureGroups = []) {
  const keys = models.map((m) => m.key);
  const groups = [...groupsOf(judgments), ...failureGroups];
  return {
    all: rateWithCI(keys, groups, samples),
    noOwnFamily: rateWithCI(keys, withoutOwnFamily(groups, familyOf), samples),
  };
}

/** Rubric means per model from judged groups. */
function rubricMeans(judgments, field) {
  const acc = {};
  for (const j of judgments) {
    for (const t of j.verdict.texts) {
      const model = j.labels[t.label]?.model;
      if (!model) continue;
      (acc[model] ||= []).push(t[field]);
    }
  }
  return Object.fromEntries(Object.entries(acc).map(([m, v]) => [m, mean(v)]));
}

/**
 * Human votes (results/<run>/human-votes.json, written by `bench human`): per track a
 * Bradley-Terry rating over decisive votes (each vote is its own bootstrap unit), the raw
 * win/tie/loss counts, and how often the model judges' rating order agrees with the person.
 */
function humanPanel(runId, models, taskById, tracks, samples) {
  const file = path.join(runDir(runId), 'human-votes.json');
  if (!fs.existsSync(file)) return null;
  const { votes } = readJson(file);
  const keys = models.map((m) => m.key);
  const out = { votes: votes.length, judges: [...new Set(votes.map((v) => v.judge))], tracks: {} };
  for (const track of ['literary', 'nonfiction']) {
    const tv = votes.filter((v) => taskById[v.task]?.track === track);
    if (!tv.length) continue;
    const counts = Object.fromEntries(keys.map((k) => [k, { w: 0, t: 0, l: 0 }]));
    const groups = [];
    let agree = 0;
    let decisive = 0;
    for (const v of tv) {
      const [a, b] = [v.left.model, v.right.model];
      if (!counts[a] || !counts[b]) continue;
      if (v.choice === 'tie') {
        counts[a].t++;
        counts[b].t++;
        continue;
      }
      const [winner, loser] = v.choice === 'left' ? [a, b] : [b, a];
      counts[winner].w++;
      counts[loser].l++;
      groups.push([{ winner, loser }]);
      const rw = tracks[track].all[winner].rating;
      const rl = tracks[track].all[loser].rating;
      if (rw !== rl) {
        decisive++;
        if (rw > rl) agree++;
      }
    }
    out.tracks[track] = {
      votes: tv.length,
      ties: tv.filter((v) => v.choice === 'tie').length,
      counts,
      ratings: groups.length ? rateWithCI(keys, groups, samples, 7) : null,
      agreement: decisive ? agree / decisive : null,
      decisive,
    };
  }
  return out;
}

/** Elo-scale gap → probability that a text of the first model is preferred. */
const winProbability = (gap) => 1 / (1 + 10 ** (-gap / 400));

/**
 * Figures that say how much a run's ratings can be trusted and what they rest on: volume,
 * head-to-head win probabilities, how far the judges agree, how much each judge favours its
 * own family, and how many errors the judges quoted per text.
 */
function runStatistics({ R, models, gens, judgments, checks, familyOf, bench }) {
  const keys = models.map((m) => m.key);
  const pairCount = judgments.reduce((n, j) => {
    const k = j.verdict?.ranking?.length || 0;
    return n + (k * (k - 1)) / 2;
  }, 0);
  const quoted = {};
  for (const j of judgments)
    for (const t of j.verdict?.texts || []) {
      const m = j.labels?.[t.label]?.model;
      if (m) (quoted[m] ||= []).push((t.fehler || []).length);
    }
  const out = {
    volume: {
      models: keys.length,
      texts: gens.length,
      words: gens.reduce((n, g) => n + (String(g.text || '').match(/\S+/g) || []).length, 0),
      groupVerdicts: judgments.length,
      pairwiseComparisons: pairCount,
      checklistChecks: checks.length,
      quotedErrors: Object.values(quoted).reduce((n, v) => n + v.reduce((a, b) => a + b, 0), 0),
    },
    quotedErrorsPerText: Object.fromEntries(Object.entries(quoted).map(([m, v]) => [m, mean(v)])),
    tracks: {},
  };
  const judgeKeys = bench.spec.judging.judges;
  for (const track of ['literary', 'nonfiction']) {
    const all = R.tracks[track]?.all;
    const pj = R.perJudge[track];
    if (!all || !pj) continue;
    const pairs = [];
    for (let i = 0; i < keys.length; i++)
      for (let k = i + 1; k < keys.length; k++) pairs.push([keys[i], keys[k]]);
    const agreement = [];
    for (let a = 0; a < judgeKeys.length; a++)
      for (let b = a + 1; b < judgeKeys.length; b++) {
        const [x, y] = [pj[judgeKeys[a]], pj[judgeKeys[b]]];
        const same = pairs.filter(
          ([p, q]) => x[p].rating > x[q].rating === y[p].rating > y[q].rating
        ).length;
        agreement.push({ judges: [judgeKeys[a], judgeKeys[b]], same, of: pairs.length });
      }
    // Rank each judge gives its own family's models, against the mean rank the others give.
    const rankBy = (judge) =>
      Object.fromEntries(
        [...keys]
          .sort((p, q) => pj[judge][q].rating - pj[judge][p].rating)
          .map((m, i) => [m, i + 1])
      );
    const ranks = Object.fromEntries(judgeKeys.map((j) => [j, rankBy(j)]));
    const selfPreference = [];
    for (const j of judgeKeys) {
      const fam = bench.spec.judges[j].family;
      for (const m of keys.filter((k) => familyOf[k] === fam)) {
        const others = judgeKeys.filter((o) => o !== j).map((o) => ranks[o][m]);
        selfPreference.push({ judge: j, model: m, ownRank: ranks[j][m], othersRank: mean(others) });
      }
    }
    const ordered = [...keys].sort((p, q) => all[q].rating - all[p].rating);
    out.tracks[track] = {
      winProbability: Object.fromEntries(
        ordered.map((p) => [
          p,
          Object.fromEntries(
            ordered.map((q) => [q, winProbability(all[p].rating - all[q].rating)])
          ),
        ])
      ),
      ordered,
      agreement,
      selfPreference,
    };
  }
  return out;
}

function build(runId, bench) {
  const manifest = readJson(path.join(runDir(runId), 'manifest.json'));
  const models = bench.models.filter((m) => manifest.models.includes(m.key));
  const familyOf = Object.fromEntries(bench.models.map((m) => [m.key, m.family]));
  const tasks = bench.tasks;
  const taskById = Object.fromEntries(tasks.map((t) => [t.id, t]));
  const gens = loadGenerations(runId).filter((g) => manifest.models.includes(g.model));
  const judgments = loadDir(runId, 'judgments');
  const checks = loadDir(runId, 'checks');
  const samples = bench.spec.judging.bootstrap_samples;
  const R = {
    runId,
    manifest,
    tracks: {},
    perJudge: {},
    editing: {},
    nonfiction: {},
    context: {},
    cost: {},
    judgeCostUsd: 0,
  };

  // --- Failures: a text that never arrived (e.g. thinking exhausted the token limit).
  // An author gets nothing in that case, so it is scored, not skipped: in ranked tasks it
  // loses against every text of its task, in keyed tracks it scores 0.
  const runTasks = tasks.filter((t) => gens.some((g) => g.task === t.id));
  // A failure is an answer WITHOUT text (the model returned nothing). A generation that is
  // missing altogether never got an answer — an API error or an interrupted run — and is not
  // the model's fault: it is listed as `missing`, flagged in the report, and not scored.
  const failures = [];
  const missing = [];
  for (const t of runTasks)
    for (const m of models)
      for (let r = 1; r <= manifest.runs; r++) {
        const g = gens.find((x) => x.task === t.id && x.model === m.key && x.run === r);
        if (!g) missing.push({ task: t.id, model: m.key, run: r });
        else if (!g.text) failures.push({ task: t.id, model: m.key, run: r });
      }
  R.failures = failures;
  R.missing = missing;
  const failureGroupsFor = (taskFilter) =>
    failures
      .filter((f) => taskFilter(taskById[f.task]))
      .map((f) => {
        const winners = [
          ...new Set(gens.filter((g) => g.task === f.task && g.text).map((g) => g.model)),
        ].filter((w) => w !== f.model);
        return winners.map((w) => ({
          winner: w,
          loser: f.model,
          judge: 'failure',
          judgeFamily: null,
        }));
      })
      .filter((g) => g.length);
  const failedCount = (model, taskId) =>
    failures.filter((f) => f.model === model && f.task === taskId).length;

  // --- Ranked tracks
  for (const track of ['literary', 'nonfiction']) {
    const tj = judgments.filter(
      (j) => taskById[j.task]?.track === track && taskById[j.task]?.language === 'de'
    );
    const fg = failureGroupsFor(
      (t) => t.track === track && t.language === 'de' && bench.spec.tracks[t.track].judged
    );
    R.tracks[track] = ratings(models, tj, familyOf, samples, fg);
    R.tracks[track].rubric = {
      sprache: rubricMeans(tj, 'sprache'),
      stil: rubricMeans(tj, 'stil'),
      aufgabe: rubricMeans(tj, 'aufgabe'),
    };
    R.perJudge[track] = {};
    for (const jk of bench.spec.judging.judges) {
      R.perJudge[track][jk] = rateWithCI(
        models.map((m) => m.key),
        [...groupsOf(tj.filter((j) => j.judge === jk)), ...fg],
        Math.min(samples, 300)
      );
    }
  }
  const en = judgments.filter((j) => taskById[j.task]?.language === 'en');
  R.tracks.english = ratings(
    models,
    en,
    familyOf,
    samples,
    failureGroupsFor((t) => t.language === 'en')
  );

  // --- Non-fiction from source: facts and unsupported claims
  const src = tasks.find((t) => t.source);
  if (src) {
    for (const m of models) {
      const texts = gens.filter((g) => g.task === src.id && g.model === m.key && g.text);
      const unsupported = [];
      for (const j of judgments.filter((x) => x.task === src.id)) {
        for (const t of j.verdict.texts)
          if (j.labels[t.label]?.model === m.key) unsupported.push(t.unsupported.length);
      }
      R.nonfiction[m.key] = {
        factCoverage: mean([
          ...texts.map((g) => det.factCoverage(src.facts, g.text).coverage),
          ...Array(failedCount(m.key, src.id)).fill(0),
        ]),
        unsupportedMedian: median(unsupported),
      };
    }
  }
  // Checklist violations on the long chapter (majority of judges per text)
  const chk = tasks.find((t) => t.checklist);
  if (chk) {
    for (const m of models) {
      const perText = {};
      for (const j of judgments.filter((x) => x.task === chk.id)) {
        for (const t of j.verdict.texts) {
          const lab = j.labels[t.label];
          if (lab?.model !== m.key) continue;
          (perText[lab.run] ||= []).push(t.violations.length);
        }
      }
      (R.nonfiction[m.key] ||= {}).chapterViolations = mean(Object.values(perText).map(median));
    }
  }

  // --- Editing (deterministic + checklist)
  for (const m of models) {
    const e = {};
    for (const t of tasks.filter((x) => x.track === 'editing')) {
      const texts = gens.filter((g) => g.task === t.id && g.model === m.key && g.text);
      if (t.fixes) {
        const zero = { score: 0, recall: 0, protect: 0, missed: ['(no text)'] };
        const s = [
          ...texts.map((g) => det.scoreProofread(t, g.text)),
          ...Array(failedCount(m.key, t.id)).fill(zero),
        ];
        e.proofread = {
          score: mean(s.map((x) => x.score)),
          recall: mean(s.map((x) => x.recall)),
          protect: mean(s.map((x) => x.protect)),
          missed: s.flatMap((x) => x.missed),
        };
      } else if (t.facts && t.target_words) {
        const zero = { score: 0, coverage: 0, words: 0, invented: [] };
        const s = [
          ...texts.map((g) => det.scoreTighten(t, g.text)),
          ...Array(failedCount(m.key, t.id)).fill(zero),
        ];
        e.tighten = {
          score: mean(s.map((x) => x.score)),
          coverage: mean(s.map((x) => x.coverage)),
          words: mean(s.map((x) => x.words)),
          invented: s.flatMap((x) => x.invented),
        };
      } else if (t.issues) {
        const byRun = {};
        for (const c of checks.filter((x) => x.task === t.id && x.model === m.key))
          (byRun[c.run] ||= []).push(c.verdict);
        const runs = Object.values(byRun).map((vs) => {
          // An issue counts as found when a majority of judges says so.
          const found = t.issues.filter(
            (i) => vs.filter((v) => v.found.includes(i.id)).length * 2 > vs.length
          ).length;
          const falseAlarms = median(vs.map((v) => v.false_alarms));
          return {
            found,
            falseAlarms,
            score: Math.max(0, found / t.issues.length - 0.05 * falseAlarms),
          };
        });
        for (let k = 0; k < failedCount(m.key, t.id); k++)
          runs.push({ found: 0, falseAlarms: 0, score: 0 });
        e.feedback = {
          score: mean(runs.map((r) => r.score)),
          found: mean(runs.map((r) => r.found)),
          of: t.issues.length,
          falseAlarms: mean(runs.map((r) => r.falseAlarms)),
        };
      }
    }
    e.score = mean(
      [e.proofread?.score, e.tighten?.score, e.feedback?.score].filter(Number.isFinite)
    );
    R.editing[m.key] = e;
  }

  // --- Book context fidelity: assertions, majority of judges per text
  const ctxTasks = tasks.filter((t) => t.assertions);
  for (const m of models) {
    const perText = [];
    const byDim = {};
    for (const t of ctxTasks) {
      const byRun = {};
      for (const c of checks.filter((x) => x.task === t.id && x.model === m.key))
        (byRun[c.run] ||= []).push(c.verdict);
      for (const vs of Object.values(byRun)) {
        const violated = t.assertions.filter(
          (a) => vs.filter((v) => v.violated.includes(a.id)).length * 2 > vs.length
        );
        perText.push(1 - violated.length / t.assertions.length);
        for (const a of violated) byDim[a.dim] = (byDim[a.dim] || 0) + 1;
      }
      for (let k = 0; k < failedCount(m.key, t.id); k++) perText.push(0); // no chapter delivered
    }
    const ctxGens = gens.filter(
      (g) => g.model === m.key && g.text && ctxTasks.some((t) => t.id === g.task)
    );
    R.context[m.key] = {
      score: mean(perText),
      texts: perText.length,
      byDim,
      centsPerChapter: mean(ctxGens.map((g) => (g.costUsd || 0) * 100)),
    };
  }

  // --- Cost, speed, reliability
  for (const m of models) {
    const mine = gens.filter((g) => g.model === m.key);
    const ok = mine.filter((g) => g.text);
    const chars = ok.reduce((n, g) => n + g.text.length, 0);
    // Cost includes texts that never arrived: the thinking tokens were billed anyway.
    const cost = mine.reduce((n, g) => n + (g.costUsd || 0), 0);
    R.cost[m.key] = {
      texts: ok.length,
      expected: tasks.length * manifest.runs,
      centsPerPage: chars ? (cost / chars) * 1800 * 100 : NaN,
      medianSeconds: median(ok.map((g) => g.latencyMs / 1000)),
      failed: failures.filter((f) => f.model === m.key).length,
      truncated: ok.filter((g) => /length|max_tokens/i.test(String(g.finish))).length,
      metaText: ok.filter((g) => g.meta && g.meta.length).length,
      totalUsd: cost,
    };
  }
  // --- Human panel: blind pairwise votes from arena.hermes3000.ai (`bench human`).
  R.human = humanPanel(runId, models, taskById, R.tracks, samples);
  R.stats = runStatistics({ R, models, gens, judgments, checks, familyOf, bench });

  R.judgeCostUsd = [...judgments, ...checks].reduce((n, j) => n + (j.costUsd || 0), 0);
  R.generationCostUsd = gens.reduce((n, g) => n + (g.costUsd || 0), 0);
  return { R, models, gens, tasks };
}

function ratingTable(models, r, extra = () => '') {
  const rows = models
    .map((m) => ({ m, x: r.all[m.key], y: r.noOwnFamily[m.key] }))
    .sort((a, b) => b.x.rating - a.x.rating);
  const lines = [
    '| # | Model | Rating (95 % CI) | Without own-family judges |' +
      (extra(null) ? ' ' + extra(null) + ' |' : ''),
    '|---|---|---|---|' + (extra(null) ? '---|' : ''),
  ];
  rows.forEach(({ m, x, y }, i) => {
    lines.push(
      `| ${i + 1} | ${m.label}${m.open_weight ? ' ¹' : ''} | **${x.rating}** (${x.lo}–${x.hi}) | ${y.rating} (${y.lo}–${y.hi}) |` +
        (extra(m) ? ' ' + extra(m) + ' |' : '')
    );
  });
  return lines.join('\n');
}

function writeStatistics(md, R, models) {
  const S = R.stats;
  if (!S) return;
  const label = Object.fromEntries(models.map((m) => [m.key, m.label]));
  const v = S.volume;
  md.push(
    '## Statistics',
    '',
    `**Volume.** ${v.models} models, ${v.texts} texts (${v.words.toLocaleString('en-US')} words), ${v.groupVerdicts} group verdicts = ${v.pairwiseComparisons.toLocaleString('en-US')} pairwise comparisons, ${v.checklistChecks} checklist checks, ${v.quotedErrors.toLocaleString('en-US')} errors quoted verbatim by the judges.`,
    ''
  );
  for (const [track, t] of Object.entries(S.tracks)) {
    const name = track === 'literary' ? 'Literary prose' : 'Non-fiction';
    md.push(
      `### ${name}: head-to-head`,
      '',
      'Probability that a text of the row model is preferred over a text of the column model, from the rating gap (Elo scale: p = 1 / (1 + 10^(−gap/400))).',
      '',
      '| | ' + t.ordered.map((m) => label[m]).join(' | ') + ' |',
      '|---|' + t.ordered.map(() => '---').join('|') + '|'
    );
    for (const p of t.ordered)
      md.push(
        `| **${label[p]}** | ` +
          t.ordered.map((q) => (p === q ? '–' : pct(t.winProbability[p][q]))).join(' | ') +
          ' |'
      );
    md.push(
      '',
      `**Judge agreement** (model pairs ordered the same way by two judges' own ratings): ` +
        t.agreement.map((a) => `${a.judges.join('–')} ${a.same}/${a.of}`).join(' · ') +
        '.',
      '',
      '**Own-family preference** (rank a judge gives its own family vs. mean rank from the other judges): ' +
        t.selfPreference
          .map((x) => `${x.judge} → ${label[x.model]} ${x.ownRank} vs ${f1(x.othersRank)}`)
          .join(' · ') +
        '.',
      ''
    );
  }
  md.push(
    '**Errors quoted per text** (mean over all judged texts and judges): ' +
      models
        .filter((m) => Number.isFinite(S.quotedErrorsPerText[m.key]))
        .sort((a, b) => S.quotedErrorsPerText[a.key] - S.quotedErrorsPerText[b.key])
        .map((m) => `${m.label} ${f1(S.quotedErrorsPerText[m.key])}`)
        .join(' · ') +
      '.',
    ''
  );
}

function writeMarkdown(runId, bench, { R, models }) {
  const md = [];
  const m0 = R.manifest;
  // A hand-written press summary (SUMMARY.md, optionally ZUSAMMENFASSUNG.md) is linked first:
  // it is what most readers want, and this report is the evidence behind it.
  const summaryLink = fs.existsSync(path.join(runDir(runId), 'SUMMARY.md'))
    ? `**Short version for readers and press:** [SUMMARY.md](SUMMARY.md)${fs.existsSync(path.join(runDir(runId), 'ZUSAMMENFASSUNG.md')) ? ' · [ZUSAMMENFASSUNG.md](ZUSAMMENFASSUNG.md)' : ''}`
    : null;
  md.push(`# hermes3000 Writing Benchmark — run \`${runId}\``, '');
  if (summaryLink) md.push(summaryLink, '');
  if (R.missing.length)
    md.push(
      `> **Incomplete run:** ${R.missing.length} generation(s) never received an answer (API error or interrupted run) and are not scored: ${R.missing.map((x) => `${x.model}/${x.task}/r${x.run}`).join(', ')}. Re-run the same command to fill them in before publishing.`,
      ''
    );
  md.push(
    `Benchmark ${m0.benchmark}, fingerprint \`${m0.fingerprint}\`${m0.privateTasks ? `, private tasks \`${m0.privateTasks}\`` : ''}, stage **${m0.stage}**, ${m0.runs} sample(s) per task and model, started ${m0.started.slice(0, 10)}, code \`${m0.commit || 'n/a'}\`. Judges: ${m0.judges.map((k) => bench.spec.judges[k].model).join(', ')}.`,
    ''
  );
  md.push(
    'Ratings are Bradley-Terry on an Elo-like scale (mean 1000) from blind group rankings; intervals are 95 % bootstrap over judged groups. Overlapping intervals mean the order is not established. ¹ open-weight model.',
    ''
  );

  for (const [track, title] of [
    ['literary', 'Literary prose (German)'],
    ['nonfiction', 'Non-fiction (German)'],
  ]) {
    const rb = R.tracks[track].rubric;
    md.push(`## ${title}`, '');
    md.push(
      ratingTable(models, R.tracks[track], (m) =>
        m
          ? `${f1(rb.sprache[m.key])} / ${f1(rb.stil[m.key])} / ${f1(rb.aufgabe[m.key])}`
          : 'Language / style / brief (1–10)'
      ),
      ''
    );
    md.push(
      'Per judge: ' +
        Object.entries(R.perJudge[track])
          .map(([jk, r]) => {
            const top = Object.entries(r)
              .sort((a, b) => b[1].rating - a[1].rating)
              .slice(0, 3)
              .map(([k]) => models.find((m) => m.key === k)?.label);
            return `${jk} → ${top.join(', ')}`;
          })
          .join(' · '),
      ''
    );
  }

  md.push('### Facts and brief adherence', '');
  md.push(
    '| Model | Source facts kept | Unsupported claims (median per text) | Chapter brief violations (mean) |',
    '|---|---|---|---|'
  );
  for (const m of models) {
    const n = R.nonfiction[m.key] || {};
    md.push(
      `| ${m.label} | ${pct(n.factCoverage)} | ${f1(n.unsupportedMedian)} | ${f1(n.chapterViolations)} |`
    );
  }
  md.push('');

  md.push('## Copy-editing (German, scored against answer keys)', '');
  md.push(
    '| Model | Editing score | Proofread: errors fixed / style kept | Tighten: facts kept / words | Notes: problems found / false alarms |',
    '|---|---|---|---|---|'
  );
  for (const m of [...models].sort(
    (a, b) => (R.editing[b.key].score || 0) - (R.editing[a.key].score || 0)
  )) {
    const e = R.editing[m.key];
    md.push(
      `| ${m.label} | **${pct(e.score)}** | ${pct(e.proofread?.recall)} / ${pct(e.proofread?.protect)} | ${pct(e.tighten?.coverage)} / ${f1(e.tighten?.words)} | ${f1(e.feedback?.found)} of ${e.feedback?.of ?? '–'} / ${f1(e.feedback?.falseAlarms)} |`
    );
  }
  md.push('');

  md.push('## Book context fidelity (German)', '');
  md.push(
    'Writing a chapter inside a frozen book context (cast, places, summaries of all chapters — later ones included). Score = share of known assertions kept, majority of judges per text.',
    ''
  );
  md.push(
    '| Model | Assertions kept | Name confusion | Spoiler | Hallucination | Invariants | Selectivity / psyche | Cents per chapter with context |',
    '|---|---|---|---|---|---|---|---|'
  );
  for (const m of [...models].sort(
    (a, b) => (R.context[b.key].score || 0) - (R.context[a.key].score || 0)
  )) {
    const c = R.context[m.key];
    const d = c.byDim || {};
    md.push(
      `| ${m.label} | **${pct(c.score)}** | ${d.confusion || 0} | ${d.spoiler || 0} | ${d.hallucination || 0} | ${d.consistency || 0} | ${(d.selectivity || 0) + (d.psyche || 0)} | ${f2(c.centsPerChapter)} |`
    );
  }
  md.push('', 'Violation columns count texts × assertions violated, summed over all samples.', '');

  md.push('## English control', '', ratingTable(models, R.tracks.english), '');

  writeStatistics(md, R, models);

  if (R.human) {
    md.push(
      '## Human panel (blind pairwise votes)',
      '',
      `${R.human.votes} votes by ${R.human.judges.length} ${R.human.judges.length === 1 ? 'person' : 'people'} at arena.hermes3000.ai: two texts for the same task, sides randomised, no model names. Ratings use decisive votes only; with this few votes the intervals are wide. "Agreement" is the share of decisive votes where the person preferred the model the AI judges rate higher.`,
      ''
    );
    for (const [track, h] of Object.entries(R.human.tracks)) {
      md.push(
        `### ${track === 'literary' ? 'Literary prose' : 'Non-fiction'} — ${h.votes} votes, ${h.ties} ties, agreement with AI judges ${h.agreement === null ? '–' : pct(h.agreement)}`,
        '',
        '| Model | Human rating (95 % CI) | Won / tied / lost | AI-judge rating |',
        '|---|---|---|---|'
      );
      const rows = [...models].sort(
        (a, b) => (h.ratings?.[b.key]?.rating ?? 0) - (h.ratings?.[a.key]?.rating ?? 0)
      );
      for (const m of rows) {
        const c = h.counts[m.key];
        if (!c.w && !c.t && !c.l) continue;
        const r = h.ratings?.[m.key];
        md.push(
          `| ${m.label} | ${r ? `**${r.rating}** (${r.lo}–${r.hi})` : '–'} | ${c.w} / ${c.t} / ${c.l} | ${R.tracks[track].all[m.key].rating} |`
        );
      }
      md.push('');
    }
  }

  md.push('## Cost, speed, reliability', '');
  md.push(
    '| Model | Cents per standard page | Median seconds per text | Texts delivered | No text (failed) | Cut off | Preamble/heading |',
    '|---|---|---|---|---|---|---|'
  );
  for (const m of [...models].sort(
    (a, b) => R.cost[a.key].centsPerPage - R.cost[b.key].centsPerPage
  )) {
    const c = R.cost[m.key];
    md.push(
      `| ${m.label} | ${f2(c.centsPerPage)} | ${Math.round(c.medianSeconds)} | ${c.texts}/${c.expected} | ${c.failed} | ${c.truncated} | ${c.metaText} |`
    );
  }
  md.push(
    '',
    `A standard page (Normseite) is 1,800 characters of output; thinking tokens are included in cost, also for texts that never arrived. "No text": the model spent the whole token budget thinking and returned nothing — scored as a failure in every track. Generation cost of this run: $${R.generationCostUsd.toFixed(2)}, judging: $${R.judgeCostUsd.toFixed(2)}.`,
    ''
  );
  // Hand-written observations about the run (what we would do differently next time) live in
  // notes.md next to the data, so re-computing the report never loses them.
  const notes = path.join(runDir(runId), 'notes.md');
  if (fs.existsSync(notes)) md.push(fs.readFileSync(notes, 'utf8').trim(), '');
  fs.writeFileSync(path.join(runDir(runId), 'report.md'), md.join('\n'));
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Blind reading page; the key is a separate file so the page can be handed to a reader. */
function writeBlind(runId, { gens, tasks }) {
  const dir = path.join(runDir(runId), 'blind');
  fs.mkdirSync(dir, { recursive: true });
  const rand = rng(12345);
  const body = [];
  const key = [];
  for (const t of tasks.filter((x) => !x.assertions)) {
    const texts = gens.filter((g) => g.task === t.id && g.text);
    const order = texts
      .map((g) => [rand(), g])
      .sort((a, b) => a[0] - b[0])
      .map((x) => x[1]);
    body.push(
      `<section><h2>${esc(t.title)}</h2><p class="task">${esc(t.prompt.replace(/\{\{\w+\}\}/g, '[…]')).replace(/\n/g, '<br>')}</p>`
    );
    order.forEach((g, i) => {
      const id = `${t.id}-${i + 1}`;
      body.push(
        `<article id="${id}"><h3>${id}</h3>${esc(g.text)
          .split(/\n\s*\n/)
          .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
          .join('')}</article>`
      );
      key.push(`<tr><td>${id}</td><td>${esc(g.model)}</td><td>${g.run}</td></tr>`);
    });
    body.push('</section>');
  }
  const head = (title) =>
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font:17px/1.6 Georgia,serif;max-width:720px;margin:0 auto;padding:16px;background:#fbfaf7;color:#222}h2,h3{font-family:system-ui}h3{font-size:14px;color:#777}.task{font:14px system-ui;color:#555;background:#eee;padding:10px}td{padding:2px 8px;font:14px system-ui}</style></head><body>`;
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    `${head('Blind reading')}<h1>Blind reading — ${esc(runId)}</h1><p>Texts are shuffled per task. The key is in key.html.</p>${body.join('\n')}</body></html>`
  );
  fs.writeFileSync(
    path.join(dir, 'key.html'),
    `${head('Key')}<h1>Key — ${esc(runId)}</h1><table>${key.join('')}</table></body></html>`
  );
}

/**
 * Pairs for the human panel (arena.hermes3000.ai benchmark mode): for each judged German
 * task, random pairs of texts from different models, sides randomised.
 */
function writeArenaPairs(runId, bench, { gens, tasks }, perTask = 12) {
  const rand = rng(777);
  const pairs = [];
  const seen = new Set();
  for (const t of tasks.filter((x) => bench.spec.tracks[x.track].judged && x.language === 'de')) {
    const texts = gens.filter((g) => g.task === t.id && g.text);
    for (let k = 0; k < perTask && texts.length > 1; k++) {
      const a = texts[Math.floor(rand() * texts.length)];
      const others = texts.filter((g) => g.model !== a.model);
      if (!others.length) break;
      const b = others[Math.floor(rand() * others.length)];
      const [left, right] = rand() < 0.5 ? [a, b] : [b, a];
      // The same two samples drawn twice would count one comparison twice; skip, don't redraw
      // (redrawing would change every later pair of an already-imported run).
      const id = [`${a.model}#${a.run}`, `${b.model}#${b.run}`].sort().join('|');
      if (seen.has(`${t.id}|${id}`)) continue;
      seen.add(`${t.id}|${id}`);
      pairs.push({
        task: t.id,
        title: t.title,
        prompt: renderPrompt(t), // the prompt the models saw, source material included
        left: { model: left.model, run: left.run, text: left.text },
        right: { model: right.model, run: right.run, text: right.text },
      });
    }
  }
  writeJson(path.join(runDir(runId), 'arena-pairs.json'), pairs);
  return pairs.length;
}

function report(runId, bench) {
  const built = build(runId, bench);
  writeMarkdown(runId, bench, built);
  writeJson(path.join(runDir(runId), 'ratings.json'), built.R);
  writeBlind(runId, built);
  const n = writeArenaPairs(runId, bench, built);
  return { ...built, arenaPairs: n };
}

/** Finalists: best by mean rank across the two judged tracks and editing. */
function finalists(runId, bench, n) {
  const { R, models } = build(runId, bench);
  // Tied scores share the mean of their positions (fractional ranking). Breaking ties by list
  // order once decided a final seat: in book context nearly every model scores 100 %, and the
  // models listed first in models.yaml took the better ranks.
  const rankIn = (score) => {
    const values = models.map((m) => score(m)).sort((a, b) => b - a);
    const rankOf = (v) => {
      const first = values.indexOf(v);
      const count = values.filter((x) => x === v).length;
      return first + (count - 1) / 2;
    };
    return (k) => rankOf(score(models.find((m) => m.key === k)));
  };
  const lit = rankIn((m) => R.tracks.literary.all[m.key].rating);
  const nf = rankIn((m) => R.tracks.nonfiction.all[m.key].rating);
  const ed = rankIn((m) => R.editing[m.key].score || 0);
  const ctx = rankIn((m) => R.context[m.key].score || 0);
  return [...models]
    .map((m) => ({
      key: m.key,
      meanRank: (lit(m.key) + nf(m.key) + ed(m.key) + ctx(m.key)) / 4,
    }))
    .sort((a, b) => a.meanRank - b.meanRank)
    .slice(0, n);
}

module.exports = { report, finalists, build };
