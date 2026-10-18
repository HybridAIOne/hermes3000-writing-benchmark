# Welche KI schreibt die besten deutschen Buchtexte – und zu welchem Preis? Ergebnisse Oktober 2026

*hermes3000 Writing Benchmark v1 · Finale, 18. Oktober 2026 · [English version](SUMMARY.md) · [vollständiger Bericht](report.md) · [Methode](../../METHODOLOGY.md)*

**GPT-6.1 Sol (OpenAI) und Claude Opus 5.5 (Anthropic) schreiben die besten deutschen Buchtexte,
gleichauf an der Spitze – aber Sol kostet pro Seite etwa ein Fünftel.** Der beste Lektor ist ein
offenes Modell: Kimi K3. GPT-6 Luna erreicht Platz vier zu einem Vierzehntel der Kosten von Sol.

## Die wichtigsten Ergebnisse

1. **Geteilte Spitze.** Beim literarischen Schreiben liegen Sol (Rating 1.382) und Opus (1.325)
   statistisch gleichauf, ebenso im Sachbuch (1.266 und 1.226). Beide liegen klar vor dem Feld. Alle
   drei KI-Bewerter von drei verschiedenen Unternehmen setzen beim literarischen Schreiben dieselben
   drei Modelle nach vorn – Sol, Opus, Sonnet –, auch wenn kein Bewerter über die eigene
   Modellfamilie urteilen darf.
2. **Qualität folgt nicht dem Preis.** Sol und Opus liegen gleichauf, aber Opus kostet 3,9 Cent pro
   Normseite, Sol 0,84. GPT-6 Luna, Vierter beim literarischen Schreiben und im Sachbuch gleichauf
   mit Claude Sonnet 5.5, kostet 0,06 Cent. Ein Kapitel mit vollständigem Buchkontext kostet mit
   Luna 0,19 Cent, mit Opus 13,5 Cent.
3. **Der beste Lektor ist ein offenes Modell.** Kimi K3 fand im Schnitt 5,7 von 6 versteckten
   Problemen in einer Manuskriptpassage und erreichte im Lektorat 94 % – vor Claude Sonnet 5.5
   (92 %) und beiden Spitzenmodellen (Opus 88 %, Sol 80 %). Als Autor ist es schwächer: Sechster
   von sieben beim literarischen Schreiben, Letzter im Sachbuch.
4. **Offene Modelle: ein Finalist, ein Spezialist.** Von fünf offenen Modellen der Vorrunde
   erreichte Kimi K3 das Finale. GLM-5.3 hatte das beste Lektorats-Ergebnis der gesamten Vorrunde
   (96 %), aber zu wenig in den Schreib-Bereichen. Qwen 3.8 27B und Gemma 4 31B landeten auf den
   letzten Plätzen.
5. **Den Überblick über ein ganzes Buch zu behalten, ist nicht mehr die Hürde.** Beim Schreiben
   eines Kapitels mit bis zu 119 Figuren, Orten und Gegenständen im Kontext – samt Fallen wie zwei
   Ärzten mit demselben Vornamen – bestanden alle Finalisten 97–100 % der Prüfungen.
6. **Ein Mensch bestätigt die klaren Unterschiede.** In einer Blindprüfung von 42 Paaren stimmte der
   menschliche Leser in 8 von 11 Fällen mit den KI-Bewertern überein, wo diese einen deutlichen
   Abstand sahen; wo sie nur knapp trennten, urteilte er meist anders oder unentschieden.

## Zitierfähig

- „Beim literarischen Schreiben auf Deutsch teilen sich GPT-6.1 Sol und Claude Opus 5.5 den ersten
  Platz – und Sol kostet pro Seite ein Fünftel.“
- „Der beste Lektor im Test ist ein offenes Modell: Kimi K3.“
- „Qualität folgt nicht dem Preis: Das viertbeste Modell kostet ein Vierzehntel des besten.“
- „Alle Finalisten hielten ein Buch mit 119 Figuren, Orten und Gegenständen auseinander – die
  Stimmigkeit über ein ganzes Buch trennt die Modelle nicht mehr.“

## In Zahlen

- **490 Texte** mit rund **214.000 Wörtern**, geschrieben von 14 Modellen (Vorrunde und Finale).
- **264 Gruppenurteile** von drei KI-Bewertern = **2.784 Einzelvergleiche**, dazu 420 Prüfungen
  gegen Checklisten und **4.920 wörtlich zitierte Fehler**.
- **Direkter Vergleich** (Literatur, aus dem Rating-Abstand): Sol gegen Opus 58 : 42; Sol gegen
  Sonnet 83 %; Sol gegen GPT-6 Luna 93 %.
- **Unsicherheit:** 95-%-Intervalle aus 1.000 Bootstrap-Stichproben. Sol 1.320–1.453 und Opus
  1.264–1.401 überschneiden sich; Sonnet erreicht höchstens 1.161.
- **Einigkeit der Bewerter:** Von 21 Modellpaaren ordneten zwei Bewerter beim literarischen
  Schreiben im Schnitt 18 gleich, im Sachbuch 15.
- **Vorliebe für die eigene Familie:** Jeder Bewerter setzt die eigene Familie etwas höher – Opus
  setzte Opus auf Platz 1, Sol setzte Sol auf Platz 1, Gemini setzte Gemini 4 Argon auf Platz 4, wo
  die anderen beiden es auf Platz 5 und 6 sahen. Ohne diese Urteile bleiben beim literarischen
  Schreiben dieselben drei vorn.
