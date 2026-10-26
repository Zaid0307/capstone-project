# User Flows

Alle Flows sind **implementiert**, außer dort, wo es anders steht.

## F1: Erster Besuch

1. Startseite (`/`): Überschrift, Start-Button, Sprachumschalter
2. Optional: Sprache umschalten
3. „Los geht´s“ führt zur Muskelgruppen-Auswahl (`/exercises`)

## F2: Übungen entdecken

1. Muskelgruppen-Auswahl: Kachel antippen, zum Beispiel „Brust“
2. `/exercises/chest`: Liste der Übungskarten, sofort sichtbar
   - **Leer:** Hinweis „keine Übungen gefunden“ (bei den heutigen Daten nicht der Fall)
3. In der Muskelgruppen-Leiste eine andere Gruppe antippen: Die Liste wechselt
4. Weit gescrollt: Der „Nach oben“-Button erscheint
5. Zurück-Pfeil oder Zurück-Taste des Browsers führt zur Muskelgruppen-Auswahl

## F3: Trainingsplan erstellen

1. Untere Navigation „Trainingsplan erstellen“ oder Button auf `/plans` führt zu `/plans/new`
2. **Schritt 1:** Name eingeben, Tage ankreuzen, optional eine Beschreibung, dann „Weiter“
   - Name leer: Der Browser meldet das Pflichtfeld, es geht nicht weiter
   - Kein Tag gewählt: Fehlermeldung unter den Tagen. Sie verschwindet, sobald ein Tag angekreuzt wird.
3. **Schritt 2:** Für jeden Tag Übungen eintragen
   - Muskel wählen, Übung, Gewicht, Wiederholungen und Sätze eingeben, dann „Übung hinzufügen“
   - Die Übung erscheint in der Liste dieses Tages, die Felder werden geleert, der Muskel bleibt gewählt
   - Optional: Übung bearbeiten (Stift), siehe F5
   - Optional: Übung entfernen (Papierkorb, ohne Rückfrage)
   - Optional: „Name und Tage bearbeiten“ führt zurück zu Schritt 1, bereits eingetragene Übungen bleiben erhalten
4. „Trainingsplan speichern“
   - Hat ein Tag keine Übung: Hinweis mit den betroffenen Tagen, es wird nicht gespeichert
   - Sonst: Der Plan wird gespeichert, weiter zu `/plans`

## F4: Trainingsplan ansehen

1. `/plans`: Liste der Pläne, alle zugeklappt
2. Plan aufklappen: Beschreibung und Trainingstage erscheinen
3. Tag aufklappen: Die Muskelgruppen dieses Tages erscheinen
4. Muskelgruppe aufklappen: Die Übungen mit Gewicht, Wiederholungen und Sätzen erscheinen

## F5: Trainingsplan bearbeiten

1. `/plans`: Stift-Icon beim Plan führt zu `/plans/<id>/edit`
2. Das Formular öffnet direkt in **Schritt 2** mit allen Übungen
3. **Übung ändern:** Stift bei der Übung, die Werte erscheinen im Formular, die Übung ist in der Liste markiert, dann „Übung speichern“ oder „Abbrechen“
4. **Name, Beschreibung oder Tage ändern:** „Name und Tage bearbeiten“, Schritt 1 ist vorausgefüllt, dann „Weiter“
   - Wird ein Tag abgewählt, fallen seine Übungen beim Speichern weg
5. „Änderungen speichern“: Der Plan wird an seiner Stelle aktualisiert, weiter zu `/plans`

## F6: Löschen

- **Plan löschen:** Papierkorb am Plan, Rückfrage, bei „OK“ wird der Plan entfernt
- **Tag löschen:** Papierkorb am Tag (im aufgeklappten Plan), Rückfrage, bei „OK“ wird der Tag entfernt
- **Letzten Tag eines Plans löschen:** Die Rückfrage bietet an, den ganzen Plan zu löschen. Bei „OK“ wird der Plan entfernt, denn ein Plan ohne Tage ist nicht sinnvoll.
- Bei „Abbrechen“ bleibt alles unverändert

## F7: Sprache wechseln

Von jeder Seite aus über den Sprachumschalter. Alle Texte wechseln sofort, auch die Übungsnamen und Beschreibungen.

## F8: Alte oder ungültige Adresse

Alte Lesezeichen und unbekannte Adressen werden weitergeleitet (siehe [01-seiten-und-navigation.md](01-seiten-und-navigation.md)). Eine eigene 404-Seite gibt es nicht.

## Geplante Flows (noch nicht spezifiziert)

| Flow | Status | Bekannt | Offen |
|---|---|---|---|
| Ansicht Mann/Frau wechseln | geplant | Es soll eine männliche und eine weibliche Ansicht geben | Wo umgeschaltet wird, ob die Wahl gespeichert wird |
| Muskelgruppe auf der Figur ansehen | geplant | Figur mit hervorgehobener Gruppe, vorne und hinten | Einbindung in F2 |
| Übungsanimation ansehen | geplant | Animationen bzw. Videos zu Übungen | Ort, Bedienung |
| Plan-Vorlage übernehmen | geplant | Vorlage ansehen, als eigenen Plan kopieren, Kopie bearbeiten. Das Original bleibt unverändert. | Einstieg, Navigation, Filter, Darstellung |
| Anmelden, Training protokollieren, auswerten, Ziele verfolgen, Gesundheitsdaten übernehmen | geplant | Ziel vom Nutzer bestätigt | Abläufe im Detail offen, Vorschlag in `docs/gesamtkonzept.md` |
