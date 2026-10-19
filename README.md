# hermes3000 Writing Benchmark

A reproducible, open benchmark for one question: **which language model writes, structures and
edits German book text best — and at what cost?**

It is maintained by [HybridAI GmbH](https://hybridai.one), the makers of the writing app
[Hermes 3000](https://hermes3000.ai), and used to choose the models the app offers. Tasks,
answer keys, rubrics, code and every generated text are public.

## What is measured

| Track | Tasks | Scoring |
|---|---|---|
| **Literary prose** (German) | opening scene, dialogue, continuing a novel scene from book context, 900-word chapter with fixed constraints; English scene as a control | blind group rankings by three judges from three providers → Bradley–Terry rating with 95 % intervals |
| **Non-fiction** (German) | chapter opening, book outline, explanatory text **written from supplied source material** | blind rankings plus fact coverage and invented claims |
| **Copy-editing** (German) | proofreading with 20 planted errors and 10 traps, tightening without losing facts, editorial notes on 6 planted problems | answer keys and counts |
| **Book context fidelity** (German) | writing a chapter inside a frozen book context of up to 119 characters, places and things | assertions on name confusion, spoilers, hallucinated characters and invariants |

Plus cost per standard page (1,800 characters, reasoning tokens included), speed and reliability.
Details: [METHODOLOGY.md](METHODOLOGY.md).

## Results

**Latest: final 2026-10-18** — [short version](results/2026-10-18-v1-final/SUMMARY.md) · [Kurzfassung](results/2026-10-18-v1-final/ZUSAMMENFASSUNG.md) · [full report](results/2026-10-18-v1-final/report.md). In German literary prose and non-fiction GPT-6.1 Sol and Claude Opus 5.5 lead with overlapping intervals; Sol costs about a fifth as much per page. The best copy-editor is the open-weight Kimi K3. GPT-6 Luna takes fourth place at a fourteenth of Sol's cost. Preliminary round with all 14 models: [`2026-10-17-v1-prelim-r2`](results/2026-10-17-v1-prelim-r2/report.md) (long list in the short version).

Each run lives in [`results/`](results/) with its report, every text and every verdict, a blind
reading page and a manifest naming the benchmark fingerprint, models, judges and code commit.

## Beyond the ranking: literary quality and the judges

The ranking says which model writes better than another. Three studies alongside it ask what the
judges can be trusted with, and how good the texts are in absolute terms:

- **Can AI judges assess literature?** [`calibration/ttcw`](calibration/ttcw/README.md) — our three
  judges against the 2,016 expert verdicts of *Art or Artifice?* (Chakrabarty et al., CHI 2024).
  They reliably tell professional literature from machine text (κ 0.45–0.66, where 2023's judges
  were at chance) and rank LLM texts about as well as one expert ranks them against two others —
  but they cannot say reliably *which* weakness a single text has.
- **Have LLMs become better writers since 2023?** [`experiments/ttcw-2026`](experiments/ttcw-2026/SUMMARY.md)
  — the study's story experiment repeated with 2026 models: same twelve *New Yorker* plots, same
  prompt, same judges. Tests passed: 2–13 % in 2023, 74–91 % in 2026; GPT-6.1 Sol 91 % against
  the originals' 92 %. The remaining gap is originality. No 2026 story shares an 8-word sequence
  with its original. Not yet confirmed by human experts.
- **How reliable is Hermes 3000's style analysis?** [`experiments/eschbach-check`](experiments/eschbach-check/README.md)
  — Andreas Eschbach's ten craft rules, as Hermes applies them: stable (±0.25 points on repeat),
  consistent with stronger models (ρ 0.70–0.80), moderately aligned with counted features — and a
  measure of lean modern style, not of quality: German classics score 5.7, every model 8.3–8.8.

Applied to the benchmark itself: [TTCW on the final's literary texts](results/2026-10-18-v1-final/TTCW.md),
with openings of German novellas as a human anchor — which showed that the test does not work on
cut-off excerpts.

## Run it yourself

```bash
npm install
cp .env.example .env        # add the API keys of the providers you want to run
npm test                    # checks the answer keys and the statistics
npm run bench -- run --id my-run --models gpt-6-luna,claude-haiku-5.5 --tasks lit-scene,ed-proofread
npm run bench -- report --id my-run
```

`run` is resumable — re-running the same command only does what is missing. Models are called
directly at their providers or via OpenRouter, so no Hermes 3000 account is needed.

## Kurzfassung (Deutsch)

Der hermes3000 Writing Benchmark prüft, welches Sprachmodell **deutsche Buchtexte** am besten
schreibt, gliedert und lektoriert: literarisches Schreiben, Sachbuch, Lektorat und Kontexttreue im großen Buch (Verwechslungen, Spoiler, erfundene Figuren). Bewertet wird
blind durch drei KI-Judges verschiedener Anbieter, ergänzt um menschliche Urteile in der
[Arena](https://arena.hermes3000.ai) und um Lösungsschlüssel, wo sich etwas objektiv messen lässt.
Jede Zahl lässt sich aus den veröffentlichten Daten nachrechnen.

## License

Code: MIT ([LICENSE](LICENSE)). Tasks, answer keys, rubrics and results: CC BY 4.0
([LICENSE-DATA.md](LICENSE-DATA.md)) — please cite "hermes3000 Writing Benchmark, HybridAI GmbH".
