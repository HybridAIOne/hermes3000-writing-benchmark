# hermes3000 Writing Benchmark — run `2026-10-17-v1-prelim`

Benchmark hermes3000-writing-benchmark/v1, fingerprint `120df69b42478182`, stage **prelim**, 1 sample(s) per task and model, started 2026-10-17, code `b3a264c`. Judges: claude-opus-5-5, gpt-6.1-sol, gemini-4-argon.

Ratings are Bradley-Terry on an Elo-like scale (mean 1000) from blind group rankings; intervals are 95 % bootstrap over judged groups. Overlapping intervals mean the order is not established. ¹ open-weight model.

## Literary prose (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | Claude Opus 5.5 | **1608** (1518–1749) | 1679 (1494–1772) | 9.3 / 8.5 / 8.9 |
| 2 | GPT-6.1 Sol | **1535** (1368–1845) | 1467 (1296–1795) | 9.0 / 8.5 / 8.7 |
| 3 | Claude Sonnet 5.5 | **1386** (1230–1605) | 1339 (1188–1573) | 8.8 / 8.3 / 8.6 |
| 4 | Kimi K3 ¹ | **1219** (1077–1430) | 1203 (1089–1407) | 8.8 / 7.8 / 7.2 |
| 5 | Gemini 4 Argon | **1096** (940–1294) | 1192 (996–1426) | 8.9 / 7.0 / 7.8 |
| 6 | GPT-6 Luna | **1089** (1017–1187) | 993 (841–1154) | 8.7 / 7.0 / 6.6 |
| 7 | DeepSeek V4.1 Flash ¹ | **1056** (897–1272) | 1093 (930–1354) | 8.4 / 6.8 / 7.0 |
| 8 | Claude Haiku 5.5 | **1000** (875–1133) | 1129 (989–1301) | 8.3 / 7.1 / 6.7 |
| 9 | GLM-5.3 ¹ | **902** (655–1177) | 916 (631–1315) | 8.4 / 7.1 / 6.1 |
| 10 | Gemini 3.8 Flash (thinking low) | **889** (678–1071) | 805 (567–993) | 8.8 / 6.1 / 6.6 |
| 11 | Gemma 4 31B ¹ | **806** (458–994) | 753 (430–1018) | 7.3 / 4.7 / 6.2 |
| 12 | GPT-5.4 mini | **693** (468–825) | 616 (301–787) | 7.8 / 4.9 / 5.3 |
| 13 | Grok 4.3 | **578** (332–671) | 644 (402–737) | 8.0 / 4.7 / 4.6 |
| 14 | Qwen 3.8 27B ¹ | **142** (-59–316) | 171 (-49–408) | 5.0 / 3.4 / 4.8 |

Per judge: opus → Claude Opus 5.5, Claude Sonnet 5.5, GPT-6.1 Sol · sol → GPT-6.1 Sol, Claude Opus 5.5, Claude Sonnet 5.5 · gemini → GPT-6.1 Sol, Claude Opus 5.5, Claude Sonnet 5.5

