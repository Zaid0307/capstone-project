# UX-Spezifikation 01: Trainingspläne erstellen und verwalten

Stand: 13.11.2026 · Zielgruppe: Entwicklung (Umsetzung) · Bezug: [Konzept Pläne, Training, Auswertung](../konzept-plaene-training-auswertung.md), [Gesamtkonzept](../gesamtkonzept.md), [Muskelmodell](../muskelmodell.md)

**Geltungsbereich:** Planliste (`/plans`), Anlegen (`/plans/new`), Bearbeiten (`/plans/:id/edit`), Übungsauswahl, Übungsvorschau, Muskelauslastung im Editor, Übergang ins Tagebuch.
**Nicht Teil dieses Dokuments:** Farben, Schriften, Abstände in Pixeln über die Mindestmaße hinaus, Illustrationen (Design-Agent); Muskelfigur und Übungsanimationen (Grafik-Agent, hier nur Platzhalter-Slots); Tagebuch und Kalender (eigene Spezifikation).

Begriffe wie im Konzept: **Plan → Trainingstag → Übungseintrag → Satzvorgabe**. „Tag“ meint immer einen Trainingstag des Plans, nicht ein Kalenderdatum.

---

## 1. Bewertung des Ist-Zustands

Grundlage: Code auf Branch `ueberarbeitung` und Screenshots bei 390 px Breite (Vorlage „Muskelaufbau Ganzkörper 3 Tage“ übernommen, leerer Plan mit einem Tag, Übungsauswahl offen).

### 1.1 Was gut funktioniert (behalten)

| Punkt | Wo |
|---|---|
| Planmodell 3 ist sauber: benannte Tage, Vorgaben pro Satz, Wiederholungen oder Sekunden, pro Seite. Alte Pläne werden beim Lesen umgewandelt. | `src/utils/workoutPlan.js` |
| Alle Bearbeitungen sind reine Funktionen (Plan rein, Plan raus). Das macht Undo fast kostenlos (siehe 5.3). | `src/utils/planEditing.js` |
| Entwurf wird bei jeder Änderung gespeichert, beim Wiederkommen wiederhergestellt. | `src/hooks/usePlanDraft.js` |
| Ein Tag zur Zeit (Tagesleiste statt aller Formulare untereinander). | `PlanEditor.jsx`, `DayTabs` |
| Schnellzeile pro Übung: Sätze, Wdh. von–bis, kg in einer Zeile, Details aufklappbar. | `EntryEditor.jsx`, `Quick` |
| Verbundene Filter mit Trefferzahlen; Arten (Körpergewicht, Kurzhanteln …) aus der Ausstattung abgeleitet. | `src/utils/exerciseSearch.js` |
| Übungsvorschau mit Animations-Slot, Haupt-/Hilfsmuskeln (TA-Namen), Varianten. | `ExercisePreview.jsx` |
| Fehler werden mit Ort benannt, Fokus springt in die Fehlerliste, betroffener Tag wird gewählt. | `PlanEditor.jsx`, `handleSave` |
| Muskelauslastung ganz unten, umschaltbar Tag / ganzer Plan. | `PlanAnalysis.jsx` |
| Icon-Buttons haben 44 × 44 px und `aria-label`. | `src/components/ui/IconButton.js` |
| Neuer Plan führt nach dem Speichern direkt ins Tagebuch. | `src/App.jsx`, `handleCreatePlan` |

### 1.2 Konkrete UX-Probleme

| Nr. | Problem | Wirkung | Wo |
|---|---|---|---|
| B1 | **Speichern steht mitten auf der Seite**, zwischen Editor und Analyse. Bei einem Plan mit 5 Übungen liegt der Button bei 390 px ca. 1 800 px unter dem Seitenanfang; während man Übungen bearbeitet, ist er nie sichtbar. | „Wo speichere ich?“ – Suchen, Scrollen | `PlanEditor.jsx`, `FooterArea` |
| B2 | **Bestätigungsdialoge (`window.confirm`) für alles**: Übung entfernen, Tag löschen, Abbrechen, Plan löschen, Tag in der Planliste löschen. Native Dialoge sind nicht gestaltbar, unterbrechen und werden bei häufigem Einsatz blind weggeklickt. | Reibung bei jeder kleinen Änderung; trotzdem kein Schutz | `EntryEditor.jsx:86`, `DayEditor.jsx:51`, `PlanEditor.jsx:78`, `WorkoutPlanCard.jsx:31/40/45` |
| B3 | **Übungsauswahl ist in den Tag eingebettet**, mit eigener Scroll-Liste in der scrollenden Seite (Scroll in Scroll). Nur 40 Treffer werden gezeigt („Grenze die Suche ein“), obwohl es nur 97 Übungen gibt. | Auf dem Handy fängt die innere Liste das Scrollen ab; Übungen „fehlen“ scheinbar | `ExercisePicker.jsx:23` (`MAX_RESULTS`), `ResultList` |
| B4 | **Zwei Filter für dasselbe**: „Gerät“ (Auswahlliste mit ~40 Einträgen) und „Art“ (Chips Körpergewicht/Kurzhanteln …) filtern beide nach Ausstattung. Die Art-Chips laufen bei 390 px aus dem Bild (horizontal scrollend, ohne Hinweis). | Unklar, welcher Filter wofür ist; versteckte Chips | `ExercisePicker.jsx`, `Filters`, `ChipGroup` |
| B5 | **Keine Mehrfachauswahl** im Sinne „mehrere markieren, dann hinzufügen“. Jedes „+“ fügt sofort hinzu, die Rückmeldung ist nur eine Statuszeile. | Bei 5–8 Übungen pro Tag viele Einzelschritte, schlechte Kontrolle | `ExercisePicker.jsx`, `addLibraryExercise` |
| B6 | **Kein „Übung ersetzen“**, obwohl das Konzept (3.4) es fordert. Wer Kurzhantel- durch Langhantelbankdrücken ersetzen will, muss löschen, neu suchen, Werte neu eingeben und neu sortieren. | Häufigster Änderungswunsch ist umständlich | fehlt in `planEditing.js` und `EntryEditor.jsx` |
| B7 | **Umsortieren ist versteckt**: Hoch/Runter liegt im aufgeklappten Detailbereich jeder Übung. Für „Übung 6 nach oben auf Platz 2“ sind 1 + 4 Klicks nötig, jedes Mal mit großem aufgeklapptem Formular. | Umsortieren wird praktisch nicht benutzt | `EntryEditor.jsx`, `ToolRow` |
| B8 | **Bei Wochentag-Plänen verschwindet der Tagesname**: Die Tagesleiste und die Überschrift zeigen „Montag“, der Name „Ganzkörper A“ steht nur im Eingabefeld. | Man sieht nicht, welcher Tag was trainiert | `workoutPlan.js:59` (`dayTitle`) |
| B9 | **Ein Trainingstag kann nur einen Wochentag haben.** „Tag A am Montag und Donnerstag“ geht nur durch Duplizieren; danach sind es zwei Tage, die getrennt gepflegt werden müssen. | Doppelte Pflege, Fehlerquelle | `workoutPlan.js` (`day.weekday`) |
| B10 | **Reihum-Pläne rechnen falsch pro Woche**: `weeklySetsByMuscle` zählt jeden Tag einmal pro Woche. Ein Plan A/B, der 3× pro Woche reihum läuft, hat aber im Mittel 1,5 × A + 1,5 × B. | Hinweise „zu wenig/zu viel“ sind bei Reihum falsch | `workoutPlan.js:228`, `planAnalysis.js` |
| B11 | **Plan-Formular oben nimmt den ersten Bildschirm ein** (Name, Beschreibung, Zeitplan mit Erklärung). Das Wichtigste, die Übungen, beginnt erst nach ca. 700 px. | Beim Bearbeiten immer erst scrollen | `PlanEditor.jsx`, Karte „Allgemein“ |
| B12 | **Tag-Formular wiederholt sich**: Name, Wochentag, Notiz sind immer offene Felder, obwohl man sie selten ändert. | Lange Seite, wenig Fokus | `DayEditor.jsx`, `Fields` |
| B13 | **Zahlenfelder als `type="number"`**: Komma als Dezimaltrenner (deutsche Tastatur „62,5“) wird je nach Browser abgelehnt oder geleert; Mausrad verändert Werte versehentlich; Pfeile sind bei 390 px zu klein. | Eingabefehler bei Gewichten | `EntryEditor.jsx:144–345` |
| B14 | **Sätze-Auswahl 1–10 als `<select>`**: Für die häufigste Änderung (+1/−1 Satz) braucht man zwei Taps und eine Liste. | Langsam | `EntryEditor.jsx:46` (`SET_COUNTS`) |
| B15 | **Analyse ist sehr lang und erklärt sich nicht**: 40+ Zeilen Einzelmuskeln bei 390 px, Werte wie „1,5 Sätze“ ohne Erklärung (Hilfsmuskel zählt halb). Hinweis „untrainierte Einzelmuskeln“ nennt auch tiefe Muskeln (z. B. M. coracobrachialis), die kaum gezielt trainiert werden. Ein Mobility-Plan bekommt „Brust fehlt“-Hinweise. | Rauschen statt Hilfe; bei parallelen Plänen (Mobility zu Hause + Kraft im Studio) irreführend | `PlanAnalysis.jsx`, `planAnalysis.js` (`analyzePlan`) |
| B16 | **Planliste zeigt nur den Namen** und fünf Icons. Keine Tage, kein Zeitplan, keine Übungsanzahl, kein „zuletzt trainiert“. Fünf Icon-Buttons nebeneinander (▶ ✎ ⧉ 🗑 ⌄) lassen bei 390 px kaum Platz für den Namen. | Pläne sind schwer zu unterscheiden; Löschen liegt direkt neben Bearbeiten | `WorkoutPlanCard.jsx` |
| B17 | **Tage lassen sich in der Planliste löschen** (`PlanDay`, Mülleimer pro Tag). Das ist eine Bearbeitung außerhalb des Editors, ohne Entwurf und ohne Undo. | Versehentliches Löschen | `PlanDay.jsx:34` |
| B18 | **Kein Archiv, kein Status.** Bei mehreren Plänen (parallel oder im Wechsel alle drei Monate) wächst die Liste; alte Pläne kann man nur löschen. | Unübersichtlich; Löschen ist die falsche Antwort auf „gerade nicht aktuell“ | `WorkoutPlansPage.jsx` |
| B19 | **Vorlagenwahl ist eine lange Liste ohne Filter** (23 Karten, ca. 5 600 px bei 390 px), ohne Vorschau der Tage/Übungen vor dem Übernehmen. Daten für Filter sind vorhanden (`goals`, `level`, `setting`, `weeklyTrainingDays`). | Lange Suche, Übernehmen „auf Verdacht“ | `TemplatePicker.jsx`, `planTemplates.json` |
| B20 | **Desktop nutzt die Breite nicht**: Das Layout ist auch bei 1 280 px einspaltig (max. 960 px), die Übungsauswahl schiebt die Übungsliste nach unten. | Auf dem Desktop unnötig viel Scrollen | `PlanEditor.jsx:216` (`Layout`) |
| B21 | **Untere App-Navigation bleibt im Editor sichtbar** und konkurriert mit den Editor-Aktionen; ein Tipp auf „Pläne“ verlässt den Editor ohne Rückmeldung (Entwurf bleibt zwar erhalten, das weiß der Nutzer aber nicht). | Unsicherheit, versehentliches Verlassen | `PageLayout.jsx` |

---

## 2. Benchmark: Wie die besten Apps Pläne bauen

| App | Muster | Übernehmen für GetFit! |
|---|---|---|
| **Hevy** | Routinen in **Ordnern**; „New Routine“ → Name → „+ Add Exercise“ am Ende der Liste; Übungsauswahl als Vollbild mit Suche, Muskel- und Gerätefilter und **Mehrfachauswahl** („Add n exercises“). Pro Übung ein **Satz-Raster** (Satz · kg · Wdh.), Satzarten Warm-up/Normal/Failure/Drop, Wdh.-Bereich per Tap auf „REPS“. Menü „⋮“ pro Übung: Ersetzen, Supersatz, Entfernen; **Umsortieren per Drag** in einer eingeklappten Liste. Notizen pro Routine/Übung, Pausen-Timer pro Übung. | Vollbild-Auswahl mit Mehrfachauswahl, ⋮-Menü pro Übung mit „Ersetzen“, eingeklappter Sortiermodus, Wdh.-Bereich |
| **Strong** | Vorlagen (Templates) in Ordnern, Supersätze, Aufwärm-Rechner, eigene Übungen und Timer. Sehr reduzierter Editor: Übungsname + Satzzeilen, keine Formulare drumherum. | Reduktion: Formulare nur, wo nötig; Aufwärm-Rechner später (P3) |
| **Boostcamp** (Program Builder, Web + App) | Programme bis 18 Wochen, bis 7 Tage/Woche; **„Repeating Weeks“** (eine Woche wiederholt) oder **„Periodized Weeks“** (jede Woche eigen); Woche/Tag **duplizieren**, Übungen zwischen Tagen kopieren, Tage umsortieren, **Phasen-Titel**, Supersätze; Ziele als Wdh., Bereich, AMRAP, Zeit; Intensität als RPE oder % 1RM. | Wochen-Modell als spätere Erweiterung (P3), „Woche wiederholt“ als Standard; Kopieren zwischen Tagen |
| **Fitbod** | **Gym-Profile** (mehrere: Studio, Zuhause, Hotel) legen die verfügbare Ausstattung fest; die Übungsauswahl zeigt nur, was mit dem Profil geht. Muskel-Heatmap und Erholung pro Muskelgruppe. | **Ausstattungsprofil pro Plan** (Studio/Zuhause), das die Auswahl vorfiltert – passt genau zum Fall „Mobility zu Hause + Kraft im Studio“ |
| **Alpha Progression** | Plan selbst bauen oder generieren lassen (Ziel, Erfahrung, Ausstattung, Häufigkeit, Dauer, Muskel-Prioritäten); Statistiken „Sätze pro Muskel“, Periodisierung und Deload als Experten-Einstellungen. | Sätze pro Muskel als Rückmeldung (haben wir), Experten-Optionen (RIR, Periodisierung) eingeklappt halten |
| **JEFIT** | Wochenplan mit Tagen, „als aktuellen Plan setzen“, öffentliche Plan-Bibliothek; Intervall-/Autoplay-Modus für Zeitübungen. | „Aktiver Plan“-Status in der Liste; Zeitübungen mit Sekunden (haben wir) |
| **Apple Fitness+ / Nike Training Club** | Keine Plan-Editoren im engeren Sinn, sondern **fertige Programme mit Vorschau** (Wochen, Dauer, Ausstattung, Niveau) und einem großen Start-Button. | Vorlagen-Auswahl mit Filtern (Ziel, Ort, Tage/Woche, Niveau) und Vorschau vor dem Übernehmen |

