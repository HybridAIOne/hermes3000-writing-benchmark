# hermes3000 Writing Benchmark — run `2026-10-17-v1-prelim-r2`

Benchmark hermes3000-writing-benchmark/v1, fingerprint `66e0bd8f75bf965c`, stage **prelim**, 1 sample(s) per task and model, started 2026-10-17, code `81a259d`. Judges: claude-opus-5-5, gpt-6.1-sol, gemini-4-argon.

Ratings are Bradley-Terry on an Elo-like scale (mean 1000) from blind group rankings; intervals are 95 % bootstrap over judged groups. Overlapping intervals mean the order is not established. ¹ open-weight model.

## Literary prose (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | Claude Opus 5.5 | **1710** (1564–1828) | 1577 (1359–1743) | 9.3 / 8.4 / 9.0 |
| 2 | GPT-6.1 Sol | **1706** (1521–1849) | 1797 (1522–1866) | 9.5 / 8.7 / 9.1 |
| 3 | Claude Sonnet 5.5 | **1574** (1424–1723) | 1423 (1331–1537) | 9.1 / 8.2 / 8.8 |
| 4 | GPT-6 Luna | **1128** (1033–1299) | 1107 (1013–1325) | 8.7 / 7.4 / 7.2 |
| 5 | Gemini 4 Argon | **1067** (947–1253) | 1071 (851–1385) | 8.6 / 6.7 / 7.6 |
| 6 | Claude Haiku 5.5 | **1011** (818–1263) | 946 (688–1262) | 8.8 / 6.8 / 5.8 |
| 7 | Kimi K3 ¹ | **965** (840–1124) | 968 (831–1161) | 7.8 / 6.8 / 6.8 |
| 8 | Gemini 3.8 Flash (thinking low) | **927** (788–1135) | 901 (727–1139) | 8.4 / 6.2 / 6.7 |
| 9 | DeepSeek V4.1 Flash ¹ | **895** (768–1043) | 923 (774–1132) | 8.3 / 6.0 / 6.9 |
| 10 | GPT-5.4 mini | **836** (740–949) | 899 (768–1055) | 8.2 / 5.4 / 5.9 |
| 11 | GLM-5.3 ¹ | **778** (449–1012) | 779 (409–1007) | 6.1 / 5.3 / 5.6 |
| 12 | Grok 4.3 | **668** (486–822) | 684 (482–834) | 7.9 / 5.0 / 5.5 |
| 13 | Gemma 4 31B ¹ | **435** (260–545) | 519 (301–665) | 7.6 / 3.8 / 5.1 |
| 14 | Qwen 3.8 27B ¹ | **298** (-128–499) | 406 (18–594) | 4.1 / 3.5 / 4.3 |

Per judge: opus → Claude Sonnet 5.5, Claude Opus 5.5, GPT-6.1 Sol · sol → GPT-6.1 Sol, Claude Opus 5.5, GPT-6 Luna · gemini → GPT-6.1 Sol, Claude Opus 5.5, Claude Sonnet 5.5

## Non-fiction (German)

| # | Model | Rating (95 % CI) | Without own-family judges | Language / style / brief (1–10) |
|---|---|---|---|---|
| 1 | GPT-6.1 Sol | **1348** (1146–1667) | 1180 (1036–1412) | 9.4 / 8.6 / 9.3 |
| 2 | Claude Opus 5.5 | **1348** (1181–1651) | 1366 (1095–1767) | 9.6 / 9.0 / 8.4 |
| 3 | GPT-6 Luna | **1310** (1199–1547) | 1371 (1260–1584) | 9.1 / 8.4 / 8.7 |
| 4 | Claude Sonnet 5.5 | **1306** (1161–1592) | 1230 (1036–1446) | 9.2 / 8.7 / 8.7 |
| 5 | Claude Haiku 5.5 | **1233** (1076–1471) | 1277 (1029–1626) | 8.4 / 8.2 / 8.3 |
| 6 | Gemini 4 Argon | **1001** (840–1187) | 939 (769–1178) | 9.1 / 7.2 / 8.0 |
| 7 | Gemini 3.8 Flash (thinking low) | **959** (719–1233) | 907 (668–1117) | 8.9 / 6.9 / 7.3 |
| 8 | DeepSeek V4.1 Flash ¹ | **875** (635–1117) | 923 (654–1195) | 7.7 / 6.3 / 7.3 |
| 9 | Kimi K3 ¹ | **870** (673–1027) | 935 (683–1140) | 7.0 / 6.9 / 7.0 |
| 10 | GLM-5.3 ¹ | **866** (658–1052) | 903 (644–1117) | 7.3 / 6.9 / 6.6 |
| 11 | GPT-5.4 mini | **865** (500–1110) | 823 (326–1109) | 8.9 / 6.9 / 7.2 |
| 12 | Grok 4.3 | **776** (526–934) | 819 (561–996) | 8.1 / 6.4 / 6.2 |
| 13 | Gemma 4 31B ¹ | **766** (527–896) | 806 (519–1005) | 8.0 / 6.2 / 6.8 |
| 14 | Qwen 3.8 27B ¹ | **478** (99–688) | 522 (108–746) | 5.3 / 5.0 / 5.2 |

