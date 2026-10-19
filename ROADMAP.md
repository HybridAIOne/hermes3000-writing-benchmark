# Notes for later runs

Points collected while running v1. Anything that changes what is measured goes into `v2`;
presentation and tooling can change between runs of the same version.

## Human panel (arena)

- **Render markdown** when presenting texts to people (arena benchmark mode, blind page). Raw
  `#` and `**` distract from the prose. Render both sides the same way; a heading or preamble
  the model added must stay visible, since it is part of what is judged.
- **Less reading per vote.** 81 full pairs (up to 900 words a side) is more than anyone reads
  carefully; one judge stopped at 42. Options:
  - Judge an **excerpt** (the opening ~150 words, or one passage at the same position), not
    the whole text — a reader decides about prose within the first paragraphs anyway.
  - **Short sessions, many people:** 10 pairs per session instead of one person doing 80.
  - **Spend votes where they inform:** pairs whose AI-judge ratings are close or where the
    three judges disagree. Pairs the judges already separate clearly confirm little (in v1
    the person agreed 9 of 12 times there).
- **Only tasks where human taste adds something:** literary scene, dialogue, chapter opening,
  non-fiction opening. Not fact fidelity (`nf-from-source`), outlines or anything with an
  answer key — a checklist or the key judges those better and cheaper than a reader.

## Benchmark v2

- **TTCW as a coarse quality score** (calibration in [calibration/ttcw](calibration/ttcw/README.md)):
  number of the 14 Torrance tests a text passes, majority of the three judges, next to the
  ranking; plus a human-written German anchor (public-domain prose). Per-test verdicts are not
  reliable enough to report. Re-run the calibration whenever a judge changes.

- **Harder context traps.** In v1 almost every model keeps 98–100 % of the assertions; the
  track does not separate the field.

## Lessons from v1 (already applied)

- Every reasoning model needs an explicit effort; without one, OpenRouter models think until
  the token budget is gone (first preliminary run, superseded).
- Record the OpenRouter host per text (`upstream`).
- Arena pairs must carry the rendered prompt (source material included) and must not contain
  the same two samples twice.
