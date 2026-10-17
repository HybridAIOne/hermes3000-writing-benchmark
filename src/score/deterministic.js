'use strict';
/**
 * Scoring without judges: answer keys and counts. Same input, same score — always.
 */

/** Normalise quotes, dashes and whitespace so typography does not decide a match. */
function norm(s) {
  return String(s || '')
    .replace(/[„“”«»"]/g, '"')
    .replace(/[‚‘’‹›']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/ | /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const words = (s) => norm(s).match(/\S+/g) || [];

/** Word-level Levenshtein similarity in [0,1]. */
function wordSimilarity(a, b) {
  const x = words(a);
  const y = words(b);
  if (!x.length && !y.length) return 1;
  let prev = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    const cur = [i];
    for (let j = 1; j <= y.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return 1 - prev[y.length] / Math.max(x.length, y.length);
}

/**
 * Proofreading against the key.
 *  recall    — share of planted errors fixed (rephrased-away counts half)
 *  protect   — share of deliberate style kept verbatim (over-correction check)
 *  goldSim   — word-level similarity to the reference correction (catches edits nobody asked for)
 *  score     — 0.5·recall + 0.25·protect + 0.25·goldSim, in [0,1]
 */
function scoreProofread(task, output) {
  const out = norm(output);
  const perFix = task.fixes.map((f) => {
    const wrongGone = !f.wrong || !out.includes(norm(f.wrong));
    const rightThere = f.right.some((r) => out.includes(norm(r)));
    const credit = wrongGone && rightThere ? 1 : wrongGone ? 0.5 : 0;
    return { id: f.id, credit };
  });
  const recall = perFix.reduce((n, f) => n + f.credit, 0) / perFix.length;
  const kept = (task.protect || []).map((p) => ({ span: p, kept: out.includes(norm(p)) }));
  const protect = kept.length ? kept.filter((k) => k.kept).length / kept.length : 1;
  const goldSim = wordSimilarity(output, task.gold);
  return {
    score: 0.5 * recall + 0.25 * protect + 0.25 * goldSim,
    recall,
    protect,
    goldSim,
    missed: perFix.filter((f) => f.credit < 1).map((f) => f.id),
    brokenStyle: kept.filter((k) => !k.kept).map((k) => k.span),
  };
}

/** Which required facts (any alternative) appear in the text. */
function factCoverage(facts, output) {
  const out = norm(output);
  const per = facts.map((f) => ({ id: f.id, found: f.any.some((a) => out.includes(norm(a))) }));
  return {
    coverage: per.filter((f) => f.found).length / per.length,
    missing: per.filter((f) => !f.found).map((f) => f.id),
  };
}

/** Numbers in the output that the source never mentions — invented figures. */
function inventedNumbers(source, output) {
  const nums = (s) =>
    new Set(
      (norm(s).match(/\d[\d.,]*/g) || []).map((n) => n.replace(/[.,]$/, '').replace(/[.,\s]/g, ''))
    );
  const src = nums(source);
  return [...nums(output)].filter((n) => !src.has(n));
}

/**
 * Tightening: keep every fact, hit the length, add nothing.
 *  score = 0.6·coverage + 0.25·lengthScore + 0.15·(no invented numbers)
 */
function scoreTighten(task, output) {
  const { coverage, missing } = factCoverage(task.facts, output);
  const n = words(output).length;
  const dev = Math.abs(n - task.target_words) / task.target_words;
  const lengthScore = dev <= task.tolerance ? 1 : Math.max(0, 1 - (dev - task.tolerance) * 2);
  const invented = inventedNumbers(task.text, output);
  const clean = invented.length === 0 ? 1 : 0;
  return {
    score: 0.6 * coverage + 0.25 * lengthScore + 0.15 * clean,
    coverage,
    missing,
    words: n,
    lengthScore,
    invented,
  };
}

/** Meta text a writer would have to delete (preamble, heading, sign-off). */
function metaText(text) {
  const first = String(text || '')
    .split('\n')[0]
    .trim();
  const hits = [];
  if (/^(hier ist|hier sind|gerne|natürlich|klar[,!]|sure|here is|here's|certainly)/i.test(first))
    hits.push('preamble');
  if (/^#{1,6}\s/.test(first) || /^\*\*[^*]+\*\*$/.test(first) || /^(titel|title)\s*:/i.test(first))
    hits.push('heading');
  if (
    /(ich hoffe|lass mich wissen|möchtest du|let me know|hope this)/i.test(String(text).slice(-300))
  )
    hits.push('signoff');
  return hits;
}

module.exports = {
  norm,
  words,
  wordSimilarity,
  scoreProofread,
  scoreTighten,
  factCoverage,
  inventedNumbers,
  metaText,
};