Per judge: opus → Claude Opus 5.5, Claude Sonnet 5.5, GPT-6 Luna · sol → GPT-6.1 Sol, Claude Opus 5.5, GPT-6 Luna · gemini → Claude Haiku 5.5, Claude Sonnet 5.5, GPT-6 Luna

### Facts and brief adherence

| Model | Source facts kept | Unsupported claims (median per text) | Chapter brief violations (mean) |
|---|---|---|---|
| GPT-6 Luna | 100 % | 0.0 | 0.0 |
| GPT-6.1 Sol | 100 % | 0.0 | 0.0 |
| GPT-5.4 mini | 100 % | 1.0 | 0.0 |
| Claude Haiku 5.5 | 100 % | 2.0 | 2.0 |
| Claude Sonnet 5.5 | 100 % | 1.0 | 0.0 |
| Claude Opus 5.5 | 100 % | 1.0 | 0.0 |
| Gemini 3.8 Flash (thinking low) | 100 % | 3.0 | 0.0 |
| Gemini 4 Argon | 100 % | 1.0 | 0.0 |
| Grok 4.3 | 100 % | 4.0 | 0.0 |
| Kimi K3 | 100 % | 4.0 | 0.0 |
| GLM-5.3 | 100 % | 3.0 | 0.0 |
| DeepSeek V4.1 Flash | 100 % | 1.0 | 0.0 |
| Qwen 3.8 27B | 100 % | 4.0 | 1.0 |
| Gemma 4 31B | 100 % | 2.0 | 0.0 |

## Copy-editing (German, scored against answer keys)

| Model | Editing score | Proofread: errors fixed / style kept | Tighten: facts kept / words | Notes: problems found / false alarms |
|---|---|---|---|---|
| GLM-5.3 | **96 %** | 100 % / 90 % | 100 % / 129.0 | 6.0 of 6 / 2.0 |
| Claude Sonnet 5.5 | **94 %** | 100 % / 90 % | 100 % / 138.0 | 6.0 of 6 / 3.0 |
| Kimi K3 | **90 %** | 95 % / 100 % | 100 % / 132.0 | 5.0 of 6 / 2.0 |
| Grok 4.3 | **89 %** | 100 % / 100 % | 100 % / 142.0 | 4.0 of 6 / 0.0 |
| Gemini 4 Argon | **85 %** | 100 % / 90 % | 100 % / 145.0 | 4.0 of 6 / 2.0 |
| GPT-6 Luna | **82 %** | 100 % / 100 % | 100 % / 143.0 | 3.0 of 6 / 1.0 |
| Claude Opus 5.5 | **81 %** | 100 % / 90 % | 100 % / 141.0 | 4.0 of 6 / 4.0 |
| GPT-6.1 Sol | **81 %** | 100 % / 90 % | 100 % / 129.0 | 3.0 of 6 / 1.0 |
| Gemini 3.8 Flash (thinking low) | **80 %** | 100 % / 100 % | 100 % / 142.0 | 3.0 of 6 / 2.0 |
| Qwen 3.8 27B | **76 %** | 93 % / 100 % | 100 % / 137.0 | 2.0 of 6 / 0.0 |
| DeepSeek V4.1 Flash | **75 %** | 95 % / 100 % | 100 % / 141.0 | 2.0 of 6 / 1.0 |
| Gemma 4 31B | **74 %** | 90 % / 100 % | 100 % / 112.0 | 2.0 of 6 / 1.0 |
| GPT-5.4 mini | **69 %** | 100 % / 100 % | 100 % / 147.0 | 1.0 of 6 / 2.0 |
| Claude Haiku 5.5 | **69 %** | 95 % / 100 % | 100 % / 134.0 | 2.0 of 6 / 5.0 |

## Book context fidelity (German)

Writing a chapter inside a frozen book context (cast, places, summaries of all chapters — later ones included). Score = share of known assertions kept, majority of judges per text.

