# Inhalte und Daten

## Sprachen

- Deutsch und Englisch, umschaltbar. Die Wahl wird im Browser gespeichert.
- Beim ersten Besuch gilt die Browsersprache, sonst Englisch.
- Alle Oberflächentexte stehen in `src/i18n/translations.js` (rund 90 Texte, für beide Sprachen gleich viele).
- **Deutsche Texte sind oft deutlich länger**, zum Beispiel „Wiederholungen:“ statt „Repetitions:“ oder „Neuen Trainingsplan erstellen“. Layouts müssen beide Längen tragen.
- Übungsnamen und Beschreibungen gibt es für alle Übungen auf Deutsch und Englisch.

## Übungsdatenbank (eigene Daten, implementiert)

Die Übungen sind Teil der App (`src/data/`), es wird nichts aus dem Internet geladen. Namen und IDs stammen aus dem Katalog des Grafik-Pakets, Beschreibungen und Muskelzuordnungen sind selbst geschrieben und noch nicht von einer Fachperson geprüft.

| Feld | Angezeigt | Hinweis |
|---|---|---|
| Name | ja | Deutsch und Englisch, 5 bis 33 Zeichen |
| Beschreibung | ja | Deutsch und Englisch, 2 bis 3 Sätze (102 bis 206 Zeichen) |
| Kategorie | nein | Kraft, Halten, Mobility, Dehnen, Yoga, Pilates, Boxen, Cardio |
| Geräte | nein | 32 Geräte mit deutschem und englischem Namen, z. B. Langhantel, Kabelzug, Matte |
| Hauptmuskeln | nein | Bestimmen die Muskelgruppe der Übung. Aus 39 Muskeln mit deutschem, englischem und lateinischem Namen. |
| Hilfsmuskeln | nein | Werden später für die Muskelkarten gebraucht |
| Bild / Animation | nein | Gibt es noch nicht, kommt vom Grafik-Agenten |

Insgesamt 97 Übungen. Anzahl je Gruppe: Brust 12, Rücken 22, Bauch 9, Schultern 12, Arme 12, Beine 31. Eine Übung kann in mehreren Gruppen vorkommen, zum Beispiel Dips in Brust und Arme. 8 Cardio- und Boxübungen haben keine Hauptmuskeln und erscheinen in keiner Muskelgruppe.

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

## Plan-Vorlagen (Daten vorhanden, Funktion geplant)

Quelle: `data/training-plans.json` im Grafik-Paket. 30 Vorlagen, davon 23 eigene und 7 „inspiriert von“ bekannten Athleten (siehe O9).

| Feld | Inhalt |
|---|---|
| Name, Beschreibung | Deutsch (Englisch fehlt noch) |
| Ziel | z. B. Muskelaufbau, Kraft, Mobility |
| Niveau | Einsteiger bis Fortgeschrittene |
| Ort | Studio, zu Hause, gemischt |
| Trainingstage pro Woche und Zykluslänge | z. B. 3 Tage pro Woche, Zyklus 7 Tage; eine Vorlage hat einen 4-Tage-Zyklus |
| Tage | Training, Ruhetag, Mobility, Pilates oder Boxen, jeweils mit Namen |
| Einträge pro Tag | Übung (aus der Übungsdatenbank), Sätze, Wiederholungsbereich **oder** Dauer in Sekunden, Pause in Sekunden, Ziel-Reserve (RIR) |
| Fortschritt | Text, wie die Belastung gesteigert wird |
| Sicherheit | Hinweise, z. B. ärztliche Freigabe bei Schmerzen oder Schwangerschaft |
| Filter „women_interest“ | redaktionelle Sammlung, ausdrücklich **keine** Zugangsbeschränkung |

Umfang: 656 Einträge, 69 verschiedene Übungen, alle in der Übungsdatenbank vorhanden.

## Alle Meldungstexte (Zustände)

| Situation | Deutsch | Englisch |
|---|---|---|
| Gruppe ohne Übungen | Für diese Muskelgruppe wurden keine Übungen gefunden. | No exercises found for this muscle group. |
| Kein Bild | Kein Bild vorhanden (nur Screenreader) | No image available |
| Keine Pläne | Du hast noch keine Trainingspläne. | You have no workout plans yet. |
| Kein Tag gewählt | Bitte wähle mindestens einen Trainingstag. | Please choose at least one training day. |
| Tag ohne Übung | Füge mindestens eine Übung hinzu für: {Tage} | Add at least one exercise for: {days} |
| Tag ohne Übungen (Liste) | Noch keine Übungen hinzugefügt. | No exercises added yet. |
| Plan nicht gefunden | Diesen Trainingsplan gibt es nicht. | This workout plan does not exist. |

Die übrigen Texte stehen vollständig in `src/i18n/translations.js`.
