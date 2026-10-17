# Methodology — hermes3000 Writing Benchmark v1

This document describes exactly what is measured and how. Everything it refers to lives in
`benchmark/v1/` (tasks, answer keys, rubrics, models, rules) and `src/` (the code that runs
and scores it).

## What the benchmark answers

Which language model should write, structure and edit **German book text** — the work authors do
in the writing app [Hermes 3000](https://hermes3000.ai)? Four tracks:

| Track | Tasks | How it is scored |
|---|---|---|
| Literary prose | opening scene · dialogue with unspoken conflict · continuing a novel scene from book context · 900-word chapter opening with fixed constraints · English scene (control) | blind group rankings by three judges, rubric scores, constraint checklist |
| Non-fiction | chapter opening · book outline · explanatory text written **from supplied source material** | blind group rankings, rubric scores, fact coverage (deterministic), unsupported claims |
| Copy-editing | proofreading (20 planted errors, 10 traps) · tightening by 40 % without losing facts · editorial notes on a passage with 6 planted problems | answer keys and counts — no judge for the first two; a checklist for the notes |
| Book context fidelity | writing a chapter inside a large frozen book context (36 and 119 characters, places and things; summaries of all chapters) — three chapters from two test novels | known assertions per chapter: name confusion, spoilers, hallucinated characters, invariants; majority of three judges |

German is the primary language; the English scene is a control.

## Generation

Every model writes every task `runs` times (preliminary stage: 1, final: 3) from the identical prompt.
Models are called directly at their provider or via OpenRouter, with the settings listed in
`models.yaml` (for example reasoning effort). Nothing is post-processed: a preamble, heading or
sign-off the model adds stays in the text and is counted against it (`metaText`).

**Failures are scored, not skipped.** Some reasoning models occasionally spend the whole token
budget (16,000) thinking and return no text. An author would get nothing — and still pay. Such a
text loses against every text of its task in the ranked tracks and scores 0 in the keyed tracks
(copy-editing, facts, book context); the report lists the count per model.

Cost is computed from the token counts the provider reports and the list prices in
`models.yaml`, including reasoning tokens, and reported **per standard page** (Normseite,
1,800 characters of output) — the unit German publishing uses.

## Judging (literary and non-fiction)

- **Judges.** Three models from three providers (`spec.yaml → judges`): Claude Opus 5.5,
  GPT-6.1 Sol, Gemini 4 Argon. Each judge is also related to candidates; see "self-preference".
- **Groups, not single texts.** A judge sees a group of five anonymised texts for the same task
  (labels A–E, order shuffled), scores each on the track rubric (`rubrics/literary.md`,
  `rubrics/nonfiction.md`: language, style, brief — 1 to 10), quotes concrete errors and ranks the
  group. Groups are re-shuffled per judge and pass (preliminary: 1 pass, final: 2) with a seed derived from the run,
  task, judge and pass, so a run's groups are reproducible. Two texts of the same model are kept
  in different groups where possible.
- **Structured verdicts.** Verdicts are requested as schema-valid JSON (Anthropic structured
  outputs, OpenAI `json_schema`, Gemini `responseJsonSchema`); a ranking that is not a
  permutation of the group is retried.
- **Extra checks inside the same call.** For the source-based task the judge lists every claim
  not supported by the source (`rubrics/source-check.md`). For the long chapter the judge marks
  violated constraints from the task's checklist (`rubrics/checklist.md`).

### Ratings

A ranking of n texts yields n(n−1)/2 pairwise outcomes. A Bradley–Terry model is fitted to all
outcomes of a track (minorisation–maximisation, a weak prior of one virtual draw per model) and
reported on an Elo-like scale with mean 1000. 95 % intervals come from 1,000 bootstrap resamples
**over judged groups** — the unit a judge actually decided — with a fixed seed, so re-computing a
report gives identical numbers. Two models whose intervals overlap are not reliably ordered.

### Self-preference

Every judge has a relative among the candidates. The report therefore shows, next to the rating
from all judges, a rating **without own-family judges**: an outcome is dropped when the judge
belongs to the family of either model in the pair. Per-judge orderings are listed as well.

## Copy-editing scoring

- **Proofreading** (`ed-proofread`): each planted error has a key (`wrong` → `right`, compared
  after normalising quotes and whitespace). A fix counts when the wrong form is gone and a right
  form is present; gone-but-rephrased counts half. Ten **traps** — correct spellings that look
  wrong ("im Nachhinein", "so lange, bis") and deliberate style (dialect in dialogue, a sentence
  fragment) — must survive verbatim. Score = 0.5 · fixed + 0.25 · traps kept + 0.25 · word-level
  similarity to the reference correction (which penalises edits nobody asked for).
- **Tightening** (`ed-tighten`): 9 facts with accepted phrasings must survive, the length must land
  within ±20 % of 140 words, and no number may appear that the source does not contain.
  Score = 0.6 · facts kept + 0.25 · length + 0.15 · no invented figures.
- **Editorial notes** (`ed-feedback`): the passage contains six planted problems (a logic break,
  a tense error, a point-of-view break, a repetition pattern, a head-count contradiction, an
  impossibility). All three judges check the notes against this list (`rubrics/feedback.md`); a
  problem counts as found when a majority agrees. False alarms are counted. Score =
  found / 6 − 0.05 · false alarms.

The editing score is the mean of the three. Proofreading is close to the ceiling for current
models; most of the spread comes from tightening and editorial notes.

## Book context fidelity

In real use a model writes inside a book: a cast list, places, objects, the plan of every chapter.
Three tasks take a chapter from two test novels written for this purpose (originally for the
worldbuilding evaluation of Hermes 3000) and freeze the full book context into the prompt —
19,000 and 64,000 characters. The context deliberately includes the summaries of **later**
chapters: the author knows the whole plan, the chapter must not leak it.

The novels are built around traps: two doctors called Adrian with opposite traits, a third
character sharing one surname; seven Wilhelms and five Annas in a merchant town; a brother who
counts as dead until chapter 5; an uncle who exists only in letters and must never appear; a wing
that stays sealed until chapter 6. Each task lists its assertions (`assertions`, with a dimension
each). All three judges check every text against them (`rubrics/context-check.md`) and quote
evidence; an assertion counts as violated when a majority of judges says so. Score = share of
assertions kept. The report also gives the cost of one chapter with the full context, which is
where input prices start to matter.

One assertion type — the psychological state of a character at this point of the arc — is softer
than the others; it is reported with "selectivity" and weighs like any other assertion.

## Stages

1. **Preliminary** — all models, all tasks, one sample and one judging pass by all three judges.
   It only has to decide who reaches the final; its intervals are wide by design.
2. **Final** — the best six models by mean rank across the four tracks (`finalists`): three
   samples per task, two judging passes, and the human panel. The published ranking of the
   top comes from this stage.

### Human panel

Judged German texts are exported as random cross-model pairs (`arena-pairs.json`) for blind
pairwise votes at [arena.hermes3000.ai](https://arena.hermes3000.ai). Human votes are reported
separately and used to state how well the model judges agree with people.

## Reproducibility

- `benchmark/v1/` has a **fingerprint** (sha256 over all files). Every run records it in
  `manifest.json` together with the code commit, stage, sample count, models and judges. A run
  cannot be resumed under a different fingerprint.
- A change that alters what is measured (tasks, keys, rubrics, judging rules) is a new benchmark
  version (`v2`), never an edit of `v1`.
- Every generated text, verdict and check is stored as its own JSON file under
  `results/<run>/`. The report is computed from these files alone (`npm run bench -- report`).
- Runs are resumable: re-running a command only does what is missing.

Model outputs are not deterministic, even at the same settings; that is why every task is sampled
more than once and every rating carries an interval.

## Public and private tasks

The tasks in this repository are public. A held-out set with the same schema can be kept outside
the repository (`PRIVATE_TASKS_DIR`) so that a model trained on the public tasks would not gain an
advantage; its fingerprint is recorded in the manifest, its content is not published.

## Limits

- Judges are language models. Three providers, blind groups, the own-family control and the human
  panel reduce — but do not remove — the bias this brings.
- Tasks are short to medium length and come without a full manuscript; in real use a model sees
  much more context.
- Prices change quickly. Reported costs use list prices on the run date.
- Taste is taste. A model that ranks low here may suit a particular author's voice.
