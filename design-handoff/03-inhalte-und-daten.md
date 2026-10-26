# Inhalte und Daten

## Sprachen

- Deutsch und Englisch, umschaltbar. Die Wahl wird im Browser gespeichert.
- Beim ersten Besuch gilt die Browsersprache, sonst Englisch.
- Alle Oberflächentexte stehen in `src/i18n/translations.js` (rund 90 Texte, für beide Sprachen gleich viele).
- **Deutsche Texte sind oft deutlich länger**, zum Beispiel „Wiederholungen:“ statt „Repetitions:“ oder „Neuen Trainingsplan erstellen“. Layouts müssen beide Längen tragen.
- Übungsnamen und Beschreibungen kommen aus der Übungsdatenbank. Fehlt eine deutsche Übersetzung, wird die englische angezeigt. Auf einer deutschen Seite können also englische Übungstexte stehen.

## Übungsdatenbank (Quelle: wger.de, implementiert)

Die Daten werden beim Start der App geladen.

| Feld | Angezeigt | Hinweis |
|---|---|---|
| Name | ja | 1 bis über 40 Zeichen |
| Beschreibung | ja | 0 bis mehrere hundert Zeichen, kann leer sein |
| Bild | ja | Nur etwa 280 von 930 Übungen haben ein Bild, Format und Seitenverhältnis sind sehr unterschiedlich |
| Video | **nein** | Wird geladen, aber noch nicht angezeigt. Nur 46 Übungen haben Videos. |
| Primäre Muskeln | nein | Wird nur zur Zuordnung zur Muskelgruppe genutzt |
| Sekundäre Muskeln | nein | Wird geladen, aber nicht angezeigt |

Ungefähre Anzahl Übungen je Gruppe: Brust 104, Rücken 185, Bauch 125, Schultern 135, Arme 164, Beine 245. Eine Übung kann in mehreren Gruppen vorkommen.

## Muskelgruppen

| Schlüssel | Deutsch | Englisch |
|---|---|---|
| `chest` | Brust | Chest |
| `back` | Rücken | Back |
| `abs` | Bauch | Abs |
| `shoulders` | Schultern | Shoulders |
| `arms` | Arme | Arms |
| `legs` | Beine | Legs |

## Trainingsplan (Datenmodell, implementiert)

Gespeichert im Browser (`localStorage`). Es gibt keine Benutzerkonten und keinen Server.

```
Plan
├─ Name                (Text, max. 100)
├─ Beschreibung        (Text, max. 200, optional)
└─ Trainingstage[]     (1 bis 7, immer in Wochenreihenfolge Mo → So)
   └─ Muskelgruppen[]  (automatisch nach den Übungen gruppiert)
      └─ Übungen[]
         ├─ Übung             (Text, max. 50)
         ├─ Gewicht in kg     (Zahl, Dezimal erlaubt)
         ├─ Wiederholungen    (Zahl ≥ 1)
         └─ Sätze             (Zahl ≥ 1)
```

Die Übungen im Plan sind **Freitext**. Sie sind nicht mit der Übungsdatenbank verknüpft, es gibt also im Plan weder Bild noch Beschreibung zu einer Übung.

## Inhalte pro Seite

| Seite | Angezeigte Inhalte |
|---|---|
| `landing` | Überschrift, Start-Button, Sprachumschalter, Hintergrundbild |
| `exercises` | 6 Muskelgruppen (Bild und Name) |
| `muscle-group` | Muskelgruppen-Leiste, Übungskarten (Name, Bild oder Platzhalter, Beschreibung) |
| `plans` | Pro Plan: Name, Beschreibung, Tage, Muskelgruppen, Übungen (Name, Gewicht, Wiederholungen, Sätze) |
| `plan-new` / `plan-edit` Schritt 1 | Titel, Name, 7 Wochentage, Beschreibung |
| `plan-new` / `plan-edit` Schritt 2 | Planname, pro Tag das Formular und die Liste der Übungen |

## Alle Meldungstexte (Zustände)

| Situation | Deutsch | Englisch |
|---|---|---|
| Übungen laden | Übungen werden geladen … | Loading exercises … |
| Laden fehlgeschlagen | Die Übungen konnten nicht geladen werden. | The exercises could not be loaded. |
| Erneut laden | Erneut versuchen | Try again |
| Gruppe ohne Übungen | Für diese Muskelgruppe wurden keine Übungen gefunden. | No exercises found for this muscle group. |
| Kein Bild | Kein Bild vorhanden (nur Screenreader) | No image available |
| Keine Pläne | Du hast noch keine Trainingspläne. | You have no workout plans yet. |
| Kein Tag gewählt | Bitte wähle mindestens einen Trainingstag. | Please choose at least one training day. |
| Tag ohne Übung | Füge mindestens eine Übung hinzu für: {Tage} | Add at least one exercise for: {days} |
| Tag ohne Übungen (Liste) | Noch keine Übungen hinzugefügt. | No exercises added yet. |
| Plan nicht gefunden | Diesen Trainingsplan gibt es nicht. | This workout plan does not exist. |

Die übrigen Texte stehen vollständig in `src/i18n/translations.js`.
