# Mockup V4 · Prüfliste

15.11.2026 · Datei: [`mockup-v4.html`](mockup-v4.html) (V3 bleibt unverändert). Vier Bildschirme (390 × 844): **1 Heute**, **2 Training** (interaktiv), **3 Training abgeschlossen**, **4 Muskelkarte** (interaktiv), dazu der Icon-Satz.

Prüfansichten zum Nachstellen: `mockup-v4.html?solo=1` … `?solo=4`, dazu `&view=exercise|week|groups`, `&mode=avg`, `&confirm=2` und `?audit=1` (misst Touch-Ziele, Überlauf und Randabstand im DOM).

---

## 1. Beispiel-Datensatz (Quelle aller Zahlen)

**Plan „Ganzkörper A/B“:** reihum (A, B, A, B …), Wochenziel 3 Trainings, Woche Mo–So.

| Plan | Übung | Sätze × Ziel | Primär → Gruppe (1 Satz) | Sekundär → Gruppe (½ Satz) |
|---|---|---|---|---|
| A | Kniebeuge (Langhantel) | 3 × 8–12, 2 Wdh. Reserve, Pause 2:00 | Beine | (Adduktoren = auch Beine, nicht doppelt) |
| A | Bankdrücken (Langhantel) | 3 × 8–12 | Brust | Arme (Trizeps), Schultern (vorderer Deltamuskel) |
| A | Rudern (Langhantel) | 3 × 8–12 | Rücken | Arme (Bizeps, M. brachialis), Schultern (hinterer Deltamuskel) |
| A | Schulterdrücken (Kurzhantel) | 3 × 8–12 | Schultern | Arme (Trizeps) |
| A | Ausfallschritte (Kurzhantel, einseitig L/R) | 2 × 10–12 je Seite | Beine | – |
| A | Unterarmstütz | 2 × 45 s | Bauch | – |
| B | Rumänisches Kreuzheben | 3 | Beine | Rücken (Rückenstrecker) |
| B | Schrägbankdrücken (Kurzhantel) | 3 | Brust | Schultern, Arme |
| B | Latziehen | 3 | Rücken | Arme |
| B | Seitheben | 3 | Schultern | Rücken (M. trapezius, Pars descendens) |
| B | Beinpresse | 2 | Beine | – |
| B | Crunch am Kabelzug | 2 | Bauch | – |

A = 6 Übungen, 16 Sätze (ca. 50 min: 16 × ~45 s Arbeit + 2:00 Pause + Aufwärmen). B = 6 Übungen, 16 Sätze.

**Zählregel (Muskelauslastung):** pro Satz Primärgruppe +1, jede *andere* Sekundärgruppe +0,5, Stabilisatoren 0. Einseitige Sätze (L/R) zählen einmal. Alle Übungen oben gelten als Kraftübungen.
- Pro Training A: Beine 5 · Brust 3 · Rücken 3 · Schultern 6 · Arme 4,5 · Bauch 2
- Pro Training B: Beine 5 · Brust 3 · Rücken 6 · Schultern 4,5 · Arme 3 · Bauch 2

**Verlauf (Reihenfolge reihum):** … 21.10. A · 23.10. B · 26.10. A · 28.10. B · 30.10. A · 2.11. B · 4.11. A · 6.11. B · **Mo 9.11. A · Mi 11.11. B · Fr 13.11. A (heute)**.

**Kniebeuge, letzte 5 Einheiten (Arbeitssätze):**

| Datum | kg | Wdh. | Folge |
|---|---|---|---|
| 21.10. | 55 | 12, 12, 12 | alle an der oberen Grenze → +2,5 |
| 26.10. | 57,5 | 11, 10, 10 | |
| 30.10. | 57,5 | 12, 12, 12 | → +2,5 |
| 4.11. | 60 | 11, 10, 10 | |
| 9.11. | 60 | 12, 12, 12 | → **heute 62,5 kg** |

