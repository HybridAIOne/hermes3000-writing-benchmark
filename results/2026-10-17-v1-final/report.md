# hermes3000 Writing Benchmark — run `2026-10-17-v1-final`

Benchmark hermes3000-writing-benchmark/v1, fingerprint `66e0bd8f75bf965c`, stage **final**, 3 sample(s) per task and model, started 2026-10-17, code `81a259d`. Judges: claude-opus-5-5, gpt-6.1-sol, gemini-4-argon.

Ratings are Bradley-Terry on an Elo-like scale (mean 1000) from blind group rankings; intervals are 95 % bootstrap over judged groups. Overlapping intervals mean the order is not established. ¹ open-weight model.

## Literary prose (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | GPT-6.1 Sol | **1298** (1233–1391) | 1235 (1150–1344) | 9.0 / 8.3 / 8.5 |
| 2 | Claude Opus 5.5 | **1275** (1227–1337) | 1303 (1217–1414) | 9.0 / 8.1 / 8.6 |
| 3 | Claude Sonnet 5.5 | **1106** (1049–1172) | 1159 (1091–1249) | 8.9 / 7.8 / 7.6 |
| 4 | GPT-6 Luna | **877** (820–933) | 859 (766–940) | 8.6 / 6.5 / 6.8 |
| 5 | Gemini 4 Argon | **743** (660–813) | 707 (577–805) | 8.7 / 5.8 / 6.6 |
| 6 | Claude Haiku 5.5 | **700** (637–753) | 739 (642–809) | 8.1 / 5.7 / 5.8 |

Per judge: opus → Claude Opus 5.5, GPT-6.1 Sol, Claude Sonnet 5.5 · sol → GPT-6.1 Sol, Claude Opus 5.5, Claude Sonnet 5.5 · gemini → Claude Opus 5.5, GPT-6.1 Sol, Claude Sonnet 5.5

## Non-fiction (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | GPT-6.1 Sol | **1187** (1128–1257) | 1156 (1094–1237) | 9.4 / 8.4 / 9.0 |
| 2 | Claude Opus 5.5 | **1162** (1092–1237) | 1209 (1111–1338) | 9.4 / 8.7 / 8.6 |
| 3 | Claude Sonnet 5.5 | **983** (919–1047) | 1020 (929–1124) | 8.7 / 8.1 / 7.9 |
| 4 | GPT-6 Luna | **976** (913–1034) | 869 (767–963) | 9.3 / 7.7 / 7.9 |
| 5 | Claude Haiku 5.5 | **911** (850–964) | 965 (887–1042) | 8.6 / 7.7 / 7.5 |
| 6 | Gemini 4 Argon | **781** (702–849) | 782 (624–890) | 8.6 / 6.5 / 7.2 |

Per judge: opus → Claude Opus 5.5, GPT-6.1 Sol, Claude Sonnet 5.5 · sol → GPT-6.1 Sol, GPT-6 Luna, Claude Opus 5.5 · gemini → Claude Opus 5.5, GPT-6.1 Sol, Claude Sonnet 5.5

### Facts and brief adherence

| Model | Source facts kept | Unsupported claims (median per text) | Chapter brief violations (mean) |
|---|---|---|---|
| GPT-6 Luna | 100 % | 1.0 | 0.0 |
| GPT-6.1 Sol | 100 % | 0.0 | 0.0 |
| Claude Haiku 5.5 | 100 % | 1.0 | 0.7 |
| Claude Sonnet 5.5 | 100 % | 3.0 | 0.3 |
| Claude Opus 5.5 | 100 % | 2.0 | 0.0 |
| Gemini 4 Argon | 100 % | 2.0 | 0.0 |

## Copy-editing (German, scored against answer keys)

| Model | Editing score | Proofread: errors fixed / style kept | Tighten: facts kept / words | Notes: problems found / false alarms |
|---|---|---|---|---|
| Claude Sonnet 5.5 | **92 %** | 94 % / 97 % | 100 % / 137.7 | 5.3 of 6 / 1.7 |
| Claude Opus 5.5 | **87 %** | 98 % / 90 % | 100 % / 137.7 | 5.0 of 6 / 4.0 |
| Gemini 4 Argon | **82 %** | 100 % / 90 % | 100 % / 147.0 | 4.0 of 6 / 3.3 |
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
| GPT-6.1 Sol | **98 %** | 0 | 0 | 0 | 0 | 1 | 3.05 |
| Claude Haiku 5.5 | **98 %** | 0 | 0 | 0 | 0 | 1 | 0.37 |

Violation columns count texts × assertions violated, summed over all samples.

## English control

| # | Model | Rating (95 % CI) | Without own-family judges |
|---|---|---|---|
| 1 | GPT-6.1 Sol | **1530** (1405–1696) | 1499 (1355–1717) |
| 2 | Claude Sonnet 5.5 | **1118** (1005–1254) | 1056 (882–1293) |
| 3 | GPT-6 Luna | **1032** (945–1117) | 1148 (1075–1260) |
| 4 | Claude Opus 5.5 | **982** (858–1116) | 945 (793–1099) |
| 5 | Gemini 4 Argon | **748** (605–838) | 725 (528–842) |
| 6 | Claude Haiku 5.5 | **590** (417–701) | 627 (367–761) |

## Cost, speed, reliability

| Model | Cents per standard page | Median seconds per text | Texts delivered | No text (failed) | Cut off | Preamble/heading |
|---|---|---|---|---|---|---|
| GPT-6 Luna | 0.06 | 11 | 42/42 | 0 | 0 | 4 |
| Claude Haiku 5.5 | 0.13 | 11 | 42/42 | 0 | 0 | 4 |
| Gemini 4 Argon | 0.75 | 18 | 42/42 | 0 | 0 | 6 |
| GPT-6.1 Sol | 0.84 | 22 | 42/42 | 0 | 0 | 3 |
| Claude Sonnet 5.5 | 2.01 | 15 | 42/42 | 0 | 0 | 9 |
| Claude Opus 5.5 | 3.92 | 21 | 42/42 | 0 | 0 | 10 |

A standard page (Normseite) is 1,800 characters of output; thinking tokens are included in cost, also for texts that never arrived. "No text": the model spent the whole token budget thinking and returned nothing — scored as a failure in every track. Generation cost of this run: $4.90, judging: $10.06.
