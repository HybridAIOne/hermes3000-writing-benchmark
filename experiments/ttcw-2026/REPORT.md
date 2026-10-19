# Have LLMs become better writers since 2023?

The story experiment of Chakrabarty et al. (CHI 2024) repeated with 2026 models: the same 12 one-sentence plots of New Yorker stories, the same prompt, the same length matching. All stories — the New Yorker originals, the 2023 stories and the 2026 stories — judged by the same three judges (Claude Opus 5.5, GPT-6.1 Sol, Gemini 4 Argon) with all 14 TTCW tests; a test counts as passed when the majority says Yes.

Calibration ([calibration/ttcw](../../calibration/ttcw/README.md)): these judges reproduce the experts' pass levels for New Yorker and 2023 stories and rank LLM stories about as well as one expert ranks them against two others. They do not reliably name WHICH test a story fails. Read the table as levels, not diagnoses. Two of the judges are also authors here (Sol, Opus); the per-judge columns show whether that matters.

| Stories | Year | Tests passed (judge majority) | Only stories within 200 words of the original | Fluency | Flexibility | Originality | Elaboration | opus alone | sol alone | gemini alone |
|---|---|---|---|---|---|---|---|---|---|---|
| New Yorker (human, original) | — | **92 %** (12 stories) | — | 97 % | 89 % | 83 % | 94 % | 92 % | 92 % | 89 % |
| GPT-3.5 | 2023 | **2 %** (12 stories) | — | 3 % | 0 % | 0 % | 6 % | 0 % | 27 % | 2 % |
| GPT-4 | 2023 | **13 %** (12 stories) | — | 12 % | 3 % | 0 % | 39 % | 2 % | 35 % | 18 % |
| Claude 1.3 | 2023 | **8 %** (12 stories) | — | 12 % | 0 % | 0 % | 19 % | 4 % | 26 % | 8 % |
| **GPT-6 Luna** | 2026 | **77 %** (12 stories) | 78 % (7) | 98 % | 67 % | 36 % | 92 % | 61 % | 88 % | 79 % |
| **GPT-6.1 Sol** | 2026 | **91 %** (12 stories) | 91 % (12) | 100 % | 89 % | 72 % | 97 % | 85 % | 93 % | 86 % |
| **Claude Sonnet 5.5** | 2026 | **83 %** (12 stories) | 83 % (12) | 98 % | 75 % | 47 % | 100 % | 78 % | 87 % | 86 % |
| **Claude Opus 5.5** | 2026 | **85 %** (12 stories) | 85 % (12) | 100 % | 78 % | 53 % | 100 % | 81 % | 88 % | 88 % |
| **Gemini 4 Argon** | 2026 | **84 %** (12 stories) | 83 % (5) | 100 % | 89 % | 36 % | 100 % | 71 % | 85 % | 90 % |
| **Kimi K3** | 2026 | **82 %** (12 stories) | 82 % (12) | 97 % | 81 % | 44 % | 97 % | 68 % | 84 % | 86 % |
| **Hemmingway-1** | 2026 | **74 %** (12 stories) | 71 % (5) | 93 % | 67 % | 31 % | 92 % | 41 % | 85 % | 77 % |

For reference, the experts in the original study: New Yorker 84.7 %, GPT-4 27.9 %, Claude 1.3 30.0 %, GPT-3.5 8.7 %.

Cost of the 2026 part (writing and judging): $58.84.

## Contamination check — do the models reproduce the originals?

The New Yorker stories appeared 2021–2023; a 2026 model may have read them in training and, given the plot, reproduce the original from memory. Each story is compared word by word with the original of its plot (lower-cased word sequences). The 2023 stories serve as baseline. Only these figures are published; the originals stay private.

| Stories | Shared 8-word sequences | Shared 4-word sequences | Longest shared run (words) |
|---|---|---|---|
| GPT-3.5 (2023) | 0.00 % | 0.05 % | 6 |
| GPT-4 (2023) | 0.00 % | 0.05 % | 5 |
| Claude 1.3 (2023) | 0.00 % | 0.04 % | 4 |
| GPT-6 Luna (2026) | 0.00 % | 0.22 % | 5 |
| GPT-6.1 Sol (2026) | 0.00 % | 0.09 % | 5 |
| Claude Sonnet 5.5 (2026) | 0.00 % | 0.15 % | 6 |
| Claude Opus 5.5 (2026) | 0.00 % | 0.13 % | 5 |
| Gemini 4 Argon (2026) | 0.00 % | 0.08 % | 5 |
| Kimi K3 (2026) | 0.00 % | 0.12 % | 5 |
| Hemmingway-1 (2026) | 0.00 % | 0.10 % | 6 |

Shares are the fraction of a story's distinct word sequences that also occur in the original, averaged over its stories. A copied passage would show up as shared 8-word sequences and a long shared run; everyday phrasing ("he said that he would") reaches four to six words.
