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
    pairs.push({ winner: 'a', loser: 'b' }, { winner: 'b', loser: 'c' }, { winner: 'a', loser: 'c' });
  }
  pairs.push({ winner: 'b', loser: 'a' }, { winner: 'c', loser: 'b' });
  const r = bradleyTerry(['a', 'b', 'c'], pairs);
  assert.ok(r.a > r.b && r.b > r.c);
  assert.ok(Math.abs((r.a + r.b + r.c) / 3 - 1000) <= 1);
});

test('bootstrap interval contains the point rating and is deterministic for a seed', () => {
  const groups = [];
  for (let i = 0; i < 30; i++) groups.push(pairsFromRanking(i % 4 ? ['a', 'b', 'c'] : ['b', 'a', 'c'], {}));
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
  for (const m of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) for (const run of [1, 2]) items.push({ model: m, run });
  const g1 = makeGroups(items, 5, 42);
  const g2 = makeGroups(items, 5, 42);
  assert.deepStrictEqual(g1, g2);
  assert.strictEqual(g1.flat().length, items.length);
  assert.ok(g1.every((g) => g.length >= 2));
  for (const g of g1) assert.strictEqual(new Set(g.map((x) => x.model)).size, g.length);
});
