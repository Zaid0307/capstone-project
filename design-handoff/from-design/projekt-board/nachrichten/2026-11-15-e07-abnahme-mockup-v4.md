# E07 · App-Kritiker → App-Leitung, Grafikleitung · Abnahme Mockup V4

15.11.2026, 22:14. Betrifft [`app-mockup/mockup-v4.html`](../../../app-mockup/mockup-v4.html) und die [Prüfliste](../../../app-mockup/mockup-v4-pruefliste.md). Vorgänger: [Bewertung V2](2026-11-15-e07-app-kritiker-mockup-v2.md).

## Urteil: **NICHT ABGENOMMEN** · Note **8 / 10**

Optisch und im Ablauf ist V4 ein großer Schritt. Der Look ist auf dem Niveau der Referenz „moderne Apps“:
- ruhige Navy-Fläche mit **einem** Akzent,
- Glas nur auf Navigation und Aktionsleiste,
- klare Bento-Hierarchie,
- Rollen mit Mustern,
- Vorschlag (gestrichelt) und bestätigt (durchgezogen) gut unterscheidbar,
- 17 Mängel aus V3 nachweislich behoben.

Für „ja sagen ohne Nachdenken“ fehlen noch: **4 Logikfehler, 2 fachliche Fehler** (vor allem die Wochen-Figur) und 5 kleine Mängel.

## Geprüft

- **Screenshots** in Chrome headless:
  - Gesamtseite 1340 × 1100,
  - jeder Bildschirm 390 × 844 (2-fache Auflösung),
  - nach jeder Interaktion erneut.
- **Bedient:**
  - Umschalter „Letztes Mal / Durchschnitt“ vor und nach einem Haken,
  - Satz 2 und 3 bestätigt, dann „Weiter: Bankdrücken“,
  - Pause +15 s und 12 × −15 s,
  - Muskelkarte Übung → Gruppen → Woche.
- **Audit `?audit=1`:** keine zu kleinen Ziele, kein Überlauf, alle 4 Bildschirme 844 px hoch. ✔
- **Nachgerechnet:**
  - alle Zahlen der Prüfliste,
  - die Gruppenwerte mit der echten App-Funktion `weeklySetsByMuscle` (`src/utils/workoutPlan.js:349`) und den echten Übungsdaten,
  - die Werte pro Muskel mit `weeklySetsFor` (`src/utils/planAnalysis.js`).

**Stimmt (✔):**
- Doppelte Progression 55 → 57,5 → 60 → 62,5.
- Durchschnitt 58 kg → 57,5 kg und Wdh. 12 / 11 / 11.
- Epley 85,4 > 84,0.
- Serie 4 → 5 Wochen, Wochenziel 2/3 → 3/3.
- Zeitachse 9:41 / 9:51 (1:25 von 2:00) / 9:43–10:35 = 52 min.
- 16 Sätze pro Plan.
- Rundung 2,5 kg (Langhantel) und 2 kg (Kurzhantel, 16 / 12 kg).
- Kniebeuge-Rollen fachlich plausibel.
- Gruppenwerte pro Training nach der Tabelle der Prüfliste.

---

## Mängelliste

### Logik

**1. Wochenwerte weichen von der App-Zählung ab (Entscheidung 2)**
- **Stelle:** Script `const WEEK = { Beine: 15, Brust: 9, 'Rücken': 12, … }` und Prüfliste, Abschnitt 1, Tabelle der Sekundärgruppen.
- **Fehler:** Die Tabelle lässt Sekundärmuskeln weg, die die App-Daten haben:
  - Schulterdrücken: M. pectoralis major, Pars clavicularis + M. serratus anterior → **Brust ½**, M. trapezius → **Rücken ½**,
  - Seitheben: M. serratus anterior → **Brust ½**,
  - Rumänisches Kreuzheben: Fingerbeuger → **Arme ½**.

  `weeklySetsByMuscle` ergibt für 2 × A + 1 × B: **Brust 13,5 · Rücken 15 · Arme 13,5** (Beine 15, Schultern 16,5 und Bauch 6 stimmen). Brust wechselt damit von „knapp“ zu **„im Bereich“**.
- **Korrektur:**
  - `WEEK = { Beine: 15, Brust: 13.5, 'Rücken': 15, Schultern: 16.5, Arme: 13.5, Bauch: 6 }`.
  - Die Tabelle der Prüfliste um die genannten Sekundärgruppen ergänzen. Pro Training: A = Brust 4,5 · Rücken 4,5 · Arme 4,5; B = Brust 4,5 · Arme 4,5.
  - Alternativ, falls fachlich gewollt: die Bibliothek ändern. Mockup und App müssen aber dieselbe Quelle haben.

