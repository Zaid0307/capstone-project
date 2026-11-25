# E07 · App-Kritiker → App-Leitung, Grafikleitung · Bewertung Mockup V2

15.11.2026, 13:39. Betrifft [`app-mockup/mockup-v2.html`](../../../app-mockup/mockup-v2.html), dazu als Vergleich [Navy-Mockup](../../redesign/mockup-navy-2026-11-15.png), [Referenz moderne Apps](../../../nutzer-referenz/moderne-apps-referenz-2026-11-15.png) und den verbindlichen Maßstab [Übersichtsreferenz](../../../nutzer-referenz/uebersicht-referenz-2026-11-13.png) ([G01](2026-11-15-g01-app-an-grafik-figurenmassstab.md)).

**Geprüft:**
- Code (391 Zeilen),
- eigene Screenshots in Chrome headless: Gesamtseite 1340 × 1000 und jeder Bildschirm 390 × 844 mit 2-facher Auflösung,
- Größen der Touch-Ziele im DOM gemessen,
- Kontraste selbst berechnet (Glasflächen auf `--bg` gemischt).

Die Figuren sind Ausschnitte aus der Referenz und Platzhalter. Ihre Qualität bewerte ich nicht. Bewertet wird nur, **wie** sie eingesetzt sind.

**Gesamtnote: 6,5 / 10.** Ein klarer Sprung gegenüber dem Prototyp vom 14.11. (dort etwa 3). Gegenüber dem Navy-Mockup ist er lebendiger, aber unruhiger. Die Richtung stimmt. Zum „Wow“ fehlen Disziplin bei Farbe und Glow, ein einheitlicher Icon-Stil und eine fachlich saubere Muskelkarte.

---

## 1. Modern und hochwertig?

**Was schon auf Referenzniveau ist:**
- **Schrift:** Manrope 800 mit negativer Laufweite (`-0.02em`/`-0.03em`) für Überschriften. Große Zahlen in Bento-Kacheln („4 Wochen“, „8,4 t“). Einheiten klein und gedämpft (`.tile .num small`, `.field small`). Das ist der Look der Referenz.
- **Aufbau „Heute“:** Hero, darüber eine schwebende Glaskarte mit einem einzigen Hauptknopf, darunter Bento. Das ist eine klare Hierarchie mit einer Hauptaktion in der Daumenzone.
- **Training:** Fortschrittssegmente „2/6 · 18:24“, große Satzfelder mit 44 px, erledigte Sätze mit Haken **und** Farbe, Pause mit ±15 s. Das Konzept stimmt.
- **Schwebende Glas-Navigation** mit 5 Bereichen. Die Animation am Ring beachtet `prefers-reduced-motion` (Zeile 199).

