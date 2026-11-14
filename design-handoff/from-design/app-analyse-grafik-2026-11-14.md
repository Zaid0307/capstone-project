# B2 – App-Analyse aus Grafiksicht

14.11.2026. Geprüft wurde die laufende lokale App in 390 × 844 und 1280 × 800 CSS-Pixeln. Der gestartete Vite-Server nutzte den Projektport 3000. In einem getrennten Browserprofil wurde die Vorlage „Muskelaufbau Ganzkörper 3 Tage“ gespeichert und ein Training mit zwei Wiederholungseinträgen angelegt. 19 Zustände pro Format wurden aufgenommen. Darunter Start, Heute, Kalender, Pläne, Vorlagen, beide Planeditor-Routen, Übungsauswahl und -vorschau, Auswertung und Übungsdetail, Übungen und eine repräsentative Muskelgruppe, Einstellungen, Tagebuch und Training. [Mobil](app-analyse-screens/kontaktbogen-mobil.png) · [Desktop](app-analyse-screens/kontaktbogen-desktop.png)

## 1. Platz und Größe

| Grafikstelle | 390 × 844 | 1280 × 800 | Konsequenz |
|---|---:|---:|---|
| Plan-Editor, Muskel-Monitor für Tag und Plan | 311 × 160 | 896 × 160 | Mobil Vorder-/Rückansicht umschalten. Desktop bietet Platz für beide Ansichten, wenn die Fläche höher wird. |
| Auswertung, Muskelfigur | 311 × 160 | 656 × 160 | Gleiche Figuren und Masken wie im Editor. Die Höhe begrenzt die Detailgröße stärker als die Breite. |
| Übungsvorschau, 21er-Langhantelcurl | 300 × 225 | 645 × 256 | Medien vollständig einpassen. Für Geräte mit großer Breite quadratischen Ausschnitt testen. Ein 4:5-Clip braucht ggf. eine höhere Medienfläche. |
| Einstellungen, Figurwahl | Auswahl vorhanden | Auswahl vorhanden | Derzeit keine Bildfläche. Kleine Vorschau aus dem gleichen Figurenexport ableiten. |
| Navigation und Training | Navigation 24 px laut Styles | Navigation 24 px laut Styles | 24er-SVG für Navigation und Aktionen. Kalender und Training verwenden kompakte Status- und Aktionszeichen. |

Die gemessenen Flächen sind Platzhalter, keine verbindlichen Exportmaße. Ein Figurenrahmen in 2:3 mit 1080 × 1620 px bietet Platz für Figur, Maske und Skelett im selben Koordinatensystem. Bei aktuell 160 px Höhe schrumpft eine 2:3-Ansicht auf rund 107 px Breite. [Messwerte](app-analyse-screens/messwerte.json) · [Plan-Monitor mobil](app-analyse-screens/mobil-muskelmonitor-plan.png) · [Vorschau mobil](app-analyse-screens/mobil-uebungsvorschau.png)

## 2. Lesbarkeit

Für Brachialis, Teres minor und einzelne Trizepsköpfe ist die aktuelle Platzhalterhöhe zu klein für zuverlässig unterscheidbare Regionen. Das ist eine Schlussfolgerung aus der gemessenen Größe und den vorhandenen Maskenstudien. Die App zeigt dort noch Platzhalter. Für Beta 1 eine einzelne größere Figur auf dem Handy und einen Detailausschnitt beim Antippen vorsehen. Die bestehende Muskelliste bleibt als beschrifteter Zugang zur Auswahl nutzbar. Auf dem Desktop kann eine Ansicht neben der Liste stehen. Zwei Ansichten sind sinnvoll, wenn ihre Höhe ausreicht.

## 3. Farben

Die laufende helle App verwendet Weiß und die Flächenfarben #F4F7F8 und #E8EFF2. Das Blau/Schwarz und Grün/Schwarz der Figuren passt grundsätzlich auf diese hellen Flächen. V43 zeigt auf dunklem Grund weiterhin geringe Trennung zwischen schwarzer Kleidung und Hintergrund. Beta 1 braucht deshalb eine Prüfung auf hellem und dunklem Grund mit derselben Pose und denselben Masken. Der Dark Mode war in den Einstellungen angekündigt. Die dunkle App-Oberfläche selbst war hier nicht testbar.

