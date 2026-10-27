# Rückmeldung der Entwicklung

Stand: 27.10.2026. Antworten bitte in `from-design/` ablegen.

## An den Grafik-Agenten: Paket `fitness-graphics-v0.7`

Die Entwicklung hat das Paket ausgewertet. Übernommen wurden der Übungskatalog (97 IDs und Namen) und die 23 eigenen Plan-Vorlagen. Muskeln und Muskelzuordnungen dienten als Grundlage für die App-Daten.

**Fehler im Paket:**

| Nr. | Fundstelle | Problem | Bitte |
|---|---|---|---|
| G1 | `data/mappings.json` | Verweist auf `supine_hamstring_strap`, die Übung heißt im Katalog `supine_hamstring_strap_stretch` | ID angleichen |
| G2 | `data/equipment.json` und `data/exercise-catalog-expanded.json` | Geräte-IDs passen nicht zusammen, z. B. `cable_machine` gegenüber `cable_station` und `stretch_strap` gegenüber `strap`. Der Katalog nutzt 33 Geräte-IDs, die Geräteliste kennt 7. | Eine gemeinsame Liste. Die App nutzt die IDs des Katalogs (`src/data/equipment.js`). |
| G3 | `documentation/README-DE.md` | Überschrift „V0.6“, Ordner heißt „v0.7“ | Version angleichen |
| G4 | `data/mappings.json` | Muskelzuordnungen nur für 6 von 97 Übungen | Die App hat inzwischen eigene Zuordnungen für alle 97 Übungen (`src/data/exercises/`). Bei eigenen Zuordnungen bitte mit diesen abgleichen. |

**Hinweise zu den Figuren:**

| Nr. | Thema | Hinweis |
|---|---|---|
| G5 | Markenzeichen | Die Schuhe in den Charakterbögen zeigen ein Logo, das einer bekannten Sportmarke ähnelt. In finalen Grafiken bitte keine Markenzeichen. |
| G6 | Farben | Die Charakterbögen zeigen Mann blau und Frau grün, ein früherer Entwurf Mann rot und Frau lavendel. Bitte mit dem Nutzer klären (offene Frage O2). |
| G7 | Muskelhervorhebung | Die App braucht pro Muskelgruppe eine Hervorhebung von vorne und hinten, für Mann und Frau. Alle Varianten einer Ansicht bitte deckungsgleich, siehe [04-grafikbedarf.md](04-grafikbedarf.md). |
| G8 | Übungsbilder | Die 97 Übungen der App haben heute keine Bilder. Die Übungs-IDs der App entsprechen denen des Katalogs. |
| G9 | Technik | Laut Paket ist der nächste Schritt ein 3D-Modell in Blender. Auf dem Rechner des Nutzers ist Blender nicht installiert, es gibt keinen Mac, und kostenpflichtige Werkzeuge sind ausgeschlossen. Lieferformate, die die App einbinden kann: SVG, PNG oder WebP, Videos als MP4 (H.264). |

**Nicht übernommen:**
- Die 7 Vorlagen „inspiriert von“ bekannten Athleten, bis Namens- und Persönlichkeitsrechte geklärt sind (O9). Das Paket weist selbst darauf hin.
- Die Fotokandidaten aus `legend-image-rights.json`.

**Hinweis zur Ablage:** Das Paket liegt beim Nutzer lokal unter `docs/images/Design Agent/` und ist **nicht auf GitHub**. Verweise darauf in dieser Übergabe sind nur lokal nachvollziehbar.

## An den Design-Agenten

| Nr. | Thema | Rückmeldung bzw. Bitte |
|---|---|---|
| D1 | Lieferformat | Farben, Schriften, Abstände, Radien und Schatten bitte als benannte Design-Tokens liefern. Die App hat dafür `src/styles/tokens.js`, die Tokens werden als CSS-Variablen ausgegeben. Ein zweites Theme (z. B. Dark Mode) ist damit ohne Umbau möglich. |
| D2 | Zustände | Für jede Komponente bitte Normal, Hover, Fokus, Aktiv, Deaktiviert und Fehler angeben. Fokus muss sichtbar sein. |
| D3 | Textlängen | Deutsche Texte sind oft deutlich länger als englische. Die Layouts müssen beide tragen. Ein Fehler dieser Art wurde gerade behoben: Das Plan-Formular war auf dem Handy breiter als der Bildschirm. |
| D4 | Handybreite | Geprüft wird bei 390 px Breite. Nichts darf breiter als der Bildschirm werden. |
| D5 | Muskelhervorhebung | Die Farbe der Hervorhebung muss zur App-Palette passen **und** auf den Figuren des Grafik-Agenten erkennbar sein. Bitte abstimmen, siehe [07-offene-punkte.md](07-offene-punkte.md). |
| D6 | Neue Daten ohne Darstellung | Aus Vorlagen kopierte Pläne haben Tagesnamen und Hinweise zu Fortschritt, Erholung und Sicherheit. Für diese gibt es noch keine Anzeige, siehe [CHANGELOG.md](CHANGELOG.md). |
| D7 | Reihenfolge | Für die Entwicklung als Nächstes am hilfreichsten: Tokens (D1), dann die bestehenden Seiten, dann die Plan-Vorlagen (O8), danach Konto und Tracking. |
| D8 | Offene Fragen | O8 bis O13 sind Fragen an den Nutzer. Bitte nicht eigenmächtig entscheiden, sondern Varianten vorschlagen. |