**Abgeleitete Grundsätze für GetFit!**
1. **Editor = Liste der Übungen**, nicht Formular. Plan- und Tageseinstellungen wandern in Sheets.
2. **Übung hinzufügen ist eine eigene Ansicht** (Vollbild auf dem Handy, Seitenpanel auf dem Desktop) mit Mehrfachauswahl.
3. **Ändern ist billig, Löschen ist rückgängig machbar**: Undo statt Rückfrage (Hevy, Strong und Material-Design-Snackbar-Muster).
4. **Umsortieren als eigener Modus** mit eingeklappten Karten.
5. **Ausstattung gehört zum Plan** (Fitbod-Profil), weil Pläne an Orte gebunden sind.
6. **Vorlagen werden vor dem Übernehmen gezeigt** (Apple/Nike/Boostcamp).
7. **Speichern ist immer sichtbar** (Hevy: „Save“ oben rechts).

**Barrierefreiheit (Normen):** WCAG 2.2 AA: 2.5.7 *Dragging Movements* verlangt für jedes Ziehen eine Ein-Zeiger-Alternative (z. B. Hoch/Runter-Buttons); 2.5.8 *Target Size (Minimum)* 24 × 24 px (wir setzen 44 × 44 px, wie im Code schon festgelegt); 2.4.11 *Focus Not Obscured* (fixierte Leisten dürfen den Fokus nicht verdecken); 3.3.7 *Redundant Entry*.

**Quellen**
- Hevy, Routinen anlegen, Übungen hinzufügen, Umsortieren, Ordner: https://www.hevyapp.com/features/gym-routines/ und https://help.hevyapp.com/hc/en-us/articles/34953606698903-Build-a-Workout-Program-Create-Organize-Routines
- Hevy, Satzarten, Supersätze, Pausen-Timer, Notizen, Wdh.-Bereich: https://www.hevyapp.com/features/exercise-programming-options/
- Hevy, Supersätze mit mehr als zwei Übungen: https://help.hevyapp.com/hc/en-us/articles/35650286563095
- Strong, Funktionsübersicht (Supersätze, Aufwärm-Rechner, eigene Übungen): https://www.strong.app/
- Boostcamp, Program Builder: https://www.boostcamp.app/features/program-builder und https://www.boostcamp.app/custom-program
- Fitbod, Gym-Profil und Ausstattung: https://fitbod.me/blog/your-gym-profile/ ; Muskel-Erholung: https://help.fitbod.me/hc/en-us/articles/360006269014-Muscle-Recovery
- Alpha Progression, Plan-Erstellung und Periodisierung: https://alphaprogression.com/en und https://alphaprogression.com/en/blog/periodize-your-training
- JEFIT, Routinen und Intervall-Modus: https://www.jefit.com/download/autoplay
- Muster-Sammlung Fitbod-Screens: https://screensdesign.com/showcase/fitbod-gym-fitness-planner
- Undo statt Bestätigung: https://uxmatters.com/mt/archives/2020/03/are-you-sure-versus-undo-design-and-technology.php
- WCAG 2.2, 2.5.7 Dragging Movements: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements ; 2.5.8 Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum

Hinweis: Die Hevy-Hilfeseiten blockieren automatisierte Abrufe; die Angaben stammen aus den öffentlichen Feature-Seiten und Suchauszügen. Für Strong gibt es keine öffentliche Hilfe zu Ordnern/Archiv; dort sind nur die Funktionen der Startseite belegt.

---

## 3. Zielablauf und Informationsarchitektur

### 3.1 Objekte und Status

```text
Plan  (status: aktiv | archiviert)       ← mehrere aktive Pläne gleichzeitig erlaubt
 ├─ Einstellungen: Name, Symbol, Ort/Ausstattung, Zeitplan, Start, Dauer, Beschreibung
 ├─ Trainingstag A … (Name, Wochentage[], Notiz)
 │   └─ Übungseintrag 1 … (Übung, Sätze[], Pause, pro Seite, Notiz, Supersatz-Gruppe)
 └─ Hinweise aus Vorlage (Progression, Sicherheit)
```

**Entscheidung (ändert O16):** Statt „genau ein aktiver Plan“ gilt **„beliebig viele aktive Pläne, alte Pläne ins Archiv“**. Begründung: Der Nutzer will ausdrücklich Pläne parallel (Mobility zu Hause + Kraft im Studio) und im Wechsel. „Aktiv“ heißt: erscheint im Tagebuch und später im Kalender. „Archiviert“ heißt: ausgeblendet, Trainings bleiben, jederzeit wiederherstellbar. Die Koordination bestätigt das bitte im Konzept (Abschnitt 10).

### 3.2 Seiten und Routen

| Route | Seite | Neu? |
|---|---|---|
| `/plans` | Planliste: Bereich „Aktiv“, darunter eingeklappt „Archiv (n)“ | geändert |
| `/plans/new` | Start: „Leerer Plan“ oder Vorlage (mit Filtern und Vorschau) | geändert |
| `/plans/new?template=<id>` | Vorlagen-Vorschau (Sheet über der Startseite; eigene URL, damit Zurück funktioniert) | neu |
| `/plans/:planId` | Plan ansehen (nur lesen): Tage, Übungen, Analyse, „Trainieren“, „Bearbeiten“ | neu (ersetzt das Aufklappen in der Liste) |
| `/plans/:planId/edit` | Editor | geändert |
| `/diary?plan=<id>` | Tagebuch mit vorgewähltem Plan (nach „Anlegen“ und „Trainieren“) | vorhanden |

Im Editor gibt es **keine weiteren Routen**; Sheets (Plan-Einstellungen, Tag-Einstellungen, Übungsauswahl, Vorschau, Übungsdetails) sind Dialoge über dem Editor. Ausnahme: Die Übungsauswahl setzt `?add=<dayId>` in die URL, damit die Zurück-Taste des Handys die Auswahl schließt statt den Editor zu verlassen (gleiches Muster für `?entry=<entryId>`).

### 3.3 Abläufe

**A. Neuer Plan aus Vorlage (Hauptweg für Einsteiger)**
1. Planliste → „＋ Neuer Plan“.
2. Startseite: oben Karte „Leerer Plan“, darunter Vorlagen mit Filter-Chips (Ziel · Ort · Tage/Woche · Niveau).
3. Tipp auf Vorlage → Vorschau-Sheet: Beschreibung, Tage mit Übungen (eingeklappt je Tag), Ausstattung, Muskelauslastung der Woche (Balken), Sicherheitshinweis. Knopf „Vorlage übernehmen“.
4. Editor öffnet sich mit der Kopie, Plan-Name vorbelegt, Status „aktiv“.
5. „Anlegen“ (oben rechts) → Tagebuch mit diesem Plan vorgewählt, Snackbar „Plan „X“ angelegt“.

**B. Neuer leerer Plan (Hauptweg für Erfahrene)**
1. Startseite → „Leerer Plan“.
2. Editor öffnet mit **einem Tag „Tag A“** und **direkt geöffneter Übungsauswahl** für diesen Tag (der erste sinnvolle Schritt ist „Übungen wählen“, nicht „Formular ausfüllen“). Standard-Zeitplan: **Reihum, 3× pro Woche** (keine Wochentage nötig; Wochentage kann man später zuweisen).
3. Übungen mehrfach markieren → „3 hinzufügen“ → zurück im Editor.
4. Plan-Name: Das Namensfeld steht oben im Editor mit Platzhalter „Name des Plans“. Ist es beim Anlegen leer, wird **nicht blockiert**, sondern ein Name vorgeschlagen und markiert: „Mein Plan 1“ (fortlaufend). Der Nutzer kann ihn sofort überschreiben. (Ein leerer Name ist der häufigste Fehler im aktuellen Ablauf; ein Vorschlag erspart den Fehlerschritt, WCAG 3.3.7-Geist.)
5. „＋ Tag“ legt „Tag B“ an und öffnet wieder die Auswahl.

**C. Plan bearbeiten**
Planliste → Karte antippen → Planansicht → „✎ Bearbeiten“ (oder ⋮ → Bearbeiten direkt aus der Liste). Editor öffnet den zuletzt gewählten Tag (gemerkt pro Plan in `sessionStorage`, Fehler ignorieren). „Speichern“ → zurück zur Herkunft (Planansicht oder Liste), Snackbar „Gespeichert“.

**D. Duplizieren**
⋮ → „Duplizieren“ → Kopie „Name (Kopie)“ erscheint **direkt unter dem Original**, kurz hervorgehoben, Snackbar „Kopie angelegt · Bearbeiten“. Kein Dialog. Die Kopie ist aktiv.

**E. Archivieren / Wiederherstellen**
⋮ → „Archivieren“ → Karte verschwindet aus „Aktiv“, Snackbar „„X“ archiviert · Rückgängig“. Im Archiv: ⋮ → „Wiederherstellen“ oder „Endgültig löschen“.

**F. Löschen**
Nur im ⋮-Menü, als letzter Eintrag, abgesetzt. Löschen sofort, Snackbar „„X“ gelöscht · Rückgängig“ (8 s). Trainings im Tagebuch bleiben erhalten (sie enthalten eine Kopie der Vorgaben). Der Text im Menü sagt das: „Löschen (Trainings bleiben)“. Ein echter Bestätigungsdialog nur, wenn der Plan **gerade in einem laufenden Training** verwendet wird (dann: „Dieser Plan wird in einem laufenden Training verwendet. Trotzdem löschen?“).

**G. Plan wechseln / mehrere Pläne**
- Kein globaler „aktiver Plan“-Schalter. Jeder aktive Plan hat in der Liste ein **▶ Trainieren**.
- Wechsel alle drei Monate: alten Plan archivieren, neuen anlegen oder aus dem Archiv wiederherstellen. Optional: Feld „Dauer (Wochen)“; nach Ablauf zeigt die Planliste beim Plan einen Hinweis „Geplante Dauer erreicht – archivieren?“ mit Knopf (kein automatisches Archivieren).
- Plan-**Symbol** und **Ort** (Studio / Zuhause / Draußen / Unterwegs) unterscheiden parallele Pläne auf einen Blick in Liste, Tagebuch und Kalender.

**H. Programme über Wochen (P3)**
Standard bleibt „jede Woche gleich“. Erweiterung „Wochen planen“ in den Plan-Einstellungen: Dauer n Wochen; pro Woche optional **Anpassungen** (Sätze ±, RIR-Ziel, Deload-Woche = Sätze halbieren). Der Editor zeigt dann oberhalb der Tagesleiste eine Wochenleiste „W1 W2 … W8“ mit „Alle Wochen“ als Standard. Details in 5.2.

### 3.4 Navigation im Editor (Fokus-Modus)

Im Editor wird die **untere App-Navigation ausgeblendet** (wie Hevy/Strong beim Bearbeiten). Stattdessen eine fixierte **Kopfleiste**: links ← (Zurück), Mitte Titel, rechts ↶ (Rückgängig) und **„Speichern“/„Anlegen“** als Text-Button. Damit ist Speichern immer sichtbar (B1) und die Analyse bleibt wirklich ganz unten.

---

## 4. Screens im Detail

Maße: Touch-Ziele **mindestens 44 × 44 px**, Abstand zwischen benachbarten Zielen mindestens 8 px. Mobile = 390 px (Ausgangspunkt), Tablet ab 768 px, Desktop ab 1 024 px. Icons: vorhandene Pakete `react-icons/md` und `react-icons/bi`; vorgeschlagene Icons in Klammern, endgültige Wahl beim Design-Agenten. Jeder Icon-Button hat `aria-label` und `title`.

### 4.1 S1 – Planliste (`/plans`)

**Mobil**
```text
┌──────────────────────────────────────┐
│ Meine Pläne                [＋ Neu]  │
├──────────────────────────────────────┤
│ AKTIV (2)                            │
│ ┌──────────────────────────────────┐ │
│ │ 🏋 Kraft Ober/Unter      [▶] [⋮] │ │
│ │ Studio · Mo Di Do Fr · 4 Tage    │ │
│ │ 22 Übungen · zuletzt: gestern    │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ 🧘 Mobility              [▶] [⋮] │ │
│ │ Zuhause · Reihum 3×/Woche · 2 T. │ │
│ │ 9 Übungen · noch nie trainiert   │ │
│ └──────────────────────────────────┘ │
│ ▸ Archiv (3)                         │
└──────────────────────────────────────┘
```
- Karte als Ganzes ist ein Link zur Planansicht (`/plans/:id`). Darin zwei Buttons: **▶ Trainieren** (primär, `BiPlay`) und **⋮ Mehr** (`MdMoreVert`). Die bisherigen Einzel-Icons ✎ ⧉ 🗑 ⌄ entfallen aus der Kartenzeile (B16).
- ⋮-Menü (Popover, als `role="menu"`): Bearbeiten (`MdOutlineEdit`) · Duplizieren (`MdContentCopy`) · Archivieren (`MdOutlineArchive`) · Trenner · Löschen (`MdOutlineDeleteForever`, Text „Löschen (Trainings bleiben)“).
- Zeile 2: Ort-Symbol + Zeitplan-Kurzform. Wochentag-Pläne: Wochentagskürzel in Wochenreihenfolge. Reihum: „Reihum · 3×/Woche“.
- Zeile 3: Übungsanzahl (Summe aller Tage) · „zuletzt: heute/gestern/vor 5 Tagen/12.10.“ aus dem Tagebuch · bei Vorlage nichts Zusätzliches.
- Sicherheitshinweis der Vorlage (bisher `SafetyHint`) bleibt sichtbar, aber als einzeiliges Symbol + Text „Sicherheitshinweis“ mit Link in die Planansicht, nicht als voller Text in der Liste.
- Sortierung „Aktiv“: zuletzt trainiert zuerst, dann zuletzt bearbeitet. Archiv: zuletzt archiviert zuerst.
- Tage werden **nicht mehr in der Liste gelöscht** (B17); `PlanDay` mit Löschknopf entfällt in der Liste.

