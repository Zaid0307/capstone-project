# R09 · App-Leitung → Grafikleitung, Grafik-Kritiker · Nutzerfeedback 3: beide Richtungen abgelehnt

15.11.2026. Betrifft [R09A/R09B](../arbeitspakete.md) und den [Vergleich](../../redesign/r09-vergleich.html).

**Nutzer (wörtlich):** „gefällt mir nicht, sieht nicht modern aus und auch die Bilder sind noch zu weit weg von [den] 2 Beispiel-Mockup-Bildern, die ich genannt hatte.“

Maßstab sind ab jetzt **ausschließlich** die zwei Nutzerreferenzen: [Stilreferenz](../../../nutzer-referenz/stil-referenz-2026-11-13.png) und [Übersichtsreferenz](../../../nutzer-referenz/uebersicht-referenz-2026-11-13.png). Die Oberfläche soll aussehen wie diese Bilder, nicht wie eine klassische helle App mit Karten.

## Was die Referenzen konkret zeigen (bitte genau so umsetzen)

**Oberfläche („Character Sheet“ / HUD-Look)**
- Tiefschwarze Fläche (#000–#07090C), Paneele nur durch **dünne 1-px-Linien** in der Akzentfarbe getrennt, kaum Rundungen, keine weichen Schatten.
- Überschriften in **schmaler Großbuchstaben-Schrift mit Sperrung** (wie „CHAR_MALE_01“, „HEAD VARIATIONS“, „DETAILS“), dazu kurze farbige Unterstriche und Linien, die bis zum Rand laufen. Kleine Labels ebenfalls in Großbuchstaben mit Sperrung (wie „MUSCULAR · ATHLETIC · POWERFUL“, „FRONT / BACK / LEFT / RIGHT“).
- **Eine Leuchtfarbe pro Figur als App-Akzent:** Elektrisch-Blau beim Mann, Neon-Grün bei der Frau. Die Akzentfarbe der ganzen App folgt der gewählten Figur (Einstellungen).
- Kacheln und Detailausschnitte in **dünn gerahmten Rasterfeldern** (wie die „DETAILS“-Leiste).

**Figur als Held**
- Die Figur ist auf „Heute“, im Muskel-Monitor und in der Auswertung **groß und zentral**, nicht ein kleines Bild in einer Karte.
- Stil exakt wie die Stilreferenz: massig, Stencil mit großen schwarzen Negativflächen, leuchtende Konturen, dynamische Haare, Bart beim Mann. Die bisherigen Figuren (V42/V43) sind dafür noch zu weit weg (zu flach, zu wenig Kontrast, zu wenig Muskelvolumen, zu wenig Leuchten).

**Muskeln**
- Muskelübersicht wie in der Übersichtsreferenz: **jeder Muskel bzw. Anteil in eigener Farbe**, mit Legende nach Gruppen (farbiges Quadrat + Gruppenname, darunter die Muskeln).
- Übungsrollen: Primär rot, Sekundär orange, Stabilisator grau, inaktiv dunkel – direkt auf der Figur.

**Übungsbilder**
- Wie die Leiste „BEISPIEL ÜBUNGEN“: schwarze Kacheln, Großbuchstaben-Titel mit Gerät in Klammern, Figur am Gerät, Gerät als graue Linienzeichnung, beteiligte Muskeln farbig.

## Bitte für die nächste Runde
1. **Figuren zuerst:** Vorschlag, wie ihr die Stilreferenz wirklich erreicht. Wenn das 3D-Rendering den Stencil-Look nicht hergibt, bitte ausdrücklich prüfen, ob **2D-Vektorzeichnungen (SVG) im Stencil-Stil** pro Ansicht der bessere Weg sind. Masken lassen sich dann direkt aus denselben Pfaden ableiten. Bitte je Figur eine Vorderansicht als Probe, neben die Referenz gelegt.
2. **Ein Bildschirm statt vieler:** „Heute“ mobil (390 × 844) im Character-Sheet-Look nach dieser Nachricht, mit großer Figur und Muskel-Monitor. Erst wenn der Nutzer diesen einen Bildschirm freigibt, folgen die anderen.
3. Vor der Vorlage beim Nutzer die Probe direkt neben beide Referenzbilder legen und selbst prüfen: „Würde man das für dieselbe App halten?“

Die App-Seite (E07) kann auf Wunsch eine Token-Datei (Farben, Schrift, Linien) nach dieser Beschreibung vorbereiten, damit die Umsetzung in der echten App schnell geht.
