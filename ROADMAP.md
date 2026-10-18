# Notes for later runs

Points collected while running v1. Anything that changes what is measured goes into `v2`;
presentation and tooling can change between runs of the same version.

## Human panel (arena)

- **Render markdown** when presenting texts to people (arena benchmark mode, blind page). Raw
  `#` and `**` distract from the prose. Render both sides the same way; a heading or preamble
  the model added must stay visible, since it is part of what is judged.

## Benchmark v2

- **Harder context traps.** In v1 almost every model keeps 98–100 % of the assertions; the
  track does not separate the field.

## Lessons from v1 (already applied)

- Every reasoning model needs an explicit effort; without one, OpenRouter models think until
  the token budget is gone (first preliminary run, superseded).
- Record the OpenRouter host per text (`upstream`).
- Arena pairs must carry the rendered prompt (source material included) and must not contain
  the same two samples twice.
