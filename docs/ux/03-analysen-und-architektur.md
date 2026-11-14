# GetFit! – Analysen und App-Architektur (UX-Spezifikation)

Stand: 13.11.2026 · Für: Entwicklung (Schritt C „Kalender“ und D „Auswertung“) · Grundlage: [Konzept Pläne, Training, Auswertung](../konzept-plaene-training-auswertung.md), [Gesamtkonzept](../gesamtkonzept.md), [Muskelmodell](../muskelmodell.md) und der Code auf Branch `ueberarbeitung`.

Dieses Dokument legt fest, **was** gezeigt und **wie** gerechnet wird: Navigation, Routen, Kennzahlen mit Formeln, Filter, Diagrammarten, Zustände, Texte und Barrierefreiheit. **Wie es aussieht** (Farben, Schriften, Abstände, Icons) liefert der Design-Agent; die Muskelfigur liefert der Grafik-Agent. Bis dahin gelten Platzhalter (Abschnitt 4.9).

Verbindliche Regeln für alle Diagramme:
- **Eine Achse pro Diagramm**, keine Doppelachsen. Zwei Größen mit verschiedenen Einheiten = zwei Diagramme untereinander mit gleicher Zeitachse.
- **Identität nie nur über Farbe**: Serien werden direkt beschriftet (Label am Linienende bzw. am Balken), zusätzlich unterschiedliche Markerformen oder Linienmuster. Status im Kalender immer mit Symbol **und** Text.
- Jedes Diagramm hat eine **Tabellen-Alternative** („Als Tabelle zeigen“) mit denselben Zahlen, eine Überschrift als Frage oder Aussage und eine Kurzbeschreibung für Screenreader (`aria-describedby`, z. B. „Trainings pro Woche, 12 Wochen, Mittelwert 2,8, zuletzt 3“).
- Zahlen im Format der Sprache (`Intl.NumberFormat`, de: „1.250 kg“, „82,5 kg“; en: „1,250 kg“, „82.5 kg“). Einheit immer kg (Entscheidung O18).

---

## 1. Prüfung der Gesamtarchitektur

### 1.1 Heutiger Stand (geprüft im Code)

| Bereich | Stand | Bewertung |
|---|---|---|
| Untere Navigation (`Navigation.jsx`) | Neu, Übungen, Pläne, Tagebuch, Sprachumschalter | „Neu“ ist eine Aktion, kein Bereich; die Sprache ist eine Einstellung. Beides belegt zwei der fünf wertvollsten Plätze. Auswertung, Kalender und „Heute“ fehlen. |
| Routen (`routes.js`) | `/`, `/exercises`, `/exercises/:muscle`, `/plans`, `/plans/new`, `/plans/:id/edit`, `/diary`, `/diary?plan=`, `/diary/:workoutId` | Sauber, aber Training liegt unter „Tagebuch“; es gibt keine Plan-Detailseite und keine Übungs-Detailseite. |
| Trainingsmodell (`workoutLog.js`) | `status: done/skipped`, Plan-Bezug mit `planId/planName/dayId/dayName/weekday`, Sätze mit `planned`, `sides.left/right`, `isSetDone`, `workoutSummary`, `filterWorkoutsByPlans` | Gute Basis: Soll ist pro Satz kopiert, Seiten getrennt. Lücken siehe 1.4. |
| Planmodell (`workoutPlan.js`) | `schedule: { type }`, Tage mit optionalem Wochentag, Sätze mit `dose`, `weight`, `rirTarget` | `startDate`, `endDate`, `isActive`, `version` aus Konzept 7.1 fehlen noch; ohne sie lässt sich „verpasst“ und „Termintreue“ nicht berechnen. |
| Plan-Auswertung (`planAnalysis.js`) | Sätze pro Muskel (Haupt 1, Hilfs 0,5), Gruppen über `entry.muscle`, Balance-Paare, Hinweise | Zwei verschiedene Zählweisen (Gruppe über Eintrag, Muskel über Datenbank) und Summen über Teile eines Muskels zählen einen Satz mehrfach (siehe 3.3). Muss mit der Ist-Auswertung dieselbe Funktion nutzen. |
| Tagebuch (`DiaryPage.jsx`) | Woche: Trainings, ausgefallen, Sätze, Volumen, Plantreue (Mittel der Prozentwerte), Planfilter | Plantreue der Woche als Mittel der Prozente gewichtet ein kurzes Training wie ein langes. Ersetzen durch Satz-gewichtete Plantreue (3.6). |
| Speicher | `localStorage`, ein JSON-Array `workoutLog` | Grenze ca. 5 MB pro Herkunft. Ein Training mit 20 Sätzen ≈ 4–6 KB JSON → nach ca. 800–1.000 Trainings (3–5 Jahre) voll. Siehe 1.5. |

### 1.2 Navigation (Entscheidung)

**Mobil: untere Leiste mit fünf Bereichen, alle mit sichtbarer Textbeschriftung unter dem Icon** (heute nur Screenreader-Text; bei fünf gleichrangigen Bereichen ist eine sichtbare Beschriftung Pflicht, damit Icons nicht geraten werden müssen).

| Pos. | Bereich | Route | Enthält | de / en |
|---|---|---|---|---|
| 1 | **Heute** | `/today` | Fälliges Training starten, freies Training, andere Aktivität, Wochenstand, Ziele-Kurzstand, letzte Bestleistungen | „Heute“ / „Today“ |
| 2 | **Kalender** | `/calendar` | Monat mit Status, Tagesdetails Soll-Ist, Listenansicht (ersetzt das heutige Tagebuch) | „Kalender“ / „Calendar“ |
| 3 | **Pläne** | `/plans` | Planliste, „Neuer Plan“ (Hauptaktion oben), Plan-Detail, Editor, Plan-Auswertung | „Pläne“ / „Plans“ |
| 4 | **Auswertung** | `/analysis` | Standard-Dashboard, eigenes Dashboard, Übungs-, Muskel-, Plan-Details, Vergleich, Ziele | „Auswertung“ / „Progress“ |
| 5 | **Übungen** | `/exercises` | Übungsdatenbank, Übungsvorschau, von dort Link zum eigenen Verlauf | „Übungen“ / „Exercises“ |

- **„Neu“ verschwindet aus der Leiste.** „Neuer Plan“ ist die Hauptaktion auf `/plans` und im leeren Zustand von „Heute“.
- **Sprache, Mann/Frau-Figur, Datenexport, später Konto** wandern auf `/settings` („Einstellungen“ / „Settings“), erreichbar über ein Zahnrad oben rechts auf „Heute“ und „Auswertung“ und auf dem Desktop unten in der Seitenleiste. Auf der Startseite (`/`) bleibt der Sprachumschalter.
- **Ziele** sind kein eigener Bereich, sondern ein Reiter in „Auswertung“ und eine Karte auf „Heute“ (Begründung: Ziele werden aus Auswertungszahlen berechnet; ein sechster Bereich würde die Leiste überladen).
- **Laufendes Training** (`/workouts/:id`) zeigt die Leiste nicht, sondern einen Kopf mit „Fertig“; so wird beim Trainieren nichts versehentlich verlassen. Läuft ein Training, zeigt „Heute“ oben „Training läuft – fortsetzen“.
- Aktiver Bereich: `aria-current="page"` auch auf Unterseiten (Bereich = erstes Pfadsegment; `/workouts/*` zählt zu Kalender).
- **Desktop (≥ 1024 px):** linke Seitenleiste (Breite vom Design) mit denselben fünf Bereichen plus „Einstellungen“ unten. Inhalte maximal 1.280 px breit; Auswertung nutzt ein Raster mit 2–3 Spalten (4.1).
- **Tablet (600–1023 px):** untere Leiste wie mobil, Inhalte zweispaltig, wo angegeben.

### 1.3 Informationsarchitektur und Routen

Filter und Auswahl stehen **in der URL** (Suchparameter). Damit funktionieren Zurück-Taste, Lesezeichen, Neuladen und Links von „Heute“ direkt in eine gefilterte Ansicht.

| Route | Seite | Wichtige Parameter |
|---|---|---|
| `/` | Startseite (erster Besuch). Gibt es schon Pläne oder Trainings: Weiterleitung auf `/today` | – |
| `/today` | Heute | – |
| `/calendar` | Kalender | `month=2026-11`, `day=2026-11-13`, `view=month\|list`, `plans=` |
| `/workouts/:workoutId` | Training (heute `/diary/:id`) | – |
| `/plans` | Planliste | – |
| `/plans/new` | Plan anlegen | – |
| `/plans/:planId` | **neu:** Plan-Detail mit Reitern „Aufbau“ und „Auswertung“ | `tab=structure\|analysis` + Filter |
| `/plans/:planId/edit` | Plan bearbeiten | – |
| `/analysis` | Standard-Dashboard | Filter (3.9) |
| `/analysis/my` | Eigenes Dashboard | Filter |
| `/analysis/my/edit` | Dashboard bearbeiten | – |
| `/analysis/exercises/:exerciseKey` | Übungsverlauf | `range`, `plans`, `side` |
| `/analysis/muscles/:muscleId` | Muskel-Detail (Gruppe oder Muskel) | `range`, `plans` |
| `/analysis/compare` | Pläne oder Zeiträume vergleichen | `plans=a,b`, `range`, `mode=plans\|periods` |
| `/analysis/goals` | Ziele | – |
| `/exercises`, `/exercises/:muscle` | wie heute | – |
| `/settings` | Einstellungen | – |

`exerciseKey` = Datenbank-ID (`barbell_squat`) oder für eigene Übungen `custom:` + URL-kodierter, kleingeschriebener Name.

**Weiterleitungen (in `legacyRedirects` ergänzen):** `/diary` → `/calendar?view=list`; `/diary?plan=X` → `/calendar?view=list&plans=X`; `/diary/:id` → `/workouts/:id`. `routes.diaryForPlan` wird zu `routes.calendarForPlan`; nach dem Anlegen eines Plans geht es auf `/today` (dort ist das fällige Training des neuen Plans oben).

Seitenhierarchie (Zurück-Ziele): Übungs-Detail ← Auswertung oder Übungen oder Training; Muskel-Detail ← Auswertung oder Muskelkarte; Plan-Auswertung ← Plan-Detail. Der Zurück-Pfeil nutzt `navigate(-1)`, wenn es eine App-interne Vorseite gibt, sonst die Elternseite.

### 1.4 Lücken im Datenmodell

Für die Kennzahlen in Abschnitt 3 fehlen folgende Felder. Alle sind **optional** und rückwärtskompatibel; `WORKOUT_SCHEMA_VERSION` steigt auf 2, Version 1 wird beim Lesen ergänzt (wie `migratePlan`).

