# TTCW calibration

Can the benchmark's judges administer the **Torrance Test of Creative Writing** (Chakrabarty et
al., *Art or Artifice?*, CHI 2024) — 14 yes/no tests of literary quality that professional
writers designed and applied to 48 stories? The authors' release
([salesforce/creativity_eval](https://github.com/salesforce/creativity_eval), BSD-3) holds 2,016
expert verdicts; in their study no LLM judge agreed with the experts. `run.js` repeats their
protocol (their prompt, their expanded test descriptions, Yes/No at the start of the answer) with
our three judges and compares against the expert majority. Results: [REPORT.md](REPORT.md).

The 12 New Yorker stories are not redistributable — the release links them. They were read from
a private copy (`TTCW_PRIVATE_DIR`); neither they nor the judges' raw answers (which may quote
them) are in this repository, only the aggregate figures.

## What we found (2026-10-19)

1. **The harness reproduces the authors' figures** for their judges exactly (GPT-4 balanced
   accuracy 0.54, Claude 3 Opus 0.58, …), so our numbers sit on the same scale.
2. **Overall, today's judges look excellent** — Claude Opus 5.5 κ 0.66, Gemini 4 Argon 0.60,
   GPT-6.1 Sol 0.45, and r ≈ 0.92 on the number of tests a story passes — far above the 2023
   judges (κ ≤ 0.13) and above the agreement between the experts themselves.
3. **But that is mostly human-versus-machine recognition.** New Yorker stories pass ~90 % of the
   tests, 2023 LLM stories ~15 %; all three judges reproduce those levels almost exactly. Inside
   each group, per-test agreement is weak (κ 0.09–0.22), below the experts' own (0.41 on New
   Yorker, 0.22 on LLM stories).
4. **Ranking LLM stories by tests passed works about as well as an expert does.** On the 36 LLM
   stories the judges correlate with the expert majority at r 0.31–0.49; one expert against the
   other two reaches 0.22. Experts disagree a lot on which test a weak story fails, so this ceiling
   is low.
5. **Calibration differs.** Opus 5.5 is much stricter than the experts on LLM stories (passes 2 %
   vs 15 %), Sol more lenient (29 %), Gemini 4 Argon closest (9 %). A strict judge squeezes all
   LLM texts towards zero passed tests, which leaves nothing to separate.
6. **Contamination cannot be excluded** — the dataset and the experts' justifications are public
   since 2023. The weak within-group agreement argues against memorised labels.

## Consequence for benchmark v2

- TTCW enters as a **coarse aggregate** — number of tests passed per text, majority of the three
  judges — next to the ranking, not as a per-test diagnosis. Per-test verdicts ("fails the ending
  test") are not reliable enough to report, for judges or, on LLM texts, for experts.
- The judges' strictness differs; report the per-judge counts and use the majority.
- A human-written anchor in German (public-domain prose) is what makes the scale meaningful: the
  judges reliably place human literature far above LLM text, so the gap to that anchor is a
  measurement in its own right.
- Repeat this calibration whenever a judge changes.