**Was zum „Wow“ fehlt:**
1. **Zu viele Farben, die alle gleich laut sind.** Neun Akzentfarben (`--blue … --red`, Zeile 21–28) plus 7 Kachelverläufe (`.t-*`, Zeile 123–129). Jede Kennzahl hat ihre eigene Farbe. Gleichzeitig trägt die Figur 6+ Farben. Auf der Muskelkarte stehen dann Rot, Orange, Cyan und Violett für *Gruppen*, und direkt darunter dieselben Rot- und Orangetöne für *Rollen* (Screenshot Muskelkarte). In den Apps der Referenz gibt es **einen** Akzent plus Daten-Farben, nicht einen Regenbogen.
2. **Glow-Inflation.** Leuchtende Schatten liegen auf CTA, aktivem Navigationspunkt, Ring, Fortschrittssegmenten, Wochentagen, Haken, Legendenpunkten und Kachel-Icons (`box-shadow … rgba(47,107,255,.5)`, `drop-shadow`, Zeile 94, 108, 115, 139, 147, 171, 189). Wenn alles leuchtet, leuchtet nichts mehr. Hochwertig wirkt Glow nur an einer Stelle pro Bildschirm.
3. **Inhalt unter der Navigation abgeschnitten.** Auf Heute verschwindet die dritte Bento-Kachel „Volumen“ unter der Glas-Navigation (Screenshot Heute: nur das Icon ist sichtbar). Grund: `.screen { overflow:hidden; padding-bottom:110px }` bei Hero 300 px + Karte + Bento. Ein Mockup mit abgeschnittenem Inhalt wirkt unfertig.
4. **Figur-Ausschnitte unsauber.** Auf der Muskelkarte ragen rechts und links Teile der Nachbarfiguren ins Bild (Arm-Fragment rechts der Figur, rote Stücke links). Ursache: Sprite-Ausschnitt `.stage .fig` (Zeile 184). Als Platzhalter erlaubt, als Präsentation störend. Besser den Ausschnitt mit `clip-path` begrenzen oder eine einzelne Figur freistellen.
5. **Typografie noch nicht als System.** Die Größen 10/11/12/13/14/15/17/18/22/24/26/28/34 px haben keine Skala. Die Navigationsbeschriftung ist 10 px (Zeile 137), unter dem Minimum von 11–12 px. Ziffern stehen nur im Timer in `tabular-nums` (Zeile 174), nicht in Satzfeldern, Ring und Bento. Beim Tippen springen die Zahlen dann.
6. **Abstände.** Die Werte 6/8/10/12/14/16/18/20/22 px folgen keinem 4-px-Raster (14/18/22). Die Karten-Radien 14/16/18/20/22/26/30 sind sieben verschiedene. Für ruhiges Premium reichen drei: 12 / 20 / 28.
7. **Animation.** Nur der Ring ist animiert. Es fehlen die Mikroanimationen, die der Recherche-Stand 2026 nennt: Haken springt beim Speichern eines Satzes (Federung 200 ms), Ring des Pausen-Timers läuft ab, der aktive Punkt in der Navigation gleitet beim Wechsel, Zahl zählt hoch.
8. **Emoji im UI.** Der Chip „🔥 4 Wochen Serie“ (Zeile 251) verwendet ein System-Emoji. Es sieht auf jedem Gerät anders aus und bricht den Icon-Stil. Das eigene Feuer-Icon `#i-fire` ist vorhanden.

---

## 2. Icons

**Lebendig:** Ja, deutlich mehr als im Navy-Mockup. Die Soft-3D-Kacheln mit Glanzkante (`.ico-tile::before`) treffen den Trend.

**Einheitlich:** Nein. Es laufen **drei Stile** parallel:
- (a) **Duotone** mit `currentColor` und Deckkraft .35/.6 für Navigation und Kopfzeile (`#i-home`, `#i-calendar`, …),
- (b) **weiße Glyphen auf Verlaufskachel** (`#i-fire`, `#i-timer`, …, mit fest eingetragenem `fill="#fff"`),
- (c) **Linien-Icons** mit Strich 2,6–3 px (`#i-back`, `#i-check`, `#i-more`).

Dazu kommen das Emoji und uneinheitliche Strichstärken: 1,8 / 2 / 2,2 / 2,4 / 2,6 / 3.

**Lesbar bei 24 px:**
- Navigation (26 px): gut lesbar.
- Die halbtransparente zweite Ebene (.35) ist in inaktiven Navigationspunkten kaum sichtbar. Gedämpft × 0,35 ergibt praktisch Hintergrund. Die Icons zerfallen dann in Einzelteile (Kalender: nur der Kopf mit den Punkten, Pläne: kleine Haken ohne Brett).
- `#i-muscle` ist bei 30 px nicht als Bizeps erkennbar, es sieht aus wie ein Blatt oder ein Schuh (Icon-Satz, Kachel „Muskeln“).
- `#i-weight` (Kettlebell) steht für „Volumen“. Inhaltlich passt ein Balken- oder Stapel-Symbol besser.
- `#i-exercises` (Hantel) und `#i-dumbbell` sind zwei fast gleiche Hanteln für zwei Bedeutungen (Übungen gegenüber Training).

