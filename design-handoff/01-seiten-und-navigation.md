# Seiten und Navigation

## Seitenübersicht

| ID | Seite | Route | Status | Untere Navigation |
|---|---|---|---|---|
| `landing` | Startseite | `/` | implementiert | nein |
| `exercises` | Muskelgruppen-Auswahl | `/exercises` | implementiert | ja |
| `muscle-group` | Übungen einer Muskelgruppe | `/exercises/:muscle` | implementiert | ja |
| `plans` | Meine Trainingspläne | `/plans` | implementiert | ja |
| `plan-new` | Trainingsplan erstellen | `/plans/new` | implementiert | ja |
| `plan-edit` | Trainingsplan bearbeiten | `/plans/:planId/edit` | implementiert | ja |

`:muscle` ist einer von `chest`, `back`, `abs`, `shoulders`, `arms`, `legs`.

### Weiterleitungen (implementiert, keine eigene Gestaltung nötig)

| Alte oder ungültige Adresse | Ziel |
|---|---|
| `/home` | `/exercises` |
| `/Workoutplans` | `/plans` |
| `/Create_Plan` | `/plans/new` |
| `/exercises/<unbekannte Gruppe>` | `/exercises` |
| jede andere unbekannte Adresse | `/` |

## Navigation

### Untere Navigationsleiste (implementiert)

Auf allen Seiten außer der Startseite, am unteren Bildschirmrand fixiert (heute 48 px hoch).

| Position | Ziel | Heutiges Icon | Beschriftung (nur für Screenreader) |
|---|---|---|---|
| 1 | Trainingsplan erstellen (`/plans/new`) | Listen-Symbol | „Trainingsplan erstellen“ / „Create workout plan“ |
| 2 | Übungen (`/exercises`) | Haus-Symbol | „Übungen“ / „Exercises“ |
| 3 | Meine Trainingspläne (`/plans`) | Hantel-Symbol | „Meine Trainingspläne“ / „My workout plans“ |
| 4 | Sprachumschalter (Button, kein Link) | Text „DE“ bzw. „EN“ | „Sprache auf Englisch umstellen“ / „Switch language to German“ |

- Der aktive Bereich ist hervorgehoben. Punkt 2 ist auch auf Unterseiten von `/exercises` aktiv, Punkt 3 nur genau auf `/plans`.
- Die Navigation hat heute keine sichtbaren Textbeschriftungen. Ob welche dazukommen, entscheidet das Design.

### Muskelgruppen-Leiste (implementiert)

Nur auf `muscle-group`. Sie klebt oben am Bildschirm (sticky) und enthält:
- einen Zurück-Link zur Muskelgruppen-Auswahl,
- sechs Links zu den Muskelgruppen, die aktive Gruppe ist hervorgehoben.

## Seiten im Detail

### `landing`: Startseite (implementiert)

- Vollflächiges Hintergrundbild (heute ein Foto)
- Überschrift: „Erstelle deinen Trainingsplan“ / „Create your Workoutplan“
- Button „Los geht´s“ / „Let´s Go“ führt zu `/exercises`
- Sprachumschalter oben rechts
- Keine untere Navigation

Screenshot: [screenshots/landing.png](screenshots/landing.png)

### `exercises`: Muskelgruppen-Auswahl (implementiert)

- Raster mit 6 Kacheln (heute 2 Spalten × 3 Zeilen): Brust, Rücken, Bauch, Schultern, Arme, Beine
- Jede Kachel zeigt ein Bild der Muskelgruppe und ihren Namen und führt zu `/exercises/:muscle`
- Die heutigen Bilder sind externe Platzhalter und werden durch Grafiken des Grafik-Agenten ersetzt (siehe [04-grafikbedarf.md](04-grafikbedarf.md))

Screenshot: [screenshots/exercises-muscle-groups.png](screenshots/exercises-muscle-groups.png)

### `muscle-group`: Übungen einer Muskelgruppe (implementiert)

- Oben die Muskelgruppen-Leiste
- Darunter eine Liste von Übungskarten, alphabetisch sortiert, je nach Gruppe 9 bis 31 Übungen
- „Nach oben“-Button, sobald mehr als 500 px gescrollt wurde
- Zustände: Liste, leer (siehe [02-komponenten.md](02-komponenten.md)). Die Übungen sind Teil der App und sofort da, es gibt keinen Lade- oder Fehlerzustand.

Screenshot: [screenshots/exercises-group.png](screenshots/exercises-group.png)

### `plans`: Meine Trainingspläne (implementiert)

- Liste aller gespeicherten Pläne als aufklappbare Karten
- Leerzustand: „Du hast noch keine Trainingspläne.“
- Button „Neuen Trainingsplan erstellen“ führt zu `/plans/new`
- Pro Plan: bearbeiten, löschen (mit Rückfrage), aufklappen
- Aufgeklappt: Beschreibung (falls vorhanden) und die Trainingstage in Wochenreihenfolge
- Pro Tag: löschen (mit Rückfrage), aufklappen, aufgeklappt die Muskelgruppen
- Pro Muskelgruppe: aufklappen, aufgeklappt die Übungen mit Gewicht, Wiederholungen und Sätzen

Es gibt also drei verschachtelte Ebenen zum Aufklappen: Plan, Tag, Muskelgruppe.