## Non-fiction (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | Claude Sonnet 5.5 | **1209** (1031–1541) | 1266 (1037–1628) | 9.4 / 8.8 / 8.3 |
| 2 | Claude Opus 5.5 | **1207** (1056–1443) | 1152 (893–1491) | 9.6 / 8.6 / 8.2 |
| 3 | GPT-6.1 Sol | **1150** (977–1421) | 1133 (889–1596) | 9.2 / 8.0 / 8.8 |
| 4 | GLM-5.3 ¹ | **1145** (996–1397) | 1162 (1018–1419) | 8.3 / 8.0 / 8.1 |
| 5 | GPT-6 Luna | **1123** (982–1293) | 1010 (830–1181) | 8.9 / 7.6 / 8.1 |
| 6 | GPT-5.4 mini | **1106** (933–1291) | 1061 (802–1329) | 9.0 / 7.1 / 8.1 |
| 7 | Kimi K3 ¹ | **1087** (949–1238) | 1224 (1099–1442) | 9.0 / 8.2 / 7.1 |
| 8 | DeepSeek V4.1 Flash ¹ | **1076** (870–1294) | 1183 (943–1570) | 8.8 / 7.0 / 7.4 |
| 9 | Gemini 4 Argon | **1038** (815–1246) | 965 (619–1276) | 9.2 / 7.2 / 7.9 |
| 10 | Claude Haiku 5.5 | **984** (716–1165) | 941 (556–1279) | 8.9 / 7.2 / 6.9 |
| 11 | Gemini 3.8 Flash (thinking low) | **883** (571–1109) | 918 (512–1217) | 8.8 / 6.4 / 7.1 |
| 12 | Grok 4.3 | **704** (460–851) | 821 (620–952) | 8.2 / 5.7 / 6.4 |
| 13 | Gemma 4 31B ¹ | **680** (492–765) | 597 (313–748) | 8.6 / 6.1 / 6.3 |
| 14 | Qwen 3.8 27B ¹ | **608** (194–804) | 566 (128–854) | 6.0 / 5.5 / 7.3 |

Per judge: opus → Claude Sonnet 5.5, Claude Opus 5.5, GLM-5.3 · sol → GPT-6.1 Sol, GPT-6 Luna, GPT-5.4 mini · gemini → Gemini 4 Argon, Claude Sonnet 5.5, GLM-5.3

### Facts and brief adherence

| Model | Source facts kept | Unsupported claims (median per text) | Chapter brief violations (mean) |
|---|---|---|---|
| GPT-6 Luna | 100 % | 0.0 | 0.0 |
| GPT-6.1 Sol | 100 % | 1.0 | 0.0 |
| GPT-5.4 mini | 100 % | 0.0 | 1.0 |
| Claude Haiku 5.5 | 100 % | 2.0 | 0.0 |
| Claude Sonnet 5.5 | 100 % | 3.0 | 0.0 |
| Claude Opus 5.5 | 100 % | 4.0 | 0.0 |
| Gemini 3.8 Flash (thinking low) | 100 % | 5.0 | 0.0 |
| Gemini 4 Argon | 100 % | 1.0 | 0.0 |
| Grok 4.3 | 100 % | 1.0 | 1.0 |
| Kimi K3 | 100 % | 4.0 | 0.0 |
| GLM-5.3 | 100 % | 2.0 | – |
| DeepSeek V4.1 Flash | 100 % | 1.0 | 0.0 |
| Qwen 3.8 27B | 0 % | – | – |
| Gemma 4 31B | 83 % | 4.0 | 0.0 |

## Copy-editing (German, scored against answer keys)

| Model | Editing score | Proofread: errors fixed / style kept | Tighten: facts kept / words | Notes: problems found / false alarms |
|---|---|---|---|---|
| Kimi K3 | **95 %** | 90 % / 100 % | 100 % / 147.0 | 6.0 of 6 / 2.0 |
| Claude Sonnet 5.5 | **92 %** | 100 % / 90 % | 100 % / 136.0 | 5.0 of 6 / 1.0 |
| Gemini 3.8 Flash (thinking low) | **87 %** | 100 % / 100 % | 100 % / 121.0 | 4.0 of 6 / 1.0 |
| Claude Opus 5.5 | **87 %** | 100 % / 90 % | 100 % / 141.0 | 5.0 of 6 / 4.0 |
| GLM-5.3 | **85 %** | 90 % / 100 % | 100 % / 141.0 | 4.0 of 6 / 1.0 |
| Gemini 4 Argon | **85 %** | 100 % / 90 % | 100 % / 136.0 | 4.0 of 6 / 2.0 |
| GPT-5.4 mini | **83 %** | 100 % / 100 % | 100 % / 146.0 | 3.0 of 6 / 0.0 |
| GPT-6.1 Sol | **82 %** | 100 % / 90 % | 100 % / 139.0 | 3.0 of 6 / 0.0 |
| Claude Haiku 5.5 | **81 %** | 95 % / 100 % | 100 % / 136.0 | 3.0 of 6 / 1.0 |
| DeepSeek V4.1 Flash | **78 %** | 100 % / 100 % | 100 % / 129.0 | 3.0 of 6 / 3.0 |
| Gemma 4 31B | **78 %** | 100 % / 100 % | 100 % / 117.0 | 2.0 of 6 / 0.0 |
| Grok 4.3 | **76 %** | 100 % / 100 % | 100 % / 133.0 | 2.0 of 6 / 1.0 |
| GPT-6 Luna | **75 %** | 95 % / 100 % | 100 % / 143.0 | 2.0 of 6 / 1.0 |
| Qwen 3.8 27B | **32 %** | 95 % / 100 % | 0 % / 0.0 | 0.0 of 6 / 0.0 |

