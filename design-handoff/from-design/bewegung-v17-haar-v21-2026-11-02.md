# Bewegung V17 und Haarstudien bis V21 – 02.11.2026

Gesamtauftrag UNVOLLSTÄNDIG. 0 von 194 endgültigen Übungsmedien fertig. Keine Nutzerabnahme, keine App-Integration und kein App-Gesamtdesign. Neuester technischer Bewegungseinstieg: fitness-graphics/production-v13/data/latest-motion-pilots.json. Der kanonische Figurenzeiger bleibt unverändert.

## Neue tatsächliche Bewegung
Beide Figuren besitzen getrennte bearbeitbare Kniebeugen-Arbeitskopien mit nach vorn geführten Armen statt technischer A-Pose: animations/<ID>_skin-v17-forward-arms-pilot.blend. Das ist eine echte geänderte Skelettaktion mit 49 Frames, keine aus Standbildern erfundene Animation. Es wurden je Figur fünf tatsächliche Phasen gerendert (512 x 768 RGBA).

Technisch geprüft: Ellbogen-/Handgelenksziele und unveränderte Fußbewegung gegenüber der Quelle in allen 49 Frames; gepackter Skin unverändert; native Dateien unabhängig ohne MPFB geöffnet. Ausgewertete Körpergeometrie in allen 49 Frames endlich. Zehn Bilder vollständig decodiert, Alpha vorhanden und Körper nicht am Bildrand abgeschnitten. Anfangs- und Endbilder sind je Figur pixelgenau gleich.

## Begrenzter Überschneidungstest
In allen 49 Frames beider Figuren wurden Kernbereiche von linkem Arm, rechtem Arm und Rumpf per Dreiecks-BVH auf mögliche Überschneidungen verglichen: 0 Hinweis-Frames. Bereichsregel: alle Dreieckseckpunkte besitzen über 70 Prozent passende Arm- bzw. spine/pelvis-Gewichte. Schulterübergänge, Haare, Kleidung, andere Körperteile und Umgebung waren AUSGENOMMEN. Das ist keine allgemeine Kollisions-, Anatomie- oder Trainingsfreigabe. Füße wurden auf Knochenpositionen geprüft, nicht auf Sohlenkontakt oder Lastverteilung.

Berichte: validation/skin-v17-forward-arms-pilot.json, skin-v17-image-file-checks.json, skin-v17-core-arm-collisions.json.

## Haarstudien
V18, V18b und V19 wurden visuell verworfen: Kappenform, ungeeignete Strähnenüberdeckung beziehungsweise frei wirkende Seitenteile. Nicht auf die Serienfiguren übernehmen. Dateien bleiben als Diagnose erhalten.

V20 passt die ausdrücklich CC0-gekennzeichnete Haargeometrie von Cortu Johnstone an die echte Figur an. V21 hebt und führt vordere Partien nach hinten; Blau/Schwarz und ursprüngliche Transparenz sind als natives Material angelegt. Herkunft und unveränderte Quelle: data/hair-v20-provenance.json und licenses/cortu-hair-source.md. Keine zusätzliche Installation und kein kostenpflichtiger Dienst.

V21 wurde unabhängig erneut geöffnet. Körperdaten einschließlich UVs, Gewichten, Formschlüsselgeometrie und Skin sowie alle 49 Skelettposen stimmen exakt mit V17 überein. Werte der Formschlüssel ebenfalls identisch. Die neue Haargeometrie ist in allen 49 Frames endlich und folgt dem Kopfknochen mit weniger als 0,00001 m lokalem Fehler. Haar-/Kopf-Kollisionen nicht geprüft. Bericht: validation/skin-v21-native-reopen.json.

Zwei tatsächliche Haar-Nahansichten und eine 768-x-1152-Gesamtansicht sind vorhanden: renders/char_male_01_skin-v21-hair_front.png, *_anatomical_left.png sowie char_male_01_skin-v21-forward-arms-review.png. V21 ist ein weiterer Kandidat: Fransen sind aufgeräumter, die feine, unruhige Textur trifft die kräftig gruppierten Referenzsträhnen noch nicht vollständig. Kein optisches Gesamt-PASS behaupten. Weibliche Frisur unverändert.

## Nächster Produktionsschritt
Keine weiteren Kappen-/globalen Glättungsversuche wiederholen. Tatsächlich eigenständige Kleidungsgeometrie für Shorts sowie weibliches Sporttop/Leggings herstellen, aus der vorhandenen Körperform abgeleitet und mit echten Deformationsgewichten, stabilen Quellvertex-Zuordnungen und überprüftem Abstand. Kein Cloth-Simulationssystem behaupten. Verdeckte Muskelregionen bleiben für spätere deckungsgleiche Masken über der Kleidung erforderlich. Neue Kleidung in Ruhepose und Bewegung prüfen. Danach Haarstil beider Figuren, alle vier Ansichten, Seitennähte und helle Hintergründe weiter prüfen; erst anschließend den Bewegungspilot erweitern und die Bibliothek vervielfältigen. Atlas und restliche Geräte bleiben offen.

## Paket
fitness-graphics-bewegung-v17-haar-v21-2026-11-02.zip ist ein geprüftes ERGÄNZUNGSARCHIV zum vollständigen historischen Stand vom 31.10.; kein eigenständiges fertiges Gesamtpaket. Das globale Manifest beschreibt den gesamten lokalen Produktionsordner, nicht nur diesen ZIP-Inhalt. Ein eigener Paketindex enthält nur tatsächlich enthaltene Dateien und Hashes. Verworfenes bleibt lokal; im Ergänzungsarchiv liegen seine Programme, Prüfbefunde und Bilder, aber nicht alle verworfenen nativen Zwischenkopien.
