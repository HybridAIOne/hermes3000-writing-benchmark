# Which AI writes the best German book text — and at what cost? Results, October 2026

*hermes3000 Writing Benchmark v1 · final round, 18 October 2026 · [Deutsche Fassung](ZUSAMMENFASSUNG.md) · [full report](report.md) · [method](../../METHODOLOGY.md)*

**GPT-6.1 Sol (OpenAI) and Claude Opus 5.5 (Anthropic) write the best German book text, tied at
the top — but Sol costs about a fifth as much per page.** The best copy-editor is an open-weight
model: Kimi K3. GPT-6 Luna reaches fourth place at a fourteenth of Sol's cost.

## Key findings

1. **A shared lead.** In literary prose Sol (rating 1,382) and Opus (1,325) are statistically tied,
   and so they are in non-fiction (1,266 and 1,226). Both are clearly ahead of the field. All three
   AI judges, from three different companies, put the same three models first in literary prose —
   Sol, Opus, Sonnet — also when no judge may rate its own model family.
2. **Quality does not follow price.** Sol and Opus are tied, but Opus costs 3.9 cents per standard
   page against Sol's 0.84. GPT-6 Luna, fourth in literary prose and level with Claude Sonnet 5.5 in
   non-fiction, costs 0.06 cents. Writing a chapter inside a full book context costs 0.19 cents with
   Luna and 13.5 cents with Opus.
3. **The best editor is an open model.** Kimi K3 found on average 5.7 of 6 hidden problems in a
   manuscript passage and scored 94 % in copy-editing, ahead of Claude Sonnet 5.5 (92 %) and both
   leaders (Opus 88 %, Sol 80 %). As a writer it is weaker: sixth of seven in literary prose, last in
   non-fiction.
4. **Open models: one finalist, one specialist.** Of five open-weight models in the preliminary
   round, Kimi K3 reached the final. GLM-5.3 had the best copy-editing score of the whole
   preliminary round (96 %) but too little in the writing tracks. Qwen 3.8 27B and Gemma 4 31B came
   last.
5. **Keeping track of a whole book is no longer the hard part.** Writing a chapter with up to 119
   characters, places and objects in context — including traps such as two doctors with the same
   first name — every finalist kept 97–100 % of the consistency checks.
6. **A human confirms the clear differences.** In a blind check of 42 pairs, the human reader agreed
   with the AI judges in 8 of 11 cases where the judges saw a clear gap; where they saw only a small
   one, the human mostly disagreed or was split.

## Quotable

- "In German literary prose, GPT-6.1 Sol and Claude Opus 5.5 are tied for first place — and Sol
  costs a fifth as much per page."
- "The best copy-editor in the test is an open-weight model: Kimi K3."
- "Quality does not follow price: the fourth-best writer costs a fourteenth of the best."
- "Every finalist kept a book of 119 characters, places and objects straight — consistency across a
  book is no longer what separates the models."

## In numbers

- **490 texts**, about **214,000 words**, written by 14 models (preliminary round and final).
- **264 group verdicts** by three AI judges = **2,784 pairwise comparisons**, plus 420 checklist
  checks and **4,920 errors quoted word for word**.
- **Head to head** (literary prose, from the rating gap): Sol vs Opus 58 : 42; Sol vs Sonnet 83 %;
  Sol vs GPT-6 Luna 93 %.
- **Uncertainty:** 95 % intervals from 1,000 bootstrap resamples. Sol 1,320–1,453 and Opus
  1,264–1,401 overlap; Sonnet reaches at most 1,161.
- **Judge agreement:** of 21 model pairs, two judges ordered on average 18 the same way in literary
  prose and 15 in non-fiction.
- **Own-family preference:** each judge ranks its own family a little higher — Opus put Opus first,
  Sol put Sol first, Gemini put Gemini 4 Argon fourth where the other two put it fifth and sixth.
  Without own-family verdicts the top three in literary prose stay the same.
- **Errors quoted per text** in the final: GPT-6.1 Sol 2.3 · Claude Opus 5.5 3.1 · GPT-6 Luna 3.4 ·
  Claude Sonnet 5.5 3.5 · Claude Haiku 5.5 4.1 · Gemini 4 Argon 4.3 · Kimi K3 4.6.