## Book context fidelity (German)

Writing a chapter inside a frozen book context (cast, places, summaries of all chapters — later ones included). Score = share of known assertions kept, majority of judges per text.

| Model | Assertions kept | Name confusion | Spoiler | Hallucination | Invariants | Selectivity / psyche | Cents per chapter with context |
|---|---|---|---|---|---|---|---|
| GPT-6 Luna | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.19 |
| GPT-6.1 Sol | **100 %** | 0 | 0 | 0 | 0 | 0 | 3.07 |
| Claude Haiku 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.37 |
| Claude Sonnet 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 6.49 |
| Claude Opus 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 13.28 |
| Gemini 3.8 Flash (thinking low) | **100 %** | 0 | 0 | 0 | 0 | 0 | 1.18 |
| Gemini 4 Argon | **100 %** | 0 | 0 | 0 | 0 | 0 | 3.31 |
| Grok 4.3 | **100 %** | 0 | 0 | 0 | 0 | 0 | 1.46 |
| GLM-5.3 | **100 %** | 0 | 0 | 0 | 0 | 0 | 4.49 |
| Gemma 4 31B | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.22 |
| GPT-5.4 mini | **95 %** | 0 | 0 | 0 | 0 | 1 | 1.57 |
| DeepSeek V4.1 Flash | **90 %** | 1 | 0 | 0 | 1 | 0 | 0.29 |
| Kimi K3 | **67 %** | 0 | 0 | 0 | 0 | 0 | 5.59 |
| Qwen 3.8 27B | **67 %** | 0 | 0 | 0 | 0 | 0 | 3.05 |

Violation columns count texts × assertions violated, summed over all samples.

## English control

| # | Model | Rating (95 % CI) | Without own-family judges |
|---|---|---|---|
| 1 | Claude Sonnet 5.5 | **1637** (1142–1778) | 1597 (1000–1725) |
| 2 | GPT-6.1 Sol | **1459** (1002–1660) | 1372 (1000–1553) |
| 3 | Kimi K3 ¹ | **1314** (1002–1617) | 1430 (1001–1620) |
| 4 | Claude Opus 5.5 | **1172** (1001–1313) | 1092 (918–1294) |
| 5 | GLM-5.3 ¹ | **1106** (903–1369) | 1121 (981–1332) |
| 6 | Gemini 4 Argon | **1048** (785–1582) | 897 (746–1020) |
| 7 | Claude Haiku 5.5 | **1042** (786–1252) | 971 (635–1219) |
| 8 | Gemini 3.8 Flash (thinking low) | **1008** (576–1301) | 1237 (1000–1351) |
| 9 | Grok 4.3 | **953** (653–1168) | 989 (651–1236) |
| 10 | DeepSeek V4.1 Flash ¹ | **918** (562–1158) | 827 (546–1050) |
| 11 | GPT-6 Luna | **808** (559–1001) | 755 (626–1001) |
| 12 | GPT-5.4 mini | **708** (492–912) | 772 (613–1001) |
| 13 | Gemma 4 31B ¹ | **416** (157–1000) | 527 (372–1001) |
| 14 | Qwen 3.8 27B ¹ | **413** (228–771) | 413 (254–720) |