**Desktop (≥ 1 024 px):** Karten im Raster 2 Spalten (≥ 1 280 px: 3), gleicher Inhalt. „＋ Neu“ rechts oben neben dem Titel.

**Zustände**
| Zustand | Darstellung |
|---|---|
| Leer (keine Pläne) | Illustration-Slot (Design), Text „Noch kein Plan. Starte mit einer Vorlage oder baue deinen eigenen.“ Zwei Buttons: **„Vorlage wählen“** (primär → `/plans/new#vorlagen`) und „Leerer Plan“ (sekundär → Editor direkt). Kein „＋ Neu“ im Kopf (eine klare Aktion). |
| Nur archivierte Pläne | Bereich „Aktiv“ zeigt „Kein aktiver Plan“ + „Neuer Plan“; Archiv ist aufgeklappt. |
| Laden (künftig mit Konto) | 2 Skeleton-Karten in Kartenhöhe, `aria-busy="true"` auf der Liste; ab 10 s Text „Lädt noch …“. |
| Fehler beim Laden | `role="alert"`: „Pläne konnten nicht geladen werden.“ + „Erneut versuchen“. Lokale Pläne werden trotzdem gezeigt, falls vorhanden. |
| Langer Name | max. 2 Zeilen, danach „…“ (`-webkit-line-clamp: 2`); voller Name in der Planansicht und als `aria-label` des Links. |
| Viele Pläne (> 8 aktiv) | Ab 9 aktiven Plänen erscheint über der Liste ein Suchfeld „Pläne durchsuchen“. |
| Nach Duplizieren | Neue Karte direkt unter dem Original, 2 s hervorgehoben (bei `prefers-reduced-motion` ohne Animation), Fokus auf die neue Karte. |
| Nach Löschen/Archivieren | Fokus auf die nächste Karte (oder vorherige, sonst „＋ Neu“). Snackbar mit „Rückgängig“. |

### 4.2 S2 – Neuer Plan: Start und Vorlagen (`/plans/new`)

```text
┌──────────────────────────────────────┐
│ ←  Neuer Plan                        │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ ＋ Leerer Plan                    │ │
│ │ Eigene Tage und Übungen wählen   │ │
│ └──────────────────────────────────┘ │
│ Vorlagen (23)                        │
│ [Ziel ▾] [Ort ▾] [Tage ▾] [Niveau ▾] │  ← Chips, umbrechend, nicht scrollend
│ ┌──────────────────────────────────┐ │
│ │ Muskelaufbau Ganzkörper 3 Tage   │ │
│ │ 3×/Woche · Studio · Einsteiger+  │ │
│ │ Kurzbeschreibung, 2 Zeilen …     │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```
- Filter (Mehrfachauswahl innerhalb eines Filters, UND zwischen Filtern), Werte aus `planTemplates.json`: **Ziel** (`goals`: Muskelaufbau, Kraft, Zeitsparend, Fitness, Kondition, Boxen, Mobility, Beweglichkeit, Glutes, Pilates), **Ort** (`setting`: Studio, Zuhause, Gemischt), **Tage/Woche** (2–3, 4, 5–6), **Niveau** (`level`: Einsteiger, Einsteiger bis Fortgeschritten, Fortgeschritten, Profi, Alle). Jeder Chip zeigt die Trefferzahl. Aktive Filter als Chips mit ✕; „Filter zurücksetzen“ wenn mindestens einer aktiv ist.
- Karte = ein Button für die Vorschau. Kein separater „Übernehmen“-Button in der Liste (Übernehmen nur aus der Vorschau, damit man sieht, was man bekommt, B19).
- **Vorschau-Sheet** (Mobil: Vollbild-Sheet von unten; Desktop: Dialog 640 px breit):
  - Titel, Ziel/Ort/Niveau/Tage als Text-Zeile, Beschreibung.
  - Tage als Akkordeon: „Ganzkörper A · Mo · 5 Übungen“ → Liste „Goblet Squat · 3 × 8–12“.
  - Ausstattung (Vereinigung aller Übungen): „Kurzhanteln, Bank, Matte“.
  - Kurzbalken „Sätze pro Woche je Muskelgruppe“ (gleiche Komponente wie Analyse, kompakt).
  - Sicherheitshinweis, wenn vorhanden, mit `role="note"`.
  - Fixiert unten: **„Vorlage übernehmen“** (primär). Oben: ✕ Schließen.
- Leerer Filter-Treffer: „Keine Vorlage passt zu diesen Filtern.“ + „Filter zurücksetzen“ + „Leeren Plan anlegen“.
- Entwurf vorhanden (unfertiger neuer Plan): Statt automatisch in den Editor zu springen (heutiges Verhalten in `CreatePlanPage.jsx`), erscheint ganz oben eine Karte **„Weiter am Entwurf „<Name>“ · zuletzt <Zeit>“** mit „Fortsetzen“ (primär) und „Verwerfen“ (Text-Button, mit Undo-Snackbar). Der Nutzer behält die Wahl.

### 4.3 S3 – Plan-Editor: Gerüst

**Mobil (390 px), Reihenfolge von oben nach unten**
```text
┌──────────────────────────────────────┐
│ ←   Plan bearbeiten     ↶  [Speichern]│ ← fixiert, 56 px
├──────────────────────────────────────┤
│ [Name des Plans_____________]  [⚙]   │ ← Name inline, ⚙ = Plan-Einstellungen
│ Reihum · 3×/Woche · Studio           │ ← Zusammenfassung, Tipp öffnet ⚙
├──────────────────────────────────────┤
│ (A Ganzkörp. 5) (B Oberk. 4) (＋)    │ ← Tagesleiste, klebt unter Kopfleiste
├──────────────────────────────────────┤
│ Tag A · Ganzkörper   Mo Do    [⋮]    │ ← Tag-Kopf
│ 📝 Notiz: Aufwärmen 5 min Rad        │ ← nur wenn vorhanden
│ ┌ 1 Goblet Squat            [⋮] ┐    │
│ │   Beine · ⏱ 120 s                │    │
│ │   [−] 3 [+] Sätze  8–12 Wdh. __kg│    │
│ └──────────────────────────────────┘    │
│ … weitere Übungen …                  │
│ [＋ Übungen hinzufügen]  [⇅ Sortieren]│
├──────────────────────────────────────┤
│ Muskelauslastung  (Tag A | Woche)    │ ← immer ganz unten
│ [Figur-Slot] [Balken] [Hinweise]     │
└──────────────────────────────────────┘
```

**Kopfleiste**
| Element | Verhalten | Name für Screenreader (DE / EN) |
|---|---|---|
| ← (`MdArrowBack`) | Verlässt den Editor. Gibt es ungespeicherte Änderungen, öffnet ein **Sheet** (kein `window.confirm`) mit drei Optionen: „Speichern“ (primär), „Als Entwurf behalten“, „Änderungen verwerfen“. Ohne Änderungen: sofort zurück. | „Zurück“ / „Back“ |
| Titel | „Neuer Plan“ / „Plan bearbeiten“; bei Scroll ab dem Namensfeld wird der Planname angezeigt (gekürzt, 1 Zeile). | – (ist `h1`) |
| ↶ (`MdUndo`) | Macht die letzte Änderung rückgängig (Verlauf, siehe 5.3). Deaktiviert (`aria-disabled`, nicht entfernt), wenn nichts rückgängig zu machen ist. Lange gedrückt / Rechtsklick: nichts (kein verstecktes Redo). Desktop: Strg+Z / Strg+Umschalt+Z (Redo, ohne eigenen Button). | „Rückgängig: <Aktion>“ / „Undo: <action>“, z. B. „Rückgängig: Kniebeuge entfernt“ |
| Speichern / Anlegen | Text-Button, immer aktiv. Prüft und speichert (siehe 4.10). | „Speichern“ / „Save“; „Anlegen“ / „Create“ |

Die Kopfleiste ist `position: sticky; top: 0`. Die Seite bekommt `scroll-padding-top` = Kopfleiste + Tagesleiste, damit fokussierte Felder nicht verdeckt werden (WCAG 2.4.11).

**Plan-Kopf**
- Namensfeld als großes, randloses Eingabefeld mit sichtbarem Label über dem Feld („Name des Plans“, klein). `maxLength` 100. Zeichenzähler erst ab 80 Zeichen: „87/100“.
- ⚙ (`MdTune` oder `MdSettings`) öffnet **S4 Plan-Einstellungen**.
- Zusammenfassungszeile (Button): „Reihum · 3×/Woche · Studio“ bzw. „Feste Wochentage · Mo Di Do Fr · Zuhause“. Öffnet S4.
- Hinweise aus der Vorlage (Progression, Sicherheit) als einklappbare Zeile „ⓘ Hinweise der Vorlage“ unter der Zusammenfassung (standardmäßig zu; Sicherheitshinweis mit Warnsymbol immer sichtbar, eine Zeile).

**Desktop (≥ 1 024 px)**
```text
┌───────────────────────────────────────────────────────────────────────┐
│ ←  Plan bearbeiten                                    ↶   [Speichern] │
├───────────────────────────────┬───────────────────────────────────────┤
│ Name, Zusammenfassung         │  Übungen hinzufügen (immer offen)     │
│ Tagesleiste                   │  Suche, Filter, Ergebnisliste         │
│ Tag-Kopf, Übungsliste         │  oder: Übungsvorschau                 │
│ (breiter: Satztabelle offen)  │  (rechte Spalte sticky, 400 px)       │
├───────────────────────────────┴───────────────────────────────────────┤
│ Muskelauslastung (volle Breite): Figur links, Balken + Hinweise rechts│
└───────────────────────────────────────────────────────────────────────┘
```
- Linke Spalte `minmax(0, 1fr)`, rechte Spalte 400 px, `position: sticky; top: <Kopfleiste>` mit eigener Höhe `calc(100vh - Kopfleiste)` und eigenem Scroll (auf dem Desktop ist Scroll-in-Scroll akzeptabel, weil Maus/Trackpad gezielt scrollen).
- In der rechten Spalte fügt „＋“ direkt zum gewählten Tag hinzu (keine Mehrfachauswahl nötig, die Liste links zeigt das Ergebnis sofort). Über der Liste: „Hinzufügen zu: Tag A · Ganzkörper ▾“.
- Übungskarten zeigen auf dem Desktop die Satztabelle standardmäßig offen (genug Platz), auf dem Handy die Schnellzeile.
- Tablet (768–1 023 px): wie Mobil, aber Inhalt max. 720 px breit; Auswahl als Seitenpanel von rechts (480 px) statt Vollbild.

### 4.4 S4 – Plan-Einstellungen (Sheet)

Mobil: Vollbild-Sheet; Desktop: Dialog 560 px. Kopf: „Plan-Einstellungen“, rechts „Fertig“. Änderungen wirken sofort (gehen in den Undo-Verlauf), kein eigenes Speichern im Sheet.

| Feld | Steuerelement | Standard | Hinweis |
|---|---|---|---|
| Name | Textfeld (dasselbe wie im Kopf, gespiegelt) | Vorlage: deren Name; leer: leer | Pflicht beim Speichern (Vorschlag „Mein Plan n“, siehe 3.3 B) |
| Symbol | Raster mit 12 Symbolen (Hantel, Kettlebell, Laufen, Yoga/Mobility, Boxen, Herz, Blitz, Berg, Haus, Baum, Koffer, Stern), Radiogruppe | Aus Vorlagen-Ziel abgeleitet, sonst Hantel | Nur Symbol, Farbe entscheidet das Design |
| Ort | Segmente: Studio · Zuhause · Draußen · Unterwegs | Vorlage `setting`, sonst Studio | Steuert die Vorauswahl der Ausstattung |
| Ausstattung | „Verfügbare Ausstattung“ → Checkliste nach Arten gruppiert (Körpergewicht immer an; Kurzhanteln; Langhantel; Bänder; Kabelzug; Maschinen; Boxsack; Cardiogeräte; Sonstiges: Bank, Klimmzugstange, Matte …). Kurzwahl-Buttons „Alles (Studio)“ und „Nur Körpergewicht“. | Studio: alles; Zuhause: Körpergewicht, Kurzhanteln, Bänder, Matte | Filtert die Übungsauswahl vor (abschaltbar, siehe 4.7) |
| Zeitplan | Radiogruppe als Segmente: **Reihum** · **Feste Wochentage** | Leerer Plan: Reihum; Vorlage: Feste Wochentage | Erklärtext darunter (vorhandene Texte `schedule.*Hint`) |
| Trainings pro Woche | Stepper 1–7 (nur bei Reihum) | 3 | Grundlage für „Sätze pro Woche“ (B10) |
| Start | Datumsfeld, optional | leer = ab heute | Für Kalender (Schritt C) |
| Dauer | Stepper in Wochen, 0 = „unbegrenzt“ | unbegrenzt | Zeigt „endet am <Datum>“ |
| Beschreibung | Textarea, 300 Zeichen, optional | Vorlage: deren Text | – |
| Status | Schalter „Aktiv“ / Hinweis „Archivierte Pläne erscheinen nicht im Tagebuch“ | Aktiv | nur beim Bearbeiten, nicht beim Anlegen |

