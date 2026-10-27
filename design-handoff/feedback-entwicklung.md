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

**Hinweis zur Ablage:** Das Paket liegt unter `design-handoff/fitness-graphics/`. Antwort des Grafik-Agenten auf G1–G9: `design-handoff/fitness-graphics/documentation/GETFIT-APP-HANDOFF-V11.md`.

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

## Umsetzung der Design-Übergabe 1 (`from-design/antwort-design-v1.md`)

> **Hinweis zur STOPP-Anweisung** (`from-design/00-mockup-abnahme-zuerst.md`, `from-design/00-aktueller-auftrag.md`): Die Umsetzung unten lief bereits, als die Anweisung einging, und ist lokal committet (`e4f7d15`). Wie verlangt ist sie dokumentiert und **nicht** zurückgesetzt. Ob sie bleibt, bis das Mockup abgenommen ist, oder zurückgenommen wird, entscheidet der Nutzer. Bis dahin beginnt die Entwicklung keine weitere Designumsetzung. Die Figuren-Abnahme (`from-design/figuren-abnahme/`) ist gesehen; Rückmeldung dazu gibt der Nutzer.

Stand: 27.10.2026. Alle Tests (215) und die Code-Prüfung laufen durch. Screenshots bei 390 px: [screenshots/design-v1-390/](screenshots/design-v1-390/).

**Übernommen:**

| Nr. | Umsetzung |
|---|---|
| D1 | Alle Tokens aus `design-tokens-v1.json` stehen unverändert in `src/styles/tokens.js` und werden als CSS-Variablen ausgegeben. Grundschrift jetzt 1rem mit Zeilenhöhe 1,5 (vorher 112,5 Prozent), Systemschrift, Überschriften brechen um, Trainingszahlen mit tabellarischen Ziffern. Die alte Farbverlaufs-Fläche ist durch `background` ersetzt. Die Kontrastwerte aus `kontrastpruefung-v1.json` sind nachgerechnet und stimmen. |
| D2 | Bedienelemente mindestens 44 × 44 px. Fokus global über `:focus-visible` (3 px `focus`, 3 px Abstand, weißer Zwischenring). Hauptbutton, Sekundärbutton, IconButton, Sprachumschalter, Felder, Tages-Auswahl, Navigation und Muskelkacheln haben die angegebenen Zustände. Deaktiviert mit `disabledSurface`/`disabledText`. Fehler stehen als Text am Feld (`aria-invalid`, `aria-describedby`). Bei `prefers-reduced-motion` gibt es keine Übergänge und kein sanftes Scrollen. Löschbestätigungen bleiben die nativen Dialoge. |
| D3/D4 | 16 px Seitenrand, maximal 720 px Inhalt, Abstände 12/16/24 px. Navigation fest unten mit 72 px plus Safe Area und sichtbaren Kurztexten (Neu, Übungen, Pläne, DE/EN); die aktuelle Seite hat `highlight`, einen Balken oben und `aria-current`. Seiten: Start mit Text auf deckender Fläche; Übungen mit Titel und Kacheln in zwei Spalten (eine bei Platzmangel); Übungsgruppe mit Zurück-Link, Gruppenname und horizontal scrollbarer Gruppenleiste; Karten ohne feste Höhe und ohne innere Scrollfläche, kleines Hantelsymbol statt Leerbild; Meine Pläne mit Titel, Button und Leerzustand mit genau einer Aktion; Plan-Ebenen über Überschriften und Flächentöne statt Einrückung; Formular mit „Schritt 1 von 2“ / „Schritt 2 von 2“, Labels oben, Wochentage umbrechend, Zahlenfelder zweispaltig mit Umbruch, Speichern im Dokumentfluss. „Wird bearbeitet“ ist als Text sichtbar. |
| D5 | Fehlt die Grafik einer Muskelgruppe oder lädt sie nicht, erscheint ein neutrales Symbol. Die Figuren und die Muskelhervorhebung sind noch nicht eingebaut. |
| D6 | Tagesname unter dem Wochentag. Fortschritt (mit Reserve-Wiederholungen) und Erholung als beschriftete Abschnitte unter der Beschreibung. Sicherheit steht immer sichtbar in der Plankarte, auch zugeklappt. Leere Werte erzeugen keinen Abschnitt. Neue Datenfelder gibt es nicht. |

**Bitte prüfen (eigene Entscheidungen der Entwicklung, wo die Übergabe nichts festlegt):**

1. **Nach-oben-Button:** Er schwebt über dem Inhalt. Eine transparente Fläche wäre dort nicht lesbar, deshalb hat er `surface`, Rahmen `border` und Schatten `card`.
2. **Icons der Navigation:** Plus-Kreis (Neu), Hantel (Übungen) und Liste (Pläne). Vorher stand ein Haus-Symbol für Übungen.
3. **Hinweis zur ärztlichen Abklärung:** Alle Vorlagen haben `medicalClearance: true`. Die App zeigt dazu im Sicherheitsabschnitt einen Satz, den die Entwicklung formuliert hat: „Wenn du unsicher bist, ob das Training zu dir passt, lass es vor dem Start ärztlich abklären.“ Bitte Wortlaut bestätigen oder ersetzen.
4. **Tagesnotiz:** Ist in einer Vorlage eine Notiz zum Tag vorhanden, steht sie im aufgeklappten Tag unter dem Tagesnamen.
5. **Plantitel im Schritt 2** ist die Seitenüberschrift (h1); darunter steht der Sekundärbutton „Name und Tage bearbeiten“.
6. **Gewicht** wird jetzt im Zahlenformat der Sprache gezeigt (Deutsch „22,5 kg“).

**Noch offen bzw. nicht geprüft:**

- 200 Prozent Textvergrößerung und eine echte Prüfung mit Screenreader stehen noch aus. Die Layouts brechen um (Kachelraster, Zahlenfelder, Kopfzeilen), eine Sichtprüfung bei 200 Prozent fehlt.
- Der Sprachumschalter zeigt sichtbar „EN“ bzw. „DE“, sein Name für Screenreader ist „Sprache auf Englisch umstellen“. Sichtbarer Text und Name stimmen damit nicht überein. Vorschlag willkommen.
- Desktop (O5) und Dark Mode (O6) sind wie vorgesehen nicht gestaltet.