| Feld | Wo | Wofür | Priorität |
|---|---|---|---|
| `schedule.startDate`, `schedule.endDate?`, `schedule.daysPerWeek?` | Plan | Verpasste Tage, Termintreue, Planlaufzeit als Zeitraum | P1 |
| `isActive` (mehrere erlaubt, siehe Entscheidung unten) | Plan | Was der Kalender als „geplant“ zeigt | P1 |
| `version` | Plan | `plan.planVersion` im Training; zeigt „Plan wurde seitdem geändert“ | P2 |
| `kind: 'plan' \| 'free' \| 'activity'` | Training | Heute aus `plan === null` abgeleitet; „Andere Aktivität“ braucht ein eigenes Feld | P1 |
| `activity: { type, durationMinutes, distanceKm? }` | Training | Andere Aktivitäten (O17) | P2 |
| `startedAt`, `finishedAt` | Training | Dauer, Trainingszeit pro Woche | P2 |
| `feeling` (1–5) | Training | Verlauf Befinden | P3 |
| `rir` bzw. `rpe` (Ist) | Satz | Belastung, RIR-bereinigtes e1RM | P3 |
| `status: 'done' \| 'skipped' \| 'replaced' \| 'extra'`, `replacesEntryId` | Ausgeführte Übung | Ersetzt vs. zusätzlich (heute nur `skipped` und `plannedEntryId === null`) | P2 |
| `repetitions[]` | Satz | Pro-Wiederholung-Auswertung (O14) | P3 |
| `bodyweightKg` (Profil/Körperwerte mit Datum) | Profil | Volumen bei Körpergewichtsübungen | P3 |

**Entscheidungsbedarf O16:** Das Konzept legt „genau ein aktiver Plan“ fest, der Nutzer trainiert aber ausdrücklich **mehrere Pläne parallel** (Mobility zu Hause + Kraft im Studio). Empfehlung: **mehrere aktive Pläne zulassen.** Jeder aktive Plan erzeugt seine geplanten Tage im Kalender; zwei geplante Einheiten an einem Tag sind erlaubt. Wechsel alle drei Monate = alten Plan beenden (`endDate`), neuen aktivieren. Ohne diese Änderung zeigt der Kalender für den zweiten Plan nie „geplant“ oder „verpasst“.

**Muskeldaten zur Laufzeit, nicht im Training gespeichert.** Haupt- und Hilfsmuskeln werden bei der Auswertung aus der Übungsdatenbank gelesen (`libraryExercise(exerciseId)`), nicht ins Training kopiert. Vorteil: Korrekturen am Muskelmodell wirken auch rückwirkend und anatomisch richtig. Nachteil: Die Muskelkarte vergangener Wochen kann sich nach einer Datenkorrektur ändern; das ist gewollt und wird nicht angezeigt. Eigene Übungen (`exerciseId === null`) zählen nur für ihre Muskelgruppe (`exercise.muscle`).

### 1.5 Rechenaufwand und Speicher

**Rechenweg (verbindlich):** Alle Auswertungen laufen über eine **flache Satzliste**, die einmal pro Änderung der Trainings erzeugt wird:

```text
toSetRows(workouts) → SetRow[]
SetRow {
  workoutId, date, weekKey ('2026-W46'), monthKey ('2026-11'),
  planId | 'free', dayId | null, workoutStatus,           // vom Training
  exerciseRowId, exerciseKey, exerciseId | null, category,  // Übung
  groupOfEntry,                                             // exercise.muscle
  setIndex, type ('working' | 'warmup'), done (isSetDone),
  side: null | 'left' | 'right',                             // eine Zeile pro Seite
  weight, reps, seconds,
  planned: { dose, weight, rirTarget } | null, meetsTarget
}
```

- Satz pro Seite → **zwei Zeilen** mit `side`, aber `setIndex` gleich. Zähler für Sätze zählen `(exerciseRowId, setIndex)` **einmal** (siehe 3.2).
- Übersprungene Übungen (`skipped`) erzeugen Zeilen mit `done: false`, damit Plantreue sie als „geplant, nicht gemacht“ sieht.
- `toSetRows` wird in einem Hook `useSetRows(workouts)` mit `useMemo` auf die Referenz von `workouts` gecacht. Filter und Kennzahlen arbeiten auf den Zeilen; jede Kennzahl ist eine reine Funktion `(rows, options) → Ergebnis`.
- Größenordnung: 5 Jahre × 4 Trainings/Woche × 25 Sätze ≈ 26.000 Zeilen. Ein Durchlauf mit `reduce` dauert im Browser einstellige Millisekunden; keine Web-Worker, keine Vorab-Aggregation nötig. Prüfen mit einem Test, der 30.000 Zeilen erzeugt und alle Dashboard-Kennzahlen in < 100 ms (Node, CI) berechnet.
- Muskel-Zuordnung pro `exerciseId` wird einmal als Map vorberechnet (`muscleContributions(exerciseId)`, 3.3), nicht pro Satz.

**Speicher:**
- P2: Trainingsspeicher auf **IndexedDB** umstellen (Browser-API, keine Installation), gleiche Schnittstelle `list/create/update/remove/snapshot`. `snapshot()` ist bei IndexedDB nicht synchron → erster Render zeigt Ladezustand (Skelett) bis `list()` fertig ist. Bis dahin: Warnung in den Einstellungen ab 3 MB belegtem `localStorage` („Speicher fast voll – exportiere deine Daten“).
- **Export/Import** aller Daten als JSON-Datei (P2, Datenschutz und Sicherung).
- **Backend (Phase E, Supabase):** Tabelle `workouts` (Protokoll als `jsonb`, plus Spalten `date`, `plan_id`, `status`, `kind` für Abfragen). Die flache Tabelle `workout_sets` aus dem Konzept wird **nicht** als zweite Wahrheit gepflegt, sondern bei Bedarf als SQL-View über `jsonb_array_elements` erzeugt. Der Client lädt Trainings eines Zeitraums (`date >= from`) und rechnet mit denselben reinen Funktionen. Serverseitige Aggregation erst, wenn Ladezeiten messbar stören. Eigene Dashboards und Ziele als Tabellen `dashboards (user_id, data jsonb)` und `goals (user_id, data jsonb)` mit derselben Zeilenregel „nur eigene Daten“ wie `plans`.

---

## 2. Vergleich: Auswertungen in führenden Fitness-Apps

| App | Was sie zeigt | Übernehmen für GetFit! | Bewusst nicht übernehmen |
|---|---|---|---|
| **Hevy** | Sätze pro Muskelgruppe mit Zeitraum (30 Tage, 3 Monate, 1 Jahr, gesamt) und Raster Woche/Monat; Muskelverteilung als Diagramm und Körperfigur; Figur „letzte 7 Tage“; Volumen = Sätze × Wdh. × Gewicht; Bestleistungen: schwerstes Gewicht, bestes 1RM, bestes Satzvolumen, bestes Einheitsvolumen, dazu „Satz-Rekorde“ (schwerstes Gewicht je Wiederholungszahl), meiste Wdh. bei Körpergewicht, längste Zeit bei Halteübungen | Satzzählung pro Muskel als Hauptmaß, Zeitraum-Voreinstellungen, PR-Typen und Rekordtabelle je Wiederholungszahl | Monatsbericht als Teilen-Grafik (später) |
| **Strong** | Verlauf pro Übung (e1RM, Gewicht, Volumen), Rekorde | Übungs-Detail mit e1RM-Linie und Liste der Einheiten | – |
| **Fitbod** | Erholungskarte: pro Muskelgruppe 0–100 % Erholung, unter 50 % „ermüdet“, bis zu 7 Tage, Formel nicht öffentlich | Idee „wann zuletzt trainiert“ auf der Figur | **Erholungsprozente**: nicht belegbare Schätzung, widerspricht dem Anspruch „anatomisch und fachlich exakt“. Stattdessen sachlich „Tage seit letztem Training“ |
| **JEFIT** | BodyMap pro Training, Erholungsfigur, e1RM-Verlauf, Sätze pro Muskel und Woche, „Movement Balance“, Konsistenz-Kalender als Heatmap, Körpermaße | Bewegungs-Balance (bei uns: Gegenspieler-Paare aus `BALANCE_PAIRS`), Kalender-Heatmap | Punktwerte („Workout Score“) ohne erklärbare Formel |
| **Alpha Progression** | Rekorde nach jedem Training (Gewicht, Wdh., Volumen, e1RM, 10RM), Diagramme für Kraft, Volumen, Sätze pro Muskel, Trainings pro Woche; anpassbare Analyse | Abschluss-Zusammenfassung mit neuen Rekorden; anpassbares Dashboard | Automatische Volumensteuerung (später als Progressionsvorschlag) |
| **Strava** | Trainingsprotokoll mit Kreisgröße nach Umfang; Fitness & Frische (Belastung über Zeit); Relative Effort | Wochenzeilen im Kalender mit Umfang pro Tag | Fitness/Frische-Modell: braucht Herzfrequenz/Leistung, haben wir nicht |
| **Garmin Connect** | Trainingsstatus aus akuter Belastung, VO2max, HRV; Zustandslabels statt Kurven | Klare Status-Labels mit Text | Belastungsmodelle auf Sensordaten |
| **Apple Fitness** | Trends: letzte 90 Tage gegen letzte 365 Tage, Pfeil hoch/runter, Detail mit Jahresdiagramm | **Periodenvergleich** mit Pfeil + Text („mehr als vorher“) und Basislinie im Diagramm | – |
| **WHOOP** | Muskuläre Belastung aus Bewegungssensor, in Tagesbelastung 0–21 verrechnet | – | Zusammengesetzter Index ohne Sensor nicht seriös |

**Fachgrundlage für „Hilfsmuskel = 0,5 Satz“:** Die Meta-Regression von Pelland, Remmert, Robinson, Hinson, Zourdos (2024, SportRxiv) vergleicht indirekte Sätze als 1 („total“), 0,5 („fractional“) und 0 („direct“); die anteilige Zählung erklärte die Daten am besten und ist das Hauptmodell. Volumen zeigt abnehmenden Zusatznutzen. Konsequenz: GetFit! zählt Hilfsmuskeln mit 0,5 und zeigt einen Orientierungsbereich, keine Pflicht.

**e1RM:** Epley `w × (1 + r/30)` und Brzycki `w × 36 / (37 − r)` liegen bis ca. 10 Wdh. nahe beieinander (100 kg × 5: 116,7 vs. 112,5 kg); Brzycki wird über 10 Wdh. ungenau und ist bei r ≥ 37 nicht definiert. Entscheidung siehe 3.4.

