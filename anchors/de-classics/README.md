# German classics as a human anchor

Openings of twelve German novellas, cut at about 300 and about 900 words — the lengths of the
benchmark's opening-scene and chapter-opening tasks — so that a model's text can be set against
human literature of the same kind: an opening against an opening. Used by the TTCW analysis
(`npm run bench -- ttcw --id <run>`).

All texts are in the public domain in Germany and the US (authors died before 1956, works
published before 1930), taken from Project Gutenberg in the edition's spelling; only Gutenberg
markup (`_…_`, `=…=`) was removed. Each excerpt starts with the work's first sentence and ends at
a paragraph or sentence boundary. Sources and word counts: `index.json`.

Caveat: these are famous texts, and judges may recognise them. The TTCW analysis asks each judge
whether it recognises the work and reports that next to the scores.