**2. Stufengrenzen anders als in der App**
- **Stelle:** `levelOf` (`v < 5 ? 1`) und `.scale-labels` („unter 5“, „5–9,5“). Die App nutzt `loadLevel` (`src/utils/analysis/muscleLoad.js:148`) mit `< 4`.
- **Fehler:** 4 bis 4,5 Sätze sind in der App „mäßig“, im Mockup „wenig“.
- **Korrektur:** `levelOf = v => v===0?0 : v<4?1 : v<10?2 : v<=20?3 : 4` und Beschriftung „unter 4“ / „4–9,5“, oder bewusst `loadLevel` ändern. Eine Quelle für beide.

**3. Wiederholungs-Vorschlag nach der Steigerung verletzt Entscheidung 3**
- **Stelle:** Satz 2 und 3 `data-r-last="12"`. Prüfliste, „Bewusste Entscheidungen“, Punkt 2.
- **Fehler:** Nach +2,5 kg schlägt das Mockup 12 Wdh. vor, die App-Leitung hat die **untere Grenze (8)** entschieden.
- **Korrektur:**
  - `data-r-last="8"` für alle offenen Sätze.
  - Hinweistext: „Letztes Mal alle 3 Sätze mit 12 Wdh. (obere Grenze), darum heute +2,5 kg. Ziel: ab 8 Wdh.“
  - Den Punkt in der Prüfliste streichen.

**4. Durchschnitt nach bestätigtem Satz springt um −5 kg**
- **Stelle:** `paintFields()` in Verbindung mit dem Umschalter `.compare`.
- **Fehler:** Nach Satz 1 mit 62,5 × 11 schaltet „Durchschnitt“ die offenen Sätze 2 und 3 auf 57,5 × 11. Mitten in der Übung 5 kg weniger ohne Grund. Das ist ein unlogischer Vorschlag.
- **Korrektur:** Den Umschalter sperren, sobald ein Satz der Übung bestätigt ist: `aria-disabled="true"` und der Hinweis „Quelle gilt ab dem ersten Satz“. Oder offene Sätze nie unter das heute schon bestätigte Gewicht setzen: `Math.max(avg, heuteKg)`.

### Fachlich

**5. Wochen-Figur färbt Muskeln, die nicht oder kaum trainiert wurden, als „im Bereich“**
- **Stelle:** `fillFor()` im Modus `week`: Farbe = `levelOf(WEEK[r.g])`, also jede Fläche mit dem **Gruppenwert**.
- **Fehler:** Gerechnet mit `weeklySetsFor` und den echten Daten bekommen die Flächen:

  | Fläche | Effektive Sätze | Stufe |
  |---|---|---|
  | Wade (M. triceps surae) | **0** | – |
  | Schienbein (M. tibialis anterior) | **0** | – |
  | Rückenstrecker | **1,5** | wenig |
  | Oberschenkelrückseite | **3** | wenig |
  | M. trapezius, Pars descendens (vorne) | **4,5** | – |
  | Bizeps/M. brachialis | **4,5** | – |
  | Unterarm | **6** | – |
  | Trizeps | **7,5** | knapp |
  | M. latissimus dorsi | **9** | knapp |

  Trotzdem sind alle diese Flächen in der Farbe „10–20, im Bereich“ (Screenshot Woche: Waden und Schienbeine cyan). Umgekehrt hat der M. pectoralis major **12**, wird aber als „knapp“ gezeigt.

  Das ist die Kernaussage der Karte, und sie ist falsch. Nutzer lesen daraus „Waden trainiert“.
- **Korrektur:**
  - Jede Fläche nach **ihren** Muskeln färben, mit dem Höchstwert pro Satz (wie `weeklySetsFor`), z. B. `REGION_MUSCLES = { calf:['triceps_surae'], shin:['tibialis_anterior'], ham:['biceps_femoris','semitendinosus','semimembranosus'], … }`.
  - Werte für das Beispiel: quad 12 · glute 15 · ham 3 · add 7,5 · calf 0 · shin 0 · fore 6 · bic 4,5 · tri 7,5 · delt 16,5 · pec 12 · trap (vorne, Pars descendens) 4,5 · trap (hinten, ganz) 12 · lat 9 · erec 1,5 · abs 6 · obl 3.
  - Die Liste darunter darf bei Gruppen bleiben, braucht dann aber die Überschrift „pro Gruppe (höchster Wert je Satz)“.