- Durchschnitt der letzten 5: 58 kg (gerundet auf 2,5-kg-Schritte = **57,5 kg**); Wdh. je Satz 11,6 / 11,2 / 11,2 → **12 / 11 / 11**.
- Bestleistung vor heute: 60 kg × 12 (9.11.).

**Heute (Fr 13.11.), Training 9:43–10:35 = 52 min:** Kniebeuge 62,5 kg × 11, 10, 10 · Bankdrücken 50 kg × 10, 9, 9 · Rudern 50 kg × 12, 11, 10 · Schulterdrücken je 16 kg × 10, 10, 9 · Ausfallschritte je 12 kg, L/R 12/12, 11/11 · Unterarmstütz 45 s, 40 s → 16/16 Sätze.
- Neue Bestleistung: Kniebeuge 62,5 kg × 11 (schwerer als 60 kg; auch geschätztes 1RM nach Epley 85,4 > 84,0 kg).
- Nächstes Mal keine Steigerung (nicht alle Sätze bei 12 Wdh.) → wieder 62,5 kg.

**Wochenziel und Serie:** Wochen 12.10., 19.10., 26.10. und 2.11. je 3 Trainings → Serie **4 Wochen** vor heute. Mit heute 3/3 → Serie **5 Wochen**.

**Muskelkarte „Woche“ 9.–15.11. (2 × A + 1 × B):** Beine 15 · Brust 9 · Rücken 12 · Schultern 16,5 · Arme 12 · Bauch 6.

**Belastungsstufen:** 0 = keine · unter 5 = wenig · 5–9,5 = knapp · 10–20 = im Bereich · über 20 = viel.

**Zeitachse der Bildschirme:** Heute 9:41 → Training 9:51 (Kniebeuge Satz 1 erledigt, Pause seit 35 s, noch 1:25 von 2:00) → Zusammenfassung 10:35 → Muskelkarte 10:37.

---

## 2. Behobene Logikfehler (17)

