# Have LLMs become better writers since 2023?

The story experiment of Chakrabarty et al. (_Art or Artifice?_, CHI 2024) repeated with 2026
models: same 12 one-sentence plots of New Yorker stories, same prompt, same length matching
(rewrite until within 200 words of the original). All stories — originals, 2023 and 2026 —
judged by the same three judges with all 14 TTCW tests. Results: [REPORT.md](REPORT.md).

```bash
node experiments/ttcw-2026/run.js            # write + judge what is missing
node experiments/ttcw-2026/run.js --refit    # more rewriting rounds for stories >200 words off
node experiments/ttcw-2026/run.js --report   # report only
```

The New Yorker originals are not redistributed. Target lengths and the contamination check read
them from a private copy (`TTCW_PRIVATE_DIR`); the 2026 stories (`stories/`) and verdicts
(`verdicts/`) are published.

## Contamination check

The originals appeared 2021–2023, so a 2026 model may have read them in training and, given the
plot, rebuild the story from memory — which would explain a jump in scores without any gain in
writing. The report therefore compares every story word by word with the original of its plot
(shared 8- and 4-word sequences, longest shared run), with the 2023 stories as baseline.

**Result (2026-10-19): no reproduction.** No 2026 story shares a single 8-word sequence with its
original; the longest shared run is five or six words — everyday phrasing — exactly as in the
2023 stories. Shared 4-word sequences are 0.08–0.22 % of a story (2023: 0.04–0.05 %). The models
write their own stories. This rules out verbatim recall; it cannot rule out that a model knows
the originals' style or structure.

## Other caveats

- **Length.** Longer texts tend to pass more tests. Gemini 4 Argon, GPT-6 Luna and Hemmingway-1
  overshot the target even after six rounds; `--refit` gives them more rounds and re-judges.
- **Judges outside their calibration.** The calibration covers New Yorker and 2023 stories; 2026
  stories are new ground, and the judges are 2026 models themselves. Whether experts would rate
  them as highly is open — a human cross-check (New Yorker vs. 2026 pairs) is the next step.
- **Two judges are also authors** (Sol, Opus); the report shows each judge on its own.
