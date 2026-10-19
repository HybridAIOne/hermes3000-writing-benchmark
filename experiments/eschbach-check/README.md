# Eschbach style analysis — reliability check

Hermes 3000 offers a style analysis after Andreas Eschbach's ten rules for good prose (scene entry,
adjectives and adverbs, dialogue tags, filler words, simultaneity, passive, sentence length,
dialogue length, indirect perception, repetition). This experiment reproduces Hermes' exact call
(Gemini 3.1 Flash Lite, temperature 0.3, prompt snapshot in `prompt-de.json`) on 108 German
texts — the literary texts of the benchmark final plus twelve classic novella openings at two
lengths — and asks how far its verdicts can be trusted. Figures: [REPORT.md](REPORT.md).

## Findings (2026-10-19)

1. **Stable.** Three runs on the same text differ by 0.25 points on average (overall score 1–10);
   run 1 against run 2 correlates at r 0.89; 3 % of texts move by two points or more. A single
   criterion changes its label (good / needs work / problematic) in 15 % of repeats — the overall
   verdict is steadier than any one criterion.
2. **Consistent with stronger models.** Claude Opus 5.5, GPT-6.1 Sol and Gemini 4 Argon order the
   texts the same way (Spearman ρ 0.70–0.80 with Hermes' model). The cheap model is an adequate
   choice for this feature.
3. **Follows what can be counted — moderately.** Scores fall where the counted feature rises:
   dialogue tags ρ −0.67, simultaneity −0.51, filler words −0.48, sentence length −0.36, indirect
   perception −0.26. The stronger models are no better. Passive could not be tested: neither the
   models nor the classics' openings use it often enough.
4. **It measures a style, not quality.** The classics (Kafka, Musil, Zweig, Fontane, Thomas Mann,
   Schnitzler) score 5.7 against 8.3–8.8 for every model: they write 32-word sentences on average,
   half of them over 25 words, and Eschbach's rules penalise exactly that. The analysis tells an
   author how close a text is to a lean, modern craft style; it does not say whether the text is
   good literature. Every model already writes in that style.
5. **Format slips.** In 9 of 324 answers Hermes' model renamed a key ("dialogueLength" instead
   of "longDialogues"); the stronger models never did. The client shows whatever keys arrive and
   looks up their labels by key, so the user saw an untranslated label for that criterion. Fixed in
   Hermes by mapping the renamed keys back on the server.

## Consequences

- For the benchmark: an Eschbach profile is a useful *style* description per model, not a score;
  most of it can be counted without a judge.
- For Hermes: the feature is reliable enough to show; its wording should make clear that it checks
  craft rules, not literary quality — the classics would fail them.
