#!/usr/bin/env node
'use strict';
/**
 * How reliable is Hermes 3000's style analysis (Andreas Eschbach's ten rules)?
 *
 * Hermes runs it on Gemini 3.1 Flash Lite ("ANALYSIS"), temperature 0.3, thinking budget 8,192,
 * with the prompt snapshot in prompt-de.json. This experiment reproduces that call exactly and
 * asks three questions about it, on the benchmark's German literary texts (final 2026-10-18)
 * plus the German-classics anchors:
 *   1. test–retest — does the same text get the same scores? (3 runs per text)
 *   2. agreement — do Claude Opus 5.5, GPT-6.1 Sol and Gemini 4 Argon score it alike?
 *   3. validity — do the criteria that can be counted (passive, filler words, sentence length,
 *      simultaneity, indirect perception, dialogue tags) move with the counts?
 *
 *   node experiments/eschbach-check/run.js [--report]
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { ROOT, loadBenchmark } = require('../../src/spec');
const { callModel, costOf } = require('../../src/providers');
const { pooled, loadGenerations } = require('../../src/run');

const HERE = __dirname;
const OUT = path.join(HERE, 'out');
const RUN = '2026-10-18-v1-final';
const HERMES_MODEL = 'gemini-3.1-flash-lite';
const REPEATS = 3;
const P = JSON.parse(fs.readFileSync(path.join(HERE, 'prompt-de.json'), 'utf8'));
const CRITERIA = [
  'sceneEntry',
  'adjectivesAdverbs',
  'dialogueMarkers',
  'fillerWords',
  'simultaneity',
  'passive',
  'longSentences',
  'longDialogues',
  'indirectPerception',
  'repetitions',
];

function loadEnv() {
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

/** The exact Hermes request: system prompt as a user turn, "understood" as a model turn. */
function hermesCall(text) {
  const body = JSON.stringify({
    contents: [
      { role: 'user', parts: [{ text: P.system }] },
      { role: 'model', parts: [{ text: P.understood }] },
      { role: 'user', parts: [{ text: P.userPrompt.replace('{{text}}', text) }] },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 16384,
      thinkingConfig: { thinkingBudget: 8192 },
    },
  });
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${HERMES_MODEL}:generateContent`;
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': process.env.GOOGLE_API_KEY,
          'content-length': Buffer.byteLength(body),
        },
      },
      (res) => {
        const c = [];
        res.on('data', (d) => c.push(d));
        res.on('end', () => {
          const raw = Buffer.concat(c).toString();
          if (res.statusCode !== 200)
            return reject(new Error(`${res.statusCode} ${raw.slice(0, 300)}`));
          const d = JSON.parse(raw);
          resolve(
            (d.candidates?.[0]?.content?.parts || [])
              .filter((p) => !p.thought)
              .map((p) => p.text || '')
              .join('')
          );
        });
      }
    );
    req.setTimeout(180000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end(body);
  });
}

/** Hermes' own parsing: strip fences, fall back to the outermost braces. */
function parse(text) {
  let t = String(text || '')
    .trim()
    .replace(/^```(json)?/, '')
    .replace(/```$/, '')
    .trim();
  try {
    return JSON.parse(t);
  } catch {
    const a = t.indexOf('{');
    const b = t.lastIndexOf('}');
    try {
      return JSON.parse(t.slice(a, b + 1));
    } catch {
      return null;
    }
  }
}

// --- counts for the criteria that can be counted -------------------------------------------
const sentences = (t) =>
  String(t)
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?…])\s+(?=[„"»A-ZÄÖÜ])/)
    .filter((s) => s.trim());
const wordsOf = (t) => String(t).match(/[A-Za-zÄÖÜäöüß]+/g) || [];
function counts(text) {
  const w = wordsOf(text);
  const n = w.length || 1;
  const lower = text.toLowerCase();
  const per1k = (re) => ((lower.match(re) || []).length / n) * 1000;
  const sl = sentences(text)
    .map((s) => wordsOf(s).length)
    .filter((x) => x > 0);
  const quoted = (text.match(/[„"»][^„"»«“”]{1,600}[“"«”]/g) || []).join(' ');
  return {
    passive: per1k(/\b(wurde|wurden|wird|werden|worden|wurdest)\b[^.!?]{0,60}\bge\w+(t|en)\b/g),
    fillerWords: per1k(
      /\b(einige|einigen|mehrere|mehreren|ziemlich|ungefähr|wahrscheinlich|irgendwie|etwas|eigentlich|eben|halt|wohl|vielleicht|gewissermaßen)\b/g
    ),
    simultaneity: per1k(/\b(während|gleichzeitig|indem|zugleich)\b/g),
    indirectPerception: per1k(
      /\b(sah|hörte|spürte|fühlte|merkte|bemerkte|dachte|wusste|roch)\b,? (dass|wie)\b/g
    ),
    dialogueMarkers: per1k(
      /\b(sagte|fragte|antwortete|rief|flüsterte|meinte|erwiderte|murmelte)\b/g
    ),
    longSentences: sl.length ? sl.filter((x) => x > 25).length / sl.length : 0,
    meanSentence: sl.length ? sl.reduce((a, b) => a + b, 0) / sl.length : 0,
    dialogueShare: wordsOf(quoted).length / n,
  };
}
const VALIDITY = [
  ['passive', 'passive'],
  ['fillerWords', 'fillerWords'],
  ['simultaneity', 'simultaneity'],
  ['indirectPerception', 'indirectPerception'],
  ['dialogueMarkers', 'dialogueMarkers'],
  ['longSentences', 'longSentences'],
  ['longDialogues', 'dialogueShare'],
];

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sd = (a) => {
  const m = mean(a);
  return Math.sqrt(mean(a.map((x) => (x - m) ** 2)));
};
function pearson(x, y) {
  const mx = mean(x);
  const my = mean(y);
  let n = 0;
  let a = 0;
  let b = 0;
  for (let i = 0; i < x.length; i++) {
    n += (x[i] - mx) * (y[i] - my);
    a += (x[i] - mx) ** 2;
    b += (y[i] - my) ** 2;
  }
  return a && b ? n / Math.sqrt(a * b) : NaN;
}
const rank = (a) => {
  const s = [...a].map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
  const r = new Array(a.length);
  for (let i = 0; i < s.length;) {
    let j = i;
    while (j + 1 < s.length && s[j + 1][0] === s[i][0]) j++;
    for (let k = i; k <= j; k++) r[s[k][1]] = (i + j) / 2;
    i = j + 1;
  }
  return r;
};
const spearman = (x, y) => pearson(rank(x), rank(y));

function items(bench) {
  const lit = bench.tasks
    .filter((t) => t.track === 'literary' && t.language === 'de')
    .map((t) => t.id);
  const out = loadGenerations(RUN)
    .filter((g) => g.text && lit.includes(g.task))
    .map((g) => ({ id: `${g.task}__${g.model}__r${g.run}`, group: g.model, text: g.text }));
  const A = path.join(ROOT, 'anchors', 'de-classics');
  for (const a of JSON.parse(fs.readFileSync(path.join(A, 'index.json'), 'utf8')))
    out.push({
      id: `anchor__${a.file.replace(/\.txt$/, '')}`,
      group: 'German classics',
      text: fs.readFileSync(path.join(A, a.file), 'utf8'),
    });
  return out;
}

async function main() {
  loadEnv();
  const bench = loadBenchmark('v1');
  const judges = bench.spec.judging.judges.map((k) => ({ key: k, ...bench.spec.judges[k] }));
  const its = items(bench);
  fs.mkdirSync(OUT, { recursive: true });
  const file = (who, id, r) => path.join(OUT, `${who}__${id}__r${r}.json`);
  if (!process.argv.includes('--report')) {
    const jobs = [];
    for (const it of its) {
      for (let r = 1; r <= REPEATS; r++)
        if (!fs.existsSync(file('hermes', it.id, r))) jobs.push({ it, who: 'hermes', r });
      for (const j of judges)
        if (!fs.existsSync(file(j.key, it.id, 1))) jobs.push({ it, who: j.key, r: 1, j });
    }
    console.log(`eschbach: ${its.length} texts — ${jobs.length} analyses to run`);
    let done = 0;
    await pooled(
      jobs,
      (x) => x.who,
      6,
      async ({ it, who, r, j }) => {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            let text;
            let cost = 0;
            if (who === 'hermes') text = await hermesCall(it.text);
            else {
              const res = await callModel(j, {
                system: P.system,
                prompt: P.userPrompt.replace('{{text}}', it.text),
                maxTokens: 8000,
                timeoutMs: 240000,
              });
              text = res.text;
              cost = costOf(j, res.usage);
            }
            const parsed = parse(text);
            if (!parsed && attempt === 0) continue;
            fs.writeFileSync(
              file(who, it.id, r),
              JSON.stringify(
                { who, item: it.id, run: r, parsed, raw: parsed ? undefined : text, costUsd: cost },
                null,
                1
              )
            );
            if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`);
            return;
          } catch (e) {
            if (attempt === 1)
              console.log(`  ✗ ${who} ${it.id} r${r}: ${String(e.message).slice(0, 120)}`);
          }
        }
      }
    );
  }
  report(its, judges, file, bench);
}