**Wechsel Reihum ↔ Feste Wochentage:** Wechselt man auf „Feste Wochentage“ und Tage haben keine Wochentage, werden **automatisch** Wochentage verteilt (bei n Tagen: 1 → Mo; 2 → Mo, Do; 3 → Mo, Mi, Fr; 4 → Mo, Di, Do, Fr; 5 → Mo–Fr; 6 → Mo–Sa; 7 → Mo–So) und eine Snackbar sagt „Wochentage verteilt · Rückgängig“. So entsteht kein Fehlerzustand „Wochentag fehlt“.

### 4.5 S5 – Tagesleiste und Tag-Kopf

**Tagesleiste**
- Chips in Trainingsreihenfolge: Buchstabe (A, B, C … aus der Position) + Name, gekürzt auf **14 Zeichen** mit „…“, + Anzahl Übungen als Zähler. Bei festen Wochentagen zusätzlich die Wochentagskürzel klein darunter („Mo · Do“). Beispiel: „A Ganzkörper 5“ (B8 gelöst: Name immer sichtbar).
- Gewählter Chip: `aria-current="true"` und (heutiges Muster) `aria-pressed`. Muster bleibt `role="group"` mit Buttons (keine Tabs-Semantik, weil kein festes Tabpanel-Paar bei wechselndem Inhalt; einfacher und robust).
- Chip mit Fehler: Fehlersymbol (`BiErrorCircle`) vor dem Namen, nicht nur Randfarbe; `aria-describedby` auf den Fehlertext.
- Letzter Chip: **＋** „Tag hinzufügen“. Neuer Tag heißt „Tag <nächster Buchstabe>“, wird gewählt, und die Übungsauswahl öffnet sich (mobil).
- Überlauf: Die Leiste scrollt horizontal; rechts ein Verlauf als Scroll-Hinweis (Design). **Ab 6 Tagen** erscheint am Ende zusätzlich „Alle Tage (n)“ → Sheet mit vertikaler Liste aller Tage (Name, Wochentage, Anzahl) zum Springen und Umsortieren. Damit ist bei vielen Tagen nichts versteckt.
- Leiste klebt unter der Kopfleiste (`sticky`), solange der Tag-Bereich sichtbar ist; im Analyse-Bereich nicht mehr.
- Tastatur: Pfeil links/rechts wechselt zwischen Chips (Roving Tabindex), Pos1/Ende springen.

**Tag-Kopf**
- Zeile: „Tag A · Ganzkörper“ (`h2`), daneben Wochentagskürzel (nur feste Wochentage), rechts **⋮** (`MdMoreVert`, „Aktionen für Tag A“).
- ⋮-Menü Tag: **Umbenennen** (öffnet S5a) · **Wochentage** (S5a) · **Notiz** (S5a) · **Duplizieren** · **Nach links** · **Nach rechts** (nur Reihum; bei festen Wochentagen bestimmt der Wochentag die Reihenfolge) · **Übungen kopieren nach …** (P2) · Trenner · **Tag löschen**.
- Tag löschen: sofort, Snackbar „Tag A gelöscht (5 Übungen) · Rückgängig“. Der benachbarte Tag wird gewählt, Fokus auf dessen Chip. Letzter Tag eines Plans: Löschen erlaubt, danach Leerzustand „Noch kein Trainingstag“ mit „＋ Tag hinzufügen“.
- Notiz: wenn vorhanden, eine Zeile unter dem Kopf mit 📝-Symbol (`MdOutlineStickyNote2`), auf 2 Zeilen gekürzt, Tipp öffnet S5a. Ohne Notiz keine Zeile (B12).

**S5a – Tag-Einstellungen (kleines Sheet)**
- Name (Pflicht bei Reihum; vorbelegt „Tag A“), max. 60 Zeichen.
- Wochentage (nur feste Wochentage): **7 Umschalt-Buttons Mo–So**, Mehrfachauswahl (B9). Bereits von anderen Tagen belegte Wochentage sind wählbar, zeigen aber einen Punkt und `aria-describedby` „auch Tag B“. Mindestens ein Wochentag ist Pflicht.
- Notiz, 300 Zeichen.
- „Fertig“.

### 4.6 S6 – Übungskarte und Sätze

**Eingeklappt (Standard mobil)**
```text
┌──────────────────────────────────────────┐
│ [1] Kurzhantel-Bankdrücken          [⋮]  │  ← Name max. 2 Zeilen
│     Brust · ↔ pro Seite · ⏱ 90 s         │  ← Meta, Symbole + Text
│     [−] 3 [+]   [ 8 ]–[ 12 ] Wdh.  [ 20 ] kg │  ← Schnellzeile (alle Sätze gleich)
│     ▾ Sätze einzeln                      │
└──────────────────────────────────────────┘
```
- **Positionsnummer** links (wie heute), bei Supersätzen Buchstabe+Nummer („A1“, „A2“) mit verbindender Linie.
- **Name** ist ein Button → öffnet die **Übungsvorschau** (S8) im Lesemodus mit Knopf „Ersetzen“. Eigene Übungen: Name öffnet S6a.
- **Meta-Zeile**: Muskelgruppe · „↔ pro Seite“ (`MdSwapHoriz`) wenn pro Seite · „⏱ 90 s“ Pause · 📝 wenn Notiz vorhanden. Jedes Element mit Text, nicht nur Symbol.
- **Schnellzeile** (nur wenn alle Arbeitssätze gleich sind, sonst Zusammenfassung „1 + 3 × 12/10/8 · 20/22,5/25 kg“ als Button, der die Satztabelle öffnet):
  - **Sätze-Stepper**: [−] Zahl [+], 44 × 44 px Buttons, Bereich 1–20. Ersetzt das Select (B14). Die Zahl selbst ist ein Textfeld (für direkte Eingabe).
  - **Wdh.**: zwei Felder „von“–„bis“; „bis“ leer = feste Zahl (heutige Logik `changedDose` beibehalten). Sichtbare Labels „Wdh. von“, „bis“ als kleine Beschriftung über den Feldern (heute vorhanden, beibehalten).
  - Zeitübungen: ein Feld „Sek.“.
  - **kg**: optional, Platzhalter „–“.
  - Alle Zahlenfelder: `type="text"`, `inputMode="numeric"` (Wdh., Sek.) bzw. `inputMode="decimal"` (kg), `pattern` nur zur Anzeige, Parsing mit Komma und Punkt (vorhandenes `toNumber`). Kein Mausrad-Ändern (B13). Beim Fokus Inhalt markieren (`select()`), damit Überschreiben ein Tipp ist.
  - Breite bei 390 px: Stepper 132 px, Wdh. 2 × 52 px + Strich, kg 64 px; passt in 358 px Innenbreite mit 8 px Abständen. Unter 360 px Breite bricht kg in die nächste Zeile.
- **„▾ Sätze einzeln“** klappt die Satztabelle auf (Text-Button mit `aria-expanded`).

**Satztabelle (aufgeklappt)**
```text
 Satz   Art     Wdh.        kg     RIR
 1      [A ▾]   [10]–[12]   [15]   [ – ]   [✕]
 2      [·  ▾]  [ 8]–[12]   [20]   [ 2 ]   [✕]
 3      [·  ▾]  [ 8]–[12]   [20]   [ 2 ]   [✕]
 [＋ Satz]   (übernimmt Werte des letzten Satzes)
```
- Als echte Tabelle (`<table>` mit `<th scope="col">`), jedes Feld mit verstecktem Label „Satz 2, Wiederholungen von“ (`aria-label`), damit Screenreader die Zeile verstehen.
- **Art**: Kurzzeichen statt Wort, mit Legende: **A** = Aufwärmen, **·** (leer) = Arbeitssatz; später **D** = Dropsatz, **V** = bis Muskelversagen (Hevy-Muster). Tipp öffnet ein Menü mit vollem Text. `aria-label` „Satzart: Aufwärmen“.
- **✕** entfernt den Satz sofort (Undo über ↶ und Snackbar). Der letzte Satz kann nicht entfernt werden (Button `aria-disabled`, `title` „Mindestens ein Satz“).
- **RIR** (Wiederholungen in Reserve) nur sichtbar, wenn mindestens ein Satz ein RIR-Ziel hat **oder** der Nutzer in ⋮ „RIR-Ziel anzeigen“ aktiviert; sonst Spalte ausgeblendet (weniger Felder auf dem Handy). Vorlagen mit `rirTarget` zeigen sie automatisch.
- „Alle Sätze gleich setzen“ als Text-Button unter der Tabelle, übernimmt Satz 1 für alle Arbeitssätze (Undo möglich).
- Mobil bei 390 px: Spalten Satz 28 px, Art 44 px, Wdh. 2 × 44 px, kg 56 px, RIR 44 px, ✕ 44 px = 340 px. Ohne RIR-Spalte entsprechend luftiger.

**⋮-Menü der Übung** (`role="menu"`, Reihenfolge nach Häufigkeit)
| Eintrag | Icon | Wirkung |
|---|---|---|
| Ersetzen | `MdSwapVert` / `MdFindReplace` | Öffnet die Übungsauswahl im **Ersetzen-Modus** (S7): Titel „Ersetzen: Kurzhantel-Bankdrücken“, oben Bereich „Varianten (gleiche Muskeln)“ aus `exerciseVariants`, Muskelfilter vorbelegt mit der Gruppe der Übung. Tipp auf eine Übung ersetzt sofort, **Sätze, Pause, Notiz und Position bleiben**; Dosis-Einheit wird nur angepasst, wenn die neue Übung zeitbasiert ist (dann Snackbar „Auf Sekunden umgestellt“). |
| Pause … | `MdTimer` | Kleines Sheet: Stepper in 15-s-Schritten, Kurzwahl 30/60/90/120/180 s, „keine“. |
| Pro Seite | `MdSwapHoriz` | Umschalter (`role="menuitemcheckbox"`), Häkchen sichtbar. |
| Notiz … | `MdOutlineStickyNote2` | Sheet mit Textarea. |
| Duplizieren | `MdContentCopy` | Kopie direkt darunter, Fokus auf die Kopie. |
| Verschieben nach … | `MdDriveFileMove` | Untermenü mit den anderen Tagen; danach Snackbar „Nach Tag B verschoben · Rückgängig · Anzeigen“. |
| Kopieren nach … | `MdLibraryAdd` | wie Verschieben, Original bleibt (P2). |
| Supersatz mit nächster | `MdLink` | P2, siehe 5.2. |
| Entfernen | `MdOutlineDeleteForever` | Sofort, Snackbar „Kurzhantel-Bankdrücken entfernt · Rückgängig“, Fokus auf die nächste Karte (sonst „＋ Übungen hinzufügen“). |

Der bisherige Mülleimer- und Einstellungs-Button in der Kartenzeile entfällt zugunsten von ⋮ (eine Aktion pro Karte statt zwei, kein versehentliches Löschen neben dem Bearbeiten).

**Wischgeste (nur Touch, optional, P2):** Nach links wischen zeigt „Entfernen“; Loslassen über 50 % entfernt (mit Undo). Alternative ohne Geste ist immer das ⋮-Menü (WCAG 2.5.1/2.5.7).

**S6a – Eigene Übung bearbeiten:** Name, Muskelgruppe (Pflicht), „pro Seite“, Einheit (Wdh. / Sekunden). Erreichbar über Tipp auf den Namen einer eigenen Übung.

**Sortiermodus** (B7)
- Button „⇅ Sortieren“ unter der Liste (und im Tag-⋮). Schaltet die Liste um: jede Übung eine Zeile (Nummer, Name, ↑, ↓, ⠿-Griff), Schnellzeilen ausgeblendet. Kopf zeigt „Fertig“.
- ↑/↓ sind 44 × 44 px Buttons (`aria-label` „Kurzhantel-Bankdrücken nach oben“). Nach jedem Schritt Live-Ansage (`role="status"`): „Kurzhantel-Bankdrücken, Position 2 von 5“. Der Fokus bleibt auf dem gedrückten Button (der mitwandert).
- Ziehen am Griff (Pointer Events, ohne neue Bibliothek; Bibliothek wie dnd-kit nur nach Freigabe durch den Eigentümer) ist die schnelle Variante für Maus und Touch (P2). Die Buttons bleiben die Pflicht-Alternative (WCAG 2.5.7).
- Tastatur auf dem Griff: Leertaste nimmt auf, Pfeile bewegen, Leertaste legt ab, Escape bricht ab (P2, zusammen mit Ziehen).
- Gleicher Modus im Sheet „Alle Tage“ für die Reihenfolge der Tage (nur Reihum).

### 4.7 S7 – Übungsauswahl („Übungen hinzufügen“)

**Mobil: Vollbild-Dialog** (`role="dialog"`, `aria-modal="true"`, Fokusfalle, Escape/Zurück schließt, URL `?add=<dayId>`). Ersetzt die eingebettete Auswahl (B3).

