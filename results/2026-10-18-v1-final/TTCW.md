# TTCW — Torrance Test of Creative Writing on run `2026-10-18-v1-final`

13 of the 14 TTCW yes/no tests (Chakrabarty et al., CHI 2024; the narrative-ending test is left out — the tasks are openings, not complete stories), the authors' prompt, the run's three judges; a test counts as passed when the majority of judges says Yes. Human anchor: openings of twelve German novellas (Kafka, Musil, Zweig, Fontane, Thomas Mann, Schnitzler) at the task lengths — see [anchors/de-classics](../../anchors/de-classics/README.md).

**Read this as a coarse level, not a diagnosis.** [Calibration](../../calibration/ttcw/README.md) against 2,016 expert verdicts: the judges reproduce the experts' pass levels and rank texts by tests passed about as well as one expert ranks them against two others; which individual test a text fails is not reliable.

## Share of tests passed

| | Scenes, dialogue, continuation (~300 words) | Chapter opening (~900 words) |
|---|---|---|
| **German classics (anchor)** | 56 % | 74 % |
| Claude Opus 5.5 | 73 % | 79 % |
| Kimi K3 | 68 % | 77 % |
| Claude Sonnet 5.5 | 64 % | 69 % |
| Gemini 4 Argon | 67 % | 58 % |
| GPT-6.1 Sol | 68 % | 49 % |
| Claude Haiku 5.5 | 56 % | 49 % |
| GPT-6 Luna | 52 % | 46 % |

## Per judge (share of Yes over all tests)

| | opus | sol | gemini |
|---|---|---|---|
| Claude Haiku 5.5 | 47 % | 74 % | 51 % |
| Claude Opus 5.5 | 74 % | 81 % | 67 % |
| Claude Sonnet 5.5 | 63 % | 80 % | 65 % |
| Gemini 4 Argon | 63 % | 73 % | 62 % |
| GPT-6 Luna | 44 % | 71 % | 47 % |
| GPT-6.1 Sol | 59 % | 76 % | 57 % |
| Kimi K3 | 64 % | 76 % | 64 % |
| German classics (anchor) | 62 % | 74 % | 64 % |

## Per test (majority of judges, all lengths) — indicative only

| Test | Dimension | German classics (anchor) | Claude Haiku 5.5 | Claude Opus 5.5 | Claude Sonnet 5.5 | Gemini 4 Argon | GPT-6 Luna | GPT-6.1 Sol | Kimi K3 |
|---|---|---|---|---|---|---|---|---|---|
| Understandability and Coherence | Fluency | 52 % | 58 % | 100 % | 100 % | 100 % | 75 % | 92 % | 100 % |
| Scene vs Summary | Fluency | 52 % | 75 % | 75 % | 75 % | 73 % | 75 % | 67 % | 75 % |
| Narrative Pacing | Fluency | 100 % | 100 % | 100 % | 100 % | 100 % | 92 % | 100 % | 100 % |
| Language Proficiency and Literary Devices | Fluency | 83 % | 67 % | 100 % | 75 % | 91 % | 25 % | 33 % | 100 % |
| Emotional Flexibility | Flexibility | 70 % | 50 % | 100 % | 92 % | 91 % | 42 % | 58 % | 100 % |
| Structural Flexibility | Flexibility | 30 % | 25 % | 83 % | 25 % | 45 % | 0 % | 50 % | 75 % |
| Perspective and Voice Flexibility | Flexibility | 30 % | 25 % | 67 % | 33 % | 55 % | 33 % | 42 % | 50 % |
| Originality in Thought | Originality | 96 % | 25 % | 42 % | 67 % | 18 % | 42 % | 92 % | 33 % |
| Originality in Form and Structure | Originality | 4 % | 0 % | 8 % | 0 % | 0 % | 0 % | 8 % | 0 % |
| Originality in Theme and Content | Originality | 61 % | 0 % | 17 % | 8 % | 0 % | 0 % | 0 % | 8 % |
| Rhetorical Complexity | Elaboration | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % |
| World Building and Setting | Elaboration | 91 % | 83 % | 75 % | 75 % | 73 % | 75 % | 75 % | 75 % |
| Character Development | Elaboration | 83 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % |

## Do the judges recognise the anchors?

Each judge was asked to name author and title of each anchor excerpt. A recognised classic may get the benefit of the doubt.

- **opus**: recognised 24 of 24 excerpts
- **sol**: recognised 24 of 24 excerpts
- **gemini**: recognised 24 of 24 excerpts

Cost: $35.30.
