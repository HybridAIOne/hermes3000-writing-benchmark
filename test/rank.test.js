'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { pairsFromRanking, bradleyTerry, rateWithCI, withoutOwnFamily } = require('../src/rank');

test('a group ranking yields all ordered pairs, skipping same-model pairs', () => {
  const p = pairsFromRanking(['a', 'b', 'a', 'c'], { judge: 'x' });
  assert.deepStrictEqual(
    p.map((x) => x.winner + '>' + x.loser),
    ['a>b', 'a>c', 'b>a', 'b>c', 'a>c']
  );
});

test('Bradley-Terry orders a consistent tournament and centres on 1000', () => {
  const pairs = [];
  for (let i = 0; i < 20; i++) {
    pairs.push(
      { winner: 'a', loser: 'b' },
      { winner: 'b', loser: 'c' },
      { winner: 'a', loser: 'c' }
    );
  }
  pairs.push({ winner: 'b', loser: 'a' }, { winner: 'c', loser: 'b' });
  const r = bradleyTerry(['a', 'b', 'c'], pairs);
  assert.ok(r.a > r.b && r.b > r.c);
  assert.ok(Math.abs((r.a + r.b + r.c) / 3 - 1000) <= 1);
});

test('bootstrap interval contains the point rating and is deterministic for a seed', () => {
  const groups = [];
  for (let i = 0; i < 30; i++)
    groups.push(pairsFromRanking(i % 4 ? ['a', 'b', 'c'] : ['b', 'a', 'c'], {}));
  const r1 = rateWithCI(['a', 'b', 'c'], groups, 200, 7);
  const r2 = rateWithCI(['a', 'b', 'c'], groups, 200, 7);
  assert.deepStrictEqual(r1, r2);
  for (const m of ['a', 'b', 'c']) assert.ok(r1[m].lo <= r1[m].rating && r1[m].rating <= r1[m].hi);
  assert.ok(r1.a.rating > r1.c.rating);
});

test('leave-own-family-out drops only pairs a related judge decided', () => {
  const fam = { gpt: 'openai', claude: 'anthropic', kimi: 'moonshot' };
  const groups = [
    [
      { winner: 'gpt', loser: 'kimi', judgeFamily: 'openai' },
      { winner: 'claude', loser: 'kimi', judgeFamily: 'openai' },
    ],
    [{ winner: 'claude', loser: 'gpt', judgeFamily: 'google' }],
  ];
  const kept = withoutOwnFamily(groups, fam).flat();
  assert.deepStrictEqual(
    kept.map((p) => p.winner + '>' + p.loser),
    ['claude>kimi', 'claude>gpt']
  );
});

test('groups are deterministic, complete, never size 1, and keep one model per group where possible', () => {
  const { makeGroups } = require('../src/judge');
  const items = [];
  for (const m of ['a', 'b', 'c', 'd', 'e', 'f', 'g'])
    for (const run of [1, 2]) items.push({ model: m, run });
  const g1 = makeGroups(items, 5, 42);
  const g2 = makeGroups(items, 5, 42);
  assert.deepStrictEqual(g1, g2);
  assert.strictEqual(g1.flat().length, items.length);
  assert.ok(g1.every((g) => g.length >= 2));
  for (const g of g1) assert.strictEqual(new Set(g.map((x) => x.model)).size, g.length);
});

test('a failed text loses to every text of its task (build)', () => {
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  const { loadBenchmark, ROOT } = require('../src/spec');
  const { build } = require('../src/report');
  const bench = loadBenchmark('v1');
  const runId = `_test-${process.pid}`;
  const dir = path.join(ROOT, 'results', runId);
  fs.mkdirSync(path.join(dir, 'generations'), { recursive: true });
  try {
    fs.writeFileSync(
      path.join(dir, 'manifest.json'),
      JSON.stringify({
        models: ['gpt-6-luna', 'qwen3.8-27b', 'kimi-k3'],
        runs: 1,
        fingerprint: bench.fingerprint,
      })
    );
    const gen = (model, text) =>
      fs.writeFileSync(
        path.join(dir, 'generations', `lit-scene__${model}__r1.json`),
        JSON.stringify({
          task: 'lit-scene',
          model,
          run: 1,
          text,
          usage: { in: 1, out: 1 },
          costUsd: 0.001,
          latencyMs: 1000,
          meta: [],
        })
      );
    gen('gpt-6-luna', 'Ein Text.');
    gen('kimi-k3', 'Noch ein Text.');
    gen('qwen3.8-27b', '');
    const { R } = build(runId, bench);
    assert.deepStrictEqual(R.failures, [{ task: 'lit-scene', model: 'qwen3.8-27b', run: 1 }]);
    const r = R.tracks.literary.all;
    assert.ok(r['qwen3.8-27b'].rating < r['gpt-6-luna'].rating);
    assert.ok(r['qwen3.8-27b'].rating < r['kimi-k3'].rating);
    assert.strictEqual(R.cost['qwen3.8-27b'].failed, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  void os;
});

test('finalists share tied ranks instead of breaking ties by list order', () => {
  // Real preliminary run: nearly everyone scores 100 % in book context. With ties broken by
  // models.yaml order, Claude Haiku took the sixth seat; shared ranks give it to Kimi K3.
  const { loadBenchmark } = require('../src/spec');
  const { finalists } = require('../src/report');
  const keys = finalists('2026-10-17-v1-prelim-r2', loadBenchmark('v1'), 6).map((f) => f.key);
  assert.ok(keys.includes('kimi-k3'), keys.join(','));
  assert.ok(!keys.includes('claude-haiku-5.5'), keys.join(','));
});
