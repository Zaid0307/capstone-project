# Komponenten und Zustände

Alle Komponenten sind **implementiert**, sofern nicht anders angegeben. Der Pfad zeigt, wo sie im Code liegen (`src/components/...`). So lassen sich Gestaltungsvorgaben später eindeutig zuordnen.

## Grundbausteine (`ui/`)

### Button: `ui/Button.js`
Textbutton mit zwei Varianten.

| Variante | Einsatz heute |
|---|---|
| `primary` | „Weiter“, „Übung hinzufügen“, „Übung speichern“, „Abbrechen“, „Erneut versuchen“, „Los geht´s“ |
| `secondary` | „Name und Tage bearbeiten“, „Trainingsplan speichern“, „Änderungen speichern“ |

Zustände: normal, Hover, Fokus (Tastatur). Ein deaktivierter Zustand wird heute nicht genutzt.

Hinweis: „Abbrechen“ nutzt heute die Variante `primary`. Ob eine eigene Variante für sekundäre Aktionen nötig ist, entscheidet das Design.

### IconButton: `ui/IconButton.js`
Button nur mit Icon, hat immer eine Beschriftung für Screenreader. Einsatz: Bearbeiten, Löschen, Entfernen.
Zustände: normal, Hover, Fokus, „gedrückt“ (`aria-pressed`, beim Bearbeiten einer Übung).

### ToggleButton: `ui/ToggleButton.jsx`
Auf- und Zuklappen mit Auge-Icon (offen bzw. geschlossen).
Zustände: zugeklappt, aufgeklappt (`aria-expanded`). Beschriftung: „{Name} anzeigen“ / „{Name} ausblenden“.

### ItemHeader: `ui/ItemHeader.jsx`
Kopfzeile mit zentriertem Titel und Aktionsbuttons rechts. Wird verwendet in Planskarte, Trainingstag, Muskelgruppe im Plan und Übung im Formular.

### Message: `ui/Message.js`
Hinweisbox für Laden, Fehler, Leerzustand und „nicht gefunden“. Kann einen Button oder Link enthalten.

### Center, ScreenReaderOnly
Nur für Layout und Barrierefreiheit, ohne eigene Gestaltung.

## Layout (`layout/`)

### PageLayout: `layout/PageLayout.jsx`
Rahmen jeder Seite außer der Startseite: Inhaltsbereich plus untere Navigation. Der Hintergrund des Inhaltsbereichs ist heute ein Farbverlauf.

### BackToTopButton: `layout/BackToTopButton.jsx`
Schwebender runder Button unten rechts. Er erscheint erst, wenn mehr als 500 px gescrollt wurde, und scrollt sanft nach oben.
Zustände: unsichtbar, sichtbar, Hover, Fokus.

## Navigation (`navigation/`)

### Navigation: `navigation/Navigation.jsx`
Untere Leiste mit drei Links und dem Sprachumschalter (siehe [01-seiten-und-navigation.md](01-seiten-und-navigation.md)).
Zustände pro Link: normal, aktiv, Fokus.

### LanguageSwitch: `navigation/LanguageSwitch.jsx`
Button, der die jeweils **andere** Sprache anzeigt: „EN“, wenn Deutsch aktiv ist, und „DE“, wenn Englisch aktiv ist. Wird in der Navigation und auf der Startseite verwendet.

## Übungen (`exercises/`)

### MuscleGroupPicker: `exercises/MuscleGroupPicker.jsx`
Raster aus 6 Kacheln (Bild und Name).
Zustände pro Kachel: normal, Hover, Fokus, gedrückt.

### MuscleGroupNav: `exercises/MuscleGroupNav.jsx`
Klebende Leiste oben mit Zurück-Link und 6 Muskelgruppen-Links, nur mit Bild (Beschriftung für Screenreader).
Zustände pro Link: normal, aktiv (aktuelle Gruppe), Fokus.

### ExerciseCard: `exercises/ExerciseCard.jsx`
Karte für eine Übung aus der Datenbank.

| Element | Inhalt |
|---|---|
| Titel | Übungsname |
| Bild | Bild aus der Datenbank, sonst Platzhalter-Icon (Hantel) |
| Text | Beschreibung als Fließtext |

- Die Karte hat heute eine feste Höhe, längere Beschreibungen scrollen innerhalb der Karte.
- Bilder werden erst geladen, wenn sie in den sichtbaren Bereich kommen.
- Zustände: mit Bild, ohne Bild (Platzhalter), sehr kurzer bzw. sehr langer Text.

## Trainingspläne anzeigen (`workoutPlans/`)

### WorkoutPlanCard: `workoutPlans/WorkoutPlanCard.jsx`
- Kopfzeile: Planname und die Aktionen Bearbeiten, Löschen, Auf-/Zuklappen
- Aufgeklappt: Beschreibung (nur wenn vorhanden) und eine Liste von `PlanDay`
- Löschen fragt nach (heute über den Browser-Dialog, siehe unten)

Zustände: zugeklappt, aufgeklappt, mit bzw. ohne Beschreibung, ohne Tage (nur bei Plänen aus älteren App-Versionen möglich).