Quellen:
- Hevy, Statistik erklärt: https://help.hevyapp.com/hc/en-us/articles/35702030346903-Hevy-Statistics-Explained-Track-Your-Training-Progress-and-Muscle-Growth
- Hevy, Sätze pro Muskelgruppe und Woche: https://www.hevyapp.com/features/sets-per-muscle-group-per-week/
- Hevy, Muskelgruppen-Diagramm: https://www.hevyapp.com/features/muscle-group-workout-chart/
- Hevy, Bestleistungen: https://help.hevyapp.com/hc/en-us/articles/35649367857175-Personal-Records-PRs-and-Set-Records-Explained-How-They-Work-in-the-Hevy-App
- Hevy, Satz-Rekorde vs. Bestleistungen: https://help.hevyapp.com/hc/en-us/articles/38279531346455-Set-Records-vs-Personal-Records
- Fitbod, Muskelerholung: https://help.fitbod.me/hc/en-us/articles/360006269014-Muscle-Recovery und https://fitbod.me/blog/muscle-recovery/
- JEFIT, BodyMap: https://www.jefit.com/blog/introducing-bodymap-a-smarter-way-to-visualize-your-training
- JEFIT, Trainingsanalyse: https://www.jefit.com/blog/jefit-training-analysis-guide
- Alpha Progression, App-Store-Beschreibung: https://apps.apple.com/app/id1462277793
- Strava, Fitness & Frische: https://support.strava.com/hc/en-us/articles/216918477-Fitness-Freshness
- Garmin, Trainingsstatus: https://www.garmin.com/en-US/blog/fitness/garmin-training-status-and-how-to-use-it/
- Apple, Trends in der Fitness-App: https://apple.co/36ggRsf
- WHOOP, Strength Trainer: https://www.whoop.com/us/en/thelocker/the-research-and-development-behind-strength-trainer/
- Pelland et al., Dose-Response-Meta-Regression (Preprint): https://sportrxiv.org/index.php/server/preprint/view/460
- e1RM-Formeln im Vergleich: https://fitnessvolt.com/rpe-training/compare/e1rm-formulas/
- WCAG 2.2, Farbe nicht als einziges Merkmal: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- W3C WAI, Komplexe Grafiken beschreiben: https://www.w3.org/WAI/tutorials/images/complex/

---

## 3. Kennzahlen, Formeln und Filter

### 3.1 Grundbegriffe

| Begriff | Definition |
|---|---|
| **Training** | Eintrag mit `status: 'done'`. Ausgefallene (`skipped`) zählen nie als Training. |
| **Gemachter Satz** | `isSetDone(set)`: Wiederholungen oder Sekunden eingetragen (bei Seiten: mindestens eine Seite). |
| **Arbeitssatz** | `type === 'working'`. Aufwärmsätze zählen **nirgends** mit, außer der Nutzer schaltet „Aufwärmsätze einbeziehen“ ein (nur für Volumen, Sätze, Wiederholungen). |
| **Zählbarer Satz** | Gemachter Arbeitssatz einer nicht übersprungenen Übung in einem Training. Grundlage fast aller Kennzahlen. |
| **Woche** | ISO-Woche, Montag bis Sonntag, lokale Kalendertage (`toDateKey`). Schlüssel `YYYY-Www`. |
| **Zeitraum** | Geschlossenes Intervall `[from, to]` aus Kalendertagen. „Laufende Woche“ ist unvollständig und wird markiert. |

### 3.2 Zählen bei Übungen pro Seite (verbindlich)

Ein Satz mit `sides` ist **ein Satz**, nicht zwei.
- **Sätze, effektive Sätze, Plantreue:** pro Satz einmal.
- **Volumen:** Summe beider Seiten (`Σ weight × reps` über links und rechts), denn beide Seiten haben die Arbeit geleistet. Das entspricht `volumeOf` im Code.
- **Wiederholungen gesamt:** Summe beider Seiten.
- **e1RM, Rekorde, Verlauf:** **pro Seite** getrennt; für Übersichten (Rekordliste, Dashboard) gilt der **schwächere** Seitenwert als Wert der Übung (`min(L, R)`), weil „beidseitig geschafft“ die ehrliche Aussage ist. Das Übungs-Detail zeigt beide Seiten.
- **Fehlt eine Seite** (nur links eingetragen): Satz zählt als gemacht, Seitenvergleich für diesen Satz entfällt (nicht als 0 werten).

### 3.3 Muskel-Zuordnung und effektive Sätze

**Beitrag einer Übung zu einem Muskel** (Blattmuskel aus `muscles.js`):
- Hauptmuskel (`muscles.primary`): **1,0**
- Hilfsmuskel (`muscles.secondary`): **0,5**
- Steht ein Muskel in beiden Listen (Datenfehler), gilt 1,0 (Test in `exerciseLibrary.test.js` sollte das ohnehin verhindern).

**Effektive Sätze eines Blattmuskels** im Zeitraum = Σ über zählbare Sätze von `beitrag(übung, muskel)`.

**Aggregation nach oben – Regel „Maximum pro Satz“** (verhindert Doppelzählung):
- **Ganzer Muskel** (z. B. `pectoralis_major` mit drei Teilen): pro Satz `max(beitrag)` über seine Teile, dann summieren. Langhantel-Bankdrücken (Brustbein-Rippen-Teil Haupt-, Schlüsselbein- und Bauchteil Hilfsmuskel) gibt dem großen Brustmuskel 1 Satz, nicht 2; der Trizeps (drei Köpfe als Hilfsmuskeln) bekommt 0,5, nicht 1,5.
- **Muskelgruppe** (chest, back, abs, shoulders, arms, legs): pro Satz `max(beitrag)` über alle Blattmuskeln der Gruppe. Kniebeuge: Beine 1, Rücken 0,5 (Rückenstrecker als Hilfsmuskel), Bauch 0,5 bei Langhantel-Kniebeuge.
- **Eigene Übung ohne Datenbank-ID:** Gruppe `exercise.muscle` mit 1,0; kein Blattmuskel. In Muskelansichten erscheint sie als Zeile „Eigene Übungen ohne Muskelangabe“ unter der Gruppe.
- **Balance-Paare:** pro Satz `max(beitrag)` über alle Muskeln einer Seite des Paares.

**Konsequenz für den Plan-Editor:** `weeklySetsByMuscle` (Gruppe über `entry.muscle`) und `planAnalysis.sum` (Summe über Teile) werden durch dieselbe Funktion `muscleSetContributions` ersetzt. Soll (Plan) und Ist (Training) sind dann direkt vergleichbar. Die Gruppenwerte im Plan-Editor ändern sich dadurch leicht (Hilfsmuskeln anderer Gruppen zählen 0,5 mit); das ist gewollt, Text unter dem Diagramm: „Hilfsmuskeln zählen halb.“

**Orientierungsbereich** (aus Konzept 3.7, unverändert): 10–20 effektive Sätze pro Muskelgruppe und Woche; unter 10 „wenig“, über 25 „sehr viel“ (`GUIDELINE_SETS`, `HIGH_SETS`). Für Einzelmuskeln **kein** Bereich (Studienlage bezieht sich auf Muskeln bzw. Gruppen grob); Einzelmuskeln zeigen nur Zahlen und „nicht trainiert“.

**Klassen für die Muskelkarte** (effektive Sätze pro Woche im Mittel des Zeitraums; 5 Stufen, sequentiell, jede Stufe zusätzlich mit Textwert im Tooltip und in der Liste):

| Stufe | Bereich (Sätze/Woche) | Text de / en |
|---|---|---|
| 0 | 0 | „nicht trainiert“ / „not trained“ |
| 1 | > 0 bis < 4 | „wenig“ / „low“ |
| 2 | 4 bis < 10 | „mittel“ / „moderate“ |
| 3 | 10 bis 20 | „im Bereich“ / „in range“ |
| 4 | > 20 | „hoch“ / „high“ |

Für Einzelmuskeln gelten dieselben Grenzen nur als Farbstufen der Karte, nicht als Bewertung (Tooltip zeigt nur die Zahl).

### 3.4 Kraftkennzahlen

| Kennzahl | Formel / Regel |
|---|---|
| **e1RM (geschätztes Maximum)** | **Epley:** `e1RM = w × (1 + r / 30)` für `1 ≤ r ≤ 12` und `w > 0`. Bei `r = 1` gilt `e1RM = w`. Bei `r > 12` **kein** e1RM (Schätzung unzuverlässig); Satz zählt trotzdem für Volumen und Rekord „meiste Wdh.“. Gerundet auf 0,5 kg für Anzeige, ungerundet für Vergleiche. Begründung Epley: verbreitet, linear, für alle r definiert, Abweichung zu Brzycki bis 10 Wdh. gering. |
| **e1RM einer Einheit** | Maximum über die zählbaren Arbeitssätze der Übung in diesem Training. |
| **Topsatz** | Satz mit dem höchsten Gewicht; bei Gleichstand der mit mehr Wdh. |
| **Volumen (Tonnage)** | `Σ weight × reps` über zählbare Sätze (Seiten summiert). `weight` leer oder 0 → 0. Label: „Volumen (kg × Wdh.)“ / „Volume (kg × reps)“. Nur innerhalb **einer Übung** oder als Gesamtsumme zeigen; **nicht** als Muskelvergleich (eine Beinpresse bewegt ein Vielfaches einer Seitheben-Last). |
| **Wiederholungen** | `Σ reps` (Seiten summiert). Hauptmaß für Körpergewichtsübungen. |
| **Haltezeit** | `Σ seconds`; Rekord = längster Einzelsatz. |
| **Satz-Rekorde (Tabelle)** | Für jede Wiederholungszahl 1–12: schwerstes Gewicht, mit Datum. |

**Bestleistungen (PR):** pro Übung (und bei Seitenübungen pro Seite) chronologisch über alle Trainings, **ohne Filter auf den Zeitraum** berechnet (ein PR bleibt ein PR, auch wenn der Zeitraum später enger gewählt wird). Typen:

| Typ | Wert | Gilt für |
|---|---|---|
| `heaviestWeight` | max `w` mit `r ≥ 1` | Übungen mit Gewicht |
| `bestE1rm` | max e1RM | Übungen mit Gewicht, r ≤ 12 |
| `bestSetVolume` | max `w × r` eines Satzes (bei Seiten: pro Seite) | mit Gewicht |
| `bestSessionVolume` | max Volumen der Übung in einem Training | mit Gewicht |
| `mostReps` | max `r` eines Satzes | ohne Gewicht (w leer/0) |
| `longestHold` | max `seconds` eines Satzes | Zeitübungen |