- **Zitierte Fehler pro Text** im Finale: GPT-6.1 Sol 2,3 · Claude Opus 5.5 3,1 · GPT-6 Luna 3,4 ·
  Claude Sonnet 5.5 3,5 · Claude Haiku 5.5 4,1 · Gemini 4 Argon 4,3 · Kimi K3 4,6.

## Endstand

| Modell | Literatur | Sachbuch | Lektorat | Treue zum Buch | Cent pro Normseite |
|---|---|---|---|---|---|
| GPT-6.1 Sol | **1.382** | **1.266** | 80 % | 98 % | 0,84 |
| Claude Opus 5.5 | **1.325** | **1.226** | 88 % | 100 % | 3,92 |
| Claude Sonnet 5.5 | 1.105 | 999 | 92 % | 100 % | 2,01 |
| GPT-6 Luna | 935 | 1.000 | 79 % | 100 % | 0,06 |
| Gemini 4 Argon | 799 | 815 | 83 % | 100 % | 0,75 |
| Kimi K3 ¹ | 733 | 748 | **94 %** | 100 % | 0,84 |
| Claude Haiku 5.5 | 722 | 947 | 78 % | 97 % | 0,13 |

Ratings auf einer Elo-ähnlichen Skala, Mittelwert 1.000; Intervalle und Ergebnisse je Bewerter im
[Bericht](report.md). Eine Normseite hat 1.800 Zeichen; Kosten zu Listenpreisen am Testtag,
Denk-Tokens eingerechnet. ¹ offenes Modell.

## Long-List: Vorrunde mit allen 14 Modellen

Ein Text je Aufgabe und Modell, ein Bewertungsdurchgang – genug, um die Finalisten zu bestimmen,
nicht für eine feine Rangfolge. Die Ratings stammen aus der Vorrunde und sind mit denen des
Finales nicht vergleichbar.

| # | Modell | Literatur | Sachbuch | Lektorat | Treue zum Buch | Cent pro Seite | Finale |
|---|---|---|---|---|---|---|---|
| 1 | Claude Sonnet 5.5 | 1.574 | 1.306 | 94 % | 100 % | 2,02 | ✓ |
| 2 | Claude Opus 5.5 | 1.710 | 1.348 | 81 % | 100 % | 4,00 | ✓ |
| 3 | GPT-6.1 Sol | 1.706 | 1.348 | 81 % | 100 % | 0,85 | ✓ |
| 4 | GPT-6 Luna | 1.128 | 1.310 | 82 % | 100 % | 0,05 | ✓ |
| 5 | Gemini 4 Argon | 1.067 | 1.001 | 85 % | 100 % | 0,88 | ✓ |
| 6 | Kimi K3 ¹ | 965 | 870 | 90 % | 100 % | 0,96 | ✓ |
| 7 | GLM-5.3 ¹ | 778 | 866 | **96 %** | 100 % | 0,25 | |
| 8 | Gemini 3.8 Flash (Denkstufe low) | 927 | 959 | 80 % | 100 % | 0,29 | |
| 9 | Claude Haiku 5.5 | 1.011 | 1.233 | 69 % | 100 % | 0,12 | ✓ ² |
| 10 | Grok 4.3 | 668 | 776 | 89 % | 100 % | 0,64 | |
| 11 | GPT-5.4 mini | 836 | 865 | 69 % | 100 % | 0,28 | |
| 12 | DeepSeek V4.1 Flash ¹ | 895 | 875 | 75 % | 95 % | 0,16 | |
| 13 | Qwen 3.8 27B ¹ | 298 | 478 | 76 % | 100 % | 0,48 | |
| 14 | Gemma 4 31B ¹ | 435 | 766 | 74 % | 95 % | 0,05 | |

Reihenfolge = mittlerer Rang über die vier Bereiche (Gleichstände teilen sich den Rang). ¹ offenes
Modell. ² Claude Haiku 5.5 nahm als siebtes Modell am Finale teil: Ein erstes Finale hatte es
fälschlich statt Kimi K3 aufgenommen (Gleichstände wurden nach Listenposition aufgelöst –
[Details](../2026-10-17-v1-final/SUPERSEDED.md)); seine Texte blieben zum Vergleich im Feld.

## Wie gemessen wurde

14 Sprachmodelle schrieben 14 Aufgaben auf Deutsch – literarische Szenen und ein Kapitel mit 900
Wörtern, Sachtexte aus vorgegebenem Quellmaterial, Korrektorat und Lektorat gegen
Lösungsschlüssel und Kapitel innerhalb eines vollständigen Buchkontexts. Drei KI-Bewerter von
Anthropic, OpenAI und Google bewerteten die Texte blind in Fünfergruppen; die Ratings tragen
95-%-Intervalle. Die besten Modelle kamen ins Finale mit drei Texten je Aufgabe und zwei
Bewertungsdurchgängen, gefolgt von einer blinden menschlichen Gegenprobe. Aufgaben, jeder erzeugte
Text, jedes Urteil und der Code sind in diesem Repository öffentlich.

## Grenzen

Die meisten Urteile stammen von KI-Bewertern; drei Anbieter, eine Gegenrechnung ohne Urteile über
die eigene Familie und die menschliche Gegenprobe verringern deren Vorlieben, beseitigen sie aber
nicht. Die menschliche Gegenprobe umfasst bisher einen Leser und 42 Paare. Kosten zu Listenpreisen
am Testtag. Die Ergebnisse beschreiben die Modelle zum Stand 18. Oktober 2026.

*Bitte zitieren als „hermes3000 Writing Benchmark, HybridAI GmbH“. Daten unter CC BY 4.0.*
