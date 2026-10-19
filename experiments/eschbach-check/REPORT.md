# How reliable is Hermes 3000's style analysis (Eschbach's ten rules)?

Hermes' call reproduced exactly (gemini-3.1-flash-lite, temperature 0.3, thinking budget 8,192, prompt in prompt-de.json) on 108 German texts: the literary texts of the benchmark final 2026-10-18-v1-final and twelve classic novella openings at two lengths.

## 1. Same text, same verdict? (three runs per text)

- Overall score (1–10): mean spread between runs **0.25 points** (standard deviation); run 1 vs run 2 across texts r = **0.89**.
- A criterion changes its label (good / needs work / problematic) between runs in **15 %** of cases.
- Texts where the overall score differs by 2 points or more between runs: **3 %**.

| Criterion | Mean spread of the score between runs |
|---|---|
| sceneEntry | 0.27 |
| adjectivesAdverbs | 0.31 |
| dialogueMarkers | 0.30 |
| fillerWords | 0.44 |
| simultaneity | 0.36 |
| passive | 0.43 |
| longSentences | 0.27 |
| longDialogues | 0.21 |
| indirectPerception | 0.59 |
| repetitions | 0.51 |

## 2. Do stronger models agree? (overall score, Spearman ρ across texts)

| Model | ρ with Hermes (mean of 3 runs) | Mean score | Hermes mean score |
|---|---|---|---|
| opus (claude-opus-5-5) | 0.80 | 7.6 | 7.9 |
| sol (gpt-6.1-sol) | 0.70 | 8.3 | 7.9 |
| gemini (gemini-4-argon) | 0.78 | 8.4 | 7.9 |

## 3. Do the scores follow what can be counted? (Spearman ρ, criterion score vs count across texts; a good criterion is clearly negative — more passive, lower passive score)

| Criterion | Count | Hermes | opus | sol | gemini |
|---|---|---|---|---|---|
| passive | passive | -0.06 | -0.16 | -0.25 | -0.12 |
| fillerWords | fillerWords | -0.48 | -0.37 | -0.44 | -0.47 |
| simultaneity | simultaneity | -0.51 | -0.53 | -0.40 | -0.51 |
| indirectPerception | indirectPerception | -0.26 | -0.34 | -0.29 | -0.32 |
| dialogueMarkers | dialogueMarkers | -0.67 | -0.65 | -0.71 | -0.58 |
| longSentences | longSentences | -0.36 | -0.49 | -0.44 | -0.52 |
| longDialogues | dialogueShare | -0.53 | -0.33 | -0.23 | -0.06 |

## 4. Style profile per author (counted, per 1,000 words) and Hermes overall score

| | Hermes score | Passive | Filler words | während/indem | "sah, dass" | Dialogue tags | Mean sentence (words) | Sentences > 25 words |
|---|---|---|---|---|---|---|---|---|
| Claude Haiku 5.5 | 8.4 | 0.0 | 3.0 | 0.0 | 1.3 | 5.9 | 15.0 | 13 % |
| Claude Opus 5.5 | 8.7 | 0.0 | 3.4 | 0.8 | 0.3 | 7.0 | 14.0 | 14 % |
| Claude Sonnet 5.5 | 8.6 | 0.0 | 5.5 | 0.6 | 0.3 | 5.7 | 12.4 | 9 % |
| Gemini 4 Argon | 8.3 | 0.1 | 2.6 | 0.7 | 0.0 | 3.9 | 11.5 | 5 % |
| GPT-6 Luna | 8.6 | 0.0 | 2.9 | 0.1 | 0.4 | 6.6 | 13.6 | 13 % |
| GPT-6.1 Sol | 8.8 | 0.0 | 2.3 | 0.1 | 0.0 | 4.7 | 19.0 | 14 % |
| Kimi K3 | 8.4 | 0.1 | 4.3 | 0.7 | 0.7 | 5.6 | 14.4 | 15 % |
| German classics | 5.7 | 0.0 | 6.5 | 1.9 | 0.1 | 1.4 | 32.5 | 50 % |
## 5. Does the answer keep to the format?

Answers missing one of the ten keys the prompt specifies (seen: "dialogueLength" instead of "longDialogues"): Hermes model 9 of 324, stronger models 0 of 324. The Hermes client shows whatever keys arrive and looks their labels up by key, so a renamed key appears as an untranslated label.

Unparseable answers: 0. Cost of the stronger models: $16.56 (Flash Lite not itemised; a few cents).