function report(its, judges, file, bench) {
  const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
  // The prompt asks for these ten keys; models sometimes rename one (seen: "dialogueLength"
  // for "longDialogues"). Accept the obvious aliases for scoring, and count the deviations —
  // a renamed key is a criterion the Hermes client cannot show.
  const ALIAS = { longDialogues: ['dialogueLength', 'dialogLength'], repetitions: ['repetition'] };
  const crit = (p, c) =>
    p?.criteria?.[c] || (ALIAS[c] || []).map((a) => p?.criteria?.[a]).find(Boolean);
  const score = (p, c) => (c ? Number(crit(p, c)?.score) : Number(p?.overallScore));
  const label = Object.fromEntries(bench.models.map((m) => [m.key, m.label]));
  const md = [
    "# How reliable is Hermes 3000's style analysis (Eschbach's ten rules)?",
    '',
    `Hermes' call reproduced exactly (${HERMES_MODEL}, temperature 0.3, thinking budget 8,192, prompt in prompt-de.json) on ${its.length} German texts: the literary texts of the benchmark final ${RUN} and twelve classic novella openings at two lengths.`,
    '',
  ];

  // 1) Test–retest
  const rows = its
    .map((it) => ({
      it,
      runs: [1, 2, 3].map((r) => read(file('hermes', it.id, r))?.parsed).filter(Boolean),
    }))
    .filter((x) => x.runs.length === REPEATS);
  const overallSd = rows.map((x) => sd(x.runs.map((p) => score(p))));
  const flips = [];
  const critSd = {};
  for (const c of CRITERIA) {
    const sds = rows.map((x) => sd(x.runs.map((p) => score(p, c)))).filter(Number.isFinite);
    critSd[c] = mean(sds);
    flips.push(
      ...rows.map((x) => (new Set(x.runs.map((p) => p?.criteria?.[c]?.rating)).size > 1 ? 1 : 0))
    );
  }
  const r12 = pearson(
    rows.map((x) => score(x.runs[0])),
    rows.map((x) => score(x.runs[1]))
  );
  md.push(
    '## 1. Same text, same verdict? (three runs per text)',
    '',
    `- Overall score (1–10): mean spread between runs **${mean(overallSd).toFixed(2)} points** (standard deviation); run 1 vs run 2 across texts r = **${r12.toFixed(2)}**.`,
    `- A criterion changes its label (good / needs work / problematic) between runs in **${Math.round(mean(flips) * 100)} %** of cases.`,
    `- Texts where the overall score differs by 2 points or more between runs: **${Math.round(mean(rows.map((x) => (Math.max(...x.runs.map((p) => score(p))) - Math.min(...x.runs.map((p) => score(p))) >= 2 ? 1 : 0))) * 100)} %**.`,
    '',
    '| Criterion | Mean spread of the score between runs |',
    '|---|---|',
    ...CRITERIA.map((c) => `| ${c} | ${critSd[c].toFixed(2)} |`),
    ''
  );

  // 2) Agreement with stronger models
  md.push(
    '## 2. Do stronger models agree? (overall score, Spearman ρ across texts)',
    '',
    '| Model | ρ with Hermes (mean of 3 runs) | Mean score | Hermes mean score |',
    '|---|---|---|---|'
  );
  const hermesMean = Object.fromEntries(
    rows.map((x) => [x.it.id, mean(x.runs.map((p) => score(p)))])
  );
  for (const j of judges) {
    const pairs = its
      .map((it) => [hermesMean[it.id], score(read(file(j.key, it.id, 1))?.parsed)])
      .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
    md.push(
      `| ${j.key} (${j.model}) | ${spearman(
        pairs.map((p) => p[0]),
        pairs.map((p) => p[1])
      ).toFixed(
        2
      )} | ${mean(pairs.map((p) => p[1])).toFixed(1)} | ${mean(pairs.map((p) => p[0])).toFixed(1)} |`
    );
  }
  md.push('');

  // 3) Validity against counts
  md.push(
    '## 3. Do the scores follow what can be counted? (Spearman ρ, criterion score vs count across texts; a good criterion is clearly negative — more passive, lower passive score)',
    '',
    '| Criterion | Count | Hermes | ' + judges.map((j) => j.key).join(' | ') + ' |',
    '|---|---|---|' + judges.map(() => '---').join('|') + '|'
  );
  const C = Object.fromEntries(its.map((it) => [it.id, counts(it.text)]));
  for (const [crit, cnt] of VALIDITY) {
    const hv = its
      .map((it) => [
        C[it.id][cnt],
        mean((rows.find((x) => x.it.id === it.id)?.runs || []).map((p) => score(p, crit))),
      ])
      .filter(([, b]) => Number.isFinite(b));
    const cells = judges.map((j) => {
      const v = its
        .map((it) => [C[it.id][cnt], score(read(file(j.key, it.id, 1))?.parsed, crit)])
        .filter(([, b]) => Number.isFinite(b));
      return spearman(
        v.map((p) => p[0]),
        v.map((p) => p[1])
      ).toFixed(2);
    });
    md.push(
      `| ${crit} | ${cnt} | ${spearman(
        hv.map((p) => p[0]),
        hv.map((p) => p[1])
      ).toFixed(2)} | ${cells.join(' | ')} |`
    );
  }
  md.push('');

  // 4) Profile per group
  md.push(
    '## 4. Style profile per author (counted, per 1,000 words) and Hermes overall score',
    '',
    '| | Hermes score | Passive | Filler words | während/indem | "sah, dass" | Dialogue tags | Mean sentence (words) | Sentences > 25 words |',
    '|---|---|---|---|---|---|---|---|---|'
  );
  const groups = [...new Set(its.map((it) => it.group))];
  for (const g of groups) {
    const gi = its.filter((it) => it.group === g);
    const c = (k) => mean(gi.map((it) => C[it.id][k]));
    md.push(
      `| ${label[g] || g} | ${mean(gi.map((it) => hermesMean[it.id]).filter(Number.isFinite)).toFixed(1)} | ${c('passive').toFixed(1)} | ${c('fillerWords').toFixed(1)} | ${c('simultaneity').toFixed(1)} | ${c('indirectPerception').toFixed(1)} | ${c('dialogueMarkers').toFixed(1)} | ${c('meanSentence').toFixed(1)} | ${Math.round(c('longSentences') * 100)} % |`
    );
  }
  const cost = its.reduce(
    (n, it) => n + judges.reduce((m, j) => m + (read(file(j.key, it.id, 1))?.costUsd || 0), 0),
    0
  );
  // Schema deviations: an answer that lacks one of the ten keys the prompt specifies (seen:
  // "dialogueLength" for "longDialogues"). The Hermes client renders whatever keys arrive and
  // looks their labels up by key — a renamed key shows up as an untranslated label.
  const all = fs
    .readdirSync(OUT)
    .map((f) => read(path.join(OUT, f)))
    .filter((r) => r?.parsed);
  const offSchema = (pick) => {
    const rs = all.filter(pick);
    return `${rs.filter((r) => CRITERIA.some((c) => !r.parsed.criteria?.[c])).length} of ${rs.length}`;
  };
  md.push(
    '## 5. Does the answer keep to the format?',
    '',
    `Answers missing one of the ten keys the prompt specifies (seen: "dialogueLength" instead of "longDialogues"): Hermes model ${offSchema((r) => r.who === 'hermes')}, stronger models ${offSchema((r) => r.who !== 'hermes')}. The Hermes client shows whatever keys arrive and looks their labels up by key, so a renamed key appears as an untranslated label.`
  );
  const unparsed = fs
    .readdirSync(OUT)
    .filter((f) => read(path.join(OUT, f))?.parsed === null).length;
  md.push(
    '',
    `Unparseable answers: ${unparsed}. Cost of the stronger models: $${cost.toFixed(2)} (Flash Lite not itemised; a few cents).`,
    ''
  );
  fs.writeFileSync(path.join(HERE, 'REPORT.md'), md.join('\n'));
  console.log('report → experiments/eschbach-check/REPORT.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
