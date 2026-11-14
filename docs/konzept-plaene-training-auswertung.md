# GetFit! – Konzept: Pläne, Training, Kalender und Auswertung

Stand: 13.11.2026 (Schritt A umgesetzt). Ersetzt die bisherigen Vorschläge zu Plänen und Tracking im [Gesamtkonzept](gesamtkonzept.md). Alles mit **Vorschlag** ist noch nicht entschieden; offene Fragen stehen in Abschnitt 10.

## 1. Was der Nutzer will

- Pläne einfacher und besser zusammenstellen.
- Alles muss später **ausgewertet** werden können.
- Ein **Kalender** zeigt pro Tag: Wurde trainiert? Wurde der Plan befolgt, oder wurde etwas anderes gemacht?
- Abweichungen müssen sichtbar sein: andere Übungen, andere Sätze, andere Gewichte, andere Wiederholungen, **pro Satz** und auch **pro Wiederholung**.

Daraus folgt der Grundsatz dieses Konzepts: **Soll und Ist werden getrennt gespeichert.** Der Plan ist das Soll. Jedes Training ist ein eigenes Protokoll (das Ist), das sich auf den Plan bezieht, aber eine Kopie der damaligen Vorgaben enthält. Nur so lässt sich später vergleichen, auch wenn der Plan inzwischen geändert wurde.

## 2. Begriffe

| Begriff | Bedeutung | Beispiel |
|---|---|---|
| **Plan** | Ein Trainingsprogramm mit Zeitplan | „Ganzkörper 3 Tage“ |
| **Trainingstag** | Eine Einheit des Plans, mit Namen, optional an einen Wochentag gebunden | „Tag A – Ganzkörper“ |
| **Übungseintrag** | Eine Übung an einem Trainingstag mit Vorgaben pro Satz | Bankdrücken, 4 Sätze |
| **Satzvorgabe** | Soll für einen Satz | 8–12 Wdh., 60 kg, 2 Wdh. Reserve, 90 s Pause |
| **Training** (Einheit) | Das tatsächlich absolvierte Training an einem Datum | Di, 28.10., 18:05–19:10 |
| **Ausgeführte Übung** | Eine Übung im Training, mit oder ohne Bezug zum Plan | Bankdrücken (laut Plan) |
| **Satz** | Ist-Werte eines Satzes | 60 kg × 10, Reserve 2 |
| **Wiederholung** | Optionale Einzelangaben innerhalb eines Satzes | Wdh. 9 und 10 mit Hilfe |
| **Andere Aktivität** | Training außerhalb von Kraftübungen | Laufen 40 min, Fußball |

## 3. Pläne zusammenstellen (neuer Ablauf)

Grundlage: Recherche bei Hevy, Boostcamp, Fitbod und weiteren Apps (Quellen am Ende). Übernommen wird, was in fast allen Apps gleich ist und zu unseren Daten passt.

### 3.1 Start
**Leerer Plan** oder **Vorlage** wählen (23 Vorlagen; Ort in der App ist offene Frage O8). Eine Vorlage wird als Kopie übernommen und ist danach frei änderbar.

### 3.2 Zeitplan des Plans
| Art | Bedeutung | Kalender |
|---|---|---|
| **Feste Wochentage** | Tag A montags, Tag B donnerstags | Jeder Wochentag zeigt, was geplant ist |
| **Reihum** | Tage A → B → C der Reihe nach, an z. B. 3 Tagen pro Woche | Der Kalender zeigt „nächstes Training: Tag B“; welcher Tag fällig ist, ergibt sich aus dem letzten Training |

Dazu: **Startdatum** und optional **Enddatum** bzw. Dauer in Wochen. Ein Plan kann **aktiv** sein; der aktive Plan bestimmt, was der Kalender als geplant zeigt. Vorschlag: genau ein aktiver Plan zur Zeit.

### 3.3 Trainingstage
- Benannte Tage statt fester Wochentage („Tag A – Oberkörper“). Wochentag optional (nur bei „Feste Wochentage“).
- Tage hinzufügen, umbenennen, **duplizieren**, umsortieren, löschen.
- Bearbeitet wird **ein Tag nach dem anderen** (Umschalter zwischen den Tagen), nicht alle Formulare untereinander.

