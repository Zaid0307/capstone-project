# Technische Anforderungen

## Technik

| Bereich | Technik |
|---|---|
| Framework | React 19, Build mit Vite 8 |
| Routing | React Router 7 |
| Styling | styled-components 6 (CSS-in-JS). Farben, Schrift und Eckenradien stehen als Design-Tokens zentral in `src/styles/tokens.js` und werden als CSS-Variablen bereitgestellt (`--color-…`, `--font-…`, `--radius-…`). Globale Styles: `src/styles/GlobalStyles.js`. |
| Icons | react-icons (austauschbar gegen eigene SVGs) |
| Daten | Übungen von der wger-API, Pläne und Sprache im `localStorage` des Browsers |
| Konten / Server | keine |
| Tests | Vitest und React Testing Library (67 Tests), ESLint |
| Komponentenkatalog | Storybook 10 mit Stories für `PlanDetailsForm`, `DayExercisesForm` und `Navigation` |
| Hosting | Vercel (Demo: capstone-project-lake.vercel.app) |

## Umsetzung von Designvorgaben

- **Design-Tokens:** Farben, Abstände, Radien, Schatten und Schriftgrößen am besten als benannte Tokens liefern, zum Beispiel `color.surface` oder `space.md`. Die Entwicklung überträgt sie nach `src/styles/tokens.js`. Weil die Tokens als CSS-Variablen vorliegen, ist auch ein zweites Theme (z. B. Dark Mode) ohne Umbau der Komponenten möglich. Heute zentral: Farben, Schrift, Eckenradien. Schatten und Abstände stehen noch direkt in den Komponenten.
- **Schriften:** Google Fonts oder eigene Schriftdateien im Format WOFF2 sind möglich. Die Lizenz muss eine Web-Nutzung erlauben. Heute nutzt die App nur die Systemschrift (`sans-serif`).
- **Zustände:** Hover, Fokus, aktiv, deaktiviert und Fehler bitte je Komponente angeben. Fokuszustände müssen sichtbar sein, weil die App per Tastatur bedienbar ist.

## Unterstützte Grafikformate

| Format | Einsatz | Hinweis |
|---|---|---|
| SVG | Icons, Logos, Figuren, Muskelkarten | Kann als Bild oder direkt als Komponente eingebunden werden. Einfärben per Code ist möglich, wenn `currentColor` oder getrennte Ebenen genutzt werden. |
| PNG | Grafiken mit Transparenz | |
| WebP | Fotos, große Bilder | bevorzugt wegen der Dateigröße |
| JPG | Fotos | |
| GIF / animiertes WebP | kurze Animationen | GIF hat große Dateien und wenig Farben |
| MP4 (H.264) | Videos | **HEVC/H.265 und .MOV spielen nicht in allen Browsern.** Bitte nicht verwenden. |
| SVG/CSS-Animation | einfache Animationen | ohne zusätzliche Bibliothek möglich |
| Lottie (JSON) | Vektor-Animationen | Braucht eine zusätzliche Bibliothek. Möglich, muss aber mit der Entwicklung abgestimmt werden. |

## Geräte und Responsive Design

- **Heute: nur fürs Handy optimiert** (laut README). Geprüft wurde die Breite 390 px.
- Es gibt **keine Breakpoints** für Tablet oder Desktop. Auf großen Bildschirmen wird die Handy-Ansicht einfach breiter.
- Ob und wie Tablet und Desktop gestaltet werden, ist offen (siehe [07-offene-punkte.md](07-offene-punkte.md)).
- Die App läuft im Browser, es gibt keine native App.
- Die untere Navigation ist am Bildschirmrand fixiert. Bei Handys mit Gestenleiste muss die Höhe des sicheren Bereichs berücksichtigt werden.
- Einen Dark Mode gibt es heute nicht.

## Barrierefreiheit (implementiert, muss erhalten bleiben)

- Alle Icon-Buttons haben Beschriftungen für Screenreader.
- Aufklappbare Bereiche melden ihren Zustand (`aria-expanded`).
- Fehler und Ladezustände werden angesagt (`role="alert"` bzw. `role="status"`).
- Die Seitensprache wird automatisch gesetzt (`lang="de"` bzw. `lang="en"`).
- Die Checkboxen der Wochentage sind per Tastatur bedienbar und haben einen sichtbaren Fokus.

Für das Design bedeutet das: ausreichende Kontraste in allen Zuständen, sichtbare Fokuszustände, und Information nie allein über Farbe vermitteln. Das betrifft besonders die Muskelhervorhebung.

## Einschränkungen

- **Daten aus der Datenbank sind nicht gestaltbar:** Übungsnamen, Beschreibungen und Bilder kommen so, wie wger sie liefert. Längen, Sprachen und Bildformate schwanken stark (siehe [03-inhalte-und-daten.md](03-inhalte-und-daten.md)).
- **Ladezeit:** Beim Start werden etwa 0,5 MB Übungsdaten geladen. Grafiken sollten die App nicht deutlich schwerer machen. Richtwert: Icons unter 5 KB, Figuren unter 200 KB je Datei.
- **Bestätigungsdialoge** sind heute Browser-Dialoge und lassen sich nicht gestalten (siehe [02-komponenten.md](02-komponenten.md)).
- **Keine Konten:** Pläne liegen nur in diesem Browser auf diesem Gerät.
- **Rechte:** Alle Grafiken, Schriften und Icons müssen frei bzw. mit einer passenden Lizenz nutzbar sein. Keine Markenlogos.