| # | Fehler in V3 | Behebung in V4 |
|---|---|---|
| 1 | Heute „Kniebeuge +2,5 kg“, im Training 60 kg vorbelegt | Vorbelegung „Letztes Mal“ = 60 + 2,5 = **62,5 kg** mit Kennzeichen „+2,5“ an jedem offenen Feld; grüner Hinweis mit Begründung (alle 3 Sätze bei 12 = obere Grenze). Heute zeigt „Kniebeuge 62,5 kg (+2,5)“. |
| 2 | Übungsbild Kniebeuge: Brust rot (Primär) | Rollen jetzt als **eigene schematische SVG-Figur** (vorne/hinten): Primär M. quadriceps femoris + M. gluteus maximus, Sekundär Adduktoren (v. a. M. adductor magnus), Stabilisator M. erector spinae, Bauchmuskulatur, ischiocrurale Muskulatur. Das Referenzbild ist nur noch **entsättigt** als Bewegungsbild (Platzhalter) zu sehen, ohne Rollenfarbe. |
| 3 | Muskelkarte „Woche“: Gruppenfarben-Figur + Belastungsskala + Rollen-Legende | Pro Ansicht **genau eine** Legende und eine passend eingefärbte Figur: Übung = 4 Rollen, Woche = 5 Belastungsstufen, Gruppen = 6 Gruppenfarben. Umschalter funktioniert. |
| 4 | „Brust 12 Sätze“ unbegründet | Alle Wochenwerte aus dem Datensatz berechnet (Brust 9 = 3 + 3 + 3). |
| 5 | Wochenziel 3/4, Wochenleiste nur Mo–Fr | Ziel 3, Stand 2/3, Leiste Mo–So; erledigte Tage mit Haken (nicht nur Farbe), heute mit Ring und Punkt. |
| 6 | Fortschritt „2/6“ ohne Bezug | „Übung 1 von 6 · Satz 2 von 3“; der erste Segmentbalken ist zu 1/3 gefüllt. |
| 7 | „6 Übungen · 18 Sätze“ passt zu keinem Plan | 6 Übungen · 16 Sätze (Plan A). |
| 8 | „2 neu“ Bestleistungen ohne Bezug | Kachel zeigt die konkrete Bestleistung (60 kg × 12, 9.11.); die Zusammenfassung zeigt die neue (62,5 kg × 11). |
| 9 | Durchschnitt „Ø 58,5 kg × 9,6“ ist nicht ladbar und passt nicht zum Verlauf | Ø 58 kg aus 5 Einheiten, vorbelegt 57,5 kg (auf 2,5 gerundet, im Hinweis erklärt); Wdh. ganzzahlig je Satz. |
| 10 | Im Modus „Durchschnitt“ blieb der Steigerungshinweis unklar | Hinweis wechselt: „Durchschnitt … Ohne Steigerung“. Die Steigerung gilt nur für „Letztes Mal“. |
| 11 | „Vorher“-Wert fehlte pro Satz | Spalte „Letztes Mal“ pro Satz (60 × 12). |
| 12 | Vorschlag und bestätigter Wert sahen gleich aus | Vorschlag = gestrichelter Rand und blaue Schrift; bestätigt = durchgezogener Rand und weiße Schrift; Legende unter den Sätzen. Haken bzw. „Satz 2 bestätigen“ übernimmt den Wert (interaktiv). |
| 13 | „RIR 2“ ohne Erklärung | „2 Wdh. Reserve“. Auch „KH“ entfernt („je 16 kg“ statt „2 × 16 kg“). |
| 14 | Glocke mit Mitteilungs-Punkt: Mitteilungen gibt es nicht | Ersetzt durch „Konto“. |
| 15 | Skelett-Knopf ohne Funktion im Umfang | Entfernt. |
| 16 | Zeitachse fehlte (Training um 9:41 mit Satz 1 erledigt) | Uhrzeiten passen zueinander (siehe Abschnitt 1). |
| 17 | Serie-Chip im Hero doppelt zur Serie-Kachel | Hero zeigt nur den heutigen Plan und den Steigerungs-Chip. |

**Selbst gefunden und in V4 behoben (während der Prüfrunden):**
- Adduktoren-Fläche war zu schmal, die Sekundär-Rolle war kaum sichtbar → verbreitert, zusätzlich in der Rückansicht (M. adductor magnus).
- Hero-Ausschnitt zeigte eine Nachbarfigur und eine Rahmenlinie → engerer Ausschnitt, oben und unten ausgeblendet.
- Übungsbild-Ausschnitt zeigte die Beschriftung „(Langhantel)“ und das Nachbarbild → neuer Ausschnitt.
- Weißer Text auf dem hellen Ende des Hauptknopf-Verlaufs (3,9 : 1) → Verlauf #2f6bff → #2456e0 (≥ 4,5 : 1).
- Belastungsstufe 1 auf der Figur nur 2,1 : 1 → #4466c4 (3,1 : 1).
- Schriftgrößen 10 px (Legenden, Tabellenkopf) → mindestens 11 px.
- Inhalte unter Navigation bzw. Aktionsleiste → alle vier Bildschirme passen ohne Scrollen (Audit: Inhaltshöhe ≤ 844).
- Icon „Muskeln“ (Bizeps) war nicht erkennbar → „Muskelkarte“ = Figur mit markierter Brust.

**Bewusste Entscheidungen (keine Fehler):**
- Bestätigte Sätze behalten ihren Wert, wenn man danach die Vorbelegung umschaltet (in `?mode=avg` zeigt Satz 1 deshalb 62,5).
- Wdh. werden aus der Quelle übernommen (12), auch mit +2,5 kg. Das ist ein Zielwert, kein Ergebnis. Die Zusammenfassung zeigt die tatsächlich bestätigten Wdh. (11, 10, 10). Wer im Mockup alle Vorschläge unverändert abhakt, erzeugt einen anderen Verlauf als die statische Zusammenfassung.