### 3.4 Übungen hinzufügen
- **Übungsauswahl als Suchliste** mit Filter-Chips: Muskelgruppe, Gerät, Kategorie (Kraft, Dehnen, Cardio …). Später zusätzlich Auswahl über die Körperkarte, sobald die Figuren fertig sind.
- Antippen fügt die Übung mit **Startwerten** hinzu: 3 Sätze, 8–12 Wiederholungen, 90 s Pause; bei Halte- und Zeitübungen 30 s. Der Muskel kommt aus der Übungsdatenbank und muss nicht mehr vorher gewählt werden.
- **Eigene Übung** bleibt möglich (Freitext plus Muskelgruppe).
- Übungen **umsortieren** (Hoch/Runter-Buttons, bedienbar per Tastatur und Screenreader), **duplizieren**, **ersetzen**, auf einen anderen Tag **verschieben**, **Notiz** pro Übung.

### 3.5 Vorgaben pro Satz
- Standard: alle Sätze gleich, in einer Zeile bearbeitbar („4 × 8–12, 60 kg, 90 s“).
- Aufklappbar: **jeder Satz einzeln** (z. B. Pyramide 12/10/8, steigendes Gewicht, Aufwärmsätze).
- Satzarten: **Aufwärmen**, **Arbeitssatz**, später **Dropsatz** und **bis Muskelversagen**.
- Pro Satz: Wiederholungsbereich **oder** Dauer, Gewicht (optional), Wiederholungen in Reserve (optional), Pause.
- Später: **Supersätze** (zwei oder mehr Übungen abwechselnd).

### 3.6 Progression (Vorschlag, ab Tracking)
Pro Übungseintrag eine einfache Regel, zuerst nur eine Art: **Doppelte Progression**. Sind in allen Arbeitssätzen die oberen Wiederholungen erreicht, schlägt die App beim nächsten Mal mehr Gewicht vor (Schritt einstellbar, z. B. +2,5 kg). Die Vorlagen enthalten diese Regel bereits als Text.

### 3.7 Rückmeldung beim Zusammenstellen
- **Wochenübersicht:** Arbeitssätze pro Muskelgruppe und Woche. Studien-Zusammenfassungen nennen grob 10 oder mehr Sätze pro Muskel und Woche als Orientierung für Muskelaufbau; die Verteilung auf mehrere Tage ist zweitrangig. Die App zeigt nur Zahlen und einen dezenten Hinweis, keine Vorschrift.
- **Entwurf automatisch speichern**, damit nichts verloren geht.

## 4. Training protokollieren

### 4.1 Einstieg
- **Heute:** Der Kalender bzw. die Startseite zeigt das fällige Training („Heute: Tag B“). Ein Tipp startet es.
- **Anderen Tag des Plans** wählen (wenn man tauscht).
- **Freies Training** ohne Plan.
- **Andere Aktivität** (Laufen, Radfahren, Fußball, Yoga-Kurs …): Art, Dauer, optional Distanz und Notiz.
- **Nachtragen** für ein vergangenes Datum.

### 4.2 Während des Trainings
- Die Übungen des Trainingstags stehen da, mit den **Vorgaben** und den **Werten vom letzten Mal**.
- Pro Satz: Gewicht, Wiederholungen bzw. Zeit, optional Reserve oder Anstrengung (RPE), dann **abhaken**. Vorgabewerte sind vorausgefüllt, ein Tipp übernimmt sie.
- Abweichen ist jederzeit möglich: Satz hinzufügen oder weglassen, Übung **überspringen**, **ersetzen** oder **zusätzlich** hinzufügen, Reihenfolge ändern.
- **Pro Wiederholung (optional):** Ein Satz kann aufgeklappt werden, um einzelne Wiederholungen zu markieren, z. B. „mit Hilfe“, „Teilwiederholung“, „Gewicht geändert ab Wdh. 6“. Wer das nicht braucht, sieht es nicht. (Genaue Bedeutung: offene Frage O14.)
- Pausen-Timer nach jedem Satz (Vorschlag, später).
- Notiz zum Training, optional Gefühl (z. B. 1–5).

### 4.3 Abschluss
- Zusammenfassung: Dauer, Sätze, Volumen, neue Bestleistungen.
- Frage, ob Änderungen in den Plan übernommen werden sollen (z. B. neues Gewicht als Vorgabe), wie bei Hevy. Standard: Plan bleibt unverändert.

## 5. Kalender

### 5.1 Ansicht
Monatsansicht (Woche beginnt Montag), daneben bzw. darunter die Details des gewählten Tags. Pro Tag ein Status, **nicht nur über Farbe**, sondern zusätzlich mit Symbol und Text:

