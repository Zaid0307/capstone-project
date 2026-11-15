# G01 / G03 / G06 / A00 · App-Leitung → Grafikleitung, Grafik-Kritiker · Verbindlicher Maßstab für Figuren und Muskeln

15.11.2026. **Nutzer (wörtlich), mit der Übersichtsreferenz:** „das ist schon sehr sehr sehr mein Favorit und ich würde schon gerne das haben, alles andere was designt wurde finde ich nicht so gut. Die Farben und alles ist mir erstmal egal, aber die Figurenform und Muskulatur + Markierung sind perfekt für das, was ich will.“

Referenz: [uebersicht-referenz-2026-11-13.png](../../../nutzer-referenz/uebersicht-referenz-2026-11-13.png)

## Entscheidung

Für **Figuren, Muskulatur, Muskelmarkierung und Übungsbilder** ist ab sofort **genau dieses Bild** der Maßstab, vor allen früheren Vorgaben (auch vor N1 und der Stilreferenz). Die Farben sind dem Nutzer zunächst egal: Die Figurfarbe (heute Rot beim Mann, Lila bei der Frau im Bild) darf ihr festlegt; Blau/Schwarz bzw. Grün/Schwarz ist nicht mehr Pflicht.

## Was übernommen werden soll

1. **Figurenform (Abschnitt „Ansichten“):** massiger, sehr muskulöser Körper in vier Ansichten (vorn, hinten, links, rechts) in derselben App-Pose; jede Muskelform als klar umrandete, plastische Fläche; Gesicht ohne Züge; Haare als Silhouette.
2. **Muskelgruppen-Farbübersicht:** jeder Muskel bzw. Anteil als **eigene, scharf abgegrenzte Farbfläche** (Brust oben/mittel/unten, gerader Bauchmuskel in Segmenten, schräge Bauchmuskeln, Serratus, Deltamuskel vorne/seitlich/hinten, Bizeps-Köpfe, Trizeps-Köpfe, Unterarm, Trapez oben/mittel/unten, Latissimus, Rhomboiden, Teres, Infraspinatus, Rückenstrecker, Quadrizeps-Köpfe, Adduktoren, ischiocrurale Muskeln, Waden, Tibialis anterior, Gesäß) mit Legende nach Gruppen. Die Flächen entsprechen unseren Muskel-IDs ([Muskelmodell V2](../../../../docs/muskelmodell-v2.md)), damit die App jede Fläche einzeln färben kann.
3. **Farblogik bei Übungen:** Primär, Sekundär, Stabilisator, inaktiv – direkt als Füllung der Muskelflächen.
4. **Übungsbilder:** wie die Leisten „BEISPIEL ÜBUNGEN“ – Figur am Gerät (Bank, Kurzhanteln, Barren, Klimmzugstange, Kabelzug, Langhantel, Beinpresse, Maschinen), Gerät als Linienzeichnung, beteiligte Muskeln farbig nach Rolle. Bewegungs- und Gerätedaten stehen im [Übungskatalog V2](../../../uebungskatalog-v2/README.md).
5. Die **Dateistruktur** aus dem Bild (`male_front.svg` … `male_muscle_regions.json`, Ordner `exercises/` mit einer SVG je Übung) ist erwünscht. Maßgeblich sind die Muskel- und Übungs-IDs der App.

## Bitte als nächstes (vor allem anderen)

Eine **Probe Mann, Vorder- und Rückansicht, als SVG**, in der jede Muskelfläche ein eigener Pfad mit App-ID ist, einmal einfarbig (Ansicht) und einmal als Farbübersicht wie im Bild. Neben die Referenz legen; der Kritiker prüft Form und Abgrenzung gegen das Bild. Danach Frau, dann die ersten Übungsbilder. Wenn der 3D-Weg diese klare, flächige Muskelzeichnung nicht liefert, bitte auf gezeichnete 2D-Vektoren umsteigen.

Das UI-Mockup („moderne Apps“, [R09c](2026-11-15-r09c-app-an-grafik-moderne-referenz.md)) läuft parallel weiter, hat aber Vorrang nach dieser Figurenprobe.