```text
┌──────────────────────────────────────┐
│ ✕  Übungen für Tag A                 │
│ [🔍 Übung suchen ______________ ✕]   │ ← sticky
│ [Muskel ▾] [Ausstattung ▾] [⚑ Plan-Ausst. ✓] │ ← Chips, umbrechend
├──────────────────────────────────────┤
│ IN DIESEM PLAN · ZULETZT VERWENDET   │ ← nur ohne Suchtext
│ ☐ Goblet Squat          Beine   (ⓘ)  │
│ ALLE (54)                            │
│ ☑ Arnold-Drücken      Schultern (ⓘ)  │
│ ☐ Ausfallschritt rückw.  Beine  (ⓘ)  │
│ …                                    │
│ Nicht gefunden? [＋ Eigene Übung]     │
├──────────────────────────────────────┤
│ [ 2 Übungen hinzufügen ]             │ ← sticky, erst ab 1 Auswahl aktiv
└──────────────────────────────────────┘
```
- **Suche**: Autofokus nur auf dem Desktop (auf dem Handy öffnet sonst sofort die Tastatur und verdeckt die Liste). Sucht in DE und EN (vorhanden) und ab P2 zusätzlich in Muskelnamen (deutsch, englisch, lateinisch), z. B. „trizeps“ findet alle Übungen mit Trizeps-Köpfen.
- **Filter** (B4 gelöst, zwei statt drei Filter):
  - **Muskel**: Sheet mit den sechs Gruppen + „Sonstiges“ als Chips mit Trefferzahl (vorhandene Logik `filterOptions`). P3: Auswahl über die Körperfigur, sobald die Grafik da ist (Platzhalter-Slot oben im Sheet bereits vorsehen, `role="img"` mit Text „Körperfigur folgt“).
  - **Ausstattung**: Sheet mit zwei Ebenen: oben die **Arten** als Chips (Körpergewicht, Kurzhanteln, Langhantel, Bänder, Kabelzug, Maschine, Boxen, Cardiogeräte – heute `TRAINING_TYPES`), darunter aufklappbar „Einzelne Geräte“ (heutige Geräteliste). Mehrfachauswahl, ODER-verknüpft innerhalb, UND zur Muskelwahl. Trefferzahlen an jedem Chip; Chips mit 0 Treffern werden ausgeblendet, gewählte bleiben sichtbar (heutige Regel).
  - **⚑ Plan-Ausstattung**: Schalter-Chip, standardmäßig **an**, wenn der Plan ein Ausstattungsprofil hat. Zeigt nur Übungen, die mit der Plan-Ausstattung gehen. Ausschalten zeigt alle (Fitbod-Muster).
  - Aktive Filter erscheinen als Chips mit ✕ unter der Suchzeile; „Alle Filter zurücksetzen“.
- **Ergebnisliste**: alle Treffer (keine 40er-Grenze; 97 Einträge sind unkritisch). Sortierung: ohne Suche alphabetisch; mit Suche: Namensanfang vor Wortanfang vor Teiltreffer. Gruppiert: „In diesem Plan“ (bereits verwendete Übungen, zum schnellen Wiederverwenden), „Zuletzt verwendet“ (aus dem Tagebuch, max. 5), dann „Alle (n)“.
- **Zeile**: ganze Zeile ist ein Checkbox-Ziel (`role="checkbox"` bzw. echtes `<input type="checkbox">` mit großem Label), min. 56 px hoch; rechts **ⓘ** (`MdInfoOutline`, 44 × 44) öffnet die Vorschau (S8). Bereits am Tag vorhandene Übungen tragen ein Kennzeichen „✓ schon an Tag A“ (Text), bleiben aber wählbar (z. B. für zwei Varianten derselben Übung).
- **Sticky-Fußleiste**: „n Übung(en) hinzufügen“; bei 0 deaktiviert mit Text „Übungen antippen zum Auswählen“. Nach dem Hinzufügen: Dialog schließt, die neuen Karten sind kurz hervorgehoben, Fokus auf die erste neue Karte, Snackbar „2 Übungen hinzugefügt · Rückgängig“.
- **Ersetzen-Modus**: Einfachauswahl; Fußleiste entfällt, Tipp auf Zeile ersetzt sofort. Oben Abschnitt „Varianten“ (gleiche Muskeln, andere Ausstattung).
- **Eigene Übung**: unter der Liste und im Leerzustand. Öffnet ein kleines Formular im Dialog: Name (vorbelegt mit dem Suchtext!), Muskelgruppe (Pflicht, Chips statt Select), „pro Seite“, „Zeitübung“. „Hinzufügen“ fügt sie direkt dem Tag hinzu (zählt nicht in die Mehrfachauswahl, schließt den Dialog nicht).
- **Zustände**:
  | Zustand | Darstellung |
  |---|---|
  | Keine Treffer | „Keine Übung gefunden für „<Suchtext>“.“ + „Filter zurücksetzen“ (wenn Filter aktiv) + „„<Suchtext>“ als eigene Übung anlegen“ |
  | Plan-Ausstattung schränkt auf 0 ein | „Mit der Ausstattung dieses Plans gibt es dafür keine Übung.“ + „Alle Ausstattungen zeigen“ |
  | Dialog geschlossen mit Auswahl ≠ 0 | Kein Rückfrage-Dialog; die Auswahl geht verloren, aber da nichts am Plan geändert wurde, ist nichts zu schützen. Fußleisten-Text macht klar, dass erst „hinzufügen“ etwas ändert. |
- **Desktop**: rechte Spalte (siehe 4.3), ohne Mehrfachauswahl: jede Zeile hat „＋“ (fügt sofort hinzu, Snackbar mit Undo) und Tipp auf den Namen zeigt die Vorschau in derselben Spalte (mit „← Zurück zur Liste“).

### 4.8 S8 – Übungsvorschau

Mobil: Sheet über der Auswahl (zweite Ebene, Zurück schließt nur die Vorschau). Desktop: in der rechten Spalte.

Aufbau von oben:
1. Titel (Übungsname), ✕.
2. **Animations-Slot**: festes Seitenverhältnis 4 : 3 (Platz reserviert, kein Springen, wenn die Animation kommt). Bis zur Lieferung: Symbol + „Animation folgt“. Später: Animation mit **Pause-Button** (WCAG 2.2.2, sobald sie länger als 5 s läuft) und Standbild bei `prefers-reduced-motion`.
3. **Muskeln**: „Hauptmuskeln“ und „Hilfsmuskeln“ als Listen mit deutschem Namen und lateinischem Namen in kleinerer Zeile (TA2, aus `MUSCLES[id].latin`), z. B. „Großer Brustmuskel, Brustbein-Rippen-Teil – Pars sternocostalis m. pectoralis majoris“. Daneben Slot für Mini-Figur (Grafik-Agent).
4. Ausstattung, „pro Seite“ wenn zutreffend, Kategorie (Kraft, Dehnen …).
5. Beschreibung (max. 4 Zeilen, „mehr“ zum Aufklappen).
6. **Varianten (gleiche Muskeln)**: Liste aus `exerciseVariants`, jede Zeile mit Ausstattung; Tipp zeigt deren Vorschau (Verlauf: „← <vorherige Übung>“ als Zurück-Link oben, max. 5 Ebenen).
7. Fixierte Fußleiste: im Auswahlmodus **„Auswählen“/„Ausgewählt ✓“** (Umschalter, gleicher Zustand wie die Checkbox der Liste); im Ersetzen-Modus **„Damit ersetzen“**; aus der Übungskarte geöffnet **„Ersetzen …“** (öffnet Ersetzen-Modus).

### 4.9 S9 – Muskelauslastung (immer ganz unten)

- Überschrift „Muskelauslastung“ (`h2`), Segment-Umschalter **[Tag A] [Woche]** (heute „Ganzer Plan“ – „Woche“ ist eindeutiger, weil die Werte Sätze pro Woche sind). P2: dritte Option **[Alle aktiven Pläne]** für parallele Pläne (Summe der Wochen aller aktiven Pläne, inkl. dieses Entwurfs).
- Reihenfolge der Inhalte: **Figur-Slot** (Vorder- und Rückansicht nebeneinander, Platzhalter bis zur Grafik) → **Balken „Arbeitssätze pro Muskelgruppe“** mit Orientierungslinie 10 Sätze/Woche (nur in „Woche“) → **Hinweise** (nur „Woche“) → **Einzelmuskeln** (eingeklappt).
- **Legende** direkt unter den Balken (B15): „Hauptmuskel = 1 Satz, Hilfsmuskel = ½ Satz. Orientierung: etwa 10 Arbeitssätze pro Muskelgruppe und Woche für Muskelaufbau – kein Muss.“
- **Reihum-Pläne**: Wochenwerte = Summe der Tagessätze × (Trainings pro Woche ÷ Anzahl Tage). Text daneben: „bei 3 Trainings pro Woche“ (B10).
- **Einzelmuskeln**: standardmäßig eingeklappt („Einzelmuskeln anzeigen (23 trainiert)“); aufgeklappt nach Gruppe, nur trainierte und solche mit Hinweis; „Alle 81 zeigen“ wie heute. Tiefe Muskeln mit Kennzeichen „tief“ (heute vorhanden).
- **Hinweise ruhiger machen** (B15):
  - „Untrainierte Einzelmuskeln“ nur für Muskeln, die **nicht** `view: 'deep'` sind; tiefe Muskeln nur in der aufgeklappten Liste.
  - Hinweise „Gruppe fehlt/zu wenig“ abhängig vom **Planziel**: Pläne mit Ziel Mobility/Beweglichkeit/Pilates/Kondition/Boxen bekommen keine Volumen-Hinweise, nur die Balken. Ziel kommt aus der Vorlage (`goals`) oder aus einem neuen Feld `plan.goal` (S4, P2). Ohne Ziel: Hinweise wie heute.
  - Jeder Hinweis hat ein Symbol (ⓘ Information / ⚠ Ungleichgewicht) und Text; max. 3 sichtbar, Rest unter „Weitere Hinweise (n)“.
  - Hinweis ausblenden: ✕ pro Hinweis („Für diesen Plan ausblenden“), gespeichert in `plan.dismissedHints[]` (P2).
- Leerzustand (keine Übungen): Figur-Slot grau, Text „Sobald du Übungen hinzufügst, siehst du hier, welche Muskeln trainiert werden.“
- Die Balken sind eine Definitionsliste (heute `dl`), Werte als Text sichtbar; das Diagramm ist `aria-hidden`. Beibehalten.

### 4.10 S10 – Speichern, Validierung, Verlassen

**Regeln (Prüfung beim Speichern, nicht beim Tippen)**
| Problem | Vermeidung (bevor es ein Fehler wird) | Wenn trotzdem: Text DE / EN |
|---|---|---|
| Name leer | Vorschlag „Mein Plan n“ beim Anlegen eines leeren Plans | „Gib dem Plan einen Namen.“ / „Give the plan a name.“ |
| Kein Tag | Leerer Plan startet mit Tag A | „Füge mindestens einen Trainingstag hinzu.“ / „Add at least one training day.“ |
| Tag ohne Übungen | – | „Tag B hat noch keine Übungen.“ / „Day B has no exercises yet.“ |
| Tagesname leer (Reihum) | Vorbelegung „Tag X“; leeres Feld beim Verlassen des Feldes wird wieder „Tag X“ | „Gib Tag B einen Namen.“ / „Name day B.“ |
| Wochentag fehlt | Automatische Verteilung beim Umschalten (4.4) | „Wähle für Tag B mindestens einen Wochentag.“ / „Pick at least one weekday for day B.“ |
| Wdh. „bis“ < „von“ | Beim Verlassen des Felds werden die Werte getauscht und kurz markiert („8–12“ statt „12–8“), Live-Ansage „Bereich auf 8 bis 12 korrigiert“ | – |
| Wdh./Sek. leer oder 0 | Leeres Feld beim Verlassen → vorheriger Wert wiederhergestellt | „Kniebeuge, Satz 2: Wiederholungen fehlen.“ / „Squat, set 2: repetitions missing.“ |

**Ablauf bei Fehlern** (heutige Logik beibehalten, Darstellung geändert):
1. Speichern antippen → Prüfung.
2. Fehlerzusammenfassung als Banner **oben** unter der Kopfleiste (`role="alert"`, `tabindex="-1"`, erhält Fokus): „2 Dinge fehlen noch“ + Liste; **jeder Eintrag ist ein Link**, der zum Tag wechselt, das Feld fokussiert und es in Sicht scrollt.
3. Felder: `aria-invalid="true"`, Fehlertext darunter per `aria-describedby`, Symbol + Text (nicht nur Farbe). Tag-Chips mit Fehler zeigen das Fehlersymbol.
4. Nach Korrektur verschwindet der Eintrag aus dem Banner sofort (Live-Prüfung erst **nach** dem ersten Speicherversuch).

**Speichern erfolgreich**
- Neuer Plan → `/diary?plan=<id>` (Anforderung: fertiger Plan geht direkt ins Tagebuch), Snackbar im Tagebuch: „Plan „X“ angelegt. Wähle einen Tag und starte das Training.“
- Bearbeiteter Plan → zurück zur Herkunft (Planansicht oder Liste), Snackbar „Gespeichert“.
- Entwurf wird gelöscht (heute vorhanden).

**Speichern fehlgeschlagen** (Speicher voll / später Server): Snackbar ohne Zeitlimit `role="alert"`: „Speichern hat nicht geklappt. Dein Entwurf ist sicher.“ + „Erneut versuchen“. Editor bleibt offen.

**Verlassen**
- ← mit Änderungen: Sheet „Änderungen speichern?“ mit **Speichern** · **Als Entwurf behalten** · **Verwerfen**. „Verwerfen“ ist der einzige Fall mit echter Rückfrage, weil er nicht rückgängig zu machen ist (bewusst, nicht als `window.confirm`).
- Browser-Zurück / Tab schließen: Entwurf ist ohnehin gespeichert; **kein** `beforeunload`-Dialog. Beim nächsten Öffnen: Banner „Ungespeicherte Änderungen von <Zeit> wiederhergestellt · Verwerfen“ (heute vorhanden, Zeitangabe ergänzen).
- Planliste zeigt Pläne mit offenem Entwurf mit Kennzeichen „✎ Entwurf“ in der Meta-Zeile (P2), damit nichts vergessen wird.

### 4.11 Querschnitt: Snackbar mit Rückgängig