| Status | Bedeutung |
|---|---|
| **Nach Plan** | Training zum geplanten Trainingstag, Plantreue hoch (Schwelle siehe 6.2) |
| **Mit Abweichungen** | Training zum Plan, aber Übungen, Sätze, Gewichte oder Wiederholungen weichen deutlich ab |
| **Anderes Training** | Freies Training, anderer Plan oder andere Aktivität |
| **Verpasst** | Geplanter Tag in der Vergangenheit ohne Training |
| **Geplant** | Geplanter Tag heute oder in der Zukunft |
| **Ruhetag** | Kein Training geplant und keins gemacht |

Mehrere Trainings an einem Tag sind möglich und werden alle gezeigt.

### 5.2 Tagesdetails
- **Soll-Ist-Vergleich** pro Übung und pro Satz: Vorgabe neben tatsächlichem Wert, Abweichungen markiert (mehr, weniger, anderes Gewicht, übersprungen, ersetzt, zusätzlich).
- Notiz, Dauer, Gefühl.
- Aktionen: Training öffnen, bearbeiten, löschen; für leere Tage „Training nachtragen“.

### 5.3 Bei „Reihum“-Plänen
Ohne feste Wochentage gibt es keinen festen Soll-Tag. Vorschlag: Der Kalender zeigt geplante Trainings pro Woche (z. B. „2 von 3“), und „Verpasst“ gibt es nur auf Wochenebene.

## 6. Auswertung

### 6.1 Was aus den Daten möglich wird
| Auswertung | Grundlage |
|---|---|
| Trainingshäufigkeit, Serien, Kalender | Trainings mit Datum |
| **Plantreue** pro Training, Woche, Plan | Soll-Ist-Vergleich (6.2) |
| Volumen (Sätze × Wdh. × Gewicht) pro Woche, Muskelgruppe, Übung | Ist-Sätze, Muskeln aus der Übungsdatenbank |
| Sätze pro Muskelgruppe und Woche | Ist-Sätze |
| Muskelkarte | Volumen pro Muskel auf der Figur |
| Verlauf pro Übung | Gewicht, Wiederholungen, geschätztes Maximum (z. B. Epley-Formel) |
| Bestleistungen | schwerster Satz, meiste Wiederholungen, bestes geschätztes Maximum |
| Progression erfüllt | Regel aus 3.6 |
| Andere Aktivitäten | Dauer und Anzahl pro Art |

**Filter:** Zeitraum, Plan, Trainingstag, Muskelgruppe, Übung, Kategorie, Status (nach Plan / Abweichung / anders).

### 6.2 Plantreue (Vorschlag)
Pro Training wird jede geplante Übung bewertet:

| Fall | Bewertung |
|---|---|
| Alle geplanten Arbeitssätze gemacht, Wiederholungen im Bereich, Gewicht ±5 % bzw. wie vorgegeben | erfüllt |
| Weniger Sätze, Wiederholungen außerhalb des Bereichs oder anderes Gewicht | teilweise (Anteil der erfüllten Sätze) |
| Übung ersetzt | teilweise, als „ersetzt“ markiert |
| Übung übersprungen | nicht erfüllt |
| Zusätzliche Übung | zählt nicht gegen die Plantreue, wird aber gezeigt |

Plantreue des Trainings = Durchschnitt über die geplanten Übungen, in Prozent. Vorschlag: ab 80 % „Nach Plan“, darunter „Mit Abweichungen“. Schwellen sind einstellbar bzw. offene Frage O15. Mehr Wiederholungen oder Gewicht als geplant gelten als erfüllt, werden aber als „mehr als geplant“ gezeigt.

### 6.3 Dashboard und Ziele
Wie im Gesamtkonzept: Standard-Dashboard und eigenes Dashboard aus wählbaren Elementen (z. B. Kalender-Monat, Plantreue der Woche, Volumen pro Muskelgruppe, Verlauf einer Übung). Ziele z. B. „3 Trainings pro Woche“, „Plantreue 90 %“, „Bankdrücken 100 kg“.

## 7. Datenmodell

### 7.1 Plan (Planmodell 3)
Änderungen gegenüber Planmodell 2: benannte Tage mit optionalem Wochentag, Zeitplan, Vorgaben **pro Satz**, Reihenfolge, Notizen, Versionsnummer.