## Final ranking

| Model | Literary prose | Non-fiction | Copy-editing | Book context | Cents per standard page |
|---|---|---|---|---|---|
| GPT-6.1 Sol | **1,382** | **1,266** | 80 % | 98 % | 0.84 |
| Claude Opus 5.5 | **1,325** | **1,226** | 88 % | 100 % | 3.92 |
| Claude Sonnet 5.5 | 1,105 | 999 | 92 % | 100 % | 2.01 |
| GPT-6 Luna | 935 | 1,000 | 79 % | 100 % | 0.06 |
| Gemini 4 Argon | 799 | 815 | 83 % | 100 % | 0.75 |
| Kimi K3 ¹ | 733 | 748 | **94 %** | 100 % | 0.84 |
| Claude Haiku 5.5 | 722 | 947 | 78 % | 97 % | 0.13 |

Ratings on an Elo-like scale, mean 1,000; intervals and per-judge results in the [report](report.md).
A standard page is 1,800 characters; cost at list prices on the test date, thinking tokens
included. ¹ open-weight model.

## Long list: preliminary round, all 14 models

One text per task and model, one judging pass — enough to pick the finalists, not to rank them
finely. Ratings are from the preliminary run and not comparable to the final's.

| # | Model | Literary prose | Non-fiction | Copy-editing | Book context | Cents per page | Final |
|---|---|---|---|---|---|---|---|
| 1 | Claude Sonnet 5.5 | 1,574 | 1,306 | 94 % | 100 % | 2.02 | ✓ |
| 2 | Claude Opus 5.5 | 1,710 | 1,348 | 81 % | 100 % | 4.00 | ✓ |
| 3 | GPT-6.1 Sol | 1,706 | 1,348 | 81 % | 100 % | 0.85 | ✓ |
| 4 | GPT-6 Luna | 1,128 | 1,310 | 82 % | 100 % | 0.05 | ✓ |
| 5 | Gemini 4 Argon | 1,067 | 1,001 | 85 % | 100 % | 0.88 | ✓ |
| 6 | Kimi K3 ¹ | 965 | 870 | 90 % | 100 % | 0.96 | ✓ |
| 7 | GLM-5.3 ¹ | 778 | 866 | **96 %** | 100 % | 0.25 | |
| 8 | Gemini 3.8 Flash (thinking low) | 927 | 959 | 80 % | 100 % | 0.29 | |
| 9 | Claude Haiku 5.5 | 1,011 | 1,233 | 69 % | 100 % | 0.12 | ✓ ² |
| 10 | Grok 4.3 | 668 | 776 | 89 % | 100 % | 0.64 | |
| 11 | GPT-5.4 mini | 836 | 865 | 69 % | 100 % | 0.28 | |
| 12 | DeepSeek V4.1 Flash ¹ | 895 | 875 | 75 % | 95 % | 0.16 | |
| 13 | Qwen 3.8 27B ¹ | 298 | 478 | 76 % | 100 % | 0.48 | |
| 14 | Gemma 4 31B ¹ | 435 | 766 | 74 % | 95 % | 0.05 | |

Order = mean rank across the four tracks (ties share their rank). ¹ open-weight model. ² Claude
Haiku 5.5 took part in the final as a seventh model: a first final had wrongly seated it instead of
Kimi K3 (ties were broken by list order — [details](../2026-10-17-v1-final/SUPERSEDED.md)), and its
texts were kept for comparison.

## How it was measured

14 language models wrote 14 tasks in German — literary scenes and a 900-word chapter, non-fiction
from given source material, proofreading and editing against answer keys, and chapters written
inside a full book context. Three AI judges from Anthropic, OpenAI and Google ranked the texts blind
in groups of five; ratings come with 95 % intervals. The best models went to a final with three
samples per task and two judging passes, followed by a blind human check. Tasks, every generated
text, every verdict and the code are public in this repository.

## Limits

Most verdicts come from AI judges; three providers, a control without own-family judges and the
human check reduce their bias but do not remove it. The human check so far is one reader and 42
pairs. Costs use list prices on the test date. Results describe the models as of 18 October 2026.

*Please cite as "hermes3000 Writing Benchmark, HybridAI GmbH". Data under CC BY 4.0.*