**Verbesserungen:**
1. Zwei Stufen festlegen und nichts dazwischen:
   - **System-Icons** (Navigation, Kopf, Aktionen): Duotone auf 24-px-Raster, Strich 2 px, zweite Ebene mit Deckkraft **.45–.55** statt .35, inaktiv in `--text` mit 70 % Deckkraft statt `--muted`.
   - **Feature-Icons** (Kennzahlen): Soft-3D-Kachel 40/56 px.

   Linien-Icons wie Zurück, Haken und Mehr in denselben Strich (2 px) übernehmen.
2. **Aktiv = gefüllt, inaktiv = Duotone.** Die Navigation braucht für den aktiven Zustand keine leuchtende Verlaufsfläche (Zeile 139). Eine gefüllte Icon-Variante plus eine dezente Pille (`background: rgba(255,255,255,.10)`) wirken hochwertiger. Die Pille gleitet mit `transition: transform .25s`.
3. Kachelfarben auf **eine Familie** reduzieren, z. B. alle Kacheln im Akzentverlauf Blau → Cyan, nur „Serie“ (Feuer) und „Bestleistung“ (Gold) als Ausnahmen. Violett, Pink und Grün entfallen, weil die Figur sie braucht.
4. Weiße Glyphen auf Gold, Grün und Cyan haben nur **2,1–2,8 : 1** (unter 3 : 1 für Grafiken). Auf diesen Kacheln dunkle Glyphen nehmen (`#0a1020`), oder den unteren Verlaufston dunkler wählen (`#d97706`, `#059669`, `#0284c7`).
5. Neu zeichnen: `#i-muscle` als klarer Bizeps-Umriss, „Volumen“ als gestapelte Scheiben, Übungen und Training eindeutig getrennt (Training = Play/Stoppuhr mit Hantel, Übungen = Hantel mit Liste).

---

## 3. Barrierefreiheit (WCAG 2.2 AA, Projektstandard 44 px)

| Prüfung | Wert | Ergebnis |
|---|---|---|
| Gedämpfter Text `#8f9bbd` auf Karte / Hintergrund / Navigation | 6,1 / 6,9 / 6,4 : 1 | ✔ |
| Text im Hero `#c3cdea` | 9,6 : 1 | ✔ |
| **Weißer Text auf CTA-Verlauf**: links `#2f6bff` / rechts `#22b8ee` | 4,5 / **2,3 : 1** | ✘ Die Beschriftung „Training starten“ steht in der Mitte bei etwa 3 : 1. Gleiches gilt für den aktiven Segmentknopf „Vorne“ und den aktiven Navigationspunkt. |
| **Rand der Satzfelder** gegen Karte | **1,25 : 1** | ✘ (Bedienelement braucht 3 : 1). Das Feld ist nur durch die Fläche erkennbar. |
| Rand des offenen Hakens gegen Karte | **1,34 : 1** | ✘ |
| Legende **„Inaktiv“** `#2a3350` gegen Karte | **1,36 : 1** | ✘ Der Farbpunkt ist praktisch unsichtbar. |
| Leere Wochentage / leere Fortschrittssegmente | 1,18 / 1,29 : 1 | ✘ Der Zustand „noch offen“ ist kaum sichtbar. |
| Weiße Glyphen auf Gold / Grün / Cyan-Kachel | 2,2 / 2,5 / 2,8 : 1 | ✘ (Grafik 3 : 1) |
| **Rollen unterscheidbar ohne Farbton**: Primär `#ff4d5e` gegen Sekundär `#ff8a3d` | Helligkeit 1,38 : 1 | ✘ Bei Rot-Grün-Schwäche und in Graustufen kaum unterscheidbar. Sekundär `#ff8a3d` gegen Stabilisator `#9aa3b8`: **1,08 : 1**, in Graustufen gleich. |
| Touch-Ziele: Navigation 58 × 56, Glasknöpfe 44 × 44, Haken 44 × 44, Play 52 × 52 | ≥ 44 | ✔ |
| **−15 / +15** 45 × 36, **Segmente Vorne/Hinten/Skelett** 84–94 × 37, Callouts 31 hoch (falls antippbar) | < 44 | ✘ (Projektstandard 44, WCAG 2.5.8 mindestens 24 ist erfüllt). |
| Farbe als einziges Merkmal | Sätze: Haken + Farbe ✔. Wochentage: „erledigt“ nur durch Farbe und Glow, „heute“ nur durch Rahmen ✘. Rollen in der Legende nur durch Farbpunkt ✘. | teilweise |
| Semantik (für die Umsetzung) | Bedienelemente sind `div`/`span`/`a` ohne `href` (Zeile 243, 287, 326, 347). Im Mockup ok, in der App `button` / `a[href]` mit `aria-current`. | Hinweis |