| Model | Assertions kept | Name confusion | Spoiler | Hallucination | Invariants | Selectivity / psyche | Cents per chapter with context |
|---|---|---|---|---|---|---|---|
| GPT-6 Luna | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.18 |
| GPT-6.1 Sol | **100 %** | 0 | 0 | 0 | 0 | 0 | 3.04 |
| GPT-5.4 mini | **100 %** | 0 | 0 | 0 | 0 | 0 | 1.63 |
| Claude Haiku 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.33 |
| Claude Sonnet 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 6.47 |
| Claude Opus 5.5 | **100 %** | 0 | 0 | 0 | 0 | 0 | 13.57 |
| Gemini 3.8 Flash (thinking low) | **100 %** | 0 | 0 | 0 | 0 | 0 | 1.15 |
| Gemini 4 Argon | **100 %** | 0 | 0 | 0 | 0 | 0 | 3.24 |
| Grok 4.3 | **100 %** | 0 | 0 | 0 | 0 | 0 | 1.64 |
| Kimi K3 | **100 %** | 0 | 0 | 0 | 0 | 0 | 2.96 |
| GLM-5.3 | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.76 |
| Qwen 3.8 27B | **100 %** | 0 | 0 | 0 | 0 | 0 | 0.72 |
| DeepSeek V4.1 Flash | **95 %** | 0 | 1 | 0 | 0 | 0 | 0.25 |
| Gemma 4 31B | **95 %** | 0 | 0 | 0 | 1 | 0 | 0.22 |

Violation columns count texts × assertions violated, summed over all samples.

## English control

| # | Model | Rating (95 % CI) | Without own-family judges |
|---|---|---|---|
| 1 | GPT-6.1 Sol | **1864** (1001–1944) | 1583 (1000–1763) |
| 2 | Claude Sonnet 5.5 | **1532** (1001–1584) | 1407 (1000–1621) |
| 3 | Claude Opus 5.5 | **1309** (1000–1508) | 1177 (896–1310) |
| 4 | Claude Haiku 5.5 | **1276** (1002–1501) | 1321 (999–1577) |
| 5 | Grok 4.3 | **1173** (930–1545) | 1107 (873–1515) |
| 6 | GPT-6 Luna | **1116** (784–1406) | 1050 (597–1442) |
| 7 | Gemini 4 Argon | **1009** (929–1166) | 1128 (982–1230) |
| 8 | GLM-5.3 ¹ | **853** (757–1057) | 942 (782–1201) |
| 9 | Gemini 3.8 Flash (thinking low) | **788** (235–1162) | 704 (191–1198) |
| 10 | Qwen 3.8 27B ¹ | **769** (585–999) | 813 (631–1033) |
| 11 | DeepSeek V4.1 Flash ¹ | **725** (508–1000) | 763 (468–1000) |
| 12 | GPT-5.4 mini | **695** (505–986) | 896 (764–1125) |
| 13 | Kimi K3 ¹ | **493** (182–745) | 585 (277–796) |
| 14 | Gemma 4 31B ¹ | **397** (186–799) | 523 (376–1002) |

## Cost, speed, reliability

| Model | Cents per standard page | Median seconds per text | Texts delivered | No text (failed) | Cut off | Preamble/heading |
|---|---|---|---|---|---|---|
| Gemma 4 31B | 0.05 | 13 | 14/14 | 0 | 0 | 2 |
| GPT-6 Luna | 0.05 | 11 | 14/14 | 0 | 0 | 1 |
| Claude Haiku 5.5 | 0.12 | 10 | 14/14 | 0 | 0 | 1 |
| DeepSeek V4.1 Flash | 0.16 | 15 | 14/14 | 0 | 0 | 1 |
| GLM-5.3 | 0.25 | 5 | 14/14 | 0 | 0 | 5 |
| GPT-5.4 mini | 0.28 | 2 | 14/14 | 0 | 0 | 0 |
| Gemini 3.8 Flash (thinking low) | 0.29 | 8 | 14/14 | 0 | 0 | 2 |
| Qwen 3.8 27B | 0.48 | 22 | 14/14 | 0 | 0 | 1 |
| Grok 4.3 | 0.64 | 27 | 14/14 | 0 | 0 | 1 |
| GPT-6.1 Sol | 0.85 | 26 | 14/14 | 0 | 0 | 1 |
| Gemini 4 Argon | 0.88 | 22 | 14/14 | 0 | 0 | 2 |
| Kimi K3 | 0.96 | 11 | 14/14 | 0 | 0 | 4 |
| Claude Sonnet 5.5 | 2.02 | 14 | 14/14 | 0 | 0 | 3 |
| Claude Opus 5.5 | 4.00 | 21 | 14/14 | 0 | 0 | 4 |

A standard page (Normseite) is 1,800 characters of output; thinking tokens are included in cost, also for texts that never arrived. "No text": the model spent the whole token budget thinking and returned nothing — scored as a failure in every track. Generation cost of this run: $2.33, judging: $4.69.
