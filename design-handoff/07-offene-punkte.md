# Offene Punkte und Abhängigkeiten

Diese Punkte sind **nicht entschieden**. Bitte nicht eigenmächtig festlegen, sondern beim Nutzer nachfragen oder als Varianten vorschlagen.

## Fragen an den Nutzer

| Nr. | Frage | Kontext |
|---|---|---|
| O1 | Wo wird zwischen Mann und Frau umgeschaltet: einmal in einer Einstellung, direkt auf den Seiten, oder beides? | Wurde gefragt, ist noch unbeantwortet. Eine Einstellungsseite gibt es heute nicht. |
| O2 | Welche Farben bekommen die Figuren? | Ein Entwurf zeigt Mann rot und Frau lavendel, die Referenzbögen zeigen Mann blau und Frau grün. Der Nutzer wünschte „männliche Farben“ und „weibliche Farben“. |
| O3 | Wo und wie werden Übungsanimationen bzw. Videos gezeigt? | Gewünscht, Ort und Bedienung offen |
| O4 | Sollen Trainingsverlauf, Muskel-Analyse und Statistiken kommen? | Nur als Anregung genannt („SmartGym … deren Figuren und Analyse-Features“), nicht bestätigt |
| O5 | Soll die App auch für Tablet und Desktop gestaltet werden? | Heute nur Handy |
| O6 | Soll es einen Dark Mode geben? | Heute nicht vorhanden. Die Referenzbögen der Figuren haben einen schwarzen Hintergrund. |
| O7 | Bleibt der App-Name „GetFit!“? | Steht in der README, der Seitentitel lautet heute „Workout Plan“ |

## Abhängigkeiten zum Grafik-Agenten

| Thema | Was der Designer-Agent liefert | Was der Grafik-Agent liefert |
|---|---|---|
| Figuren in Kacheln und Leisten | Größe, Ausschnitt, Rahmen, Hintergrund | Figuren in passender Auflösung bzw. als vereinfachte Fassung |
| Hervorhebung der Muskelgruppen | Farbe der Hervorhebung im Zusammenspiel mit der Palette | deckungsgleiche Varianten oder Masken pro Muskelgruppe |
| Animationen | Abspielbereich, Bedienelemente | Animationsdateien im abgestimmten Format |
| Hintergrund der Figuren | Seitenhintergrund | Figuren freigestellt (transparent) |

Die Farbe der Muskelhervorhebung muss zur App-Palette passen **und** auf dem Hintergrund der Figuren gut zu erkennen sein. Das sollten beide Agenten gemeinsam abstimmen.

## Bekannte Lücken im Ist-Zustand

Diese Punkte gehören zur Entwicklung. Sie sind hier aufgeführt, weil sie das Design berühren.

- Die Muskelgruppen-Bilder werden heute von einer fremden Seite geladen und müssen ersetzt werden.
- App-Icons und `manifest.json` fehlen (siehe [04-grafikbedarf.md](04-grafikbedarf.md)).
- Bestätigungsdialoge sind Browser-Dialoge und lassen sich nicht gestalten.
- Im Plan sind die Übungen Freitext ohne Verbindung zur Übungsdatenbank. Bilder oder Animationen können deshalb im Plan heute nicht angezeigt werden.