---

## 4. Passt es zu den App-Abläufen?

- **5 Bereiche:** ✔ Heute, Kalender, Pläne, Auswertung, Übungen. Das ist ein Fortschritt gegenüber dem Navy-Mockup mit 4 Icons ohne Beschriftung.
- **Training:**
  - ✘ Die **Navigation ist im Training sichtbar**, und dabei ist „Pläne“ aktiv (Zeile 332). Laut `redesign-mobile.md` hat das Training einen eigenen Kopf ohne Hauptnavigation. An ihre Stelle gehört die feste Aktionsleiste.
  - ✘ Es fehlt der Hauptknopf **„Satz speichern“**. Im Navy-Mockup war er da.
  - ✘ Es fehlen das **Ziel** („3 × 8–12 · RIR 2 · Pause 2:00“), „Vorher“ **pro Satz** (nur ein Chip „Letztes Mal 60 × 10“), „+ Satz“ und „Überspringen“.
  - ✔ Pause mit ±15 ist da. Der Timer braucht noch einen sichtbaren Ablauf (Ring oder Balken) und „Pause beenden“.
- **Muskelkarte mit 4 Rollen:**
  - ✘ **Fachlicher Bruch:** Die Ansicht „Muskelkarte · Woche“ zeigt die **Farbübersicht der Gruppen** (Referenz oben Mitte), die Callouts färben Gruppen (Brust rot, Bauch cyan, Beine violett). Die Legende darunter erklärt aber **Rollen** (Primär/Sekundär/Stabilisator/Inaktiv). Das sind zwei verschiedene Systeme aus der Referenz:
    - **Rollen** gelten pro **Übung** (Referenz: „Farblogik für Übungen“, Beispielübungen unten).
    - Die **Woche** braucht eine **Belastungsstufe** (effektive Sätze, 5 Stufen aus `loadLevel`), keine Rollen.
  - Vorschlag: drei getrennte Ansichten mit eigener Legende:
    - **Übung** (4 Rollen),
    - **Woche/Plan** (5 Stufen Belastung, ein Farbverlauf),
    - **Gruppen** (Farbübersicht zum Erkunden).
  - ✘ Im Trainingsbild ist bei der Kniebeuge die **Brust rot markiert**. Primär sind aber der M. quadriceps femoris und der M. gluteus maximus. Platzhalter, aber im Mockup wird es mit der Legende „Primär“ verbunden. So darf es nicht in die Abnahme.
  - ✘ Es fehlt der Kern des Maßstabs: **einzelne Köpfe und Anteile antippen**, mit Auswahlkontur und Liste (z. B. „Trizeps, seitlicher Kopf“). Ebenfalls fehlt der Umschalter Mann/Frau. „Skelett“ ist da ✔.
  - Hinweis zur Referenz selbst: Einige Beschriftungen dort sind **nicht TA-konform** und dürfen nicht übernommen werden. „Unterer Brustmuskel“ ist kein eigener Muskel, richtig ist *Pars abdominalis* des M. pectoralis major. Der *M. serratus anterior* steht dort unter „Bauch“, gehört in der App aber zur Brust bzw. zum Schultergürtel. Maßgeblich sind die Namen aus `src/data/muscles.js`.

---

## 5. Sofort ändern (max. 10)

1. **Ein Akzent, Daten-Farben getrennt.** Die UI-Farben auf `--accent` (Blau → Cyan) plus `--warn` reduzieren. Violett, Pink und Grün aus der Oberfläche entfernen, sie gehören der Figur.
   `.t-violet,.t-pink,.t-green{ /* entfernen */ }`
   Timer: `background: rgba(255,255,255,.06); border-color: var(--line)`.