Regeln: Ein PR entsteht, wenn der Wert **echt größer** ist als alle früheren (Gleichstand ist kein PR). Die **erste** Einheit einer Übung setzt Startwerte, aber zeigt **keine** PR-Meldung („Erster Eintrag“). Mehrere PRs im selben Satz werden zusammengefasst angezeigt („Neues Maximum: Gewicht, e1RM“). Wird ein Training gelöscht oder geändert, werden PRs neu berechnet (keine gespeicherten PRs).

**Progression erfüllt** (Doppelte Progression, Konzept 3.6): Eine Übung ist „bereit für mehr Gewicht“, wenn in der letzten Einheit **alle** geplanten Arbeitssätze `reps ≥ dose.max` bei `weight ≥ planned.weight × 0,95` erreichen (bei Seiten beide Seiten). Anzeige nur, wenn die Übung eine Progressionsregel hat (P2).

### 3.5 Häufigkeit, Termintreue und Serien

| Kennzahl | Formel |
|---|---|
| **Trainings** | Anzahl Trainings (`done`) im Zeitraum. |
| **Trainingstage** | Anzahl verschiedener `date` mit mindestens einem Training. |
| **Trainings pro Woche** | Trainings / Anzahl **vollständiger** Wochen im Zeitraum; laufende Woche wird separat gezeigt. |
| **Geplante Einheiten** | Pro aktivem Plan im Zeitraum: bei festen Wochentagen jedes Datum `≥ startDate`, `≤ min(endDate, gestern)`, dessen Wochentag einem Tag des Plans entspricht; bei „Reihum“: `daysPerWeek` pro vollständiger Woche. Ohne `startDate`: Datum des ersten Trainings dieses Plans. |
| **Erledigte geplante Einheiten** | Feste Wochentage: geplanter Tag gilt als erledigt, wenn in **derselben ISO-Woche** ein Training mit demselben `planId` und `dayId` existiert (auch verschoben). Jedes Training deckt höchstens einen geplanten Tag ab. Reihum: `min(Trainings des Plans in der Woche, daysPerWeek)`. |
| **Termintreue** | Erledigte geplante Einheiten / geplante Einheiten (0–100 %). Name de „Termintreue“, en „Sessions on schedule“. |
| **Verpasst** | Geplante Einheit nicht erledigt **und** Woche abgeschlossen (bei festen Wochentagen: Datum < heute und keine Nachholung in derselben Woche bis heute; erst nach Wochenende endgültig). Ausdrücklich ausgefallene Einträge (`skipped`) zählen als verpasst **mit Grund**. |
| **Wochenserie** | Anzahl aufeinanderfolgender abgeschlossener Wochen (rückwärts ab letzter abgeschlossener Woche), in denen `Trainings ≥ Wochenziel`. Die laufende Woche **verlängert** die Serie, sobald das Ziel erreicht ist, **bricht** sie aber nie. Wochenziel = Ziel „x Trainings pro Woche“, sonst Summe der geplanten Einheiten pro Woche der aktiven Pläne, sonst 1. **Keine Tagesserie** (Ruhetage sind im Krafttraining gewollt). |
| **Längste Wochenserie** | Maximum über die gesamte Historie. |

### 3.6 Plantreue (Inhalt)

Aufbauend auf `meetsTarget` in `workoutLog.js` (unverändert: Wdh. ≥ `dose.min` bzw. Sekunden ≥ `dose.value`, Gewicht ≥ 95 % des geplanten; bei Seiten beide Seiten).

- **Plantreue eines Trainings** = erfüllte geplante Arbeitssätze / geplante Arbeitssätze (wie `workoutSummary.adherence`). Übersprungene Übungen zählen als geplant, nicht erfüllt. Zusätzliche Übungen/Sätze zählen nicht.
- **Plantreue über mehrere Trainings (Woche, Plan, Zeitraum)** = Σ erfüllte / Σ geplante Sätze (**gepoolt**, satzgewichtet), **nicht** Mittel der Prozentwerte. `DiaryPage` entsprechend umstellen.
- **Status eines Trainings:** `adherence ≥ 0,8` → „Nach Plan“, sonst „Mit Abweichungen“ (O15). Ohne Plan → „Anderes Training“.
- **„Mehr als geplant“** (Hinweis, kein Abzug): Satz erfüllt und `reps > dose.max` oder `weight > planned.weight × 1,05`.
- **Abweichungsarten pro Übung** (für Soll-Ist-Listen und „häufigste Abweichungen“): `skipped`, `fewerSets`, `repsBelow`, `weightBelow`, `extraSets`, `moreThanPlanned`, `extraExercise`, später `replaced`.

### 3.7 Balance

**Links/Rechts (Seitenübungen):**
- Pro Übung im Zeitraum, nur Sätze mit beiden Seiten: `L = Σ weight×reps links` (bei Gewicht 0: `Σ reps`, bei Zeitübungen: `Σ seconds`), `R` analog.
- **Seitenunterschied** = `(L − R) / max(L, R)` in %, Vorzeichen zeigt die stärkere Seite. Anzeige als Betrag mit Text: „Links 8 % mehr“.
- Hinweis ab **|Unterschied| ≥ 10 %** und mindestens 3 Sätzen mit beiden Seiten: „Deutlicher Seitenunterschied“. Unter 3 Sätzen: „zu wenig Daten“.

**Gegenspieler (Muskelpaare):** `BALANCE_PAIRS` mit effektiven Sätzen nach 3.3 (Maximum pro Satz je Seite). Verhältnis `kleiner / größer`; Hinweis wie im Plan-Editor ab Verhältnis < 0,5 und größerer Seite ≥ 4 Sätze pro Woche. Text ohne Wertung als „falsch“: „Hintere Schulter bekommt weniger als halb so viele Sätze wie die vordere.“

### 3.8 Muskelbelastung über Zeit

- **Matrix** Muskelgruppe (bzw. Muskel) × Woche mit effektiven Sätzen.
- **Tage seit letztem Training** pro Muskelgruppe/Muskel: Datum des letzten zählbaren Satzes mit Beitrag ≥ 0,5. Ersetzt Erholungsprozente (siehe Abschnitt 2).
- **Soll-Ist pro Muskelgruppe:** Soll = effektive Sätze pro Woche aus den gewählten aktiven Plänen (Summe über Pläne, `muscleSetContributions` auf Planvorgaben), Ist = Mittel pro vollständiger Woche im Zeitraum.

### 3.9 Filter

| Filter | Ebene | Werte | Standard | URL-Parameter |
|---|---|---|---|---|
| **Zeitraum** | Training | 4 Wochen, **12 Wochen**, 6 Monate, 1 Jahr, Gesamt, eigener Zeitraum; bei genau einem Plan zusätzlich „Planlaufzeit“ | 12 Wochen (bis heute) | `range=4w\|12w\|6m\|1y\|all\|plan` oder `from=2026-08-01&to=2026-10-31` |
| **Pläne** | Training | Mehrfachauswahl aller Pläne mit Trainings, dazu „Ohne Plan“ (`free`) und „Andere Aktivitäten“ (`activity`) | alle | `plans=id1,id2,free` |
| **Trainingstag** | Training | Tage des Plans; nur sichtbar bei genau **einem** Plan | alle | `day=dayId` |
| **Status** | Training | Nach Plan, Mit Abweichungen, Anderes Training | alle | `status=onPlan,deviated,other` |
| **Art** | Satz | Kraft (`strength`, `isometric`), Beweglichkeit (`mobility`, `stretch`, `yoga`, `pilates`), Ausdauer (`cardio`, `boxing`), Eigene | alle | `kind=strength,mobility` |
| **Muskelgruppe** | Satz | 6 Gruppen | alle | `group=legs` |
| **Muskel** | Satz | Blatt- oder ganzer Muskel; Auswahl gruppiert nach Gruppe, mit lateinischem Namen als Zusatz | alle | `muscle=gluteus_maximus` |
| **Übung** | Satz | Suchliste der Übungen mit Einträgen | alle | `exercise=barbell_squat` |
| **Aufwärmsätze einbeziehen** | Satz | an/aus | aus | `warmups=1` |

**Kombination:**
- Zwischen Filtern **UND**, innerhalb eines Filters **ODER**.
- Erst Trainingsfilter (Zeitraum, Plan, Tag, Status) → Menge der Trainings. Dann Satzfilter (Art, Gruppe, Muskel, Übung) → Menge der Satzzeilen.
- **Muskel-/Gruppenfilter** wählt Sätze von Übungen mit Beitrag > 0 zu diesem Muskel; Muskelkennzahlen zählen dann **nur** den Beitrag zu diesem Muskel; Satz- und Volumenzahlen zählen die gewählten Sätze voll und tragen den Hinweis „Sätze aller Übungen, die diesen Muskel trainieren“.
- **Gruppe und Muskel gleichzeitig:** Muskel muss in der Gruppe liegen; wählt man eine andere Gruppe, wird der Muskel entfernt (mit Live-Region-Hinweis).
- **Abhängige Auswahl** wie im Plan-Editor: Optionen zeigen Trefferzahl in Klammern; Optionen ohne Treffer werden ausgegraut (bleiben fokussierbar, `aria-disabled`).
- **Was welche Ansicht ignoriert** (sichtbar als Hinweis an der Karte „Filter X gilt hier nicht“): Kalender ignoriert Satzfilter (markiert aber Tage mit Treffern); Termintreue und Serie ignorieren Satz- und Statusfilter; Bestleistungen ignorieren den Zeitraum für die Berechnung, zeigen aber nur PRs, die im Zeitraum **entstanden** sind.
- **Zurücksetzen:** ein Knopf „Filter zurücksetzen“ setzt alles außer Zeitraum zurück.

### 3.10 Vergleiche

**Zeiträume:** Standard ist der **vorherige gleich lange Zeitraum** direkt davor (12 Wochen gegen die 12 Wochen davor). Jede Kennzahl-Kachel zeigt Differenz absolut und relativ als Text mit Pfeilsymbol: „▲ 14 % ggü. vorher“ / „▲ 14 % vs previous“. Relative Differenz nur, wenn der Vorwert > 0; sonst „neu“. Bei „Gesamt“ kein Vergleich. Kein Werturteil über Farbe allein (mehr Volumen ist nicht automatisch gut); Pfeil + Text reichen.

**Pläne:** bis zu **3 Pläne** nebeneinander. Weil Pläne unterschiedlich lange liefen, werden alle Werte **pro Woche Planlaufzeit** normiert (Planlaufzeit = erste bis letzte Woche mit Training des Plans bzw. `startDate`–`endDate`). Kennzahlen: Trainings/Woche, Termintreue, Plantreue, effektive Sätze/Woche pro Muskelgruppe, e1RM-Veränderung der gemeinsamen Übungen (Anfang→Ende in kg und %). Darstellung als kleine Mehrfachdiagramme (je Plan eine Zeile, gleiche Skala) oder gruppierte Balken mit direkter Beschriftung; immer mit Tabelle.