```text
Plan
  id, schemaVersion: 3, name, description, template?, hints?
  schedule: { type: 'weekdays' | 'rotation', startDate, endDate?, daysPerWeek? }
  isActive, version            // version steigt bei jeder Änderung
  days[]: Trainingstag
    id, name, weekday?, note?
    entries[]: Übungseintrag (Reihenfolge = Position)
      id, exerciseId | null, exercise (Freitext), muscle, note?
      restSeconds?, progression?: { type: 'double', step }
      sets[]: Satzvorgabe
        type: 'warmup' | 'working' | 'drop' | 'failure'
        dose: { unit: 'repetitions', min, max } | { unit: 'seconds', value }
        weight?, rirTarget?
```

**Übernahme alter Pläne:** Jeder Tag bekommt als Namen den Wochentag und behält ihn als festen Wochentag; Zeitplan „Feste Wochentage“. Aus „4 Sätze, 8–12“ werden 4 gleiche Satzvorgaben. Nichts geht verloren.

### 7.2 Training (Protokoll)
```text
Training
  id, date (Kalendertag), startedAt?, finishedAt?
  kind: 'plan' | 'free' | 'activity'
  plan?: { planId, planVersion, dayId, dayName }   // Bezug zum Soll
  activity?: { type, durationMinutes, distanceKm?, note? }
  note?, feeling?
  exercises[]: Ausgeführte Übung
    id, exerciseId | null, exercise, muscle
    plannedEntryId?          // null = zusätzlich
    status: 'done' | 'skipped' | 'replaced' | 'extra'
    replacesEntryId?
    planned?: Kopie des Übungseintrags zum Zeitpunkt des Trainings
    sets[]: Satz
      id, type, plannedSetIndex?
      weight?, reps?, seconds?, rir?, rpe?, completed
      repetitions?[]: { index, assisted?, partial?, weight? }   // optional pro Wiederholung
```

Die Kopie `planned` sorgt dafür, dass alte Trainings richtig ausgewertet werden, auch wenn der Plan später geändert oder gelöscht wird.

### 7.3 Speicherung
- **Ohne Konto:** im Browser, wie heute. Pläne und Trainings bekommen je einen eigenen Speicher mit derselben austauschbaren Schnittstelle wie der heutige Plan-Speicher.
- **Mit Konto (Supabase, vorbereitet):** Tabellen `plans` (wie vorbereitet, Inhalt als JSON) und neu `workouts` mit Datum, Art, Plan-Bezug und dem Protokoll als JSON. Für Auswertungen über viele Trainings zusätzlich eine flache Tabelle `workout_sets` (ein Datensatz pro Satz mit Übung, Muskel, Gewicht, Wiederholungen, Datum). Jeder Nutzer sieht nur seine eigenen Daten.
- **Export** aller Trainings als Datei (Datenschutz, Sicherung).

## 8. Seiten und Navigation (Vorschlag, Gestaltung durch das Design)

| Seite | Inhalt |
|---|---|
| **Heute / Start** | Fälliges Training, „Training starten“, kurze Wochenübersicht |
| **Kalender** | Monat mit Status, Tagesdetails mit Soll-Ist-Vergleich |
| **Pläne** | Liste, aktiver Plan, Plan-Editor (Abschnitt 3), Vorlagen |
| **Training** | Laufendes Training (Abschnitt 4), auch Nachtragen |
| **Übungen** | Übungsdatenbank, später mit Verlauf pro Übung |
| **Auswertung** | Dashboard, Filter, Ziele |

Die Navigation unten bekommt dafür neue Einträge. Die Gestaltung liefert der Design-Agent; die Entwicklung baut die Abläufe mit den vorhandenen Bausteinen und meldet neue Seiten im Handoff.

## 9. Reihenfolge der Umsetzung (Vorschlag)

| Schritt | Inhalt | Ergebnis |
|---|---|---|
| **A – Planmodell 3 und neuer Plan-Editor** | Benannte Tage, Zeitplan, Übungsauswahl mit Filtern, Vorgaben pro Satz, Umsortieren, Duplizieren, Vorlagen übernehmen, Wochenübersicht, Entwurf speichern | Pläne sind so aufgebaut, dass sie ausgewertet werden können |
| **B – Training protokollieren** | Training aus Plan starten, frei, andere Aktivität, nachtragen; Sätze und optional Wiederholungen; Abschluss | Ist-Daten entstehen |
| **C – Kalender und Plantreue** | Monatsansicht, Status, Soll-Ist-Vergleich | Der gewünschte Kalender |
| **D – Auswertung** | Verlauf pro Übung, Volumen, Bestleistungen, Filter, Dashboard, Ziele, Progressionsvorschläge | Analysen |
| **E – Konto** | Supabase, Synchronisation von Plänen und Trainings | Daten auf allen Geräten |

