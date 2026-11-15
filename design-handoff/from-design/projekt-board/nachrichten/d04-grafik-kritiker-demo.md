# D04 · Unabhängiger Test der GetFit-Demo

15.11.2026. Chrome Headless hat die lokale Demo bei 390 × 844 und 1280 × 800 CSS-Pixeln geladen. Die visuelle Ablehnung durch den Nutzer bleibt maßgeblich. Die Prüfung unten betrifft die Demo-Funktion und gibt keine Stilfreigabe. [Demo](../../redesign/demo.html)

## Funktion im Browser

| Prüfung | Befund |
| --- | --- |
| Navigation | Heute, Kalender, Pläne, Auswertung und Übungen schalten bei beiden Größen auf die jeweilige Ansicht. Der aktive Eintrag trägt aria-current. Keine horizontalen Überläufe in den geprüften Routen. |
| Bilder | Navigationsbilder und V43-Figur auf Heute dekodiert. Das weibliche Beckenheben-Standbild dekodiert mit 640 × 440 px. Der Beckenheben-Clip befand sich zum Prüfzeitpunkt im Renderlauf. |
| Kniebeugenvideos | Beide Figuren laden je einen viersekündigen Clip mit 384 × 576 px. Der Browser meldet bereitgestellte Medien ohne gemeldeten Fehler. |
| Satz eintragen | Ein Satz mit 10 Wiederholungen erscheint in der Trainingsansicht. Nach dem Speichern liegt der Fokus am Ansichtscontainer. |
| Theme | Der Schalter setzt das Eltern-Dokument auf Hell und ändert seine Beschriftung passend. Das Theme innerhalb der separaten Auswertung wurde hierbei nicht mitgeprüft. |
| Auswertung | Das lokale Dokument im Auswertungsrahmen lädt bei beiden Größen. Rahmenbreite 343 bzw. 1047 px. Interaktionen innerhalb des Rahmens waren in diesem Durchlauf außerhalb des Umfangs. |

Die Klicks und die Satzeingabe wurden programmgesteuert im gerenderten Dokument ausgelöst. Vollständige Tastaturfolge, reale Medienwiedergabe, Touch und persistente Speicherung wurden nicht geprüft.

## Drei visuelle Änderungen nach der Nutzerablehnung

1. **Referenznahe Figuren als großer Prüfgegenstand.** Schulterkappen, Brust, Rücken, Oberschenkel und Waden müssen auch neutral beleuchtet erkennbare Volumina zeigen. Vorder- und Seitenansicht aus derselben Haltung vergleichen. Die Stencil-Negativflächen sollen diesen Formen folgen. In der Demo bekommt die Figur in der Detailansicht eine große Bühne, damit Silhouette und Muskeltrennung unmittelbar sichtbar sind.
2. **Übung und Gerät wie in der zweiten Referenz zusammen darstellen.** Eine aussagekräftige Ganzkörper-Komposition auf schwarzer Bühne mit passendem Gerät, klarer Ausgangs- und Endpose und gezielten Rollenfarben ausarbeiten. Eine kompakte Legende gehört direkt an das Bild. Das erste Beispiel soll die reale Gerätenutzung und erkennbare Ziel-, Hilfs- und Stabilisatormuskeln zeigen.
3. **Inhalte als Arbeitsfläche ordnen.** Mobil klar zwischen nächstem Training, Wochenstatus und letztem Eintrag unterscheiden. Zahlen mit ruhiger Typografie und sichtbaren Einheiten setzen. Auf dem Desktop Kennzahlen und Muskelkarte im selben Raster platzieren. Weniger gleich gewichtete, umrandete Karten und gleichmäßige Abstände schaffen eine deutlichere Hierarchie.

[Stilreferenz](../../../nutzer-referenz/stil-referenz-2026-11-13.png) · [Übersichtsreferenz](../../../nutzer-referenz/uebersicht-referenz-2026-11-13.png)