- Eine Komponente `Snackbar` (neu, `src/components/ui/`), eine zur Zeit; neue ersetzt alte (die alte Aktion bleibt über ↶ rückgängig machbar).
- Position: unten, über der Fußleiste bzw. 16 px über dem unteren Rand; Desktop unten links. Max. 2 Zeilen Text + ein Text-Button.
- Dauer: **8 s**, pausiert bei Hover und Fokus; schließt nicht, solange der Fokus darin ist. Fehler-Snackbars ohne Zeitlimit. (Undo bleibt zusätzlich über ↶ im Editor erreichbar, daher ist das Zeitlimit unkritisch, WCAG 2.2.1.)
- `role="status"` (`aria-live="polite"`), Fehler `role="alert"`. Der Text nennt Objekt und Aktion („Tag B gelöscht (4 Übungen)“).
- Tastatur: F6 / Strg+Z im Editor löst Rückgängig aus; Escape schließt die Snackbar.
- `prefers-reduced-motion`: Einblenden ohne Bewegung.

### 4.12 Texte (Deutsch / Englisch)

Neue oder geänderte Schlüssel. Bestehende Schlüssel (`planEditor.*`, `plans.*`) bleiben, wo nicht genannt. Platzhalter in `{}` wie im Projekt.

| Schlüssel | Deutsch | Englisch |
|---|---|---|
| `plans.title` | Meine Pläne | My plans |
| `plans.create` | Neuer Plan | New plan |
| `plans.activeSection` | Aktiv ({count}) | Active ({count}) |
| `plans.archiveSection` | Archiv ({count}) | Archive ({count}) |
| `plans.emptyText` | Noch kein Plan. Starte mit einer Vorlage oder baue deinen eigenen. | No plan yet. Start from a template or build your own. |
| `plans.chooseTemplate` | Vorlage wählen | Choose a template |
| `plans.emptyPlan` | Leerer Plan | Empty plan |
| `plans.more` | Weitere Aktionen für {name} | More actions for {name} |
| `plans.archive` | Archivieren | Archive |
| `plans.restore` | Wiederherstellen | Restore |
| `plans.deleteKeepsWorkouts` | Löschen (Trainings bleiben) | Delete (workouts stay) |
| `plans.deleteForever` | Endgültig löschen | Delete permanently |
| `plans.archived` | „{name}“ archiviert | "{name}" archived |
| `plans.deleted` | „{name}“ gelöscht | "{name}" deleted |
| `plans.duplicated` | Kopie angelegt | Copy created |
| `plans.lastTrained` | zuletzt: {when} | last: {when} |
| `plans.neverTrained` | noch nie trainiert | not trained yet |
| `plans.exerciseCount` | {count} Übungen | {count} exercises |
| `plans.rotationSummary` | Reihum · {count}×/Woche | Rotation · {count}×/week |
| `plans.durationReached` | Geplante Dauer erreicht – archivieren? | Planned duration reached – archive? |
| `plans.draftBadge` | Entwurf | Draft |
| `common.undo` | Rückgängig | Undo |
| `common.undoAction` | Rückgängig: {action} | Undo: {action} |
| `common.more` | Mehr | More |
| `common.done` | Fertig | Done |
| `planEditor.back` | Zurück | Back |
| `planEditor.settings` | Plan-Einstellungen | Plan settings |
| `planEditor.namePlaceholder` | Name des Plans | Plan name |
| `planEditor.suggestedName` | Mein Plan {number} | My plan {number} |
| `planEditor.leaveTitle` | Änderungen speichern? | Save your changes? |
| `planEditor.leaveSave` | Speichern | Save |
| `planEditor.leaveKeepDraft` | Als Entwurf behalten | Keep as draft |
| `planEditor.leaveDiscard` | Verwerfen | Discard |
| `planEditor.saved` | Gespeichert | Saved |
| `planEditor.created` | Plan „{name}“ angelegt. Wähle einen Tag und starte das Training. | Plan "{name}" created. Pick a day and start training. |
| `planEditor.saveFailed` | Speichern hat nicht geklappt. Dein Entwurf ist sicher. | Saving failed. Your draft is safe. |
| `planEditor.retry` | Erneut versuchen | Try again |
| `planEditor.problemsCount` | {count} Dinge fehlen noch | {count} things are still missing |
| `planEditor.place.gym` / `.home` / `.outdoor` / `.travel` | Studio / Zuhause / Draußen / Unterwegs | Gym / Home / Outdoors / Travel |
| `planEditor.equipment` | Verfügbare Ausstattung | Available equipment |
| `planEditor.equipmentAll` | Alles (Studio) | Everything (gym) |
| `planEditor.equipmentBodyweight` | Nur Körpergewicht | Bodyweight only |
| `planEditor.timesPerWeek` | Trainings pro Woche | Workouts per week |
| `planEditor.startDate` | Start | Start |
| `planEditor.durationWeeks` | Dauer (Wochen) | Duration (weeks) |
| `planEditor.unlimited` | unbegrenzt | no end |
| `planEditor.weekdaysSpread` | Wochentage verteilt | Weekdays assigned |
| `planEditor.day.actions` | Aktionen für {name} | Actions for {name} |
| `planEditor.day.rename` | Umbenennen | Rename |
| `planEditor.day.weekdays` | Wochentage | Weekdays |
| `planEditor.day.alsoDay` | auch {name} | also {name} |
| `planEditor.day.removed` | {name} gelöscht ({count} Übungen) | {name} deleted ({count} exercises) |
| `planEditor.day.allDays` | Alle Tage ({count}) | All days ({count}) |
| `planEditor.entry.actions` | Aktionen für {name} | Actions for {name} |
| `planEditor.entry.replace` | Ersetzen | Replace |
| `planEditor.entry.replaceTitle` | Ersetzen: {name} | Replace: {name} |
| `planEditor.entry.removed` | {name} entfernt | {name} removed |
| `planEditor.entry.movedTo` | Nach {day} verschoben | Moved to {day} |
| `planEditor.entry.copyTo` | Kopieren nach … | Copy to … |
| `planEditor.entry.switchedToSeconds` | Auf Sekunden umgestellt | Switched to seconds |
| `planEditor.entry.setsSingly` | Sätze einzeln | Sets one by one |
| `planEditor.entry.sameForAll` | Alle Sätze gleich setzen | Make all sets the same |
| `planEditor.entry.minOneSet` | Mindestens ein Satz | At least one set |
| `planEditor.set.typeShort.warmup` | A | W |
| `planEditor.set.typeLegend` | A = Aufwärmen | W = warm-up |
| `planEditor.sort` | Sortieren | Reorder |
| `planEditor.sortPosition` | {name}, Position {position} von {count} | {name}, position {position} of {count} |
| `planEditor.picker.titleFor` | Übungen für {day} | Exercises for {day} |
| `planEditor.picker.addSelected` | {count} Übung hinzufügen / {count} Übungen hinzufügen | Add {count} exercise / Add {count} exercises |
| `planEditor.picker.selectHint` | Übungen antippen zum Auswählen | Tap exercises to select them |
| `planEditor.picker.inPlan` | In diesem Plan | In this plan |
| `planEditor.picker.recent` | Zuletzt verwendet | Recently used |
| `planEditor.picker.alreadyOnDay` | schon an {day} | already on {day} |
| `planEditor.picker.planEquipment` | Plan-Ausstattung | Plan equipment |
| `planEditor.picker.noneWithEquipment` | Mit der Ausstattung dieses Plans gibt es dafür keine Übung. | No exercise fits this plan's equipment. |
| `planEditor.picker.showAllEquipment` | Alle Ausstattungen zeigen | Show all equipment |
| `planEditor.picker.createFromQuery` | „{query}“ als eigene Übung anlegen | Create "{query}" as own exercise |
| `planEditor.picker.added` | {count} Übungen hinzugefügt | {count} exercises added |
| `planEditor.preview.select` / `.selected` | Auswählen / Ausgewählt | Select / Selected |
| `planEditor.preview.replaceWith` | Damit ersetzen | Replace with this |
| `planEditor.analysis.week` | Woche | Week |
| `planEditor.analysis.allActivePlans` | Alle aktiven Pläne | All active plans |
| `planEditor.analysis.legend` | Hauptmuskel = 1 Satz, Hilfsmuskel = ½ Satz. Orientierung: etwa 10 Arbeitssätze pro Muskelgruppe und Woche für Muskelaufbau – kein Muss. | Primary muscle = 1 set, secondary = ½ set. Guide: about 10 working sets per muscle group and week for muscle growth – not a rule. |
| `planEditor.analysis.perWeekAt` | bei {count} Trainings pro Woche | at {count} workouts per week |
| `planEditor.analysis.empty` | Sobald du Übungen hinzufügst, siehst du hier, welche Muskeln trainiert werden. | Add exercises to see which muscles they train. |
| `planEditor.analysis.moreHints` | Weitere Hinweise ({count}) | More hints ({count}) |
| `planEditor.analysis.dismissHint` | Für diesen Plan ausblenden | Hide for this plan |
| `templates.filterGoal` / `Place` / `Days` / `Level` | Ziel / Ort / Tage / Niveau | Goal / Place / Days / Level |
| `templates.use` | Vorlage übernehmen | Use template |
| `templates.noMatch` | Keine Vorlage passt zu diesen Filtern. | No template matches these filters. |
| `templates.resetFilters` | Filter zurücksetzen | Reset filters |
| `templates.continueDraft` | Weiter am Entwurf „{name}“ | Continue draft "{name}" |

Tonfall: Du-Form, kurze Sätze, Verben vorn („Plan anlegen“, nicht „Anlegen des Plans“). Keine Ausrufezeichen. Zahlen im Format der Sprache (`toLocaleString`).

### 4.13 Barrierefreiheit – Checkliste für die Abnahme (WCAG 2.2 AA)

| Kriterium | Umsetzung |
|---|---|
| 1.3.1 Info und Beziehungen | Satztabelle als `<table>`; Tage/Übungen als Listen (`ol`); Überschriften `h1` Seite, `h2` Tag-Kopf / Analyse, `h3` Übungsname |
| 1.4.1 Farbe | Fehler, aktiver Tag, gewählte Chips, Satzart: jeweils Symbol oder Text zusätzlich zur Farbe |
| 1.4.10 Reflow | Bei 320 px Breite kein horizontales Scrollen der Seite (nur die Tagesleiste scrollt, mit „Alle Tage“-Alternative) |
| 1.4.13 Inhalt bei Hover/Fokus | Tooltips (`title`) nur ergänzend; keine Hover-only-Inhalte |
| 2.1.1 Tastatur | Alles per Tastatur: Menüs (Pfeile, Escape), Sheets (Fokusfalle, Escape), Sortieren (Buttons) |
| 2.4.3 Fokus-Reihenfolge | Nach Löschen → nächstes Element; nach Hinzufügen → erste neue Karte; nach Schließen eines Sheets → auslösender Button |
| 2.4.11 Fokus nicht verdeckt | `scroll-padding-top/bottom` = Höhe der fixierten Leisten |
| 2.5.7 Ziehbewegungen | Ziehen nur zusätzlich zu ↑/↓ und „Verschieben nach …“ |
| 2.5.8 Zielgröße | 44 × 44 px für alle Buttons, Chips, Checkbox-Zeilen (Projektstandard `sizes.touchTarget`) |
| 3.2.2 Bei Eingabe | Kein automatisches Springen beim Tippen; „von/bis“-Tausch erst beim Verlassen des Felds |
| 3.3.1/3.3.3 Fehler erkennen/Vorschlag | Fehlertexte nennen Ort und Lösung |
| 3.3.7 Redundante Eingabe | Neue Sätze übernehmen Werte des letzten; Ersetzen behält Sätze; eigene Übung übernimmt Suchtext |
| 4.1.2 Name, Rolle, Wert | Alle Icon-Buttons mit `aria-label` inkl. Objektname („Aktionen für Kniebeuge“); Umschalter mit `aria-pressed`/`aria-expanded`/`aria-checked` |
| 4.1.3 Statusmeldungen | Snackbar `role="status"`, Sortier-Ansagen, „n Übungen ausgewählt“ als Live-Region |

---

## 5. Daten- und Architekturänderungen

### 5.1 Planmodell (Erweiterung von Modell 3, keine neue Hauptversion nötig)

Alle neuen Felder sind optional; `migratePlan` setzt Standardwerte beim Lesen. `schemaVersion` bleibt 3, solange nur Felder hinzukommen; für `day.weekdays` (Typänderung) siehe unten.

```text
Plan
  status?: 'active' | 'archived'          // Standard 'active'; ersetzt das geplante isActive
  archivedAt?: ISO-Datum
  createdAt?, updatedAt?: ISO-Zeitstempel  // Sortierung, „zuletzt bearbeitet“
  icon?: 'dumbbell' | 'kettlebell' | 'run' | 'mobility' | 'boxing' | 'heart' | 'bolt' | 'mountain' | 'home' | 'tree' | 'travel' | 'star'
  place?: 'gym' | 'home' | 'outdoor' | 'travel'
  equipment?: string[]                     // IDs aus src/data/equipment; leer/fehlend = keine Einschränkung
  goal?: string                            // ein Ziel aus den Vorlagen-Zielen; steuert Hinweise
  dismissedHints?: string[]                // z. B. 'groupMissing:chest', 'imbalance:pushPull'
  schedule:
    type: 'weekdays' | 'rotation'
    daysPerWeek?: number                   // nur rotation; Standard 3
    startDate?: 'YYYY-MM-DD'
    durationWeeks?: number | null          // null = unbegrenzt
  days[]:
    weekdays?: Weekday[]                   // NEU, ersetzt weekday (siehe Migration)
    weekday?: Weekday | null               // alt, nur noch gelesen
    entries[]:
      groupId?: string | null              // P2: Supersatz-Gruppe; gleiche groupId = Supersatz
      sets[].type: 'working' | 'warmup' | 'drop' | 'failure'   // drop/failure erst P3 in der UI
  weekAdjustments?: { [week: number]: { setsDelta?, rirTarget?, deload?: boolean } }   // P3
```

