'use strict';
/**
 * Ratings from group rankings.
 *
 * A judge ranks a group of n anonymised texts; that yields n(n-1)/2 pairwise outcomes
 * (better-ranked text wins). A Bradley-Terry model is fitted to all outcomes and reported
 * on an Elo-like scale (mean 1000, 400·log10 per unit of strength). Confidence intervals
 * come from a bootstrap over GROUPS — the unit a judge actually decided — not over pairs,
 * which would overstate certainty.
 */

/** Pairwise outcomes from one judged group: [{ winner, loser, judge, judgeFamily }]. */
function pairsFromRanking(ranking, meta) {
  const out = [];
  for (let i = 0; i < ranking.length; i++) {
    for (let j = i + 1; j < ranking.length; j++) {
      if (ranking[i] === ranking[j]) continue; // two runs of the same model: no information
      out.push({ winner: ranking[i], loser: ranking[j], ...meta });
    }
  }
  return out;
}

/**
 * Bradley-Terry by minorisation-maximisation (Hunter 2004). A tiny prior (one virtual
 * draw against an average opponent) keeps strengths finite for models that never lose.
 * @param {string[]} items
 * @param {{winner:string, loser:string}[]} pairs
 * @returns {Object<string, number>} rating per item, mean 1000
 */
function bradleyTerry(items, pairs, iterations = 200) {
  const idx = new Map(items.map((m, i) => [m, i]));
  const n = items.length;
  const wins = new Array(n).fill(0.5);
  const games = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const p of pairs) {
    const w = idx.get(p.winner);
    const l = idx.get(p.loser);
    if (w === undefined || l === undefined) continue;
    wins[w] += 1;
    games[w][l] += 1;
    games[l][w] += 1;
  }
  let s = new Array(n).fill(1);
  for (let it = 0; it < iterations; it++) {
    const next = s.map((si, i) => {
      let denom = 1 / (si + 1); // prior game against strength 1
      for (let j = 0; j < n; j++) if (games[i][j]) denom += games[i][j] / (si + s[j]);
      return wins[i] / denom;
    });
    const g = Math.exp(next.reduce((a, v) => a + Math.log(v), 0) / n);
    s = next.map((v) => v / g);
  }
  const ratings = s.map((v) => 400 * Math.log10(v));
  const mean = ratings.reduce((a, v) => a + v, 0) / n;
  return Object.fromEntries(items.map((m, i) => [m, Math.round(1000 + ratings[i] - mean)]));
}

/** Small seeded PRNG so a report is byte-identical when re-computed from the same data. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Rating with 95% bootstrap interval.
 * @param {string[]} items
 * @param {Array<Array<{winner,loser}>>} groups - pairs grouped by the judged group they came from
 */
function rateWithCI(items, groups, samples = 1000, seed = 1) {
  const point = bradleyTerry(items, groups.flat());
  const rand = rng(seed);
  const draws = Object.fromEntries(items.map((m) => [m, []]));
  for (let b = 0; b < samples; b++) {
    const resampled = [];
    for (let k = 0; k < groups.length; k++)
      resampled.push(...groups[Math.floor(rand() * groups.length)]);
    const r = bradleyTerry(items, resampled, 60);
    for (const m of items) draws[m].push(r[m]);
  }
  const pct = (arr, q) => {
    const s = [...arr].sort((x, y) => x - y);
    return s[Math.min(s.length - 1, Math.max(0, Math.round(q * (s.length - 1))))];
  };
  return Object.fromEntries(
    items.map((m) => [m, { rating: point[m], lo: pct(draws[m], 0.025), hi: pct(draws[m], 0.975) }])
  );
}

/**
 * Drop every outcome judged by a model of the same family as either contestant — the
 * self-preference control. A pair between two foreign models keeps all judges.
 */
function withoutOwnFamily(groups, familyOf) {
  return groups
    .map((g) =>
      g.filter((p) => p.judgeFamily !== familyOf[p.winner] && p.judgeFamily !== familyOf[p.loser])
    )
    .filter((g) => g.length);
}

module.exports = { pairsFromRanking, bradleyTerry, rateWithCI, withoutOwnFamily, rng };
