# hermes3000 Writing Benchmark — run `2026-10-18-v1-final`

**Short version for readers and press:** [SUMMARY.md](SUMMARY.md) · [ZUSAMMENFASSUNG.md](ZUSAMMENFASSUNG.md)

**Literary quality against a human anchor (Torrance Test of Creative Writing):** [TTCW.md](TTCW.md)

Benchmark hermes3000-writing-benchmark/v1, fingerprint `66e0bd8f75bf965c`, stage **final**, 3 sample(s) per task and model, started 2026-10-18, code `c679e04`. Judges: claude-opus-5-5, gpt-6.1-sol, gemini-4-argon.

Ratings are Bradley-Terry on an Elo-like scale (mean 1000) from blind group rankings; intervals are 95 % bootstrap over judged groups. Overlapping intervals mean the order is not established. ¹ open-weight model.

## Literary prose (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | GPT-6.1 Sol | **1382** (1320–1453) | 1318 (1237–1417) | 9.1 / 8.4 / 8.5 |
| 2 | Claude Opus 5.5 | **1325** (1264–1401) | 1347 (1264–1469) | 9.0 / 8.2 / 8.8 |
| 3 | Claude Sonnet 5.5 | **1105** (1057–1161) | 1130 (1065–1215) | 9.0 / 7.7 / 7.6 |
| 4 | GPT-6 Luna | **935** (866–1004) | 960 (857–1058) | 8.7 / 6.8 / 7.1 |
| 5 | Gemini 4 Argon | **799** (730–861) | 775 (689–853) | 8.6 / 5.7 / 6.4 |
| 6 | Kimi K3 ¹ | **733** (667–792) | 767 (688–833) | 7.2 / 5.8 / 6.4 |
| 7 | Claude Haiku 5.5 | **722** (664–766) | 704 (623–764) | 8.2 / 5.9 / 6.1 |

Per judge: opus → Claude Opus 5.5, GPT-6.1 Sol, Claude Sonnet 5.5 · sol → GPT-6.1 Sol, Claude Opus 5.5, Claude Sonnet 5.5 · gemini → Claude Opus 5.5, GPT-6.1 Sol, Claude Sonnet 5.5

## Non-fiction (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | GPT-6.1 Sol | **1266** (1195–1355) | 1265 (1171–1392) | 9.5 / 8.5 / 9.2 |
| 2 | Claude Opus 5.5 | **1226** (1172–1287) | 1332 (1237–1482) | 9.4 / 8.9 / 8.8 |
| 3 | GPT-6 Luna | **1000** (937–1060) | 896 (815–964) | 9.2 / 7.8 / 8.0 |
| 4 | Claude Sonnet 5.5 | **999** (937–1058) | 1016 (936–1100) | 8.9 / 8.2 / 8.1 |
| 5 | Claude Haiku 5.5 | **947** (889–1003) | 990 (898–1090) | 8.6 / 7.7 / 7.7 |
| 6 | Gemini 4 Argon | **815** (733–892) | 719 (587–814) | 8.7 / 6.6 / 7.2 |
| 7 | Kimi K3 ¹ | **748** (684–799) | 783 (699–845) | 8.0 / 6.9 / 6.7 |

Per judge: opus → Claude Opus 5.5, GPT-6.1 Sol, Claude Sonnet 5.5 · sol → GPT-6.1 Sol, GPT-6 Luna, Claude Opus 5.5 · gemini → Claude Opus 5.5, GPT-6.1 Sol, Gemini 4 Argon

### Facts and brief adherence

| Model | Source facts kept | Unsupported claims (median per text) | Chapter brief violations (mean) |
|---|---|---|---|
| GPT-6 Luna | 100 % | 1.0 | 0.0 |
| GPT-6.1 Sol | 100 % | 0.0 | 0.0 |
| Claude Haiku 5.5 | 100 % | 0.0 | 0.7 |
| Claude Sonnet 5.5 | 100 % | 3.0 | 0.3 |
| Claude Opus 5.5 | 100 % | 1.5 | 0.0 |
| Gemini 4 Argon | 100 % | 2.0 | 0.0 |
| Kimi K3 | 100 % | 3.0 | 0.3 |