A bis D funktionieren ohne Konto, lokal im Browser. Das Konto (E) kann jederzeit dazwischen kommen, sobald Supabase entschieden ist. Jeder Schritt bekommt Tests, Deutsch und Englisch.

## 10. Entscheidungen

Der Nutzer hat die Umsetzung der Entwicklung überlassen (13.11.2026). Die Vorschläge gelten damit als entschieden; sie lassen sich später ändern.

| Nr. | Frage | Entscheidung |
|---|---|---|
| O8 | Wo stehen die Vorlagen? | Beim Anlegen „Leerer Plan“ oder eine Vorlage wählen |
| O14 | Was wird **pro Wiederholung** erfasst? | Optional: mit Hilfe, Teilwiederholung, Gewichtswechsel |
| O15 | Ab wann gilt ein Training als „nach Plan“? | Plantreue ab 80 %, Gewicht ±5 % |
| O16 | Mehr als ein aktiver Plan gleichzeitig? | **Ja (geändert am 13.11.2026 durch den Nutzer):** mehrere aktive Pläne plus Archiv |
| O17 | Welche „anderen Aktivitäten“ zur Auswahl? | Laufen, Radfahren, Schwimmen, Gehen, Mannschaftssport, Kurs, Sonstiges (Freitext) |
| O18 | Gewicht in kg fest, oder auch lb? | Nur kg |

**Weitere Nutzerentscheidungen (13.11.2026, 21:00):** Navigation mit fünf Bereichen (Heute, Kalender, Pläne, Auswertung, Übungen; Tagebuch im Kalender; Sprache in Einstellungen). Plan-Editor mobil: Übungen oben, Plan-Kopf kompakt, Details per Tipp. Ziehen zum Sortieren mit der kostenlosen Bibliothek dnd-kit erlaubt. Muskelmodell wird um sichtbare Faserbündel/Segmente größerer Muskeln erweitert (Vorschlag vom Grafik-Agenten). Skelett als zuschaltbare Ebene. Mann/Frau in Einstellungen und an der Figur wählbar. Dark Mode ja. App-Name offen.

## 11. Umsetzungsstand

**Schritt A ist umgesetzt** (13.11.2026):
- Planmodell 3 in `src/utils/workoutPlan.js`, alte Pläne (Version 1 und 2) werden beim Lesen umgewandelt.
- Bearbeitungsfunktionen in `src/utils/planEditing.js`: Tage hinzufügen, umbenennen, duplizieren, umsortieren, löschen; Übungen hinzufügen, umsortieren, duplizieren, auf anderen Tag verschieben, entfernen; Sätze hinzufügen, ändern, entfernen; Wiederholungen oder Zeit; Plan duplizieren.
- Editor in `src/components/planEditor/`: Start mit leerem Plan oder Vorlage, alles auf einer Seite, Übungsauswahl mit Suche und Filtern (Muskelgruppe, Gerät), eigene Übungen, Vorgaben pro Satz (Art, Wiederholungen oder Sekunden, Gewicht, Reserve), Pause und Notiz pro Übung, Wochenübersicht der Arbeitssätze, Entwurf wird automatisch gespeichert, Fehler werden mit Ort benannt.
- Planliste: Plan duplizieren, Tage in Trainingsreihenfolge mit nummerierten Übungen.

**Erweiterung (13.11.2026, Nutzerwunsch):**
- Verbundene Filter: Muskelgruppe und Gerät zeigen nur, was zur anderen Auswahl passt, mit Trefferzahl.
- Übungsvorschau mit Platz für die Animation, Haupt- und Hilfsmuskeln, Geräten, Beschreibung und Varianten für dieselben Muskeln (`src/utils/exerciseSearch.js`).
- Auswertung neben dem Plan (`src/utils/planAnalysis.js`): Diagramm der Arbeitssätze pro Muskelgruppe, Hinweise auf fehlende Muskelgruppen, untrainierte Einzelmuskeln und Ungleichgewichte, Liste aller Einzelmuskeln mit Sätzen, Platz für die Muskelfigur.
- Anatomisch genaues Muskelmodell mit 93 Einträgen (Köpfe und Anteile nach Terminologia Anatomica), siehe [muskelmodell.md](muskelmodell.md).
- Figur und Animationen liefert der Grafik-Agent (Auftrag M1–M4, A1–A2 im Handoff).