## Statistics

**Volume.** 14 models, 196 texts (79,908 words), 72 group verdicts = 600 pairwise comparisons, 159 checklist checks, 1,261 errors quoted verbatim by the judges.

### Literary prose: head-to-head

Probability that a text of the row model is preferred over a text of the column model, from the rating gap (Elo scale: p = 1 / (1 + 10^(−gap/400))).

| | Claude Opus 5.5 | GPT-6.1 Sol | Claude Sonnet 5.5 | Kimi K3 | Gemini 4 Argon | GPT-6 Luna | DeepSeek V4.1 Flash | Claude Haiku 5.5 | GLM-5.3 | Gemini 3.8 Flash (thinking low) | Gemma 4 31B | GPT-5.4 mini | Grok 4.3 | Qwen 3.8 27B |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Claude Opus 5.5** | – | 60 % | 78 % | 90 % | 95 % | 95 % | 96 % | 97 % | 98 % | 98 % | 99 % | 99 % | 100 % | 100 % |
| **GPT-6.1 Sol** | 40 % | – | 70 % | 86 % | 93 % | 93 % | 94 % | 96 % | 97 % | 98 % | 99 % | 99 % | 100 % | 100 % |
| **Claude Sonnet 5.5** | 22 % | 30 % | – | 72 % | 84 % | 85 % | 87 % | 90 % | 94 % | 95 % | 97 % | 98 % | 99 % | 100 % |
| **Kimi K3** | 10 % | 14 % | 28 % | – | 67 % | 68 % | 72 % | 78 % | 86 % | 87 % | 92 % | 95 % | 98 % | 100 % |
| **Gemini 4 Argon** | 5 % | 7 % | 16 % | 33 % | – | 51 % | 56 % | 63 % | 75 % | 77 % | 84 % | 91 % | 95 % | 100 % |
| **GPT-6 Luna** | 5 % | 7 % | 15 % | 32 % | 49 % | – | 55 % | 63 % | 75 % | 76 % | 84 % | 91 % | 95 % | 100 % |
| **DeepSeek V4.1 Flash** | 4 % | 6 % | 13 % | 28 % | 44 % | 45 % | – | 58 % | 71 % | 72 % | 81 % | 89 % | 94 % | 99 % |
| **Claude Haiku 5.5** | 3 % | 4 % | 10 % | 22 % | 37 % | 37 % | 42 % | – | 64 % | 65 % | 75 % | 85 % | 92 % | 99 % |
| **GLM-5.3** | 2 % | 3 % | 6 % | 14 % | 25 % | 25 % | 29 % | 36 % | – | 52 % | 63 % | 77 % | 87 % | 99 % |
| **Gemini 3.8 Flash (thinking low)** | 2 % | 2 % | 5 % | 13 % | 23 % | 24 % | 28 % | 35 % | 48 % | – | 62 % | 76 % | 86 % | 99 % |
| **Gemma 4 31B** | 1 % | 1 % | 3 % | 8 % | 16 % | 16 % | 19 % | 25 % | 37 % | 38 % | – | 66 % | 79 % | 98 % |
| **GPT-5.4 mini** | 1 % | 1 % | 2 % | 5 % | 9 % | 9 % | 11 % | 15 % | 23 % | 24 % | 34 % | – | 66 % | 96 % |
| **Grok 4.3** | 0 % | 0 % | 1 % | 2 % | 5 % | 5 % | 6 % | 8 % | 13 % | 14 % | 21 % | 34 % | – | 92 % |
| **Qwen 3.8 27B** | 0 % | 0 % | 0 % | 0 % | 0 % | 0 % | 1 % | 1 % | 1 % | 1 % | 2 % | 4 % | 8 % | – |