**Mehrere Pläne zusammen** (Mobility zu Hause + Kraft im Studio): Standardfall „alle Pläne“ addiert alles. Die Muskelkarte und Sätze pro Muskel enthalten beide Pläne; das Diagramm „Trainings pro Woche“ stapelt **nicht**, sondern zeigt Gesamtbalken und eine Tabelle pro Plan (Stapel sind schwer vergleichbar). Für die Aufteilung gibt es die Karte „Trainings nach Plan“ (horizontale Balken pro Plan, direkt beschriftet).

### 3.11 Welche Frage, welches Diagramm

| Frage | Diagramm | Achse / Kodierung | Interaktion |
|---|---|---|---|
| Wie oft trainiere ich? | Säulen pro Woche (bzw. Monat bei > 26 Wochen) | y: Trainings; Referenzlinie Wochenziel mit Beschriftung | Antippen einer Säule → Kalender dieser Woche |
| Halte ich meine Termine? | Säulen Termintreue % pro Woche, 0–100 % feste Skala | y: %; Linie bei 80 % beschriftet | Tooltip: „2 von 3 geplanten Einheiten“ |
| Halte ich die Vorgaben ein? | Säulen Plantreue % pro Woche | y: %; 80-%-Linie | Tooltip mit Satzzahlen |
| Welche Muskeln trainiere ich wie viel? | Muskelfigur (vorn/hinten) + horizontale Balken pro Gruppe, sortiert | x: effektive Sätze/Woche; Band 10–20 als Hintergrundbereich; Soll als senkrechter Strich („Bullet“) | Antippen → Muskel-Detail |
| Wie verteilt sich ein Muskel über die Wochen? | Säulen pro Woche | y: effektive Sätze | – |
| Welche Muskelgruppe in welcher Woche? | Heatmap Gruppe × Woche (Desktop), mobil: Liste mit Sparkline je Gruppe | Zellwert als Zahl in der Zelle, Farbe nur zusätzlich | Zelle → Muskel-Detail mit Zeitraum Woche |
| Werde ich stärker? | Linie e1RM pro Einheit (Punkte + Verbindungslinie) | y: kg, **nicht bei 0 beginnend** (Bereich min−5 % bis max+5 %), Hinweis „Achse beginnt bei X kg“ | Punkt → Training öffnen; PR-Punkte mit Stern-Marker |
| Wie viel bewege ich in einer Übung? | Säulen Volumen pro Einheit | y: kg × Wdh., ab 0 | – |
| Links gleich stark wie rechts? | Divergierende Balken um 0 pro Übung | x: Seitenunterschied % (−50…+50), Beschriftung „links stärker“/„rechts stärker“ an den Enden | – |
| Gegenspieler im Gleichgewicht? | Paarbalken (zwei Balken je Paar, gleiche Skala, direkt beschriftet) | x: effektive Sätze/Woche | – |
| Was wurde am häufigsten ausgelassen? | Sortierte horizontale Balken | x: Anzahl ausgelassener Sätze/Übungen | Balken → Übungs-Detail |
| Wann trainiere ich? | Kalender-Monat (Status) und Jahres-Raster (Trainings pro Tag, 0/1/2+) | Symbol + Text pro Tag | Tag → Tagesdetails |
| Wie viel andere Aktivität? | Horizontale Balken Minuten pro Aktivitätsart | x: Minuten | – |
| Erreiche ich mein Ziel? | Fortschrittsbalken (kein Ring), Text „7 von 12“ | 0–Zielwert | – |

Keine Torten- oder Ringdiagramme für Verteilungen (schlecht vergleichbar), keine 3D-Effekte, keine geglätteten Linien (täuschen Zwischenwerte vor). Lücken (Wochen ohne Training) sind Nullwerte bei Säulen und **Unterbrechungen** bei e1RM-Linien (keine Linie über Monate ohne Einheit, ab 4 Wochen Abstand Linie trennen).

### 3.12 Leere und dünne Datenlage

| Lage | Verhalten | Text de / en |
|---|---|---|
| Keine Trainings überhaupt | Auswertung zeigt nur Erklärung + Knopf | „Noch keine Trainings. Sobald du trainierst, siehst du hier deinen Fortschritt.“ / „No workouts yet. Once you train, your progress shows up here.“ · Knopf „Training starten“ / „Start a workout“ |
| Filter ohne Treffer | Karten bleiben, Inhalt ersetzt | „Keine Trainings für diese Filter.“ + „Filter zurücksetzen“ / „No workouts match these filters.“ + „Reset filters“ |
| < 2 Einheiten einer Übung | Kein Liniendiagramm, nur Werte | „Ab zwei Einheiten siehst du hier einen Verlauf.“ / „Log this exercise twice to see a trend.“ |
| < 3 vollständige Wochen | Wochen-Säulen ja, Mittelwerte und Vergleich nein | „Noch zu wenige Wochen für einen Durchschnitt.“ / „Not enough weeks for an average yet.“ |
| Kein Gewicht eingetragen | e1RM-Karte durch Wiederholungen bzw. Haltezeit ersetzen | „Ohne Gewicht zeigen wir Wiederholungen.“ / „Without weight we show reps.“ |
| Nur r > 12 | e1RM nicht berechnet | „Geschätztes Maximum erst bei bis zu 12 Wiederholungen.“ / „Estimated max needs 12 reps or fewer.“ |
| Plan ohne `startDate` | Termintreue ab erstem Training des Plans | Fußnote „gerechnet ab deinem ersten Training mit diesem Plan“ |
| Laufende Woche | Säule mit Muster/Umriss und Label „läuft“ | „läuft“ / „in progress“ |
| Eigene Übungen | In Muskelkarte nicht darstellbar | „3 Sätze aus eigenen Übungen nur in der Gruppe gezählt“ |

Ladezustand (ab IndexedDB/Backend): Skelett-Karten in Endgröße, `aria-busy="true"` am Bereich, kein Spinner über 300 ms ohne Text „Lädt …“.

---

## 4. Seiten im Detail

Allgemein für alle Auswertungsseiten:
- **Filterleiste** oben, mobil klebend (sticky) unter dem Seitentitel: Chip „Zeitraum: 12 Wochen ▾“, Chip „Pläne: alle ▾“, Knopf „Filter (2)“ öffnet ein Blatt (Bottom Sheet mobil, Seitenpanel Desktop) mit allen übrigen Filtern. Aktive Filter erscheinen als entfernbare Chips in einer horizontal scrollbaren Zeile (`role="list"`, jeder Chip `Filter Muskel: Gesäß entfernen` als Name).
- Änderungen wirken sofort (kein „Anwenden“), auf Mobil im Blatt mit Knopf „Fertig – 23 Trainings“ zum Schließen; die Trefferzahl steht in einer `aria-live="polite"`-Region.
- **Karten**: Titel (h2), optional Untertitel mit Zeitraum, Inhalt, Fußzeile mit „Als Tabelle“ (Umschalter, `aria-pressed`) und ggf. „Mehr“ (Link zur Detailseite). Mobil eine Spalte, 16 px Rand.
- Diagramme als SVG mit `role="img"` + `aria-labelledby` (Titel) + `aria-describedby` (Kurzfassung, automatisch aus den Daten erzeugt). Interaktive Punkte/Säulen sind Knöpfe in Tab-Reihenfolge nur, wenn sie eine Aktion haben; sonst reicht die Tabelle. Tooltip erscheint bei Hover **und** Fokus, schließt mit Esc, verdeckt den Wert nicht.
- Mindest-Trefferfläche 44 × 44 px; Säulen schmaler als 44 px bekommen eine unsichtbare, volle Spaltenhöhe als Trefferfläche.
- Bewegung: keine Einblend-Animationen bei `prefers-reduced-motion: reduce`.

### 4.1 Auswertung – Standard-Dashboard (`/analysis`)

Kopf: Titel „Auswertung“ / „Progress“, Reiter (Tabs, `role="tablist"`): „Übersicht“ · „Mein Dashboard“ · „Ziele“ / „Overview“ · „My dashboard“ · „Goals“. Rechts: Zahnrad (Einstellungen), auf Desktop zusätzlich „Vergleichen“.

Reihenfolge der Karten (mobil von oben nach unten; Desktop-Raster 12 Spalten, Angabe in Spalten):

| # | Karte | Inhalt | Desktop |
|---|---|---|---|
| 1 | **Kennzahlen** | 4 Kacheln: Trainings, Arbeitssätze, Volumen, Plantreue; je Wert, Einheit, Vergleich zum vorherigen Zeitraum (3.10). Mobil 2 × 2. | 12 (4 × 3) |
| 2 | **Wochenserie und Termintreue** | „6 Wochen in Folge“, längste Serie, Termintreue % mit „14 von 16 geplanten Einheiten“ | 4 |
| 3 | **Trainings pro Woche** | Säulen + Wochenziel-Linie | 8 |
| 4 | **Muskelkarte** | Figur vorn/hinten (Umschalter „Vorne/Hinten“, Desktop beide nebeneinander), Legende der 5 Stufen mit Text, darunter Liste der 6 Gruppen mit Zahl; tiefe Muskeln als Liste „Tiefe Muskeln (auf der Figur nicht sichtbar)“ | 6 |
| 5 | **Sätze pro Muskelgruppe** | Bullet-Balken: Ist pro Woche, Soll-Strich aus aktiven Plänen, Band 10–20 | 6 |
| 6 | **Neue Bestleistungen** | Liste der PRs im Zeitraum, neueste zuerst, max. 5: „Kniebeuge · e1RM 112,5 kg · 11.11.“, Link „Alle Übungen“ | 4 |
| 7 | **Plantreue pro Woche** | Säulen % mit 80-%-Linie; darunter „Am häufigsten ausgelassen“ (Top 3) | 8 |
| 8 | **Balance** | Höchstens 3 Hinweise (Seitenunterschiede, Gegenspieler), sonst „Keine Auffälligkeiten“ | 6 |
| 9 | **Übungen** | Top 5 Übungen nach Anzahl Einheiten mit Sparkline e1RM bzw. Wdh. und letzter Veränderung, Link zu allen | 6 |
| 10 | **Andere Aktivitäten** (nur wenn vorhanden) | Minuten pro Art | 6 |

Zustände: siehe 3.12. Erstes Training im Zeitraum < 3 → Karten 3, 5, 7 zeigen den Hinweis „noch zu wenige Wochen“, Kennzahlen bleiben.

Texte (Auswahl):

