> **Superseded.** This final had a finalist selection error; the valid results are in [2026-10-18-v1-final](../2026-10-18-v1-final/SUMMARY.md). [Why](SUPERSEDED.md)

# Which AI writes the best German book text? — Results, October 2026

*hermes3000 Writing Benchmark v1 · final round, 17 October 2026 · [Deutsche Fassung](ZUSAMMENFASSUNG.md) · [full report](report.md) · [method](../../METHODOLOGY.md)*

**GPT-6.1 Sol (OpenAI) and Claude Opus 5.5 (Anthropic) write the best German book text, tied at
the top.** Claude Sonnet 5.5 is the best copy-editor. None of the five open-weight models reached
the final.

## Key findings

1. **A shared lead.** In literary prose Sol (rating 1,298) and Opus (1,275) are statistically tied;
   so are they in non-fiction (1,187 and 1,162). Both are clearly ahead of the rest of the field.
   All three AI judges, from three different companies, put the same three models first in literary
   prose — Sol, Opus, Sonnet — also when every judge is barred from rating its own model family.
2. **The best editor is not the best writer.** Claude Sonnet 5.5 found on average 5.3 of 6 hidden
   problems in a manuscript passage and scored 92 % in copy-editing — ahead of both leaders
   (Opus 87 %, Sol 80 %).
3. **Open models are not there yet for German fiction.** Of 14 models in the preliminary round, none
   of the five open-weight models (Kimi K3, GLM-5.3, DeepSeek V4.1 Flash, Qwen 3.8 27B, Gemma 4 31B)
   reached the final. GLM-5.3 was the exception in one discipline: the best copy-editing score of
   the whole preliminary round (96 %).
4. **Keeping track of a whole book is no longer the hard part.** Writing a chapter with up to 119
   characters, places and objects in context — including deliberate traps such as two doctors with
   the same first name — every finalist kept 98–100 % of the consistency checks.
5. **A human confirms the clear differences.** In a blind check of 42 pairs, the human reader agreed
   with the AI judges in 9 of 12 cases where the judges saw a clear gap; where the judges saw only a
   small gap, the human was split as well.

## Quotable

- "In German literary prose, GPT-6.1 Sol and Claude Opus 5.5 are tied for first place; no other
  model comes close."
- "The model that writes best is not the one that edits best: Claude Sonnet 5.5 leads copy-editing."
- "None of the five open-weight models reached the final round."
- "Every finalist kept a book of 119 characters, places and objects straight — consistency across a
  book is no longer what separates the models."

## In numbers

- **448 texts**, about **194,000 words**, written by 14 models (preliminary round and final).
- **264 group verdicts** by three AI judges = **2,208 pairwise comparisons**, plus 384 checklist
  checks and **4,381 errors quoted word for word**.
- **Head to head** (literary prose, from the rating gap): Sol vs Opus 53 : 47 — a coin toss;
  Sol vs Sonnet 75 %; Sol vs GPT-6 Luna 92 %.
- **Uncertainty:** 95 % intervals from 1,000 bootstrap resamples. Sol 1,233–1,391 and Opus
  1,227–1,337 overlap; Sonnet reaches at most 1,172.
- **Judge agreement:** of 15 model pairs, two judges ordered on average 13 the same way in literary
  prose and almost 12 in non-fiction.
- **Own-family preference:** each judge ranks its own family a little higher — Opus put Opus first,
  Sol put Sol first, Gemini put Gemini 4 Argon fourth where the other two put it sixth. The ranking
  without own-family verdicts keeps the same top three in literary prose.
- **Errors quoted per text** in the final: GPT-6.1 Sol 2.5 · Claude Opus 5.5 3.3 · GPT-6 Luna 3.6 ·
  Claude Sonnet 5.5 3.6 · Claude Haiku 5.5 4.3 · Gemini 4 Argon 4.3.

## How it was measured

14 language models wrote 14 tasks in German — literary scenes and a 900-word chapter, non-fiction
from given source material, proofreading and editing against answer keys, and chapters written
inside a full book context. Three AI judges from Anthropic, OpenAI and Google ranked the texts blind
in groups of five; ratings come with 95 % intervals. The six best models went to a final with three
samples per task and two judging passes, followed by a blind human check. Tasks, every generated
text, every verdict and the code are public in this repository.

## Limits

Most verdicts come from AI judges; three providers, a control without own-family judges and the
human check reduce their bias but do not remove it. The human check so far is one reader and 42
pairs. Results describe the models as of 17 October 2026.

## Final ranking

| Model | Literary prose | Non-fiction | Copy-editing | Book context |
|---|---|---|---|---|
| GPT-6.1 Sol | **1,298** | **1,187** | 80 % | 98 % |
| Claude Opus 5.5 | **1,275** | **1,162** | 87 % | 100 % |
| Claude Sonnet 5.5 | 1,106 | 983 | **92 %** | 100 % |
| GPT-6 Luna | 877 | 976 | 79 % | 100 % |
| Gemini 4 Argon | 743 | 781 | 82 % | 100 % |
| Claude Haiku 5.5 | 700 | 911 | 78 % | 98 % |

Ratings on an Elo-like scale, mean 1,000. Intervals and per-judge results: [report](report.md).

*Please cite as "hermes3000 Writing Benchmark, HybridAI GmbH". Data under CC BY 4.0.*
