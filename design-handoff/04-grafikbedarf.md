# Grafikbedarf

Die Größenangaben beziehen sich auf die heutige Darstellung in CSS-Pixeln auf einem 390 px breiten Handy. Sie sind Orientierung für die Lieferformate, keine Designvorgabe. Wenn das Design andere Größen vorsieht, gelten diese.

## Zuständigkeiten

| Grafik | Zuständig |
|---|---|
| Fitnessfiguren Mann und Frau, Muskelkarten, Übungsanimationen | **Grafik-Agent** |
| Icons, App-Icons, Illustrationen für Leer- und Fehlerzustände, Hintergründe | **Designer-Agent** |
| Platz, Rahmen und Größe der Figuren und Animationen im Layout | **Designer-Agent** |

## Icons (Designer-Agent)

Heute kommen alle Icons aus der Bibliothek `react-icons`. Sie können durch eigene ersetzt werden.

| Icon | Wo | Heutige Größe | Status |
|---|---|---|---|
| Trainingsplan erstellen | untere Navigation | 40 px | implementiert |
| Übungen | untere Navigation | 40 px | implementiert |
| Meine Trainingspläne | untere Navigation | 40 px | implementiert |
| Zurück (Pfeil) | Muskelgruppen-Leiste | 30 px | implementiert |
| Nach oben | schwebender Button | 30 px | implementiert |
| Bearbeiten (Stift) | Planskarte, Übung im Formular | ca. 20 px | implementiert |
| Löschen / Entfernen | Planskarte, Tag, Übung im Formular | ca. 20 px | implementiert |
| Anzeigen / Ausblenden (Auge) | Plan, Tag, Muskelgruppe | ca. 20 px | implementiert |
| Hinzufügen (Plus) | Button „Neuen Trainingsplan erstellen“ | 20 px | implementiert |
| Platzhalter ohne Bild (Hantel) | Übungskarte | 50 px | implementiert |
| Checkbox-Markierung | Wochentage | ca. 16 px | implementiert (heute nur CSS) |

**Lieferformat:** SVG, einfarbig, sodass die Farbe per Code gesetzt werden kann (`currentColor`), auf ein quadratisches Raster von 24 px ausgelegt.

## Muskelgruppen-Bilder (Grafik-Agent, Layout vom Designer-Agent)

Heute sind das Platzhalter-Icons, die direkt von einer fremden Seite (visualpharm.com) geladen werden. **Sie müssen ersetzt werden.**

| Einsatz | Heutige Größe | Anzahl |
|---|---|---|
| Kacheln der Muskelgruppen-Auswahl | 80 px breit | 6 |
| Muskelgruppen-Leiste | 30 px breit | 6 |

Geplant ist, sie durch die Muskelfiguren des Grafik-Agenten zu ersetzen, mit hervorgehobener Muskelgruppe. Wie die Figur in einer kleinen Kachel oder einem 30-px-Icon dargestellt wird, also ganze Figur, Ausschnitt oder vereinfachte Fassung, entscheidet das Design zusammen mit dem Grafik-Agenten.

## Fitnessfiguren und Muskelkarten (Grafik-Agent, geplant)

Vom Nutzer gewünscht:
- eine Ansicht für Männer und eine für Frauen, mit männlichen und weiblichen Figuren
- Muskelgruppen hervorgehoben, von vorne und hinten
- muskulöse Figuren mit Haaren, aber ohne Gesicht

**Bedarf pro Geschlecht:**

| Bild | Anzahl |
|---|---|
| Grundfigur vorne, ohne Hervorhebung | 1 |
| Grundfigur hinten, ohne Hervorhebung | 1 |
| Hervorhebung je Muskelgruppe (6) × vorne und hinten | 12 |

Daraus ergeben sich für Mann und Frau zusammen **28 Bilder**. Die Entwicklung kann die Hervorhebungen auch per Code als Maske über die Grundfigur legen. Dafür müssen alle Varianten einer Ansicht exakt deckungsgleich sein: gleiche Bildgröße, gleiche Position.

**Lieferformat:** SVG, oder PNG mit transparentem Hintergrund, mindestens 1.000 px hoch. Kein Text und kein Rahmen im Bild.

**Vorhandene Referenzen** (vom Nutzer erstellt, nicht final):
- `docs/images/Design Agent/Neon Muskel-Charakterbogen in Blau und Grün.png`
- `docs/images/Design Agent/Neonblaues und -grünes Charakterdesign-Sheet.png`

Diese Bögen zeigen den Mann in Blau und die Frau in Grün, im zweifarbigen Stencil-Stil. Ein früherer Entwurf zeigte den Mann in Rot und die Frau in Lavendel. Die endgültigen Farben sind offen (siehe [07-offene-punkte.md](07-offene-punkte.md)).

⚠️ Auf den Schuhen in den Referenzbögen sind Logos zu sehen, die einer bekannten Sportmarke ähneln. Solche Markenzeichen dürfen in den finalen Grafiken nicht vorkommen.

## Übungsanimationen und Videos (Grafik-Agent, geplant)

- Gewünscht sind Animationen bzw. Videos zu den Übungen.
- Wo sie in der App erscheinen und wie sie bedient werden, ist noch nicht festgelegt.
- Die eigene Übungsdatenbank hat 97 Übungen ohne Bilder oder Videos. Pro Übung wird also mindestens ein Bild oder eine Animation gebraucht, für Mann und Frau.

**Unterstützte Formate:** siehe [05-technik.md](05-technik.md).

## Bilder und Illustrationen (Designer-Agent)

| Grafik | Wo | Status | Hinweis |
|---|---|---|---|
| Hintergrundbild der Startseite | `landing` | implementiert (Foto) | Füllt den ganzen Bildschirm. Querformat, Hochformat und Ausschnitt müssen funktionieren. Austausch erlaubt. |
| Illustration für Leerzustand „Keine Pläne“ | `plans` | heute nur Text | optional, Entscheidung Design |
| Bilder der Übungen | Übungskarte | heute Platzhalter | Kommen künftig vom Grafik-Agenten (Figuren in Übungspose bzw. Animation). Größe und Rahmen legt das Design fest. |

## App-Icons und Metadaten (Designer-Agent)

Die Datei `public/index.html` verweist auf diese Dateien, **die im Projekt heute fehlen**:

| Datei | Format | Größe |
|---|---|---|
| `favicon.ico` | ICO | 16, 32, 48 px |
| `logo192.png` | PNG | 192 × 192 px |
| `logo512.png` | PNG | 512 × 512 px (für `manifest.json`) |
| Apple-Touch-Icon | PNG | 180 × 180 px |

Außerdem fehlt `manifest.json`. Die Entwicklung legt sie an, sobald Icons und eine Theme-Farbe aus dem Design feststehen. Der Seitentitel lautet heute „Workout Plan“, der Name der App ist laut README „GetFit!“.

## Lieferung allgemein

- Icons, Logos und einfarbige Grafiken als **SVG**
- Fotos und komplexe Bilder als **WebP** oder **PNG**, jeweils in doppelter Auflösung (2×) für hochauflösende Displays
- Dateinamen in Kleinbuchstaben mit Bindestrichen, zum Beispiel `icon-edit.svg` oder `figure-male-front.svg`