| Schlüssel | de | en |
|---|---|---|
| `analysis.title` | Auswertung | Progress |
| `analysis.kpi.workouts` | Trainings | Workouts |
| `analysis.kpi.sets` | Arbeitssätze | Working sets |
| `analysis.kpi.volume` | Volumen | Volume |
| `analysis.kpi.adherence` | Plantreue | Plan adherence |
| `analysis.kpi.vsPrevious` | {arrow} {percent} ggü. vorher | {arrow} {percent} vs previous |
| `analysis.streak` | {count} Wochen in Folge | {count} weeks in a row |
| `analysis.schedule` | {done} von {planned} geplanten Einheiten | {done} of {planned} planned sessions |
| `analysis.muscleMap.title` | Welche Muskeln du trainierst | Muscles you train |
| `analysis.groupSets.title` | Effektive Sätze pro Woche | Effective sets per week |
| `analysis.groupSets.note` | Hauptmuskel 1 Satz, Hilfsmuskel ½ Satz. Bereich 10–20 als Orientierung. | Primary muscle 1 set, secondary ½ set. 10–20 shown as a guide. |
| `analysis.prs.title` | Neue Bestleistungen | New personal records |
| `analysis.table.show` / `.hide` | Als Tabelle zeigen / Diagramm zeigen | Show as table / Show chart |

### 4.2 Plan-Auswertung (`/plans/:planId?tab=analysis`)

Kopf: Planname, Zeitplan („Mo, Do“ bzw. „Reihum, 3 × pro Woche“), Laufzeit („seit 01.09.2026“). Zeitraum-Standard: **Planlaufzeit**.

Abschnitte:
1. **Kennzahlen:** Trainings, Termintreue, Plantreue, Wochenserie dieses Plans.
2. **Soll und Ist pro Muskelgruppe:** Bullet-Balken (Ist-Balken, Soll-Strich). Text pro Gruppe für Screenreader: „Beine: Soll 14, Ist 11,5 Sätze pro Woche“.
3. **Pro Trainingstag:** Tabelle (auch mobil, horizontal nicht scrollend: Spalten Tag · Trainings · Plantreue · zuletzt) — Zeile antippen filtert die Seite auf diesen Tag.
4. **Pro Übung:** Liste aller Übungen des Plans: Plantreue %, häufigste Abweichung („Wdh. unter Vorgabe“), e1RM-Veränderung seit Planstart, „bereit für mehr Gewicht“ (P2).
5. **Plantreue pro Woche:** Säulen.
6. Knopf **„Mit anderem Plan vergleichen“** → `/analysis/compare?plans=<id>`.

Hinweis bei geändertem Plan (P2, `planVersion`): „Der Plan wurde am 20.10. geändert. Ältere Trainings werden mit den damaligen Vorgaben verglichen.“

### 4.3 Pläne vergleichen (`/analysis/compare`)

- Auswahl: bis zu 3 Pläne (Checkbox-Liste), Modus-Umschalter „Pläne“ / „Zeiträume“.
- Modus Pläne: Tabelle Kennzahl × Plan (pro Woche normiert, 3.10), darunter kleine Mehrfachdiagramme „Effektive Sätze pro Woche je Muskelgruppe“ (ein Balkendiagramm pro Plan, gleiche x-Skala, mobil untereinander), „Gemeinsame Übungen“ mit e1RM Anfang → Ende.
- Modus Zeiträume: zwei Zeiträume wählbar (Standard: aktueller und vorheriger); gleiche Tabelle mit Spalten A, B, Differenz.
- Mobil: Tabelle mit fester erster Spalte, maximal 3 Datenspalten → passt auf 390 px ohne horizontales Scrollen bei Schriftgröße vom Design; sonst Karten pro Kennzahl.

### 4.4 Übungs-Detail (`/analysis/exercises/:exerciseKey`)

Kopf: Name (Sprache), Kategorie, Haupt- und Hilfsmuskeln als Links zum Muskel-Detail, Link „Übung ansehen“ (Vorschau/Animation).

Abschnitte:
1. **Kennzahlen:** bestes e1RM, schwerstes Gewicht, Einheiten im Zeitraum, Veränderung e1RM erster → letzter Wert im Zeitraum.
2. **Verlauf:** Umschalter (Segmented Control) „Geschätztes Maximum · Schwerstes Gewicht · Volumen · Wiederholungen“; jede Auswahl ein eigenes Diagramm mit einer Achse. Bei Seitenübungen zwei Linien „Links“ (Kreis-Marker, durchgezogen) und „Rechts“ (Quadrat-Marker, gestrichelt), am Linienende beschriftet. Planvorgabe (Gewicht) optional als Stufenlinie „Vorgabe“ (Umschalter „Vorgabe zeigen“).
3. **Seitenvergleich** (nur Seitenübungen): Seitenunterschied % über Zeit als Säulen um 0 + Text.
4. **Bestleistungen:** Liste nach Typ (3.4) mit Datum; **Satz-Rekorde**: Tabelle Wdh. 1–12 × schwerstes Gewicht.
5. **Einheiten:** Liste neueste zuerst: Datum, Plan · Tag, Sätze kompakt („60 × 10, 60 × 9, 57,5 × 10“), Soll daneben, PR-Marker als Text „Rekord“. Antippen → Training.

Leer: „Diese Übung hast du noch nicht trainiert.“ / „You haven't logged this exercise yet.“ + Knopf „Zum Plan hinzufügen“.

### 4.5 Muskel-Detail (`/analysis/muscles/:muscleId`)

`muscleId` = Gruppe (`legs`) oder Muskel-ID (Blatt oder ganzer Muskel).

1. **Kopf:** deutscher und englischer Name nach Sprache, lateinischer Name klein darunter, Gruppe, „tief liegend“-Hinweis bei `view: 'deep'`. Figur-Ausschnitt mit hervorgehobenem Muskel (Grafik-Agent; Platzhalter 4.9).
2. **Kennzahlen:** effektive Sätze pro Woche (Mittel), letzte Woche, Tage seit letztem Training, Stufe (3.3).
3. **Verlauf:** Säulen effektive Sätze pro Woche (Gruppe: mit Band 10–20).
4. **Teile/Köpfe** (bei ganzem Muskel bzw. Gruppe): horizontale Balken pro Teil, z. B. Trizeps: langer, seitlicher, mittlerer Kopf. Text: „Der mittlere Kopf liegt tief und ist auf der Figur nicht sichtbar.“
5. **Welche Übungen beitragen:** sortierte Balken „Beitrag in Sätzen“ mit Kennzeichnung „Haupt“/„Hilfs“ als Text.
6. **Gegenspieler** (wenn in `BALANCE_PAIRS`): Paarbalken mit Partner.
7. **Übungen für diesen Muskel** (Link in die Übungsdatenbank, gefiltert).

### 4.6 Kalender (`/calendar`)

**Monatsansicht** (Woche beginnt Montag, Wochentagskürzel als Spaltenköpfe, `role="grid"` mit Pfeiltasten-Navigation, Bild auf/ab = Monat):

Status pro Tag (Konzept 5.1), **Priorität** bei mehreren Ereignissen am Tag: Nach Plan > Mit Abweichungen > Anderes Training > Verpasst > Geplant > Ruhetag. Mehrere Trainings: Hauptsymbol nach Priorität + Zahl „2“.

| Status | Symbol (Vorschlag an Design) | Kurztext in Zelle (Desktop) | Screenreader-Name der Zelle |
|---|---|---|---|
| Nach Plan | Haken | „Plan“ | „13. November, nach Plan: Tag A, 92 %“ |
| Mit Abweichungen | Haken mit Strich | „Abw.“ | „…, mit Abweichungen: Tag B, 64 %“ |
| Anderes Training | Kreis | „Anders“ | „…, anderes Training: Freies Training“ |
| Verpasst | Kreuz | „Verpasst“ | „…, verpasst: Tag A (Grund: krank)“ |
| Geplant | Umrisskreis | „Geplant“ | „…, geplant: Tag C“ |
| Ruhetag | – | – | „…, Ruhetag“ |
| Heute | zusätzlicher Rahmen | – | „heute“ vorangestellt |

Mobil sind Zellen nur Symbol + Tageszahl (Text würde nicht passen); **Legende** steht dauerhaft unter dem Monat (nicht ausklappbar). Desktop zeigt Symbol + Kurztext.

**Wochenspalte** rechts (Desktop) bzw. unter jeder Wochenzeile (mobil als kleiner Text): „2/3“ = erledigte/geplante Einheiten; bei Reihum-Plänen ist das die einzige Stelle für „verpasst“ (Konzept 5.3).

**Tagesdetails** (mobil: Blatt von unten bei Antippen; Desktop: rechte Spalte):
- Pro Training: Plan · Tag, Status mit Text, Plantreue, Sätze, Volumen, Notiz.
- **Soll-Ist-Tabelle** pro Übung: Spalten Satz · Soll · Ist · Ergebnis. Ergebnis als Text + Symbol: „erfüllt“, „mehr als geplant“, „Wdh. zu wenig“, „Gewicht zu niedrig“, „nicht gemacht“, „zusätzlich“. Seitenübungen: Ist als „L 20 × 10 · R 20 × 8“.
- Aktionen: „Training öffnen“, „Löschen“ (mit Bestätigung); leere vergangene Tage: „Training nachtragen“, geplante Tage: „Jetzt starten“ (nur heute) bzw. „Als ausgefallen eintragen“.

**Listenansicht** (`view=list`, ersetzt `DiaryPage`-Liste): Einträge gruppiert nach Woche mit Wochenkopf „KW 46 · 3 Trainings · 2/3 geplant“, Planfilter-Chips wie heute.

Filter: nur Pläne (und Monat). Kopf-Knöpfe: „‹ Oktober“, „November 2026“ (öffnet Monatsauswahl), „Dezember ›“, „Heute“.

**Jahresraster** (P2, Karte im Dashboard und Umschalter im Kalender): 53 Spalten × 7 Zeilen, Zelle = Tag, 3 Stufen (0, 1, 2+ Trainings) mit Muster + Tabelle als Alternative.

### 4.7 Eigenes Dashboard (`/analysis/my`, `/analysis/my/edit`)

**Ansicht:** wie Standard-Dashboard, aber die Karten aus der eigenen Liste. Leer: „Stell dir dein eigenes Dashboard zusammen.“ + „Dashboard anpassen“; Knopf „Mit Standard starten“ kopiert die Standardkarten.