**Schritt B, erste Fassung (13.11.2026): Trainingstagebuch**
- Ein angelegter Plan führt direkt ins Tagebuch (`/diary`). Dort: Plan, Trainingstag (vorgeschlagen nach Wochentag bzw. Reihenfolge) und Datum wählen, „Training starten“, „Als ausgefallen eintragen“ (mit Grund) oder „Freies Training“.
- Trainingsseite (`/diary/:id`): pro Satz kg und Wiederholungen bzw. Sekunden, abhaken; Vorgaben des Plans als Vorgabewerte; Gewicht startet mit dem zuletzt benutzten Gewicht; Sätze ergänzen und entfernen, Übungen überspringen, entfernen und hinzufügen; Datum und Status änderbar; alles wird sofort gespeichert und bleibt bearbeitbar.
- Verschobene Trainings (anderer Wochentag als geplant) werden erkannt und angezeigt.
- Kennzahlen pro Eintrag und Woche: erledigte von geplanten Sätzen, Volumen, Plantreue (Regel aus 6.2).
- Daten: `src/utils/workoutLog.js` (Modell und Rechenregeln), `src/storage/localWorkoutStore.js` (Speicher im Browser, austauschbar wie der Plan-Speicher).
- Plan-Editor: Muskelauslastung immer ganz unten, umschaltbar zwischen gewähltem Tag und ganzem Plan.

**Ergänzung (13.11.2026, Nutzerwunsch):**
- Übungen pro Seite (einarmig, einbeinig, seitlich): im Plan pro Übung schaltbar (Vorgabe aus der Übungsdatenbank, `PER_SIDE_EXERCISE_IDS`), im Training je Satz eine Zeile links und rechts mit kg und Wiederholungen bzw. Sekunden; auch während des Trainings umschaltbar (L/R).
- Kein Bestätigen mehr: Ein Satz gilt als gemacht, sobald Wiederholungen oder Sekunden eingetragen sind. Nicht gemachte Sätze entfernt man mit ✕, zusätzliche fügt man unten hinzu.
- Mehrere Pläne parallel oder im Wechsel (z. B. Mobility zu Hause und Kraft im Studio, Wechsel alle drei Monate): Im Tagebuch wird immer zuerst der Plan gewählt, ohne Vorauswahl. Einträge und Wochenzahlen lassen sich nach einem oder mehreren Plänen filtern.

**Für Schritt D festgehalten (Nutzerwunsch):** Auswertungen für einen einzelnen Plan und für mehrere Pläne zusammen, immer mit Diagrammen, Grafiken (Muskelfigur) und Filtern (Zeitraum, Plan, Muskelgruppe, Übung, Status). Grundlage: Jeder Tagebucheintrag speichert Plan, Tag, Datum, Status und alle Sätze mit Soll und Ist, bei Übungen pro Seite getrennt nach links und rechts.

Noch offen für B–D: Erfassung pro Wiederholung (O14), andere Aktivitäten (O17), Kalender (C), Auswertungen über alle Einträge (D), Konto-Speicher.

Noch nicht in Schritt A: Supersätze, Progressionsregel (kommt mit dem Tracking), Start- und Enddatum sowie „aktiver Plan“ (kommen mit Kalender und Tracking).

## Quellen

- Hevy, Routinen erstellen: https://help.hevyapp.com/hc/en-us/articles/34953606698903-Build-a-Workout-Program-Create-Organize-Routines
- Hevy, Programmieroptionen (Satzarten, Supersätze, Notizen, Plan nach Training aktualisieren): https://www.hevyapp.com/features/exercise-programming-options/
- Hevy, Routinen duplizieren: https://help.hevyapp.com/hc/en-us/articles/35119576252951-Reset-Data-Duplicate-Exercise-Routines-and-Manual-Deletion
- Boostcamp, Program Builder (Wochen, RPE, Prozent vom Maximum): https://www.boostcamp.app/features/program-builder
- Muster anderer Apps (Gerätefilter, Körperkarte, Vorlagen): https://screensdesign.com/showcase/fitbod-gym-fitness-planner, https://f-droid.org/de/packages/org.librefit.app
- Sätze pro Muskel und Woche, Trainingshäufigkeit (Zusammenfassungen, nicht die Originalstudien): https://mennohenselmans.com/training-frequency-2018-meta-analysis-review/, https://builtwithscience.com/how-often-to-train/
