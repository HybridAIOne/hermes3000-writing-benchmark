'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadBenchmark } = require('../src/spec');
const s = require('../src/score/deterministic');

const bench = loadBenchmark('v1');
const task = (id) => bench.tasks.find((t) => t.id === id);

test('proofread key: the reference correction scores perfect', () => {
  const t = task('ed-proofread');
  const r = s.scoreProofread(t, t.gold);
  assert.deepStrictEqual(r.missed, []);
  assert.deepStrictEqual(r.brokenStyle, []);
  assert.strictEqual(r.recall, 1);
  assert.strictEqual(r.goldSim, 1);
});

test('proofread key: the uncorrected text fixes nothing but keeps all style', () => {
  const t = task('ed-proofread');
  const r = s.scoreProofread(t, t.text);
  assert.strictEqual(
    r.recall,
    0,
    `credited: ${t.fixes.map((f) => f.id).filter((id) => !r.missed.includes(id))}`
  );
  assert.strictEqual(r.protect, 1);
});

test('proofread: flattening the dialect is caught as over-correction', () => {
  const t = task('ed-proofread');
  const r = s.scoreProofread(t, t.gold.replace('„Is\' doch wahr"', '„Ist doch wahr"'));
  assert.ok(r.protect < 1);
  assert.strictEqual(r.recall, 1);
});

test('tighten key: the source keeps every fact but misses the length', () => {
  const t = task('ed-tighten');
  const r = s.scoreTighten(t, t.text);
  assert.strictEqual(r.coverage, 1);
  assert.deepStrictEqual(r.invented, []);
  assert.ok(r.lengthScore < 1);
});

test('tighten: an invented figure is detected', () => {
  const t = task('ed-tighten');
  const r = s.scoreTighten(t, t.text + ' Die Fähre ist 18 Meter lang.');
  assert.deepStrictEqual(r.invented, ['18']);
});

test('from-source facts: the source itself covers every required fact', () => {
  const t = task('nf-from-source');
  assert.strictEqual(s.factCoverage(t.facts, t.source).coverage, 1);
});

test('word similarity and meta text', () => {
  assert.strictEqual(s.wordSimilarity('a b c', 'a b c'), 1);
  assert.ok(s.wordSimilarity('a b c', 'a x c') < 1);
  assert.deepStrictEqual(s.metaText('Hier ist dein Text:\nEs war einmal'), ['preamble']);
  assert.deepStrictEqual(s.metaText('Es war einmal.'), []);
});

test('context tasks: frozen context renders, assertion ids unique, every dimension known', () => {
  const { renderPrompt } = require('../src/spec');
  const dims = new Set([
    'confusion',
    'spoiler',
    'hallucination',
    'consistency',
    'selectivity',
    'psyche',
  ]);
  const ctx = bench.tasks.filter((t) => t.track === 'context');
  assert.strictEqual(ctx.length, 3);
  for (const t of ctx) {
    const p = renderPrompt(t);
    assert.ok(p.includes('KAPITELPLAN') && p.includes('AUFGABE:'), t.id);
    const ids = t.assertions.map((a) => a.id);
    assert.strictEqual(new Set(ids).size, ids.length, t.id);
    for (const a of t.assertions) assert.ok(dims.has(a.dim), `${t.id}: ${a.dim}`);
  }
});
