# Eigenständige Kleidung und natürliche Form – 02.11.2026

UNVOLLSTÄNDIG. 0 von 194 endgültigen Übungsmedien fertig. Nutzerergänzung verbindlich festgehalten in 00-natuerliche-anatomie-und-app-pruefung.md: Körper, Muskeln und Bewegung sollen natürlich wirken; App-Agent prüft erst nach vollständiger Produktion die Einbindung. Keine vorgezogene Integrationsanfrage und keine App-Quellcodeänderung.

## Tatsächlich neu
Drei eigenständige, bearbeitbare Kleidungsobjekte: männliche Shorts, weibliche Leggings und Sporttop. Echte native Kontrollnetze, UVs, Skelettgewichte, Glättung und 0,8-mm-Solidify-Schicht; keine Stoffsimulation. Nach einer problematischen direkten Hautkopie V22 wurde die vorhandene CC0-hm08-Kleidungshülle (helper-tights, Quellvertices 15328–18001) verwendet. Ihre 2674 Vertices sind tatsächlich gewichtet. Originale Körper-/Skin-Daten blieben unverändert.

Aktuelle Kleidungs-Arbeitskopien: animations/char_male_01_skin-v26-pattern-candidate.blend und animations/char_female_01_skin-v25-local-clearance-candidate.blend unter fitness-graphics/production-v13/. Einstieg: data/latest-garment-candidates.json. Das ist KEINE Änderung des freigegebenen kanonischen Figurenstatus.

## Technischer Befund und gezielte Korrektur
V22 meldete 22 männliche bzw. 263 weibliche negative Vertex-Abstandshinweise in fünf Phasen. Andere globale Snap-/Offset-Varianten V23 erfüllten die Kriterien nicht. Die gröbere Kleidungshülle V24 senkte die Hinweise auf 6 bzw. 1. Drei Strahlrichtungen bestätigten an diesen sieben Punkten Eindringen; sie wurden nicht als harmlose Normalenabweichung wegargumentiert.

Bei der Frau behebt eine begrenzte zusätzliche Normalenprojektion um die betroffene Kniezone den Hinweis. Beim Mann wird eine örtliche Stoffzugabe von 10 mm über den editierbaren Formschlüssel Local_crotch_pattern_allowance verwendet; 5 mm reichten nicht. Die ursprüngliche Shorts-Geometrie bleibt in Basis erhalten. Keine Körperform, Körper-UVs, Körpergewichte, Skin-Ressource oder Skelettposen verändert.

Beide gespeicherten Korrekturdateien unabhängig wieder geöffnet: Körperdaten und alle 49 Skelettposen stimmen exakt mit ihrer Quelle überein; alle 49 Kleidungsframes besitzen endliche Geometrie und stabile Kantentopologie, die übertragenen Deformationsgewichte stimmen mit der Quelle überein. Geschlossene Solidify-Kleidungsnetze in der geprüften Topologie (keine Kante mit anderer als zweifacher Flächenbelegung). In den fünf Abstandsstichproben keine Vertices mehr unter -0,5 mm gegenüber der nächsten Körperdreiecksnormalen. Das ist weder ein Vollflächen-Schnitt-Test noch allgemeine Kollisions- oder Anatomiefreigabe. Alle Bewegungen bleiben unfreigegeben.

## Sichtprüfung
V24 besitzt vier echte neutrale Ansichten plus Bewegungsframe je Figur, 720 x 1080. Zusätzlich sechs neutrale Material-/Lichtdiagnosen ohne das verdeckende Stencil-Muster. Die korrigierten Fassungen besitzen je eine Frontansicht auf Alpha und Weiß sowie einen tatsächlichen Bewegungsframe, ebenfalls 720 x 1080. Dateien vollständig decodiert; Alpha-/Weißvarianten geprüft. Figuren sind auf Weiß lesbar.

Die Formprüfung ist NICHT abgeschlossen: unruhige Säume, erhöhte Mittelpartie am Bund, Schulter-/Hüft-/Knieformen, tatsächliche Muskelvolumen im Verhältnis zur Ink-Zeichnung sowie Frisuren und echte Trainingsschuhe benötigen weitere Arbeit. Die neutrale Diagnostik ist keine geänderte App-Palette und keine neue Gesichtsfreigabe. Verdeckte Muskeln müssen im Atlas später weiterhin über der Kleidung hervorgehoben werden. Keine Muskelebenen oder endgültigen Übungsloops aus dieser Kleidung ableiten.

## Nächster Schritt
Kleidungskanten/Bund gezielt glätten und natürliche Körper-/Gelenkform weiter beurteilen. Für die bislang unnatürlichen Schuh- und Haarplatzhalter sind nur offizielle Vorschaubilder geprüft: shoes04 (neutraler Schuh), short01 und ponytail01 könnten als CC0-Quellen geeignet sein. Ihre Meshes sind noch NICHT geladen oder eingebaut. Körper- und Stencil-Palette bewahren. Danach kanonische Ansichten/Seitennähte, Atlas und den kleinen Bewegungspilot abschließen; erst danach Serienbibliothek. App-Agent erst zum tatsächlichen Abschluss zur Prüfung bitten, ausschließlich per Datei in from-design.

## Belege
validation/skin-v22-garment-native-audit.json; skin-v23-clearance-trials.json; skin-v24-garment-native-audit.json; skin-v24-flagged-point-rays.json; skin-v24-no-wrap-trial.json; skin-v25-local-clearance-trials.json; skin-v25-female-clearance-audit.json; skin-v26-male-pattern-trials.json; skin-v26-male-pattern-audit.json; selected-garment-view-checks.json. Programme liegen unter source/.

Ergänzungsarchiv fitness-graphics-kleidung-v26-2026-11-02.zip: Arbeitsstand, kein eigenständiges finales Gesamtpaket. Paketindex nennt die enthaltenen Dateien; das globale Manifest beschreibt den vollständigen lokalen Produktionsordner. Historische Quellen und verworfene Kandidaten bleiben lokal erhalten.