Screenshot (leer): [screenshots/plans-empty.png](screenshots/plans-empty.png)

### `plan-new`: Trainingsplan erstellen (implementiert)

Zweistufiges Formular.

**Schritt 1: Plandetails**
- Überschrift „Erstelle deinen Trainingsplan“
- Name (Pflicht, max. 100 Zeichen)
- 7 Wochentage zum Ankreuzen (mindestens einer ist Pflicht)
- Beschreibung (optional, max. 200 Zeichen)
- Button „Weiter“

**Schritt 2: Übungen pro Tag**
- Planname als Überschrift
- Button „Name und Tage bearbeiten“: zurück zu Schritt 1, eingetragene Übungen bleiben erhalten
- Für jeden gewählten Tag ein eigener Formularblock (siehe `DayExercisesForm`)
- Hinweis, falls ein Tag noch keine Übung hat
- Button „Trainingsplan speichern“: speichert und führt zu `/plans`

Screenshot (Schritt 1): [screenshots/plan-new-details.png](screenshots/plan-new-details.png)

### `plan-edit`: Trainingsplan bearbeiten (implementiert)

- Gleiches Formular wie `plan-new`, mit allen Daten vorausgefüllt
- **Startet direkt in Schritt 2.** Schritt 1 heißt hier „Trainingsplan bearbeiten“.
- Speichern-Button: „Änderungen speichern“, danach geht es zu `/plans`
- Unbekannte Plan-ID: Hinweis „Diesen Trainingsplan gibt es nicht.“ mit Link zurück zu `/plans`

## Geplante Seitenelemente

Diese Punkte sind gewünscht, ihre genaue Platzierung ist aber **noch nicht festgelegt**. Details stehen in [07-offene-punkte.md](07-offene-punkte.md).

| ID | Funktion | Status | Betroffene Seiten |
|---|---|---|---|
| `gender-view` | Ansicht für Mann und Frau mit männlichen und weiblichen Figuren | geplant | `exercises`, `muscle-group`, voraussichtlich weitere |
| `muscle-figures` | Muskelfiguren statt der heutigen Muskelgruppen-Bilder, mit hervorgehobener Muskelgruppe von vorne und hinten | geplant | `exercises`, `muscle-group` |
| `exercise-animations` | Übungsanimationen bzw. Videos zu Übungen | geplant | Ort offen (voraussichtlich Übungskarte) |
| `plan-templates` | Plan-Vorlagen: Vorlage auswählen, als eigenen Plan übernehmen und bearbeiten | geplant | neue Seiten, siehe unten |
| `account` | Konto: Registrierung, Anmeldung, Passwort vergessen, Konto löschen, Daten exportieren | geplant | neue Seiten |
| `profile-settings` | Profil und Einstellungen (z. B. Sprache, Ansicht Mann/Frau, Einwilligungen) | geplant | neue Seite |
| `tracking` | Training aus einem Plan starten, Sätze eintragen, Trainingsverlauf | geplant | neue Seiten |
| `analytics` | Auswertungen pro Nutzer, filterbar | geplant | neue Seite |
| `dashboard` | Standard-Dashboard und eigenes, anpassbares Dashboard | geplant | neue Seiten |
| `goals` | Ziele setzen und Fortschritt verfolgen | geplant | neue Seite oder Teil des Dashboards |
| `health-connections` | Daten aus Gesundheits-Apps übernehmen, zuerst per Import der Apple-Health-Exportdatei | geplant | neue Seite |

Für diese Bereiche hat der Nutzer das **Ziel** bestätigt, nicht die Details. Inhalte, Kennzahlen, Filter und Reihenfolge stehen als **Vorschlag** im Gesamtkonzept: [../docs/gesamtkonzept.md](../docs/gesamtkonzept.md). Bitte vor dem Gestalten beim Nutzer klären, welche davon gelten (siehe O12).

## Geplant: Plan-Vorlagen (`plan-templates`)

Vom Nutzer bestätigt: Es soll fertige Trainingsplan-Vorlagen geben, die man als eigenen Plan übernimmt und dann bearbeitet. Die Daten dafür liegen vor (30 Vorlagen aus dem Grafik-Paket, Details in [03-inhalte-und-daten.md](03-inhalte-und-daten.md)). Routen, Navigation und Darstellung sind **noch nicht festgelegt**.

Was feststeht:
- Es gibt eine **Liste der Vorlagen** und eine **Ansicht einer Vorlage** mit ihren Trainingstagen und Übungen.
- Eine Vorlage wird **nicht verändert**. Der Nutzer übernimmt sie als Kopie in „Meine Trainingspläne“ und bearbeitet dort die Kopie.
- Vorlagen enthalten mehr als heutige Pläne: Wiederholungs**bereiche** (z. B. 8–12), Übungen nach Zeit (z. B. 30 Sekunden), Pausenzeiten, Ruhetage und Zyklen, die nicht an Wochentage gebunden sind (z. B. 4 Tage). Das Plan-Formular und die Planansicht müssen das später ebenfalls darstellen können.
- Jede Vorlage hat Sicherheits- und Fortschrittshinweise, die sichtbar bleiben müssen.

Was offen ist, steht in [07-offene-punkte.md](07-offene-punkte.md) (O8–O10).
