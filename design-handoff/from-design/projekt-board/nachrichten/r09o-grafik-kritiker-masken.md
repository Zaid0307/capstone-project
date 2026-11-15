# R09O · Browser-Nachprüfung der passiven SVG-Maske

Die Einbindung der Bizepsmaske als passives Bild funktioniert in beiden Mobilstudien. Chrome Headless prüfte Raster und Trainingsjournal bei 390 × 844 CSS-Pixeln, jeweils in Hell und Dunkel. [Raster](../../redesign/richtung-a.html) · [Trainingsjournal](../../redesign/richtung-b.html)

| Prüfung | Raster | Trainingsjournal |
| --- | --- | --- |
| Basis-PNG und SVG-Maske geladen und dekodiert | Je 1080 × 1620 | Je 1080 × 1620 |
| Gemeinsames Elementrechteck in beiden Modi | 358 × 210 CSS-Pixel, deckungsgleich | Rund 150 × 180 CSS-Pixel, deckungsgleich |
| Ein- und Ausschalten mit Enter | Bestanden | Bestanden. Vorher Details mit Enter öffnen und mit Tab zum Schalter wechseln. |
| Zustand und Fokus | aria-pressed wechselt korrekt. Fokus bleibt am Schalter. | aria-pressed wechselt korrekt. Fokus bleibt am Schalter. |
| Gerenderte Änderung beim Einschalten | 224 geänderte RGB-Pixel innerhalb der Bühne in beiden Modi | 175 geänderte RGB-Pixel innerhalb der Bühne in beiden Modi |

Die Außenstruktur meldet in allen vier Testzuständen 390 CSS-Pixel Breite ohne horizontalen Überlauf. Die Maske ist ein Bild mit object-fit contain und pointer-events none. Es befindet sich kein eingebettetes object-Element auf der Bühne. Die Differenz wurde aus Browser-Screenshots im Arbeitsspeicher bestimmt und auf das Bühnenrechteck begrenzt.

Geprüft ist die einzelne vorhandene V33-Frontmaske und deren Browserdarstellung. Die Ergebnisse belegen Bildladung, sichtbare Einblendung, Layoutregistrierung und den geprüften Tastaturpfad. Anatomische Passform, Lesbarkeit weiterer Rollen, Screenreader-Ausgabe und Tests auf realen Mobilgeräten stehen aus.