**Migration `weekday` → `weekdays`:** `weekdays = day.weekdays ?? (day.weekday ? [day.weekday] : [])`. Beim Speichern wird nur `weekdays` geschrieben. Betroffen: `dayTitle`, `orderedDays` (sortiert nach dem frühesten Wochentag), `planProblems` (`noWeekday` wenn `weekdays.length === 0`), Tagebuch-Vorschlag „welcher Tag ist heute dran“ (`src/utils/workoutLog.js`, `src/pages/DiaryPage.jsx`: Tag ist fällig, wenn `weekdays` den heutigen enthält), Vorlagen-Import (`templateToPlan`: gleichnamige Tage mit verschiedenen Wochentagen **nicht** zusammenlegen, Vorlagen bleiben wie sie sind). Erhöht man dafür `schemaVersion` auf 4, bleibt die Umwandlung in `migratePlan`; Empfehlung: **auf 4 erhöhen**, weil sich ein Feldtyp ändert und der Remote-Speicher (`remotePlanStore.js`) daran erkennen kann, ob ein Plan umgewandelt werden muss.

### 5.2 Neue und geänderte Funktionen

**`src/utils/planEditing.js`** (alle rein, testbar)
| Funktion | Zweck |
|---|---|
| `addEntries(plan, dayId, entries)` | Mehrere Übungen in einem Schritt (ein Undo-Schritt) |
| `replaceEntryExercise(plan, dayId, entryId, exerciseId)` | Übung tauschen; behält `id`, `sets`, `restSeconds`, `note`, Position; setzt `muscle`, `perSide` aus der Bibliothek; stellt Dosis auf Sekunden/Wdh. um, wenn sich die Art ändert (Rückgabe `{ plan, unitChanged }`) |
| `moveEntryTo(plan, dayId, entryId, index)` | Für Ziehen (Zielposition statt ±1) |
| `copyEntryToDay(plan, fromDayId, entryId, toDayId)` | Kopieren statt Verschieben (neue `id`) |
| `setDayWeekdays(plan, dayId, weekdays)` | Mehrere Wochentage |
| `spreadWeekdays(plan)` | Automatische Verteilung beim Wechsel auf feste Wochentage (Tabelle in 4.4) |
| `setScheduleType(plan, type)` | ruft bei `'weekdays'` `spreadWeekdays` für Tage ohne Wochentag auf |
| `updateSchedule(plan, changes)` | `daysPerWeek`, `startDate`, `durationWeeks` |
| `makeSetsUniform(plan, dayId, entryId)` | „Alle Sätze gleich setzen“ |
| `normalizeDose(dose)` | tauscht `min`/`max`, wenn `max < min` (für das Verlassen des Felds) |
| `setPlanStatus(plan, status)` | `active`/`archived`, setzt `archivedAt` |
| `groupEntries(plan, dayId, entryIds)` / `ungroupEntry(...)` | Supersätze (P2) |

**`src/utils/workoutPlan.js`**
- `weeklySetsByMuscle(plan)`: bei `rotation` Faktor `daysPerWeek / days.length` (B10). Gleiches in `planAnalysis.js` (`weeklySetsPerMuscle`).
- `planSummary(plan, t)`: liefert `{ scheduleText, dayCount, exerciseCount }` für die Planliste.
- `suggestPlanName(plans, t)`: „Mein Plan n“ mit dem kleinsten freien n.
- `planProblems`: neue Typen nicht nötig; `noWeekday` prüft `weekdays`.

**`src/utils/planAnalysis.js`**
- `analyzePlan(plan, { goal, dismissedHints })`: keine Volumen-Hinweise für Ziele `mobility`, `flexibility`, `pilates`, `conditioning`, `boxing`; `musclesUntrained` ohne `view: 'deep'`; ausgeblendete Hinweise herausfiltern. Hinweise bekommen eine stabile `key` (z. B. `groupMissing:chest`).
- `analyzePlans(plans)`: Summe über mehrere Pläne (P2, „Alle aktiven Pläne“).

**`src/utils/exerciseSearch.js`**
- `filterExercises({ ..., types, equipmentProfile })`: Übung passt, wenn **alle** ihre Lastgeräte (alles außer Bank/Matte/Rack-artige Hilfsmittel) im Profil sind; Körpergewicht-Übungen passen immer.
- `rankByQuery(results, query, language)`: Sortierung Namensanfang > Wortanfang > Teiltreffer.
- `matchesQuery`: zusätzlich Muskelnamen (de/en/latin) der Haupt- und Hilfsmuskeln (P2).
- `recentExerciseIds(workouts, limit = 5)` in `src/utils/workoutLog.js`.

**Hooks und Komponenten**
- `usePlanHistory(initialPlan)` (neu, ersetzt den direkten `setPlan` in `PlanEditor`): Stapel `past[]` (max. 50), `present`, `future[]`; `apply(change, label)`, `undo()`, `redo()`, `canUndo`, `lastLabel`. Kombiniert mit `usePlanDraft` (Entwurf speichert `present`). **Tippen in Textfeldern** wird zu einem Schritt zusammengefasst: gleiche Feld-ID innerhalb von 1 s ersetzt den letzten Schritt statt einen neuen anzulegen.
- `PageLayout`: Prop `hideNavigation` für den Editor.
- Neue UI-Bausteine in `src/components/ui/`: `Snackbar` (+ `SnackbarProvider` im App-Rahmen, damit Meldungen eine Navigation überleben, z. B. „Plan angelegt“ im Tagebuch), `Sheet` (Dialog mit Fokusfalle, Vollbild mobil / zentriert ab 768 px; natives `<dialog>` mit `showModal()` bevorzugen, das bringt Fokusfalle und Escape mit), `Menu` (⋮-Menü mit `role="menu"`, Pfeiltasten), `Stepper`, `NumberField` (Text + `inputMode` + Komma-Parsing).
- `ExercisePicker` wird zum Dialog mit `mode: 'add' | 'replace'` und `selection`-State; die eingebettete Darstellung entfällt.
- `WorkoutPlanCard` wird zur Zusammenfassungskarte; die heutige ausgeklappte Ansicht wandert in eine neue `PlanDetailPage` (`/plans/:planId`).
- Plan-Speicher (`localPlanStore.js`, `remotePlanStore.js`): keine Schnittstellenänderung nötig; Archivieren ist `updatePlan` mit `status`. Für Undo nach Löschen: Plan im Speicher der Snackbar halten und bei „Rückgängig“ mit derselben `id` wieder `addPlan` (Remote-Speicher: `upsert`).

### 5.3 Warum Undo hier billig ist

Alle Änderungen laufen bereits als `edit(current => change(current))` mit unveränderlichen Objekten. Ein Verlaufsstapel speichert nur Referenzen; 50 Schritte kosten praktisch keinen Speicher. Deshalb kann **jede** Rückfrage im Editor entfallen.

---

## 6. Priorisierter Backlog

Jedes Element ist einzeln umsetzbar und testbar (Vitest + Testing Library, DE und EN). Reihenfolge innerhalb einer Priorität = empfohlene Umsetzungsreihenfolge. „AK“ = Abnahmekriterien.

### P1 – Grundbedienung (zuerst)

**P1-1 Verlauf und Rückgängig im Editor**
Umfang: `usePlanHistory`, ↶ in der Kopfleiste, Strg+Z / Strg+Umschalt+Z, `Snackbar`-Baustein.
AK: (1) Jede Änderung im Editor ist mit ↶ rückgängig zu machen, bis zu 50 Schritte. (2) Tippen in einem Feld innerhalb 1 s ist ein Schritt. (3) ↶ hat ein `aria-label` mit der Aktion („Rückgängig: Kniebeuge entfernt“). (4) Entwurf speichert den aktuellen Stand nach Undo. (5) Tests für undo/redo/merge.

**P1-2 Undo statt Bestätigung beim Entfernen (Übung, Satz, Tag)**
Abhängig von P1-1.
AK: (1) Kein `window.confirm` mehr in `EntryEditor.jsx` und `DayEditor.jsx`. (2) Nach dem Entfernen erscheint eine Snackbar mit Objektname und „Rückgängig“ (8 s, pausiert bei Fokus). (3) „Rückgängig“ stellt Element und Position exakt wieder her. (4) Fokus geht auf das nächste Element. (5) Bestehende Tests auf Snackbar umgestellt.

**P1-3 Kopfleiste mit Speichern, Fokus-Modus**
AK: (1) Im Editor ist die untere App-Navigation ausgeblendet (`PageLayout hideNavigation`). (2) Kopfleiste ist fixiert und enthält ←, Titel, ↶, „Speichern“/„Anlegen“; „Speichern“ ist bei jeder Scrollposition sichtbar. (3) Der alte Button-Block zwischen Editor und Analyse entfällt. (4) Fokussierte Felder werden nicht von der Kopfleiste verdeckt (`scroll-padding-top`). (5) ← ohne Änderungen verlässt sofort.

**P1-4 Verlassen-Sheet statt `window.confirm`**
Abhängig von P1-3; braucht `Sheet`.
AK: (1) ← mit Änderungen öffnet ein Sheet mit „Speichern“, „Als Entwurf behalten“, „Verwerfen“. (2) „Als Entwurf behalten“ verlässt den Editor, der Entwurf bleibt und wird beim nächsten Öffnen mit Zeitangabe angeboten. (3) Escape schließt das Sheet ohne Aktion; Fokus zurück auf ←. (4) `PlanEditor.jsx` enthält kein `window.confirm` mehr.

**P1-5 Übungsauswahl als Vollbild-Dialog mit Mehrfachauswahl (mobil)**
AK: (1) „Übungen hinzufügen“ öffnet einen modalen Dialog; Zurück-Taste schließt ihn (URL `?add=`). (2) Zeilen sind 56 px hohe Checkbox-Ziele, ⓘ öffnet die Vorschau. (3) Fußleiste „n Übungen hinzufügen“ fügt alle in Auswahlreihenfolge in einem Undo-Schritt hinzu (`addEntries`). (4) Keine Begrenzung auf 40 Treffer. (5) Kein Scroll-in-Scroll auf dem Handy. (6) Danach Fokus auf die erste neue Karte, Snackbar mit Anzahl und „Rückgängig“.

**P1-6 Filter zusammenlegen: Muskel + Ausstattung**
AK: (1) Zwei Filter-Chips „Muskel“ und „Ausstattung“; die Ausstattung zeigt Arten oben, einzelne Geräte aufklappbar. (2) Trefferzahlen an jeder Option, voneinander abhängig (bestehende `filterOptions`). (3) Aktive Filter sichtbar als entfernbare Chips; „Alle Filter zurücksetzen“. (4) Bei 390 px ist keine Option abgeschnitten (Chips brechen um). (5) Leerzustand mit „Filter zurücksetzen“ und „als eigene Übung anlegen“ (Name aus dem Suchtext).

**P1-7 Übung ersetzen**
AK: (1) ⋮ → „Ersetzen“ öffnet die Auswahl im Ersetzen-Modus mit Abschnitt „Varianten“ oben und vorbelegtem Muskelfilter. (2) Nach dem Ersetzen sind Sätze, Pause, Notiz und Position unverändert. (3) Wechsel zwischen Wdh.- und Zeitübung stellt die Einheit um und meldet es. (4) Ein Undo-Schritt. (5) Unit-Tests für `replaceEntryExercise`.

**P1-8 Übungskarte mit ⋮-Menü und Stepper**
AK: (1) Kartenkopf: Nummer, Name (Button → Vorschau), ⋮; Mülleimer und Einstellrad entfallen aus der Kopfzeile. (2) ⋮ enthält Ersetzen, Pause, Pro Seite, Notiz, Duplizieren, Verschieben nach, Entfernen; per Tastatur bedienbar (Pfeile, Escape). (3) Sätze per Stepper −/＋ (1–20). (4) Zahlenfelder akzeptieren „62,5“ und „62.5“, Mausrad ändert nichts. (5) Meta-Zeile zeigt Pause, pro Seite, Notiz mit Symbol und Text.

**P1-9 Sortiermodus**
AK: (1) „⇅ Sortieren“ schaltet die Liste in kompakte Zeilen mit ↑/↓ (44 px). (2) Jede Bewegung wird angesagt („…, Position 2 von 5“). (3) Fokus bleibt auf dem bewegten Element. (4) „Fertig“ beendet den Modus. (5) Funktioniert für Übungen und (im Sheet „Alle Tage“) für Reihum-Tage.

**P1-10 Tagesleiste mit Namen und Tag-Menü**
AK: (1) Chips zeigen Buchstabe + Name (max. 14 Zeichen) + Anzahl, bei festen Wochentagen zusätzlich die Kürzel. (2) Tag-Kopf mit ⋮ (Umbenennen, Wochentage, Notiz, Duplizieren, Links/Rechts, Löschen). (3) Name/Wochentag/Notiz sind keine dauerhaft offenen Felder mehr, sondern im Sheet S5a. (4) Tage mit Fehler zeigen ein Fehlersymbol. (5) Pfeiltasten wechseln zwischen Chips.

**P1-11 Plan-Kopf kompakt + Plan-Einstellungen im Sheet**
AK: (1) Oben nur Namensfeld, ⚙ und eine Zusammenfassungszeile; die Karte „Allgemein“ entfällt. (2) Beschreibung, Zeitplan, Trainings pro Woche im Sheet S4. (3) Bei 390 px beginnt die erste Übungskarte innerhalb der ersten 400 px unter der Kopfleiste. (4) Wechsel auf „Feste Wochentage“ verteilt Wochentage automatisch, mit Undo-Snackbar.