**Judge agreement** (model pairs ordered the same way by two judges' own ratings): opus–sol 81/91 · opus–gemini 77/91 · sol–gemini 77/91.

**Own-family preference** (rank a judge gives its own family vs. mean rank from the other judges): opus → Claude Haiku 5.5 8 vs 6.5 · opus → Claude Sonnet 5.5 2 vs 3.0 · opus → Claude Opus 5.5 1 vs 2.0 · sol → GPT-6 Luna 7 vs 6.5 · sol → GPT-6.1 Sol 1 vs 2.0 · sol → GPT-5.4 mini 9 vs 12.5 · gemini → Gemini 3.8 Flash (thinking low) 7 vs 10.0 · gemini → Gemini 4 Argon 9 vs 4.5 · gemini → Gemma 4 31B 8 vs 11.0.

### Non-fiction: head-to-head

Probability that a text of the row model is preferred over a text of the column model, from the rating gap (Elo scale: p = 1 / (1 + 10^(−gap/400))).

| | Claude Sonnet 5.5 | Claude Opus 5.5 | GPT-6.1 Sol | GLM-5.3 | GPT-6 Luna | GPT-5.4 mini | Kimi K3 | DeepSeek V4.1 Flash | Gemini 4 Argon | Claude Haiku 5.5 | Gemini 3.8 Flash (thinking low) | Grok 4.3 | Gemma 4 31B | Qwen 3.8 27B |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Claude Sonnet 5.5** | – | 50 % | 58 % | 59 % | 62 % | 64 % | 67 % | 68 % | 73 % | 79 % | 87 % | 95 % | 95 % | 97 % |
| **Claude Opus 5.5** | 50 % | – | 58 % | 59 % | 62 % | 64 % | 67 % | 68 % | 73 % | 78 % | 87 % | 95 % | 95 % | 97 % |
| **GPT-6.1 Sol** | 42 % | 42 % | – | 51 % | 54 % | 56 % | 59 % | 60 % | 66 % | 72 % | 82 % | 93 % | 94 % | 96 % |
| **GLM-5.3** | 41 % | 41 % | 49 % | – | 53 % | 56 % | 58 % | 60 % | 65 % | 72 % | 82 % | 93 % | 94 % | 96 % |
| **GPT-6 Luna** | 38 % | 38 % | 46 % | 47 % | – | 52 % | 55 % | 57 % | 62 % | 69 % | 80 % | 92 % | 93 % | 95 % |
| **GPT-5.4 mini** | 36 % | 36 % | 44 % | 44 % | 48 % | – | 53 % | 54 % | 60 % | 67 % | 78 % | 91 % | 92 % | 95 % |
| **Kimi K3** | 33 % | 33 % | 41 % | 42 % | 45 % | 47 % | – | 52 % | 57 % | 64 % | 76 % | 90 % | 91 % | 94 % |
| **DeepSeek V4.1 Flash** | 32 % | 32 % | 40 % | 40 % | 43 % | 46 % | 48 % | – | 55 % | 63 % | 75 % | 89 % | 91 % | 94 % |
| **Gemini 4 Argon** | 27 % | 27 % | 34 % | 35 % | 38 % | 40 % | 43 % | 45 % | – | 58 % | 71 % | 87 % | 89 % | 92 % |
| **Claude Haiku 5.5** | 21 % | 22 % | 28 % | 28 % | 31 % | 33 % | 36 % | 37 % | 42 % | – | 64 % | 83 % | 85 % | 90 % |
| **Gemini 3.8 Flash (thinking low)** | 13 % | 13 % | 18 % | 18 % | 20 % | 22 % | 24 % | 25 % | 29 % | 36 % | – | 74 % | 76 % | 83 % |
| **Grok 4.3** | 5 % | 5 % | 7 % | 7 % | 8 % | 9 % | 10 % | 11 % | 13 % | 17 % | 26 % | – | 53 % | 63 % |
| **Gemma 4 31B** | 5 % | 5 % | 6 % | 6 % | 7 % | 8 % | 9 % | 9 % | 11 % | 15 % | 24 % | 47 % | – | 60 % |
| **Qwen 3.8 27B** | 3 % | 3 % | 4 % | 4 % | 5 % | 5 % | 6 % | 6 % | 8 % | 10 % | 17 % | 37 % | 40 % | – |

**Judge agreement** (model pairs ordered the same way by two judges' own ratings): opus–sol 64/91 · opus–gemini 70/91 · sol–gemini 53/91.

**Own-family preference** (rank a judge gives its own family vs. mean rank from the other judges): opus → Claude Haiku 5.5 7 vs 10.0 · opus → Claude Sonnet 5.5 1 vs 4.0 · opus → Claude Opus 5.5 2 vs 4.5 · sol → GPT-6 Luna 2 vs 7.5 · sol → GPT-6.1 Sol 1 vs 6.5 · sol → GPT-5.4 mini 3 vs 7.5 · gemini → Gemini 3.8 Flash (thinking low) 11 vs 10.5 · gemini → Gemini 4 Argon 1 vs 11.0 · gemini → Gemma 4 31B 12 vs 13.0.

**Errors quoted per text** (mean over all judged texts and judges): GPT-6.1 Sol 2.6 · Claude Opus 5.5 3.0 · Claude Sonnet 5.5 3.3 · Kimi K3 3.5 · GPT-6 Luna 3.6 · DeepSeek V4.1 Flash 3.6 · GLM-5.3 4.0 · Gemini 4 Argon 4.0 · Claude Haiku 5.5 4.2 · Grok 4.3 4.3 · Gemini 3.8 Flash (thinking low) 4.4 · GPT-5.4 mini 4.5 · Gemma 4 31B 4.6 · Qwen 3.8 27B 4.7.

## Cost, speed, reliability

| Model | Cents per standard page | Median seconds per text | Texts delivered | No text (failed) | Cut off | Preamble/heading |
|---|---|---|---|---|---|---|
| Gemma 4 31B | 0.05 | 15 | 14/14 | 0 | 0 | 2 |
| GPT-6 Luna | 0.05 | 11 | 14/14 | 0 | 0 | 1 |
| Claude Haiku 5.5 | 0.13 | 11 | 14/14 | 0 | 0 | 1 |
| DeepSeek V4.1 Flash | 0.23 | 21 | 14/14 | 0 | 0 | 1 |
| Gemini 3.8 Flash (thinking low) | 0.27 | 7 | 14/14 | 0 | 0 | 2 |
| GPT-5.4 mini | 0.28 | 3 | 14/14 | 0 | 0 | 0 |
| Grok 4.3 | 0.58 | 16 | 14/14 | 0 | 0 | 1 |
| Gemini 4 Argon | 0.71 | 21 | 14/14 | 0 | 0 | 2 |
| GPT-6.1 Sol | 0.84 | 20 | 14/14 | 0 | 0 | 1 |
| Claude Sonnet 5.5 | 1.95 | 14 | 14/14 | 0 | 0 | 3 |
| Qwen 3.8 27B | 3.30 | 62 | 9/14 | 5 | 0 | 0 |
| GLM-5.3 | 3.46 | 71 | 13/14 | 1 | 0 | 1 |
| Claude Opus 5.5 | 3.84 | 18 | 14/14 | 0 | 0 | 6 |
| Kimi K3 | 7.36 | 67 | 13/14 | 1 | 0 | 4 |

A standard page (Normseite) is 1,800 characters of output; thinking tokens are included in cost, also for texts that never arrived. "No text": the model spent the whole token budget thinking and returned nothing — scored as a failure in every track. Generation cost of this run: $4.12, judging: $4.57.