Rot und Orange brauchen bei kleinen benachbarten Masken eine sichtbare Grenze und eine beschriftete Legende. Grau für Stabilisatoren muss sich gegen die dunkle Grundfigur und auf hellen Flächen absetzen. Die Masken neutral ausliefern, Rollenfarben in der App vergeben. [Einstellungen](app-analyse-screens/mobil-einstellungen.png)

## 4. Icons

Im Live-Test belegt sind die fünf Navigationsziele und Einstellungen als Aktion auf Heute. Die Übungsübersicht zeigt sechs bebilderte Gruppen. „Sonstiges“ erscheint als Filter in der Übungsauswahl. Die vorhandenen Muskelgruppenbilder und Hantel-Fallbacks zeigen den Bedarf für eigene Gruppenzeichen. Editor, Kalender, Training und Auswertung zeigen Bedarf für Hinzufügen, Details/Info, Zurück, Schließen, Rückgängig, Löschen/Entfernen, Überspringen, L/R, Status und Diagramm/Tabelle. Die acht Trainingsarten und Geräte werden in der Übungsauswahl aktuell als Text angezeigt. Ihre Symbole sind als spätere Ergänzung der vorhandenen Filter einzuplanen.

Für die 92 bestellten Icons sind derzeit keine Streichungen belegt. Kandidaten zur Wiederverwendung sind Details und Info sowie Löschen und Satz entfernen. Sie brauchen weiterhin verständliche Beschriftungen. Ein eigener Platz für das Skelettsymbol und für Figur-Miniaturen fehlt noch. Außerhalb der Bedarfsliste sind die Monatswechselpfeile, „Nach oben“ sowie getrennte Diagramm-/Tabellendarstellung im Bestand sichtbar oder im Code belegt. [Übungsübersicht](app-analyse-screens/mobil-uebungen.png) · [Kalender](app-analyse-screens/mobil-kalender.png) · [Training](app-analyse-screens/mobil-training.png)

## 5. Stil

Startseite und Referenz teilen dunklen Kontrast, aber die Startseite verwendet ein Foto. Die übrige App nutzt helle Karten, Petrol und einfache Linienzeichen. Die vorhandenen blauen Muskelgruppen-Illustrationen wirken kleinteiliger und anders als die kontrastreichen Stencil-Figuren. Klare Flächen und neutrale SVGs erleichtern die Einbindung. Der Befund betrifft die Grafikkompatibilität der heutigen Oberfläche.

## 6. Folgen für Beta 1

- Zuerst dieselben Vorder-/Rückkameras für beide Figuren festlegen. Figuren und Masken transparent bei 1080 × 1620 bzw. mit exakt gleichem SVG-Bezugsrahmen liefern. Eine Skelettprobe nur gemeinsam mit ihrer registrierten Figurenansicht anbieten.
- Den Muskel-Monitor zuerst mit einer größeren umschaltbaren Ansicht mobil und einem Ausschnitt für kleine Muskeln prüfen. Die feinen Regionen bestimmen die Mindestgröße.
- Die ersten fünf Übungen der vereinbarten Prioritätenliste bilden die erste Gruppe: Glute Bridge, Cat Cow, Plank, Calf Raise und Kurzhantel-Schulterdrücken. Pro Figur eine Schleife und ein passendes Standbild. Quadratische Clips zuerst gegen die gemessenen Flächen testen. Figur, Gerät und Bodenkontakt vollständig im Bild halten. Ziel sind höchstens rund 2 MB je Clip.
- Die Live-App zeigt 28 Vorlagen und 99 Übungen. Für Beta 1 gilt die vereinbarte Prioritätenliste mit 97 IDs. Sit-up und lockerer Dauerlauf bleiben spätere Aufgaben.
- Für eine erste Einbindungsprobe eine Übung und einen Maskensatz mit Rot, Orange und Grau prüfen. Die maximal 160 px hohen Altflächen und die Dark-Mode-Darstellung brauchen dabei einen Integrationscheck mit der Entwicklung.

Die Screenshots zeigen die Live-App vor Einbindung neuer Grafikdateien. src blieb unverändert.
