# TTCW calibration — can our judges administer the Torrance Test of Creative Writing?

48 stories (12 New Yorker, 36 LLM-written), 14 tests, compared with the majority of three expert annotators (Chakrabarty et al., CHI 2024). κ = Cohen's kappa; 0 is chance, 0.4 moderate, 0.6 substantial agreement.

| Judge | κ (all verdicts) | mean κ per test | Balanced accuracy | Pass rate | r (tests passed per story) |
|---|---|---|---|---|---|
| opus (claude-opus-5-5) | **0.66** | 0.67 | 0.81 | 24 % | 0.92 |
| sol (gpt-6.1-sol) | **0.45** | 0.49 | 0.75 | 45 % | 0.91 |
| gemini (gemini-4-argon) | **0.60** | 0.61 | 0.79 | 29 % | 0.93 |
| majority of our 3 judges | **0.63** | 0.65 | 0.81 | 29 % | 0.94 |
| gpt4 (authors' release) | **0.07** | 0.03 | 0.54 | 79 % | 0.07 |
| claude3-opus (authors' release) | **0.13** | 0.13 | 0.58 | 72 % | 0.58 |
| claudev21 (authors' release) | **0.03** | 0.01 | 0.52 | 83 % | -0.26 |
| gemini-pro (authors' release) | **-0.01** | -0.02 | 0.49 | 97 % | -0.17 |
| cgpt (authors' release) | **-0.02** | -0.05 | 0.49 | 68 % | -0.34 |

Expert pass rate on these stories: 34 %. Expert ceiling (one annotator against the other two where they agree): κ 0.60, r 0.76 on tests passed per story; the paper reports Fleiss κ 0.41 and r 0.69.

## Within each group — the figure that matters

The overall κ above mostly measures whether a judge tells a New Yorker story from a 2023 LLM story: the first pass ~90 % of the tests, the second ~15 %. A benchmark of LLM texts needs agreement inside a group. "experts" = one annotator against the other two, on the same stories.

| Group | Who | κ per test | Pass rate | r (tests passed per story) |
|---|---|---|---|---|
| New Yorker (12 stories) | experts | 0.41 | 91 % | 0.62 |
| | opus | 0.14 | 92 % | 0.30 |
| | sol | 0.21 | 92 % | 0.51 |
| | gemini | 0.22 | 89 % | 0.38 |
| LLM (36 stories) | experts | 0.22 | 15 % | 0.22 |
| | opus | 0.09 | 2 % | 0.31 |
| | sol | 0.12 | 29 % | 0.32 |
| | gemini | 0.15 | 9 % | 0.49 |

## Per test (κ against the expert majority)

| Test | Dimension | Experts pass | opus | sol | gemini | majority of our 3 judges |
|---|---|---|---|---|---|---|
| Narrative Ending | Fluency | 31 % | 0.71 | 0.19 | 0.47 | 0.58 |
| Understandability and Coherence | Fluency | 46 % | 0.48 | 0.57 | 0.52 | 0.52 |
| Scene vs Summary | Fluency | 52 % | 0.43 | 0.39 | 0.39 | 0.35 |
| Narrative Pacing | Fluency | 56 % | 0.33 | 0.44 | 0.41 | 0.41 |
| Language Proficiency and Literary Devices | Fluency | 27 % | 0.84 | 0.58 | 0.73 | 0.79 |
| Emotional Flexibility | Flexibility | 33 % | 0.80 | 0.81 | 0.75 | 0.80 |
| Structural Flexibility | Flexibility | 31 % | 0.79 | 0.41 | 0.73 | 0.79 |
| Perspective and Voice Flexibility | Flexibility | 23 % | 0.70 | 0.60 | 0.46 | 0.70 |
| Originality in Thought | Originality | 33 % | 0.69 | 0.63 | 0.75 | 0.69 |
| Originality in Form and Structure | Originality | 21 % | 0.73 | 0.67 | 0.73 | 0.73 |
| Originality in Theme and Content | Originality | 25 % | 0.78 | 0.73 | 0.83 | 0.78 |
| Rhetorical Complexity | Elaboration | 27 % | 0.95 | 0.00 | 0.71 | 0.71 |
| World Building and Setting | Elaboration | 52 % | 0.51 | 0.09 | 0.46 | 0.50 |
| Character Development | Elaboration | 17 % | 0.73 | 0.70 | 0.54 | 0.70 |

Cost: opus $14.84 · sol $3.50 · gemini $4.26. Unparsed answers: opus 0 · sol 0 · gemini 0.