**P1-12 Leerer Plan: sinnvoller Start**
AK: (1) „Leerer Plan“ erzeugt Zeitplan Reihum (3×/Woche) und „Tag A“ und öffnet die Übungsauswahl. (2) Ist der Name beim Anlegen leer, wird „Mein Plan n“ eingesetzt statt eines Fehlers. (3) Leerer Tagesname wird beim Verlassen des Felds wieder „Tag X“. (4) `max < min` wird beim Verlassen des Felds getauscht.

**P1-13 Reihum: richtige Wochenwerte**
AK: (1) `schedule.daysPerWeek` (Standard 3) wird gespeichert und in S4 einstellbar. (2) `weeklySetsByMuscle` und `weeklySetsPerMuscle` multiplizieren bei Reihum mit `daysPerWeek / Anzahl Tage`. (3) Die Analyse zeigt „bei n Trainings pro Woche“. (4) Tests mit A/B-Plan bei 3×/Woche (Faktor 1,5).

**P1-14 Analyse: Legende und ruhigere Hinweise**
AK: (1) Legende „Hauptmuskel = 1 Satz, Hilfsmuskel = ½ Satz …“ unter den Balken. (2) Einzelmuskeln standardmäßig eingeklappt. (3) Hinweis „untrainierte Einzelmuskeln“ ohne tiefe Muskeln. (4) Max. 3 Hinweise sichtbar, Rest aufklappbar. (5) Umschalter heißt „Tag X | Woche“. (6) Analyse bleibt das letzte Element der Seite.

**P1-15 Planliste: Zusammenfassung und ⋮-Menü, Undo beim Löschen**
AK: (1) Karte zeigt Name (max. 2 Zeilen), Zeitplan-Kurzform, Anzahl Übungen, „zuletzt trainiert“. (2) Nur ▶ und ⋮ als Buttons; ⋮ enthält Bearbeiten, Duplizieren, Löschen. (3) Löschen ohne `window.confirm`, mit Undo-Snackbar; Rückgängig stellt den Plan mit gleicher `id` wieder her. (4) Tage können in der Liste nicht mehr gelöscht werden. (5) Duplikat erscheint unter dem Original und erhält den Fokus.

### P2 – Mehrere Pläne, Komfort, Desktop

**P2-1 Archiv und Status (mehrere aktive Pläne)**
AK: (1) `status` im Modell, Standard `active`. (2) Liste mit Bereichen „Aktiv“ und eingeklapptem „Archiv (n)“. (3) Archivieren/Wiederherstellen über ⋮ mit Undo. (4) Tagebuch bietet nur aktive Pläne an. (5) Konzept-Entscheidung O16 ist angepasst.

**P2-2 Planansicht `/plans/:planId`**
AK: (1) Karte in der Liste führt zur Ansicht mit Tagen, Übungen, Hinweisen, Analyse (nur lesen). (2) Aktionen „▶ Trainieren“ und „✎ Bearbeiten“ sichtbar. (3) Nach Speichern im Editor zurück zur Herkunft.

**P2-3 Vorlagen mit Filtern und Vorschau**
AK: (1) Filter Ziel, Ort, Tage/Woche, Niveau mit Trefferzahlen. (2) Vorschau-Sheet mit Tagen, Übungen, Ausstattung, Wochenbalken, Sicherheitshinweis. (3) Übernehmen nur aus der Vorschau. (4) Offener Entwurf wird als Karte „Weiter am Entwurf“ angeboten statt automatisch geöffnet.

**P2-4 Mehrere Wochentage pro Tag**
AK: (1) `day.weekdays[]`, Migration aus `weekday`, `schemaVersion` 4. (2) Sheet S5a mit 7 Umschaltern. (3) Tagebuch schlägt den Tag an jedem seiner Wochentage vor. (4) Tests für Migration und `orderedDays`.

**P2-5 Ort, Symbol und Ausstattungsprofil pro Plan**
AK: (1) Felder `place`, `icon`, `equipment` in S4. (2) Übungsauswahl filtert standardmäßig nach Plan-Ausstattung, abschaltbar. (3) Symbol und Ort in Planliste und Tagebuch-Planauswahl sichtbar (mit Text).

**P2-6 Desktop: Auswahl als rechte Spalte**
AK: (1) Ab 1 024 px zweispaltig, rechte Spalte 400 px sticky mit Suche/Filtern/Liste/Vorschau. (2) „Hinzufügen zu: <Tag> ▾“ über der Liste. (3) Satztabelle standardmäßig offen. (4) Analyse in voller Breite unten.

**P2-7 „In diesem Plan“ und „Zuletzt verwendet“ in der Auswahl; Suche nach Muskeln**
AK: (1) Ohne Suchtext erscheinen die zwei Abschnitte oben. (2) Suche „trizeps“/„triceps“ findet Übungen mit Trizeps als Haupt- oder Hilfsmuskel. (3) Sortierung nach Treffergüte.

**P2-8 Supersätze**
AK: (1) ⋮ → „Supersatz mit nächster“ verbindet zwei oder mehr benachbarte Übungen (`groupId`). (2) Darstellung A1/A2 mit Verbindungslinie und Text „Supersatz“. (3) Lösen über ⋮. (4) Tagebuch übernimmt die Gruppierung (Anzeige).

**P2-9 Ziehen zum Sortieren**
AK: (1) Griff ⠿ im Sortiermodus, Ziehen mit Maus und Touch. (2) Tastatur: Leertaste aufnehmen, Pfeile, Leertaste ablegen, Escape abbrechen. (3) ↑/↓ bleiben. (4) Ohne neue Bibliothek oder nach ausdrücklicher Freigabe.

**P2-10 Übungen zwischen Tagen kopieren; Wischen zum Entfernen**
AK: (1) ⋮ → „Kopieren nach …“. (2) Wischgeste nach links entfernt mit Undo; Menü bleibt Alternative.

**P2-11 Analyse über alle aktiven Pläne und ausblendbare Hinweise**
AK: (1) Dritte Option „Alle aktiven Pläne“. (2) Hinweise je Plan ausblendbar (`dismissedHints`). (3) Ziel-abhängige Hinweise (`goal`).

**P2-12 Start, Dauer und Hinweis „Dauer erreicht“**
AK: (1) `startDate`, `durationWeeks` in S4. (2) Planliste zeigt nach Ablauf „Geplante Dauer erreicht – archivieren?“ mit Knopf. (3) Kein automatisches Archivieren.

**P2-13 Entwurfs-Kennzeichen in der Planliste**
AK: (1) Pläne mit gespeichertem Entwurf zeigen „✎ Entwurf“. (2) Tipp öffnet den Editor mit dem Entwurf.

### P3 – Fortgeschritten

**P3-1 Wochen planen (Periodisierung, Deload)**
AK: (1) Bei gesetzter Dauer Wochenleiste „Alle Wochen | W1 … Wn“. (2) Pro Woche Sätze ±, RIR-Ziel, Deload (Sätze halbieren). (3) Tagebuch nutzt die Vorgaben der laufenden Woche.

**P3-2 Satzarten Drop und Muskelversagen**
AK: (1) Kürzel D und V mit Legende. (2) Analyse zählt sie als Arbeitssätze. (3) Tagebuch zeigt sie.

**P3-3 Muskelauswahl über die Körperfigur**
Abhängig vom Grafik-Agenten.
AK: (1) Im Muskel-Filter Figur vorne/hinten; Tipp auf einen Muskel filtert nach Übungen mit diesem Muskel (feinste Ebene, `resolveMuscleId`). (2) Jede Figur-Fläche hat einen Namen für Screenreader; Listen-Alternative bleibt.

**P3-4 Animationen in der Vorschau**
Abhängig vom Grafik-Agenten.
AK: (1) Slot 4 : 3 zeigt die Animation. (2) Pause-Button. (3) Standbild bei `prefers-reduced-motion`.

**P3-5 Plan teilen/exportieren**
AK: (1) ⋮ → „Als Datei exportieren“ (JSON) und „Importieren“ auf der Startseite. (2) Import prüft und wandelt mit `migratePlan`.

**P3-6 Aufwärmsätze vorschlagen**
AK: (1) ⋮ der Übung → „Aufwärmsätze hinzufügen“ fügt bei gesetztem Gewicht 2 Sätze (50 % × 8, 75 % × 4, auf 2,5 kg gerundet) als „A“ vorn ein. (2) Undo.

---

## 7. Offene Punkte für die Koordination

1. **O16 ändern** auf „mehrere aktive Pläne, Archiv statt einem aktiven Plan“ (Begründung 3.1).
2. **Neue Bibliothek für Ziehen** (z. B. dnd-kit, kostenlos) nur nach Freigabe des Eigentümers; P1 kommt ohne aus.
3. **Gestaltung** der Sheets, Snackbar, Menüs, Chips und Symbole durch den Design-Agenten; diese Spezifikation legt nur Aufbau, Reihenfolge und Mindestmaße fest.
4. **Grafik-Agent**: Figur-Slots (Analyse vorne/hinten, Mini-Figur in der Vorschau, Figur im Muskelfilter) und Animations-Slot 4 : 3 sind reserviert.

---

## Kanban-Aufgaben

- [P1] Verlauf und Rückgängig im Editor – jede Änderung mit ↶/Strg+Z rückgängig, 50 Schritte, Tippen zusammengefasst
- [P1] Undo statt Bestätigung beim Entfernen – kein window.confirm in Entry/DayEditor, Snackbar mit Rückgängig stellt Position wieder her
- [P1] Kopfleiste mit Speichern, Fokus-Modus – Speichern bei jeder Scrollposition sichtbar, App-Navigation im Editor ausgeblendet
- [P1] Verlassen-Sheet statt window.confirm – ← mit Änderungen bietet Speichern / Entwurf behalten / Verwerfen
- [P1] Übungsauswahl als Vollbild-Dialog mit Mehrfachauswahl – n Übungen auf einmal hinzufügen, keine 40er-Grenze, kein Scroll-in-Scroll
- [P1] Filter zusammenlegen (Muskel + Ausstattung) – zwei abhängige Filter mit Trefferzahlen, bei 390 px nichts abgeschnitten
- [P1] Übung ersetzen – Ersetzen über ⋮ mit Varianten, Sätze/Pause/Notiz/Position bleiben
- [P1] Übungskarte mit ⋮-Menü und Stepper – ein Menü statt Mülleimer+Rad, Sätze per −/＋, Komma-Eingabe für kg
- [P1] Sortiermodus – kompakte Liste mit ↑/↓, Ansage „Position x von n“, Fokus bleibt
- [P1] Tagesleiste mit Namen und Tag-Menü – Chip zeigt Buchstabe+Name+Anzahl, Tagesfelder im Sheet
- [P1] Plan-Kopf kompakt + Einstellungen-Sheet – erste Übung bei 390 px innerhalb 400 px, Wochentage automatisch verteilt
- [P1] Leerer Plan mit sinnvollem Start – Tag A + offene Auswahl, Namensvorschlag statt Fehler
- [P1] Reihum: richtige Wochenwerte – Sätze/Woche mit daysPerWeek ÷ Tage, Test A/B bei 3×/Woche
- [P1] Analyse: Legende und ruhigere Hinweise – ½-Satz-Legende, keine tiefen Muskeln in Hinweisen, max. 3 Hinweise sichtbar
- [P1] Planliste mit Zusammenfassung, ⋮-Menü und Undo-Löschen – Zeitplan/Übungen/zuletzt trainiert sichtbar, Tage nicht mehr in der Liste löschbar
- [P2] Archiv und mehrere aktive Pläne – Bereiche Aktiv/Archiv, Archivieren mit Undo, Tagebuch zeigt nur aktive
- [P2] Planansicht /plans/:planId – Lesen mit Trainieren und Bearbeiten, Rückkehr zur Herkunft
- [P2] Vorlagen mit Filtern und Vorschau – Filter Ziel/Ort/Tage/Niveau, Übernehmen nur aus der Vorschau
- [P2] Mehrere Wochentage pro Tag – weekdays[] mit Migration (Schema 4), Tagebuch schlägt an jedem Wochentag vor
- [P2] Ort, Symbol und Ausstattungsprofil pro Plan – Auswahl filtert nach Plan-Ausstattung, abschaltbar
- [P2] Desktop: Auswahl als rechte Spalte – ab 1 024 px zweispaltig, Satztabelle offen
- [P2] Auswahl: In diesem Plan, Zuletzt verwendet, Suche nach Muskeln – „trizeps“ findet alle Trizeps-Übungen
- [P2] Supersätze – benachbarte Übungen verbinden, Anzeige A1/A2, im Tagebuch sichtbar
- [P2] Ziehen zum Sortieren – Maus/Touch/Tastatur, ↑/↓ bleiben, Bibliothek nur nach Freigabe
- [P2] Übungen zwischen Tagen kopieren, Wischen zum Entfernen – Menü-Alternative bleibt, Undo
- [P2] Analyse über alle aktiven Pläne, ausblendbare Hinweise – dritte Option, Hinweise je Plan ausblendbar, zielabhängig
- [P2] Start, Dauer und Hinweis „Dauer erreicht“ – Hinweis mit Archivieren-Knopf, kein Automatismus
- [P2] Entwurfs-Kennzeichen in der Planliste – „Entwurf“ sichtbar, Tipp öffnet Entwurf
- [P3] Wochen planen (Periodisierung, Deload) – Wochenleiste, Anpassungen pro Woche, Tagebuch nutzt laufende Woche
- [P3] Satzarten Drop und Muskelversagen – Kürzel mit Legende, zählen als Arbeitssätze
- [P3] Muskelauswahl über die Körperfigur – Tipp auf Muskel filtert, Listen-Alternative bleibt
- [P3] Animationen in der Vorschau – 4:3-Slot, Pause-Button, Standbild bei reduzierter Bewegung
- [P3] Plan exportieren und importieren – JSON-Datei, Import mit migratePlan geprüft
- [P3] Aufwärmsätze vorschlagen – 2 Sätze (50 %/75 %) vorn einfügen, rückgängig machbar