### PlanDay: `workoutPlans/PlanDay.jsx`
- Kopfzeile: Wochentag in Großbuchstaben, Löschen, Auf-/Zuklappen
- Aufgeklappt: Liste von `PlanMuscle`

Zustände: zugeklappt, aufgeklappt, ohne Muskelgruppen (bei alten Daten möglich).

### PlanMuscle: `workoutPlans/PlanMuscle.jsx`
- Kopfzeile: Name der Muskelgruppe, Auf-/Zuklappen
- Aufgeklappt: eine `ExerciseDetails` pro Übung

### ExerciseDetails: `workoutPlans/ExerciseDetails.jsx`
Liste aus Beschriftung und Wert: Übung, Gewicht (in kg), Wiederholungen, Sätze. Wird auch im Formular verwendet.

## Formulare (`planForm/`)

### PlanForm: `planForm/PlanForm.jsx`
Steuert die beiden Schritte für Erstellen und Bearbeiten.
Zustände: Schritt 1, Schritt 2, Hinweis „Tage ohne Übungen“ (erscheint nur nach einem Speicherversuch).

### PlanDetailsForm: `planForm/PlanDetailsForm.jsx`

| Feld | Typ | Regeln |
|---|---|---|
| Name | Text | Pflicht, max. 100 Zeichen, nur Leerzeichen gilt als leer |
| Trainingstage | 7 Checkboxen (heute eigene Gestaltung) | mindestens 1 |
| Beschreibung | Text | optional, max. 200 Zeichen |

Zustände:
- leer
- vorausgefüllt (beim Bearbeiten)
- Fehler „Bitte wähle mindestens einen Trainingstag.“
- Pflichtfeld Name leer: Den Hinweis zeigt heute der Browser selbst an
- Checkbox: an, aus, Fokus

### DayExercisesForm: `planForm/DayExercisesForm.jsx`
Ein Block pro Trainingstag.

| Feld | Typ | Regeln |
|---|---|---|
| Muskel | Auswahlliste mit 6 Muskelgruppen und Platzhalter „Bitte auswählen“ | Pflicht |
| Übung | Text | Pflicht, max. 50 Zeichen |
| Gewicht | Zahl | Pflicht, ≥ 0, Dezimalstellen erlaubt (z. B. 12,5) |
| Wiederholungen | Zahl | Pflicht, ≥ 1 |
| Sätze | Zahl | Pflicht, ≥ 1 |

Zustände:
- **Hinzufügen:** Button „Übung hinzufügen“
- **Bearbeiten:** Felder mit den Werten der gewählten Übung gefüllt, Buttons „Übung speichern“ und „Abbrechen“, die bearbeitete Übung in der Liste hervorgehoben
- Liste leer: „Noch keine Übungen hinzugefügt.“
- Liste mit Übungen (`ExerciseListItem`)
- Nach dem Hinzufügen bleibt die gewählte Muskelgruppe ausgewählt, die übrigen Felder werden geleert

### ExerciseListItem: `planForm/ExerciseListItem.jsx`
Übung in der Formularliste: Kopfzeile mit Muskelgruppe, Bearbeiten und Entfernen, darunter `ExerciseDetails`.
Zustände: normal, wird gerade bearbeitet.

## Systemdialoge

| Dialog | Text | Heute |
|---|---|---|
| Plan löschen | „Möchtest du den Trainingsplan „{Name}“ wirklich löschen?“ | Browser-Dialog (`window.confirm`) |
| Tag löschen | „Möchtest du {Tag} aus „{Name}“ wirklich löschen?“ | Browser-Dialog (`window.confirm`) |
| Letzten Tag eines Plans löschen | „{Tag} ist der letzte Tag in „{Name}“. Möchtest du den ganzen Trainingsplan löschen?“ Bei Bestätigung wird der ganze Plan gelöscht. | Browser-Dialog (`window.confirm`) |

Browser-Dialoge lassen sich nicht gestalten. Wenn das Design einen eigenen Bestätigungsdialog vorsieht, setzt die Entwicklung ihn um.

## Komponenten, die es noch nicht gibt

Für die bestätigten Pläne in [07-offene-punkte.md](07-offene-punkte.md) werden voraussichtlich gebraucht:

| Komponente | Status | Hinweis |
|---|---|---|
| Umschalter Mann/Frau | geplant | Ort und Form offen (Einstellung oder auf den Seiten) |
| Muskelfigur-Ansicht (vorne und hinten, hervorgehobene Gruppe) | geplant | Grafiken vom Grafik-Agenten, Rahmen und Platzierung vom Design |
| Animations- bzw. Videoplayer für Übungen | geplant | Bedienelemente (Abspielen, Pause, Wiederholen) noch nicht festgelegt |
| Diagramme und Statistiken | vorgeschlagen | nicht bestätigt, bitte nicht ohne Rückfrage gestalten |

Filter gibt es in der App heute nicht. Die Auswahl der Muskelgruppe ist die einzige Filterfunktion.