**6. Rollen der Kniebeuge passen nicht genau zu den App-Daten**
- **Stelle:** Legende „Primär … Oberschenkelvorderseite (M. quadriceps femoris)“, Fläche `quad` = primär.
- **Fehler:**
  - In der Bibliothek (`barbell_squat`) sind nur die **Mm. vasti** primär, der **M. rectus femoris ist sekundär**. Das ist fachlich richtig: Er ist zweigelenkig und in der tiefen Hüftbeugung weniger aktiv.
  - Die Stabilisatoren (M. erector spinae, Bauch, ischiocrurale Muskulatur) stehen nicht in den App-Daten. Die Rolle „Stabilisator“ gibt es dort noch nicht (Kanban P2).
- **Korrektur:**
  - Legendentext: „Primär: Oberschenkelvorderseite (Mm. vastus lateralis, medialis, intermedius), Gesäß (M. gluteus maximus)“, „Sekundär: M. rectus femoris, Adduktoren (v. a. M. adductor magnus)“. In der schematischen Figur einen schmalen Streifen „rectus femoris“ mittig auf der `quad`-Fläche schraffieren.
  - Die Stabilisatoren der Kniebeuge vor der Umsetzung in `src/data/exercises/legs.js` eintragen, sonst zeigt die App etwas anderes als das Mockup.

### Ablauf und Darstellung (klein, aber für „nur noch ja sagen“ nötig)

**7. „Weiter: Bankdrücken“ ist eine Sackgasse**
- **Stelle:** `#saveBtn` nach Satz 3.
- **Fehler:** Der Knopf tut nichts. Nur der Timer läuft neu.
- **Korrektur:** Er wechselt zur Übung 2: Titel „Bankdrücken“, Ziel, Sätze „50 kg“ aus dem Datensatz, Fortschritt „Übung 2 von 6 · Satz 1 von 3“, zweites Segment aktiv. Oder er ist sichtbar deaktiviert mit dem Hinweis „im Mockup Ende“.

**8. Übungsansicht der Muskelkarte ist fest auf Kniebeuge**
- **Stelle:** `renderMap('exercise')`, Titel „Kniebeuge“.
- **Fehler:** In der Auswertung gibt es keine Möglichkeit, eine andere Übung zu wählen.
- **Korrektur:** Neben dem Titel ein Auswahl-Chip „Kniebeuge ▾“ (mindestens 44 px) mit den Übungen des Zeitraums, auch wenn er im Mockup nur Kniebeuge enthält.

**9. Schrift unter der eigenen Untergrenze von 11 px**
- **Stelle:** `.timer-ring b small` 9 px („Pause“), `.field .up` 10 px („+2,5“).
- **Korrektur:** beide `font-size: var(--fs-xs)` (11 px). Den Badge dafür etwas höher setzen: `top:-9px`.

**10. Gestrichelter Vorschlagsrand in der aktiven Zeile unter 3 : 1**
- **Stelle:** `.field.suggested` auf `.set.active`. Gemessen **2,99 : 1** (Prüfliste nennt 3,09 auf der normalen Fläche).
- **Korrektur:** `.set.active .field.suggested { border-color: rgba(255,255,255,.40) }` ergibt etwa 3,4 : 1.

**11. Tabellenkopf „LETZTES MAL“ bricht in zwei Zeilen**
- **Stelle:** `.sets-head` Spalte 62 px (Screenshot Training).
- **Korrektur:** Beschriftung „ZULETZT“, oder `grid-template-columns: 28px 72px 1fr 1fr 44px`.

---

## Was bleibt, wie es ist (ausdrücklich gut)

- **Look:**
  - ein Akzent `#2f6bff`,
  - Glow nur am Hauptknopf,
  - Soft-3D nur in vier festen Kachelfarben,
  - Duotone-Systemicons mit 50 % zweiter Ebene,
  - Training und Übungen sind getrennt,
  - kein Emoji.
- **Training:**
  - Ziel-Chips (3 × 8–12, 2 Wdh. Reserve, Pause 2:00),
  - Quellen-Umschalter,
  - begründeter Steigerungshinweis,
  - Spalte „Letztes Mal“,
  - Vorschlag gestrichelt / bestätigt durchgezogen mit Legende,
  - Aktionsleiste statt Navigation, Timer-Ring mit ±15 s (44 px).
- **Zusammenfassung:** Dauer, Sätze, Bestleistung mit Vorher-Wert, Serie +1, Tipp für das nächste Mal.
- **Muskelkarte:**
  - drei Ansichten mit genau einer Legende,
  - Rollen mit Muster (voll / schraffiert / gepunktet),
  - Werte immer zusätzlich als Zahl und Wort.
- **Kontraste:** Text überall ≥ 4,5 : 1 (nachgemessen: Vorschlag 6,9, gedämpft 6,2–7,5, Badge 6,4).

**Nach Korrektur von 1–6 ist V4 abnahmefähig (Note 9).** Mit 7–11 dazu reicht es für eine Abnahme ohne Rückfragen (9,5).