**Bearbeiten** (eigene Seite, kein Drag-and-drop als einziger Weg):
- Liste der Karten mit je: Titel, Kurzbeschreibung der Einstellungen („Kniebeuge · e1RM · 6 Monate“), Knöpfe **„Nach oben“**, **„Nach unten“**, **„Bearbeiten“**, **„Duplizieren“**, **„Entfernen“** (mit Rückgängig-Hinweis 5 s, `role="status"`). Drag-and-drop zusätzlich auf Desktop erlaubt.
- „Karte hinzufügen“ → Katalog (gruppiert: Training, Kraft, Muskeln, Plan, Ziele), jede Karte mit Vorschau-Text.
- **Kartenkonfiguration:** Pflichtfelder je Kartentyp (z. B. Übung bei „Übungsverlauf“), Größe (mobil immer volle Breite; Desktop S = 4, M = 6, L = 12 Spalten), Filter: „Seitenfilter übernehmen“ (Standard) oder „eigene Filter festlegen“ (dann wirken globale Filter auf diese Karte nicht; die Karte zeigt ein Schloss-Symbol mit Text „eigene Filter“).
- Höchstens 12 Karten. „Auf Standard zurücksetzen“ mit Bestätigung.

**Kartenkatalog** (= auch Bausteine des Standard-Dashboards):

| Typ | Parameter |
|---|---|
| `kpis` | Auswahl von 1–4 Kennzahlen |
| `workoutsPerWeek` | – |
| `streak` | – |
| `scheduleAdherence` | – |
| `planAdherence` | – |
| `muscleMap` | Ansicht vorn/hinten/beide |
| `groupSets` | mit/ohne Soll |
| `muscleTrend` | Muskel oder Gruppe |
| `exerciseTrend` | Übung, Kennzahl (e1RM, Gewicht, Volumen, Wdh., Zeit) |
| `prs` | Anzahl |
| `balance` | Seiten / Gegenspieler / beide |
| `topSkipped` | – |
| `calendarMonth` | – |
| `yearGrid` | – |
| `activities` | – |
| `goal` | Ziel-ID |

**Speicherform** (lokal `localStorage` Schlüssel `dashboards`, später Tabelle `dashboards`):

```text
Dashboard { id, schemaVersion: 1, name, widgets: Widget[], updatedAt }
Widget    { id, type, size: 'S'|'M'|'L', params: {…}, filters: null | Filters }
Filters   { range, from?, to?, plans[], day?, status[], kind[], group?, muscle?, exercise?, warmups }
```

Unbekannte Typen (ältere/neuere Version) werden übersprungen und als „Diese Karte wird nicht mehr unterstützt“ angezeigt, nie stillschweigend gelöscht.

### 4.8 Ziele (`/analysis/goals`)

**Zieltypen:**

| Typ | Beispiel | Fortschritt |
|---|---|---|
| `workoutsPerWeek` | 3 Trainings pro Woche | laufende Woche: x von 3; Erfolg in % der Wochen seit Start |
| `scheduleAdherence` | Termintreue ≥ 90 % | gleitend über 4 Wochen |
| `planAdherence` | Plantreue ≥ 80 % | gleitend über 4 Wochen |
| `exerciseE1rm` | Bankdrücken e1RM 100 kg bis 31.03.2027 | aktueller Bestwert / Ziel; Startwert gespeichert |
| `exerciseWeight` | Kniebeuge 100 kg × 5 | schwerstes Gewicht bei ≥ 5 Wdh. |
| `groupSets` | Rücken ≥ 12 Sätze pro Woche | laufende Woche + Mittel 4 Wochen |
| `streak` | 12 Wochen in Folge | aktuelle Wochenserie |
| `bodyWeight` (Phase F) | 80 kg bis Juni | letzter Körperwert |

Felder: `{ id, type, params, target, startValue, startDate, deadline?, planIds?, status: 'active'|'achieved'|'expired'|'archived', achievedAt? }`. Status wird beim Anzeigen berechnet (reine Funktion), `achievedAt` beim ersten Erreichen gespeichert.

**Seite:** Liste aktiver Ziele (Titel, Fortschrittsbalken mit Text „82,5 von 100 kg (Start 70 kg)“, Termin „noch 19 Wochen“), darunter „Erreicht“ und „Archiv“. „Ziel hinzufügen“ → Assistent: 1. Typ wählen, 2. Parameter (Übung/Gruppe/Plan), 3. Zielwert mit Vorschlag (aktueller Wert + 5 % bzw. aktuelle Wochenzahl + 1), 4. optional Termin. Erreicht: Meldung im Training-Abschluss und auf „Heute“ (`role="status"`), keine Konfetti-Pflicht (Design entscheidet, mit `prefers-reduced-motion`).

Keine Prognose „voraussichtlich erreicht am …“ in P2 (lineare Fortschreibung von Kraftwerten ist irreführend); P3 prüfen.

### 4.9 Platzhalter für die Muskelfigur

Bis der Grafik-Agent liefert:
- Fläche im Seitenverhältnis der späteren Figur (vom Design), Inhalt: Text „Muskelfigur folgt“ + darunter die **vollständige Liste** der Gruppen bzw. Muskeln mit Stufe und Zahl. Die Liste ist ohnehin Pflicht (Alternative für Screenreader und für tiefe Muskeln).
- Schnittstelle für die Figur festlegen: Komponente `MuscleFigure` mit Props `{ view: 'front'|'back', values: { [muscleId]: level 0–4 }, selected?: muscleId, onSelect?(muscleId), sex: 'female'|'male' }`. Die SVG-Pfade tragen `data-muscle="<id>"` mit den IDs aus `muscles.js` (Blattmuskeln), damit die Entwicklung ohne Zuordnungstabelle einfärben kann. Muskeln mit `view: 'both'` erscheinen auf beiden Ansichten; `deep` nie auf der Figur, nur in der Liste.
- Jeder Muskel auf der Figur ist fokussierbar nur, wenn `onSelect` gesetzt ist; Name = „Großer Gesäßmuskel, 12 Sätze pro Woche, im Bereich“.

### 4.10 Heute (`/today`) – nur der Auswertungsanteil

- Karte „Diese Woche“: Trainings x von Ziel, Termintreue der Woche, Wochenserie; Link „Auswertung“.
- Karte „Ziele“: bis zu 3 aktive Ziele mit Balken.
- Karte „Zuletzt“: letzte Bestleistung(en) aus dem letzten Training.
- Fälliges Training: pro aktivem Plan eine Zeile „Heute: Tag A – Ganzkörper (Kraft im Studio)“ mit „Starten“; fertig erledigte: „Erledigt ✓ nach Plan“.

### 4.11 Trainings-Abschluss (Ergänzung für Schritt B/D)

Nach „Fertig“: Zusammenfassung mit Dauer (ab `startedAt`), Arbeitssätze, Volumen, Plantreue mit Status-Text, **neue Bestleistungen** (Liste nach Typ), betroffene Muskelgruppen (Figur klein + Liste). Knöpfe „Zum Kalender“, „Plan übernehmen?“ (Konzept 4.3).

---

## 5. Priorisierte Umsetzung (Backlog)

Alle Rechenfunktionen liegen in `src/utils/analysis/` (eine Datei pro Thema), sind rein (keine React-, Speicher- oder Datumszugriffe außer übergebenem `today`) und haben Vitest-Tests mit kleinen, handgebauten Trainings (Fabrik `makeWorkout({ date, plan, exercises })` in `src/utils/analysis/testing.js`).

### P1 – Grundlage, Kalender, Standard-Dashboard

**P1-1 Navigation und Routen umbauen**
- Leiste: Heute, Kalender, Pläne, Auswertung, Übungen mit sichtbarer Beschriftung; Sprache nach `/settings`.
- Neue Routen aus 1.3, Weiterleitungen `/diary*`.
- Abnahme: Alle alten Adressen führen zum neuen Ziel (Test in `App.test.jsx`); `aria-current` korrekt auf Unterseiten; Tastaturbedienung der Leiste; de/en-Texte vorhanden.

**P1-2 Planmodell: Zeitplan-Daten und mehrere aktive Pläne**
- `schedule.startDate`, `endDate`, `daysPerWeek`, `isActive` im Editor (Abschnitt „Zeitplan“), Migration setzt `startDate` = Datum des ersten Trainings des Plans bzw. heute, `isActive = true` für Pläne mit Training in den letzten 28 Tagen.
- Abnahme: Migration in `workoutPlan.test.js` getestet; zwei Pläne gleichzeitig aktiv möglich; Entscheidung O16 in Konzept 10 nachgetragen.

**P1-3 `toSetRows` und `useSetRows`** (`analysis/setRows.js`)
- Abnahme (Tests): eine Zeile pro Satz bzw. pro Seite; `done` = `isSetDone`; Seiten haben gleichen `setIndex`; übersprungene Übung → Zeilen mit `done: false`; `skipped`-Training → keine zählbaren Zeilen; Wochenschlüssel korrekt an Jahresgrenze (31.12.2026 = 2026-W53, 04.01.2027 = 2027-W01).

**P1-4 Muskelbeiträge** (`analysis/muscles.js`: `muscleContributions(exerciseId)`, `effectiveSets(rows, { level: 'leaf'|'whole'|'group' })`)
- Abnahme: Haupt 1 / Hilfs 0,5; `barbell_bench_press` gibt `pectoralis_major` (ganz) 1 Satz, nicht 2, und `triceps_brachii` 0,5, nicht 1,5; Gruppe = Maximum pro Satz; eigene Übung zählt nur Gruppe; Satz pro Seite zählt einmal; `planAnalysis` nutzt dieselbe Funktion und alle bestehenden Plan-Tests laufen (angepasste Erwartungen dokumentiert).

**P1-5 Filter** (`analysis/filters.js`: `parseFilters(searchParams)`, `filtersToSearch(filters)`, `filterWorkouts`, `filterRows`, `rangeOf(filters, today)`, `previousRange(range)`)
- Abnahme: UND zwischen, ODER innerhalb; Muskel außerhalb gewählter Gruppe wird entfernt; `range=12w` endet heute und beginnt Montag vor 11 Wochen; `previousRange` gleich lang direkt davor; Rundreise `parse(toSearch(x)) = x`; `filterWorkoutsByPlans` wird darauf umgestellt (inkl. `free`).

**P1-6 Kraftkennzahlen** (`analysis/strength.js`: `estimateOneRepMax(weight, reps)`, `sessionBest(rows)`, `volume(rows)`)
- Abnahme: 100 × 5 → 116,67; r = 1 → w; r = 13 → `null`; w = 0 oder leer → `null`; Volumen summiert Seiten; Aufwärmsätze nur mit `warmups`.

**P1-7 Bestleistungen** (`analysis/records.js`: `personalRecords(rows)` → Liste `{ exerciseKey, side, type, value, date, workoutId }`, `repRecords(rows, exerciseKey)`)
- Abnahme: erste Einheit erzeugt keinen PR; Gleichstand kein PR; Seiten getrennt; nach Löschen eines Trainings verschwindet der PR; `mostReps` nur ohne Gewicht; `longestHold` nur bei Sekunden.