## Copy-editing (German, scored against answer keys)

| Model | Editing score | Proofread: errors fixed / style kept | Tighten: facts kept / words | Notes: problems found / false alarms |
|---|---|---|---|---|
| Kimi K3 | **94 %** | 92 % / 97 % | 100 % / 127.0 | 5.7 of 6 / 1.3 |
| Claude Sonnet 5.5 | **92 %** | 94 % / 97 % | 100 % / 137.7 | 5.3 of 6 / 2.0 |
| Claude Opus 5.5 | **88 %** | 98 % / 90 % | 100 % / 137.7 | 5.3 of 6 / 4.0 |
| Gemini 4 Argon | **83 %** | 100 % / 90 % | 100 % / 147.0 | 4.0 of 6 / 3.0 |
| GPT-6.1 Sol | **80 %** | 100 % / 90 % | 100 % / 133.3 | 2.7 of 6 / 0.3 |
| GPT-6 Luna | **79 %** | 95 % / 100 % | 100 % / 144.3 | 2.3 of 6 / 0.0 |
| Claude Haiku 5.5 | **78 %** | 93 % / 100 % | 100 % / 141.7 | 3.3 of 6 / 3.3 |

## Book context fidelity (German)

Writing a chapter inside a frozen book context (cast, places, summaries of all chapters — later ones included). Score = share of known assertions kept, majority of judges per text.

| Model | Assertions kept | Name confusion | Spoiler | Hallucination | Invariants | Selectivity / psyche | Cents per chapter with context |
|---|---|---|---|---|---|---|---|
| GPT-6 Luna | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.19 |
| Claude Sonnet 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 6.71 |
| Claude Opus 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 13.49 |
| Gemini 4 Argon | **100 %** | 0 | 0 | 0 | 0 | 0 | 3.36 |
| Kimi K3 | **100 %** | 0 | 0 | 0 | 0 | 0 | 2.41 |
| GPT-6.1 Sol | **98 %** | 0 | 0 | 0 | 0 | 1 | 3.05 |
| Claude Haiku 5.5 | **97 %** | 0 | 0 | 0 | 0 | 2 | 0.37 |

Violation columns count texts × assertions violated, summed over all samples.

## English control

| # | Model | Rating (95 % CI) | Without own-family judges |
|---|---|---|---|
| 1 | GPT-6.1 Sol | **1469** (1354–1660) | 1410 (1318–1613) |
| 2 | Claude Sonnet 5.5 | **1195** (1073–1353) | 1192 (1002–1447) |
| 3 | GPT-6 Luna | **1041** (933–1146) | 989 (815–1135) |
| 4 | Claude Opus 5.5 | **970** (868–1072) | 998 (852–1157) |
| 5 | Gemini 4 Argon | **813** (654–930) | 793 (601–921) |
| 6 | Claude Haiku 5.5 | **806** (658–909) | 896 (723–1044) |
| 7 | Kimi K3 ¹ | **706** (591–787) | 721 (590–800) |

## Statistics

**Volume.** 7 models, 294 texts (127,973 words), 192 group verdicts = 2,160 pairwise comparisons, 252 checklist checks, 3,632 errors quoted verbatim by the judges.

### Literary prose: head-to-head

Probability that a text of the row model is preferred over a text of the column model, from the rating gap (Elo scale: p = 1 / (1 + 10^(−gap/400))).

