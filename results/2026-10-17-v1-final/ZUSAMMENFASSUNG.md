> **Überholt.** Dieses Finale hatte einen Fehler bei der Auswahl der Finalisten; gültig sind die Ergebnisse in [2026-10-18-v1-final](../2026-10-18-v1-final/ZUSAMMENFASSUNG.md). [Warum](SUPERSEDED.md)

# Welche KI schreibt die besten deutschen Buchtexte? — Ergebnisse Oktober 2026

*hermes3000 Writing Benchmark v1 · Finale, 17. Oktober 2026 · [English version](SUMMARY.md) · [vollständiger Bericht](report.md) · [Methode](../../METHODOLOGY.md)*

**GPT-6.1 Sol (OpenAI) und Claude Opus 5.5 (Anthropic) schreiben die besten deutschen Buchtexte,
gleichauf an der Spitze.** Claude Sonnet 5.5 ist der beste Lektor. Keines der fünf offenen Modelle
erreichte das Finale.

## Die wichtigsten Ergebnisse

1. **Geteilte Spitze.** Beim literarischen Schreiben liegen Sol (Rating 1.298) und Opus (1.275)
   statistisch gleichauf, ebenso im Sachbuch (1.187 und 1.162). Beide liegen klar vor dem Rest des
   Feldes. Alle drei KI-Bewerter von drei verschiedenen Unternehmen setzen beim literarischen
   Schreiben dieselben drei Modelle nach vorn – Sol, Opus, Sonnet –, auch wenn kein Bewerter über
   die eigene Modellfamilie urteilen darf.
2. **Der beste Lektor ist nicht der beste Autor.** Claude Sonnet 5.5 fand im Schnitt 5,3 von 6
   versteckten Problemen in einer Manuskriptpassage und erreichte im Lektorat 92 % – vor beiden
   Spitzenmodellen (Opus 87 %, Sol 80 %).
3. **Offene Modelle sind für deutsche Belletristik noch nicht so weit.** Von 14 Modellen der
   Vorrunde erreichte keines der fünf offenen Modelle (Kimi K3, GLM-5.3, DeepSeek V4.1 Flash,
   Qwen 3.8 27B, Gemma 4 31B) das Finale. GLM-5.3 war in einer Disziplin die Ausnahme: das beste
   Lektorats-Ergebnis der gesamten Vorrunde (96 %).
4. **Den Überblick über ein ganzes Buch zu behalten, ist nicht mehr die Hürde.** Beim Schreiben
   eines Kapitels mit bis zu 119 Figuren, Orten und Gegenständen im Kontext – samt Fallen wie zwei
   Ärzten mit demselben Vornamen – bestanden alle Finalisten 98–100 % der Prüfungen.
5. **Ein Mensch bestätigt die klaren Unterschiede.** In einer Blindprüfung von 42 Paaren stimmte der
   menschliche Leser in 9 von 12 Fällen mit den KI-Bewertern überein, wo diese einen deutlichen
   Abstand sahen; wo sie nur knapp trennten, war auch der Mensch unentschieden.

## Zitierfähig

- „Beim literarischen Schreiben auf Deutsch teilen sich GPT-6.1 Sol und Claude Opus 5.5 den ersten
  Platz; kein anderes Modell kommt heran.“
- „Das Modell, das am besten schreibt, ist nicht das, das am besten lektoriert: Beim Lektorat liegt
  Claude Sonnet 5.5 vorn.“
- „Keines der fünf offenen Modelle erreichte das Finale.“
- „Alle Finalisten hielten ein Buch mit 119 Figuren, Orten und Gegenständen auseinander – die
  Stimmigkeit über ein ganzes Buch trennt die Modelle nicht mehr.“

## In Zahlen

- **448 Texte** mit rund **194.000 Wörtern**, geschrieben von 14 Modellen (Vorrunde und Finale).
- **264 Gruppenurteile** von drei KI-Bewertern = **2.208 Einzelvergleiche**, dazu 384 Prüfungen
  gegen Checklisten und **4.381 wörtlich zitierte Fehler**.
- **Direkter Vergleich** (Literatur, aus dem Rating-Abstand): Sol gegen Opus 53 : 47 – ein
  Münzwurf; Sol gegen Sonnet 75 %; Sol gegen GPT-6 Luna 92 %.
- **Unsicherheit:** 95-%-Intervalle aus 1.000 Bootstrap-Stichproben. Sol 1.233–1.391 und Opus
  1.227–1.337 überschneiden sich; Sonnet erreicht höchstens 1.172.
- **Einigkeit der Bewerter:** Von 15 Modellpaaren ordneten zwei Bewerter beim literarischen
  Schreiben im Schnitt 13 gleich, im Sachbuch knapp 12.
- **Vorliebe für die eigene Familie:** Jeder Bewerter setzt die eigene Familie etwas höher – Opus
  setzte Opus auf Platz 1, Sol setzte Sol auf Platz 1, Gemini setzte Gemini 4 Argon auf Platz 4,
  wo die anderen beiden es auf Platz 6 sahen. Ohne diese Urteile bleiben beim literarischen
  Schreiben dieselben drei vorn.
- **Zitierte Fehler pro Text** im Finale: GPT-6.1 Sol 2,5 · Claude Opus 5.5 3,3 · GPT-6 Luna 3,6 ·
  Claude Sonnet 5.5 3,6 · Claude Haiku 5.5 4,3 · Gemini 4 Argon 4,3.

## Wie gemessen wurde

14 Sprachmodelle schrieben 14 Aufgaben auf Deutsch – literarische Szenen und ein Kapitel mit 900
Wörtern, Sachtexte aus vorgegebenem Quellmaterial, Korrektorat und Lektorat gegen Lösungsschlüssel
und Kapitel innerhalb eines vollständigen Buchkontexts. Drei KI-Bewerter von Anthropic, OpenAI und
Google bewerteten die Texte blind in Fünfergruppen; die Ratings tragen 95-%-Intervalle. Die besten
sechs Modelle kamen ins Finale mit drei Texten je Aufgabe und zwei Bewertungsdurchgängen, gefolgt
von einer blinden menschlichen Gegenprobe. Aufgaben, jeder erzeugte Text, jedes Urteil und der Code
sind in diesem Repository öffentlich.

## Grenzen

Die meisten Urteile stammen von KI-Bewertern; drei Anbieter, eine Gegenrechnung ohne Urteile über
die eigene Familie und die menschliche Gegenprobe verringern deren Vorlieben, beseitigen sie aber
nicht. Die menschliche Gegenprobe umfasst bisher einen Leser und 42 Paare. Die Ergebnisse
beschreiben die Modelle zum Stand 17. Oktober 2026.

## Endstand

| Modell | Literatur | Sachbuch | Lektorat | Treue zum Buch |
|---|---|---|---|---|
| GPT-6.1 Sol | **1.298** | **1.187** | 80 % | 98 % |
| Claude Opus 5.5 | **1.275** | **1.162** | 87 % | 100 % |
| Claude Sonnet 5.5 | 1.106 | 983 | **92 %** | 100 % |
| GPT-6 Luna | 877 | 976 | 79 % | 100 % |
| Gemini 4 Argon | 743 | 781 | 82 % | 100 % |
| Claude Haiku 5.5 | 700 | 911 | 78 % | 98 % |

Ratings auf einer Elo-ähnlichen Skala, Mittelwert 1.000. Intervalle und Ergebnisse je Bewerter:
[Bericht](report.md).

*Bitte zitieren als „hermes3000 Writing Benchmark, HybridAI GmbH“. Daten unter CC BY 4.0.*