**P1-8 Plantreue gepoolt und Termintreue** (`analysis/adherence.js`: `pooledAdherence(workouts)`, `scheduledSessions(plans, range, today)`, `scheduleAdherence(plans, workouts, range, today)`, `workoutStatus(workout)`)
- Abnahme: zwei Trainings mit 1/2 und 9/10 erfüllten Sätzen → gepoolt 10/12 ≈ 83 % (das Mittel der Prozente wäre 70 %); verschobenes Training in derselben Woche deckt den Plantag; Reihum mit `daysPerWeek` 3 und 4 Trainings → 3/3; Zeitraum vor `startDate` erzeugt nichts; `DiaryPage`/Kalender nutzen die gepoolte Rechnung.

**P1-9 Serie** (`analysis/consistency.js`: `weekStreak(workouts, weeklyTarget, today)`, `longestWeekStreak`)
- Abnahme: laufende Woche unter Ziel bricht nicht; laufende Woche über Ziel verlängert; Lücke einer Woche setzt auf 0; Jahreswechsel korrekt.

**P1-10 Kalender** (`analysis/calendar.js`: `calendarMonth(plans, workouts, month, today)` → Tage mit `status`, `workouts`, `planned`; Seite `/calendar` mit Monat, Legende, Tagesdetails Soll-Ist, Listenansicht)
- Abnahme: Status-Priorität laut 4.6; Verpasst erst nach Wochenende; mehrere Trainings am Tag; Grid mit Pfeiltasten; jede Zelle hat sprechenden Namen; Status nie nur über Farbe (Symbol + Legende); Liste ersetzt Tagebuch-Liste.

**P1-11 Standard-Dashboard** (`/analysis`, Karten 1–7 aus 4.1, Filterleiste, Tabellen-Alternative)
- Abnahme: alle Karten mit Leer- und Wenig-Daten-Zustand (3.12); Filter in der URL; Vergleich zum vorherigen Zeitraum; jede Grafik mit „Als Tabelle“; bei 390 px kein horizontales Scrollen; Figur-Platzhalter mit vollständiger Liste; 30.000-Zeilen-Leistungstest < 100 ms.

**P1-12 Übungs-Detail** (`/analysis/exercises/:exerciseKey`)
- Abnahme: e1RM-Linie mit beschrifteter Achsenuntergrenze; Seitenübungen zwei Linien mit unterschiedlichen Markern und Direktbeschriftung; Satz-Rekorde 1–12; Einheitenliste mit Soll; Link aus Übungsdatenbank und aus dem Training.

### P2 – Tiefe Analysen, Ziele, Speicher

**P2-1 Plan-Auswertung** (`/plans/:planId?tab=analysis`, 4.2) — Abnahme: Soll-Ist pro Gruppe aus derselben Muskelfunktion; Tabelle pro Trainingstag filtert; häufigste Abweichungen (`analysis/deviations.js: deviationsByExercise(rows)`) getestet.

**P2-2 Vergleich Pläne/Zeiträume** (`/analysis/compare`, `analysis/compare.js: comparePlans(rows, plans)`, `comparePeriods(rows, a, b)`) — Abnahme: Normierung pro Woche Planlaufzeit; max. 3 Pläne; Tabelle mobil ohne horizontales Scrollen.

**P2-3 Muskel-Detail und Muskelkarte mit Figur** (4.5, 4.9, `analysis/muscles.js: muscleLevels`, `daysSinceTrained`) — Abnahme: Stufen-Grenzen getestet (0, 3,9, 4, 10, 20, 20,1); tiefe Muskeln nur in Liste; Figur über `data-muscle`, sobald Grafik geliefert.

**P2-4 Balance** (`analysis/balance.js: sideBalance(rows)`, `antagonistBalance(rows)`) — Abnahme: Seitenunterschied-Formel, Mindestens-3-Sätze-Regel, Hinweis ab 10 %; Paare nutzen Maximum pro Satz.

**P2-5 Ziele** (4.8, `analysis/goals.js: goalProgress(goal, data, today)`) — Abnahme: jeder Zieltyp mit Test für aktiv/erreicht/abgelaufen; `achievedAt` wird einmal gesetzt; Karte auf „Heute“.

**P2-6 Trainingsmodell Version 2** (`kind`, `startedAt/finishedAt`, `status` pro Übung, `activity`, `planVersion`) — Abnahme: Migration v1→v2 ohne Datenverlust (Test); Dauer in Kennzahlen; andere Aktivitäten in eigener Karte.

**P2-7 IndexedDB-Speicher, Export/Import** — Abnahme: gleiche Schnittstelle, bestehende `localStorage`-Daten werden einmalig übernommen; Export erzeugt JSON mit Plänen, Trainings, Zielen, Dashboards; Import prüft `schemaVersion`.

**P2-8 Jahresraster und Progressionsvorschlag** — Abnahme: Raster mit 3 Stufen + Tabelle; „bereit für mehr Gewicht“ nach Regel 3.4 getestet.

### P3 – Eigenes Dashboard und Erweiterungen

**P3-1 Eigenes Dashboard** (4.7, `analysis/dashboard.js: defaultDashboard()`, `migrateDashboard`, `addWidget/moveWidget/removeWidget`) — Abnahme: Bedienung vollständig ohne Drag-and-drop; Karte mit eigenen Filtern ignoriert Seitenfilter; unbekannte Kartentypen bleiben erhalten; max. 12 Karten.

**P3-2 Pro-Wiederholung-Auswertung** (O14) — Anteil „mit Hilfe“/„Teilwdh.“ pro Übung.

**P3-3 RIR/RPE und RIR-bereinigtes e1RM** (`w × (1 + (r + rir) / 30)`), Befinden-Verlauf.

**P3-4 Körpergewicht und Körpergewichts-Volumen**, Apple-Health-Export-Import (Phase F).

**P3-5 Konto-Synchronisation** (Phase E) für Trainings, Ziele, Dashboards mit denselben reinen Funktionen.

---

## 6. Offene Entscheidungen für den Nutzer

| Nr. | Frage | Empfehlung |
|---|---|---|
| A1 | Mehrere aktive Pläne gleichzeitig (ändert O16)? | Ja (1.4) |
| A2 | Bereich in der Leiste „Auswertung“ (en „Progress“)? | Ja |
| A3 | e1RM-Formel Epley, Grenze 12 Wdh.? | Ja |
| A4 | Seitenübungen in Übersichten mit dem schwächeren Seitenwert? | Ja |
| A5 | Keine Erholungsprozente, stattdessen „Tage seit letztem Training“? | Ja |

---

## Kanban-Aufgaben

- [P1] Navigation und Routen umbauen – fünf beschriftete Bereiche, Sprache in Einstellungen, alle /diary-Adressen leiten korrekt weiter (Test)
- [P1] Zeitplan-Daten und mehrere aktive Pläne – startDate/endDate/daysPerWeek/isActive im Editor, Migration getestet, O16 aktualisiert
- [P1] Flache Satzliste toSetRows/useSetRows – eine Zeile pro Satz bzw. Seite, Wochenschlüssel an Jahresgrenze korrekt (Tests)
- [P1] Muskelbeiträge und effektive Sätze – Haupt 1, Hilfs 0,5, Maximum pro Satz für Ganzes/Gruppe, Plan-Editor nutzt dieselbe Funktion
- [P1] Analyse-Filter mit URL-Parametern – UND/ODER-Regeln, Rundreise parse/toSearch, previousRange gleich lang (Tests)
- [P1] Kraftkennzahlen e1RM und Volumen – Epley bis 12 Wdh., null bei r>12 oder ohne Gewicht, Seiten summiert (Tests)
- [P1] Bestleistungen und Satz-Rekorde – kein PR bei erster Einheit oder Gleichstand, Seiten getrennt, Neuberechnung nach Löschen (Tests)
- [P1] Plantreue gepoolt und Termintreue – satzgewichtet statt Mittel der Prozente, verschobene Trainings decken Plantag (Tests)
- [P1] Wochenserie – laufende Woche bricht Serie nie, Lücke setzt auf 0 (Tests)
- [P1] Kalender mit Status und Soll-Ist – Status mit Symbol und Text, Priorität laut Spezifikation, Pfeiltasten-Grid, Liste ersetzt Tagebuch
- [P1] Standard-Dashboard /analysis – Karten 1–7 mit Leerzuständen, Tabellen-Alternative, Periodenvergleich, kein Querscrollen bei 390 px
- [P1] Übungs-Detail mit Verlauf – e1RM-Linie, Seitenlinien mit Markern und Direktbeschriftung, Satz-Rekorde 1–12, Einheitenliste
- [P2] Plan-Auswertung – Soll-Ist pro Muskelgruppe, Tabelle pro Trainingstag, häufigste Abweichungen getestet
- [P2] Pläne und Zeiträume vergleichen – Werte pro Woche Planlaufzeit normiert, max. 3 Pläne, Tabelle mobil ohne Querscrollen
- [P2] Muskel-Detail und Muskelkarte – fünf Stufen mit Text, tiefe Muskeln nur in Liste, Figur über data-muscle angebunden
- [P2] Balance links/rechts und Gegenspieler – Seitenunterschied ab 10 % bei mind. 3 Sätzen, Paare ohne Doppelzählung (Tests)
- [P2] Ziele – alle Zieltypen mit Status aktiv/erreicht/abgelaufen getestet, Karte auf Heute
- [P2] Trainingsmodell Version 2 – kind, Start/Ende, Übungsstatus, Aktivitäten, planVersion; Migration ohne Datenverlust
- [P2] IndexedDB-Speicher und Export/Import – gleiche Store-Schnittstelle, Übernahme aus localStorage, Export als JSON
- [P2] Jahresraster und Progressionsvorschlag – drei Stufen mit Tabelle, Regel „bereit für mehr Gewicht“ getestet
- [P3] Eigenes Dashboard – Karten ohne Drag-and-drop sortierbar, eigene Filter pro Karte, max. 12, unbekannte Typen bleiben
- [P3] Auswertung pro Wiederholung – Anteil mit Hilfe/Teilwiederholung pro Übung
- [P3] RIR/RPE und RIR-bereinigtes e1RM – Formel getestet, Befinden-Verlauf
- [P3] Körpergewicht und Apple-Health-Import – Körperwerte mit Datum, Volumen bei Körpergewichtsübungen
- [P3] Konto-Synchronisation für Trainings, Ziele, Dashboards – gleiche reine Funktionen, nur eigene Daten sichtbar