| | GPT-6.1 Sol | Claude Opus 5.5 | Claude Sonnet 5.5 | GPT-6 Luna | Gemini 4 Argon | Kimi K3 | Claude Haiku 5.5 |
|---|---|---|---|---|---|---|---|
| **GPT-6.1 Sol** | – | 58 % | 83 % | 93 % | 97 % | 98 % | 98 % |
| **Claude Opus 5.5** | 42 % | – | 78 % | 90 % | 95 % | 97 % | 97 % |
| **Claude Sonnet 5.5** | 17 % | 22 % | – | 73 % | 85 % | 89 % | 90 % |
| **GPT-6 Luna** | 7 % | 10 % | 27 % | – | 69 % | 76 % | 77 % |
| **Gemini 4 Argon** | 3 % | 5 % | 15 % | 31 % | – | 59 % | 61 % |
| **Kimi K3** | 2 % | 3 % | 11 % | 24 % | 41 % | – | 52 % |
| **Claude Haiku 5.5** | 2 % | 3 % | 10 % | 23 % | 39 % | 48 % | – |

**Judge agreement** (model pairs ordered the same way by two judges' own ratings): opus–sol 19/21 · opus–gemini 18/21 · sol–gemini 18/21.

**Own-family preference** (rank a judge gives its own family vs. mean rank from the other judges): opus → Claude Haiku 5.5 5 vs 6.5 · opus → Claude Sonnet 5.5 3 vs 3.0 · opus → Claude Opus 5.5 1 vs 1.5 · sol → GPT-6 Luna 4 vs 4.5 · sol → GPT-6.1 Sol 1 vs 2.0 · gemini → Gemini 4 Argon 4 vs 5.5.

### Non-fiction: head-to-head

Probability that a text of the row model is preferred over a text of the column model, from the rating gap (Elo scale: p = 1 / (1 + 10^(−gap/400))).

| | GPT-6.1 Sol | Claude Opus 5.5 | GPT-6 Luna | Claude Sonnet 5.5 | Claude Haiku 5.5 | Gemini 4 Argon | Kimi K3 |
|---|---|---|---|---|---|---|---|
| **GPT-6.1 Sol** | – | 56 % | 82 % | 82 % | 86 % | 93 % | 95 % |
| **Claude Opus 5.5** | 44 % | – | 79 % | 79 % | 83 % | 91 % | 94 % |
| **GPT-6 Luna** | 18 % | 21 % | – | 50 % | 58 % | 74 % | 81 % |
| **Claude Sonnet 5.5** | 18 % | 21 % | 50 % | – | 57 % | 74 % | 81 % |
| **Claude Haiku 5.5** | 14 % | 17 % | 42 % | 43 % | – | 68 % | 76 % |
| **Gemini 4 Argon** | 7 % | 9 % | 26 % | 26 % | 32 % | – | 60 % |
| **Kimi K3** | 5 % | 6 % | 19 % | 19 % | 24 % | 40 % | – |

**Judge agreement** (model pairs ordered the same way by two judges' own ratings): opus–sol 15/21 · opus–gemini 17/21 · sol–gemini 13/21.

**Own-family preference** (rank a judge gives its own family vs. mean rank from the other judges): opus → Claude Haiku 5.5 4 vs 4.5 · opus → Claude Sonnet 5.5 3 vs 4.5 · opus → Claude Opus 5.5 1 vs 2.0 · sol → GPT-6 Luna 2 vs 5.5 · sol → GPT-6.1 Sol 1 vs 2.0 · gemini → Gemini 4 Argon 3 vs 6.5.

**Errors quoted per text** (mean over all judged texts and judges): GPT-6.1 Sol 2.3 · Claude Opus 5.5 3.1 · GPT-6 Luna 3.4 · Claude Sonnet 5.5 3.5 · Claude Haiku 5.5 4.1 · Gemini 4 Argon 4.3 · Kimi K3 4.6.

## Human panel (blind pairwise votes)

42 votes by 1 person at arena.hermes3000.ai: two texts for the same task, sides randomised, no model names. Ratings use decisive votes only; with this few votes the intervals are wide. "Agreement" is the share of decisive votes where the person preferred the model the AI judges rate higher.

### Literary prose — 25 votes, 1 ties, agreement with AI judges 54 %

| Model | Human rating (95 % CI) | Won / tied / lost | AI-judge rating |
|---|---|---|---|
| Gemini 4 Argon | **1140** (839–1453) | 3 / 0 / 1 | 799 |
| Claude Opus 5.5 | **1043** (827–1348) | 4 / 0 / 3 | 1325 |
| GPT-6.1 Sol | **1039** (771–1326) | 3 / 0 / 2 | 1382 |
| Claude Sonnet 5.5 | **978** (701–1228) | 6 / 0 / 5 | 1105 |
| GPT-6 Luna | **968** (754–1192) | 5 / 1 / 5 | 935 |
| Claude Haiku 5.5 | **832** (524–991) | 3 / 1 / 8 | 722 |

### Non-fiction — 17 votes, 2 ties, agreement with AI judges 53 %

| Model | Human rating (95 % CI) | Won / tied / lost | AI-judge rating |
|---|---|---|---|
| Claude Haiku 5.5 | **1078** (773–1399) | 3 / 1 / 2 | 947 |
| Claude Opus 5.5 | **1054** (801–1363) | 4 / 0 / 3 | 1226 |
| GPT-6.1 Sol | **1035** (695–1354) | 2 / 0 / 2 | 1266 |
| GPT-6 Luna | **991** (671–1318) | 2 / 1 / 2 | 1000 |
| Claude Sonnet 5.5 | **986** (680–1274) | 3 / 1 / 3 | 999 |
| Gemini 4 Argon | **856** (557–1160) | 1 / 1 / 3 | 815 |

## Cost, speed, reliability

| Model | Cents per standard page | Median seconds per text | Texts delivered | No text (failed) | Cut off | Preamble/heading |
|---|---|---|---|---|---|---|
| GPT-6 Luna | 0.06 | 11 | 42/42 | 0 | 0 | 4 |
| Claude Haiku 5.5 | 0.13 | 11 | 42/42 | 0 | 0 | 4 |
| Gemini 4 Argon | 0.75 | 18 | 42/42 | 0 | 0 | 6 |
| GPT-6.1 Sol | 0.84 | 22 | 42/42 | 0 | 0 | 3 |
| Kimi K3 | 0.84 | 16 | 42/42 | 0 | 0 | 15 |
| Claude Sonnet 5.5 | 2.01 | 15 | 42/42 | 0 | 0 | 9 |
| Claude Opus 5.5 | 3.92 | 21 | 42/42 | 0 | 0 | 10 |

A standard page (Normseite) is 1,800 characters of output; thinking tokens are included in cost, also for texts that never arrived. "No text": the model spent the whole token budget thinking and returned nothing — scored as a failure in every track. Generation cost of this run: $5.46, judging: $11.30.

## Next time

Observations from this run, collected in [ROADMAP.md](../../ROADMAP.md).

**Human panel.** One person judged 42 of 81 pairs before stopping — full texts of up to
900 words a side are too much reading for a careful vote. Agreement with the AI judges depended
on how far apart the two models were rated: 3 of 9 for a gap under 150 points, 10 of 19 for
150–350, 8 of 11 above 350. (Votes were cast on pairs of the superseded final; the texts are
the same in this run.) People confirm the clear differences; the close ones are close for
them too. Next time:

- show texts with markdown rendered, both sides alike;
- judge an excerpt (the opening ~150 words) rather than the whole text;
- short sessions of about 10 pairs, spread over more people;
- spend human votes on pairs the AI judges rate closely or disagree on;
- use human judges only where taste matters (scene, dialogue, chapter opening, non-fiction
  opening) — fact fidelity, outlines and keyed tasks are judged better by checklists and keys.

**Book context fidelity.** Almost every model keeps 98–100 % of the assertions; the traps need
to be harder (benchmark v2).