---

## 3. Übernommene Muster (Recherche)

1. **Vorwert pro Satz und Antippen zum Übernehmen** (Hevy: Spalte „PREVIOUS“, Werte vom letzten Mal antippbar) → Spalte „Letztes Mal“ + vorausgefüllte Felder. [Hevy Help: Previous Workout Values](https://help.hevyapp.com/hc/en-us/articles/34105442929943), [Hevy: Track Exercises](https://help.hevyapp.com/hc/en-us/articles/36011896355479-How-to-Use-Previous-Workout-Values-to-Improve-Performance-in-Hevy)
2. **Wählbare Quelle der Vorwerte** (Hevy: „Letztes Mal überall“ oder „im selben Plan“) → Umschalter „Letztes Mal / Durchschnitt (letzte 5)“ pro Übung. [Hevy Help](https://help.hevyapp.com/hc/en-us/articles/34105442929943)
3. **Doppelte Progression mit sichtbarer Begründung** (erst Wdh. steigern, dann Gewicht; Vorschlag mit Grund) → grüner Hinweis „alle 3 Sätze bei 12 → +2,5 kg“ und Tipp in der Zusammenfassung. [Alpha Progression: Progressive Overload](https://alphaprogression.com/en/glossary/progressive-overload), [Boostcamp: Auto-Progression](https://www.boostcamp.app/features/auto-progression)
4. **Bestleistung sofort melden** (Hevy Live PR) → Karte „Neue Bestleistung“ mit Vorher-Wert. [Hevy: Live PR](https://www.hevyapp.com/features/live-pr/)
5. **Körperkarte vorne/hinten mit einer Skala** (Fitbod Recovery: Heatmap, Vorder- und Rückseite) → Figur vorne + hinten nebeneinander, eine Legende je Ansicht, Werte zusätzlich als Text. [Fitbod Help: Muscle Recovery](https://help.fitbod.me/hc/en-us/articles/360006269014-Muscle-Recovery), [Fitbod: Volume, Intensity, Recovery](https://fitbod.me/blog/tracking-volume-intensity-and-recovery-with-fitbod/)
6. **Glas nur für die schwebende Navigationsebene** (Apple Liquid Glass) → Glas nur bei Tab-Leiste, Aktionsleiste und der schwebenden Karte; Inhalte sind matte Flächen. [Apple Newsroom: Liquid Glass](https://www.apple.com/ie/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design), [WWDC25 „Get to know the new design system“](https://wwdcnotes.com/documentation/wwdc25-356-get-to-know-the-new-design-system/)
7. **Bildschirmspezifische Aktionen nicht in der Tab-Leiste** (Apple HIG) → Im Training ersetzt die Aktionsleiste (Pause ±15 s, Satz bestätigen) die Navigation. [STRV: How to apply Liquid Glass](https://www.strv.com/blog/how-to-apply-liquid-glass-to-your-app)
8. **Ring + große Zahl für das Wochenziel** (Apple-Fitness-Ringe, Bento-Kacheln) → Ring „2/3“ mit Wochenleiste, Kennzahl-Kacheln mit Soft-3D-Icons.

---

## 4. Barrierefreiheit (gemessen)

**DOM-Audit `?audit=1`:**
- Alle Bedienelemente ≥ 44 × 44 px.
- Kein horizontaler Überlauf.
- Kein Text näher als 20 px am Rand.
- Alle vier Bildschirme passen in 844 px.

**Kontraste (WCAG 2.2, Glasflächen auf den Hintergrund gemischt):**

| Paar | Kontrast | Ergebnis |
|---|---|---|
| Gedämpfter Text #a3aecb auf Fläche | 7,54 : 1 | ✔ (≥ 4,5) |
| Vorschlagswert #8fb0ff auf aktiver Satzzeile | 6,91 : 1 | ✔ (≥ 4,5) |
| Feldrand (Weiß 34 %) auf Fläche | 3,09 : 1 | ✔ (≥ 3) |
| Wochentag offen (gestrichelt) auf Fläche | 3,09 : 1 | ✔ (≥ 3) |
| Weiß auf Hauptknopf #2f6bff / #2456e0 | 4,50 / 6,03 : 1 | ✔ (≥ 4,5) |
| Haken #04261b auf #19b98a | 6,43 : 1 | ✔ |
| Hinweis grün #c8f5e4 | 14,69 : 1 | ✔ |
| Badge „+2,5“ #b9f6df auf #0f5e46 | 6,39 : 1 | ✔ |
| Navigation inaktiv (72 % Weiß) auf Glas | 8,83 : 1 | ✔ |
| Rollen auf Figur: Primär / Sekundär / Stabilisator | 4,75 / 9,11 / 5,41 : 1 | ✔ (≥ 3) |
| Primär gegen Sekundär · Sekundär gegen Stabilisator | 1,92 · 1,68 : 1 | Info: zusätzlich Muster (voll / schraffiert / gepunktet) |
| Belastungsstufe 1 #4466c4 auf Figur | 3,13 : 1 | ✔ |
| Stufen untereinander | 1,5–2,0 : 1 | Info: Werte stehen immer zusätzlich als Zahl und Wort daneben |
| Glyphen auf Kachel (Blau / Orange / Gold / Cyan) | 5,66 / 6,92 / 8,36 / 6,94 : 1 | ✔ |
| Inaktiv #2b3658 auf Figur | 1,40 : 1 | gewollt leise; Legende mit Umriss |

**Farbe nie allein:**
- Satzstatus: Haken + Füllung.
- Vorschlag: gestrichelt + Legende.
- Wochentage: Haken bzw. Punkt.
- Rollen: Muster.
- Belastung: Zahl + Wort.

---

## 5. Token-Liste (für die Übertragung nach Figma)

| Token | Wert | Verwendung |
|---|---|---|
| `color-bg` | #070b16 | Seitenhintergrund |
| `color-bg-raised` | #0c1324 | Bildschirm oben (Verlauf nach `color-bg`) |
| `color-surface` | #141d35 | Karten, Kacheln, Satzliste |
| `color-surface-2` | #1b2645 | Reserve |
| `color-line` | Weiß 10 % | Kartenränder |
| `color-edge` | Weiß 34 % | Ränder von Bedienelementen (≥ 3 : 1) |
| `color-text` | #f2f5ff | Text |
| `color-text-muted` | #a3aecb | Zweittext |
| `color-text-dim` | #f2f5ff, 72 % | inaktive Icons |
| `color-accent` | #2f6bff | einziger UI-Akzent |
| `color-accent-strong` | #2456e0 | Verlaufsende Hauptknopf |
| `color-accent-soft` | #2f6bff, 22 % | gewählter Umschalter |
| `color-accent-line` | rgb(120,160,255), 60 % | Rand aktive Satzzeile |
| `color-accent-glow` | #2f6bff, 45 % | Leuchten, nur am Hauptknopf |
| `color-success` / `color-on-success` | #19b98a / #04261b | bestätigter Satz, Steigerung |
| `color-suggest` | #8fb0ff | Vorschlagswert + gestrichelter Rand |
| `role-primary` | #ff3b4f (voll) | Primärmuskel |
| `role-secondary` | #ffb020, schraffiert mit #8a5a00 | Sekundärmuskel |
| `role-stabilizer` | #8a93a8, gepunktet mit #eef1f7 | Stabilisator |
| `role-inactive` | #2b3658 + Umriss Weiß 50 % in der Legende | inaktiv |
| `load-0` … `load-4` | #2b3658 · #4466c4 · #6b9bff · #22d3ee · #e6fbff | Belastungsstufen (Woche) |
| `group-brust` · `-ruecken` · `-schultern` · `-arme` · `-bauch` · `-beine` | #ff4d6d · #ff8a3d · #b4f03a · #38bdf8 · #ffd23f · #a78bfa | nur Ansicht „Gruppen“ |
| `figure-body` / `figure-gap` | #151d36 / #0b1226 | Silhouette / Fugen zwischen Muskelflächen |
| Kacheln (Verlauf 145°) | Blau #6f9bff → #2f50ff · Orange #ffc36b → #ff7a2f · Gold #ffe58a → #f5a70b · Cyan #a2f4ff → #18b4e0 | Training · Serie · Bestleistung · Pause/Zeit |
| `space-1` … `space-6` | 4 · 8 · 12 · 16 · 20 · 24 px | 4-px-Raster; Seitenrand 20 px |
| `radius-s` / `-m` / `-l` / `-pill` | 12 / 20 / 28 / 999 px | Felder · Karten · große Karten, Leisten |
| `fs-xs` … `fs-3xl` | 11 · 13 · 15 · 17 · 22 · 28 · 34 px | Manrope 600–800; Zahlen mit tabellarischen Ziffern; Vorwerte JetBrains Mono |
| `touch` | 44 px | Mindestgröße für Bedienelemente |
| Hauptknopf | 54 px hoch | „Training starten“, „Satz bestätigen“, „Fertig“ |
| Navigation / Aktionsleiste | 72 px, 14 px Abstand seitlich, 22 px unten, Glas: Weiß 14 % Rand, Unschärfe 24 px | |

**Aufbau je Bildschirm (von oben nach unten):**
- **Heute:**
  - Kopf (Marke, Konto)
  - Hero 196 px
  - schwebende Karte „Nächstes Training“ (−36 px Überlappung)
  - Wochenziel-Karte (Ring 72 px + 7 Tage)
  - 2 Kacheln
  - Navigation
- **Training:**
  - Kopf (Zurück, Titel + Fortschritt, Mehr)
  - 6 Segmente
  - Medien 132 px (Bewegungsbild + Rollenfigur + Mini-Legende)
  - Titel
  - Ziel-Chips
  - Umschalter
  - Hinweis
  - Satzliste (5 Spalten: 28 / 62 / 1fr / 1fr / 44)
  - Aktionsleiste
- **Zusammenfassung:**
  - Kopf
  - Hero (Kachel 56 px + „Geschafft!“)
  - 3 Kennzahlen
  - Wochenziel-Banner
  - Bestleistungs-Banner
  - Übungsliste
  - Tipp
  - Aktionsleiste „Fertig“
- **Muskelkarte:**
  - Kopf
  - Umschalter (3)
  - Ansichtstitel
  - Bühne 250 px (vorne/hinten)
  - eine Legende passend zur Ansicht
  - Navigation

---

## 6. Offene Punkte

1. **Echte Figuren** (Mann/Frau, einzelne Köpfe/Anteile antippbar) fehlen weiterhin. Die SVG-Figur ist schematisch, aber fachlich korrekt. Der Hero-Ausschnitt und das Übungsbild sind Platzhalter aus der Referenz. Das Übungsbild der Referenz markiert die Brust und darf **nicht farbig** übernommen werden.
2. **Gruppen-Zählregel:** Die App zählt pro Muskel. Wie mehrere Muskeln einer Gruppe zu einer Gruppenzahl werden (hier: Primärgruppe 1, jede andere Sekundärgruppe ½, nicht doppelt), muss die App-Leitung bestätigen.
3. **Wdh.-Vorschlag nach Gewichtssteigerung:** Wdh. der Quelle übernehmen (hier 12) oder untere Grenze (8)? Das ist zu entscheiden.
4. **Rundung des Durchschnitts** auf 2,5 kg (Kurzhanteln eventuell 1 oder 2 kg): Die Schrittweite gehört in die Übungseinstellungen.
5. Pläne-Bildschirm (Wochentage / reihum) ist nicht Teil von V4.
6. Endgültige Icons liefert das Grafik-Team. V4 legt nur die zwei Stufen und die Farben fest.