2. **Glow nur einmal pro Bildschirm** (CTA bzw. aktive Satzzeile). Den Glow von Navigation, Ring, Segmenten, Tagen, Haken und Legende entfernen:
   `.nav a.on, .steps i.on, .day.done i, .set.done .check, .leg i { box-shadow:none; filter:none }`.
3. **CTA-Kontrast.** Den Verlauf dunkler enden lassen oder die Schrift dunkel setzen:
   `.cta,.seg span.on{ background: linear-gradient(90deg,#2f6bff,#1d8fd1) }` (rechts ≥ 3,5 : 1, Text 17 px/800 gilt als groß, also 3 : 1 nötig). Alternativ einfarbig `#2f6bff`.
4. **Bedienelemente sichtbar machen.**
   `.field,.check{ border-color: rgba(255,255,255,.28) }` (~3 : 1).
   `.day i, .steps i { background: rgba(255,255,255,.16) }`.
   Legende „Inaktiv“ `#4a5578` mit Umriss `outline:1px solid rgba(255,255,255,.35)`.
5. **Rollen nicht nur über den Farbton unterscheiden.** Die Helligkeit staffeln, z. B. Primär `#ff3b4f`, Sekundär `#ffb020` (deutlich heller), Stabilisator `#7c8599` mit Punktmuster, Inaktiv als Umriss. Dazu ein Muster je Rolle in der Legende (voll / schraffiert / gepunktet / leer).
6. **Muskelkarte fachlich trennen.** Segment-Umschalter „Übung · Woche · Gruppen“, jede Ansicht mit eigener Legende. Die Woche zeigt 5 Stufen Belastung (`loadLevel` 0–4) als einen einzigen Farbverlauf. Die Callouts zeigen die Zahl plus Stufe in Textform („Brust 12 Sätze · im Bereich“). Antippbar mit 44 px Höhe: `.callout{min-height:44px;padding:0 12px;display:flex;align-items:center}`.
7. **Training ohne Hauptnavigation.** `.nav` auf dem Trainingsbildschirm durch eine feste Aktionsleiste ersetzen: Timer-Ring + −15/+15 (44 × 44) + Hauptknopf „Satz 3 speichern“ (54 px). Unter dem Titel die Zielzeile ergänzen: „3 × 8–12 · RIR 2 · Pause 2:00“. Pro Satz eine Spalte „Vorher“ in Mono und gedämpft.
8. **Touch-Ziele.**
   `.pill{height:44px;min-width:56px}`
   `.seg span{padding:12px 22px}` (≥ 44).
   `.nav a{font-size:11px}`
   Textgrößen-Skala: 11 / 13 / 15 / 17 / 22 / 28 / 34 / 44.
9. **Icons vereinheitlichen.** Ein Strich (2 px), Duotone-Deckkraft `.5`, inaktive Navigation `color: rgba(242,245,255,.7)`, aktiv gefüllt. Emoji „🔥“ durch `#i-fire` ersetzen. `#i-muscle` neu zeichnen. Kachel-Glyphen auf hellen Verläufen dunkel setzen (`fill:#0a1020`).
10. **Layout und Zahlen.**
    `.screen{overflow-y:auto}`
    Hero auf 240 px kürzen, damit die Bento-Kacheln über der Navigation enden.
    Global `font-variant-numeric: tabular-nums` für `.num,.field,.ring-wrap b`.
    Radien auf 3 Stufen (`--r-s:12px; --r-m:20px; --r-l:28px`).
    Mikroanimationen ergänzen: `@keyframes pop{50%{transform:scale(1.15)}}` auf `.set.done .check`, Timer als `stroke-dashoffset`-Ring, alles unter `prefers-reduced-motion` abschaltbar.

**Gesamtnote 6,5 / 10.** Mit den Punkten 1–4 und 6–7 erreicht das Mockup realistisch 8. Für 9 braucht es die echte Figur mit antippbaren Köpfen und Anteilen.
