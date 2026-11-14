# Rückmeldung der Entwicklung

> **AKTUELL (13.11.2026): Neuer Auftrag an den Grafik-Agenten → [00-AKTUELL-AN-GRAFIK.md](00-AKTUELL-AN-GRAFIK.md).** Die Details stehen auch unten ab „Auftrag Muskelfigur und Übungsanimationen“.

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
| G9 | Technik | Laut Paket ist der nächste Schritt ein 3D-Modell in Blender. Blender 5.2 hat der Nutzer inzwischen selbst installiert (27.10.2026). Es gibt keinen Mac, und kostenpflichtige Werkzeuge sind ausgeschlossen. Lieferformate, die die App einbinden kann: SVG, PNG oder WebP, Videos als MP4 (H.264). |

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

## An den Grafik-Agenten: Figuren-Mockup v1 (`from-design/figuren-abnahme/figuren-mockup-v1.png`)

Stand: 27.10.2026. Anmerkungen der Entwicklung nach Sichtprüfung, auch in vergrößerten Ausschnitten. **Das ist keine Nutzerabnahme.** Die Abnahme gibt nur der Nutzer.

**Was gut passt:**
- Farben wie entschieden (Mann Königsblau/Schwarz, Frau Königsgrün/Schwarz) und ein einheitlicher Stencil-Stil über alle acht Ansichten.
- Vorder- und Rückansicht ohne Gesicht, mit Haaren, wie gewünscht.
- Die Arme stehen in der Vorder- und Rückansicht leicht vom Körper ab. Für Muskelkarten ist das gut, weil die Arme den Rumpf nicht verdecken.

**Muss vor einer Freigabe geändert werden:**

| Nr. | Thema | Anmerkung |
|---|---|---|
| F1 | Markenlogos | An allen Schuhen ist ein Haken-Zeichen klar zu erkennen, das dem Nike-Logo entspricht, besonders in den Seitenansichten. Bitte ganz entfernen, nicht nur abschwächen (vgl. G5). Auch die leuchtenden Sohlen wirken wie ein bestimmtes Markenmodell. |
| F2 | Gesichter in den Seitenansichten | Vorne und hinten ist die Figur gesichtslos, in den Seitenansichten sind aber Nase, Lippen, Kinn und Ohr im Profil ausgearbeitet, bei beiden Figuren. Der Nutzer wollte keine Gesichter. Bitte auch im Profil auf eine Silhouette ohne Gesichtszüge reduzieren. |
| F3 | Verdeckte Muskeln bei der Frau | Leggings und Top sind schwarz. Dadurch sind Oberschenkel, Waden, Gesäß, ein großer Teil des Rückens und die Brust nur als Umriss zu sehen. **Entscheidung des Nutzers (27.10.2026):** Die Kleidung darf bleiben, verdeckte Muskeln werden trotzdem hervorgehoben. Die Hervorhebung liegt dann sichtbar über der Kleidung, an der anatomisch richtigen Stelle. Dafür braucht jede Ansicht Muskelregionen auch für die verdeckten Muskeln, deckungsgleich mit der Figur. |
| F4 | Verdeckte Muskeln beim Mann | Die Shorts verdecken Gesäß und oberen Oberschenkel, also Gesäßmuskeln, die obere hintere Oberschenkelmuskulatur und die Adduktoren. Es gilt dieselbe Entscheidung wie bei F3: Die Shorts dürfen bleiben, die Hervorhebung liegt über der Kleidung. |
| F5 | Detailgrad laut früheren Nutzerwünschen | Der Nutzer wünschte sich massive Muskulatur, sichtbare Muskelfasern und ein sichtbares Skelett, anatomisch korrekt nach dem Vorbild der smartgymapp-Figuren. Das Mockup zeigt flächige Muskelformen ohne Faserverlauf und ohne Skelett. Bitte mit dem Nutzer klären, ob der flächige Stil so gewollt ist oder ob Fasern und Skelett noch dazukommen. |
| F6 | Einheitlichkeit der Ansichten | Proportionen, Haare und Muskelzeichnung unterscheiden sich zwischen den Ansichten derselben Figur, zum Beispiel ist der Mann in der Seitenansicht schmaler und die Haare der Frau sind vorne und hinten verschieden. Für deckungsgleiche Muskel-Hervorhebungen müssen alle Ansichten aus einem Modell stammen. Der Agent weist selbst darauf hin. |

**Hinweise für die spätere Einbindung in die App:**

| Nr. | Thema | Anmerkung |
|---|---|---|
| F7 | Hintergrund | Endgültige Figuren bitte mit transparentem Hintergrund (PNG/WebP mit Alpha oder SVG). Der Leuchtstil ist auf Schwarz entworfen. Bitte prüfen, ob er auch auf hellen App-Flächen funktioniert; das Gesamtdesign der App ist noch nicht entschieden. |
| F8 | Keine Texte im Bild | Beschriftungen wie „MANN“ und „VORNE“ sind im Mockup in Ordnung, in Produktionsdateien bitte weglassen. Die App beschriftet selbst, auf Deutsch und Englisch. |
| F9 | Seitenbenennung | Bitte festlegen, ob „links“ die linke Körperseite der Figur oder die Blickrichtung meint. Für Dateinamen und Daten wird eine eindeutige Regel gebraucht, zum Beispiel `side_left` = linke Körperseite sichtbar. |
| F10 | Auflösung | Im Mockup ist jede Figur nur etwa 250 px breit. Für die Abnahme der Muskeldetails bitte jede Ansicht einzeln und größer liefern, mindestens im Format der V1.1-Figuren (512 × 768 px), besser höher. |
| F11 | Rückansicht | Sie ist für die Muskelgruppe Rücken nötig; bisher gibt es keine Muskelregionen für hinten (siehe G-Punkte). Die Rückansicht im Mockup ist dafür eine gute Grundlage, sobald F6 erledigt ist. Die Regionen für verdeckte Muskeln gehören dazu (F3, F4). |

## An den Grafik-Agenten: Produktionsstand V13 (`fitness-graphics/production-v13/`)

Stand: 27.10.2026. Gelesen: `README.md`, `validation/inventory-report.json`, die Renderbilder unter `renders/`. **Die Entwicklung integriert nichts davon**, wie verlangt. Die App behält ihre Platzhalter. Das hier ist keine Nutzerabnahme.

**Was gut ist:**
- Die Ansichten stammen aus je einem echten Modell. Damit ist F6 (einheitliche Ansichten) technisch lösbar, und deckungsgleiche Masken für vorne und hinten werden möglich.
- Gesichter sind auch im Kopfbereich nur Silhouette (F2), und die Füße haben keine Markenschuhe mehr (F1).
- Die Ink-Renderbilder haben einen transparenten Hintergrund (F7).
- A-Haltung mit abgespreizten Armen, gut für Muskelkarten.
- Die Datenprüfung ist sauber: 97 Übungen, alle Verweise lösen auf.

**Anmerkungen der Entwicklung:**

| Nr. | Thema | Anmerkung |
|---|---|---|
| V1 | Rückansicht fast ganz dunkel | In `char_male_01_ink-refined_back.png` und `char_female_01_ink-refined_back.png` ist der Rücken fast vollständig schwarz bzw. dunkelgrau. Rückenmuskeln sind nicht zu erkennen. Für die Muskelgruppe Rücken muss die Rückansicht die Muskeln so zeigen wie die Vorderansicht. |
| V2 | Muskeldefinition schwächer als Mockup und Referenz | Brust, Bauch und Arme sind vorne angedeutet, insgesamt aber deutlich flacher als im Bild-Mockup und in `approved-style.png`. Beine und Schultern sind kaum gegliedert. Der Agent nennt das selbst als offenen Punkt 1. |
| V3 | Verdeckte Muskeln | Gilt weiter die Nutzerentscheidung zu F3/F4: Kleidung darf bleiben, die Hervorhebung liegt über der Kleidung. Bei der Frau sind Beine und Teile des Rumpfs dunkel, beim Mann die Shorts. Die Regionen für diese Muskeln werden trotzdem gebraucht. |
| V4 | Haare | Die Haare sind derzeit grobe Blockformen (beim Mann wie ein Kamm). Der Agent nennt das selbst als offenen Punkt 1. |
| V5 | Geräte-IDs | Der Inventarbericht zählt 33 Geräte-IDs, die App hat 32 (`src/data/equipment.js`). Bitte die zusätzliche ID nennen. Zur Zahl 30 Pläne: In der App sind es 23, weil die 7 an Athleten angelehnten Vorlagen zurückgestellt sind (O9). |
| V6 | Lieferformat für die App | Für die spätere Einbindung weiter gebraucht: je Figur und Ansicht ein PNG oder WebP mit Alpha (mindestens 512 × 768 px) oder SVG, dazu deckungsgleiche Masken pro Muskel bzw. Muskelgruppe, ohne Text im Bild. GLB- und Blender-Dateien bindet die App nicht direkt ein. |

**Ablage:** Wie das übrige Grafik-Paket bleibt `production-v13/` nur lokal und wird nicht ins öffentliche Repository übernommen (MakeHuman-Ableitung, Lizenzhinweise, Größe etwa 23 MB).

## An den Grafik-Agenten: Zwischenstände bis 13.11.2026

Stand: 13.11.2026. Gelesen: `antwort-entwicklung-v14.md`, `00-natuerliche-anatomie-und-app-pruefung.md`, `fitness-grafikproduktion-status.md`, `app-agent-zwischenstand-2026-11-13.md`, `geraete-und-zubehoer-2026-11-13.md`.

- **V5 ist erledigt.** `floor` als Szenenkontext ist klar, die App braucht keinen neuen Geräteeintrag.
- **Keine weiteren Rückfragen.** Die Entwicklung integriert nichts, bis die Bitte um die Nutzbarkeitsprüfung mit dem vollständigen Paket vorliegt.
- **Zur Information, App-seitig:** Der Plan-Editor ist neu gebaut (siehe `CHANGELOG.md`, 13.11.2026). Übungen werden weiterhin über die Katalog-IDs referenziert (`exerciseId`), Geräte über die 32 Geräte-IDs. Für die Grafiken ändert sich dadurch nichts. Später nutzt die App pro Übung die Medien je Figur und die Muskelmasken je Muskelgruppe.
- Die ZIP-Pakete in `from-design/` (zusammen etwa 670 MB) bleiben lokal und kommen nicht ins Repository.

## An den Grafik-Agenten: Auftrag Muskelfigur und Übungsanimationen für den Plan-Editor

Stand: 13.11.2026. **Nutzeranforderung** (wörtlich sinngemäß): Im Trainingsplan soll eine Figur genau zeigen, welche Muskeln trainiert werden. Bei einer isolierten Übung wird nur dieser Muskel markiert. Die App muss jeden Muskel abbilden, anatomisch korrekt bis zur kleinsten Faser, ohne erfundene Zonen wie „unterer Bauch“. Beim Hinzufügen einer Übung soll ein Fenster die Animation der Übung zeigen.

Die App ist dafür vorbereitet. Im Plan-Editor gibt es drei Bereiche: Diagramm, Muskelabdeckung mit Platz für die Figur, Übungsvorschau mit Platz für die Animation. Bis zur Lieferung zeigt die App dort einen Platzhalter und eine Liste.

| Nr. | Was | Anforderung |
|---|---|---|
| M1 | Muskelliste | Maßgeblich ist das neue Muskelmodell der App: `src/data/muscles.js`, erklärt in `docs/muskelmodell.md` (Köpfe und Anteile wie Bizeps Caput longum/breve, Trizeps drei Köpfe, Deltamuskel drei Anteile, Pectoralis major drei Anteile, Trapezius drei Anteile, Brachioradialis usw.). Jede ID mit `view` `front`, `back` oder `both` braucht eine Region. Tiefe Muskeln (`view: 'deep'`) sind optional. |
| M2 | Masken | Für **jede Figur** (Mann, Frau) und **jede Ansicht** (vorne, hinten) eine Maske pro Muskel-ID, deckungsgleich mit der Figur. Bevorzugt SVG mit einem Pfad bzw. einer Gruppe pro ID (`id` = Muskel-ID), sonst PNG mit Alpha pro ID. Gleiche Leinwand wie die Figur (mindestens 512 × 768 px), ohne Text. |
| M3 | Verdeckte Muskeln | Wie entschieden (F3/F4): Hervorhebung liegt über der Kleidung an der anatomischen Stelle. |
| M4 | Darstellungszustände | Die App färbt die Masken selbst ein: Hauptmuskel, unterstützender Muskel, Hinweis (zu wenig trainiert). Bitte die Masken neutral liefern, ohne eingebrannte Farbe. |
| A1 | Übungsanimationen | Pro Übungs-ID und Figur eine Schleife (WebM oder MP4/H.264, zusätzlich ein Standbild PNG als Vorschau), ohne Text, transparenter oder neutraler Hintergrund. Reihenfolge: zuerst die Übungen der 23 Vorlagen, dann der Rest. |
| A2 | Varianten | Die App zeigt zu jeder Übung Varianten mit anderen Geräten (Langhantel, Kurzhantel, Kabel, Band, Maschine, Körpergewicht). Jede Variante ist eine eigene Übungs-ID und braucht damit eine eigene Animation. |
| L1 | Ablage | Wie bisher unter `fitness-graphics/`, mit einer Liste, welche IDs fertig sind. Integration erst nach eurer Bitte um Prüfung. |

## An den Grafik-Agenten: Muskelmodell Version 1 für den ganzen Körper (ersetzt die Muskelliste in M1)

Stand: 13.11.2026. **Nutzeranweisung:** Die genaue Muskeldarstellung gilt für den **kompletten Körper**, nicht nur für Arme und Bauch. Die Grafiken müssen daran angepasst werden.

| Nr. | Anforderung |
|---|---|
| M1 (neu) | Verbindliche Liste: [muskelmodell-fuer-grafik.md](muskelmodell-fuer-grafik.md) und [muskelmodell-v1.json](muskelmodell-v1.json). 93 Einträge, Masken für die **81 Muskeln der feinsten Ebene** (Köpfe und Anteile nach Terminologia Anatomica), davon 58 von außen sichtbar und 23 tief. Die bisherigen 35 Muskel-IDs eurer Atlas-Quellpfade bitte auf diese Liste abbilden; abweichende oder fehlende IDs bitte zurückmelden. |
| M5 | **Tiefe Muskeln:** Vorschlag für eine Tiefenansicht der Figur, damit auch verdeckte Muskeln (Rotatorenmanschette, Rautenmuskeln, innerer schräger und querer Bauchmuskel, Hüftbeuger, Musculus multifidus, tiefe Unterarm- und Wadenmuskeln u. a.) markiert werden können. |
| M6 | **Übungszuordnung:** In der JSON-Datei steht für jede der 97 Übungen, welche Muskeln Haupt- und welche Hilfsmuskeln sind. Die Animationen (A1) sollen genau diese Muskeln in Bewegung zeigen; bei isolierten Übungen arbeitet nur der genannte Muskel sichtbar. |
| M7 | Masken, Figur und Animationen bitte mit denselben IDs benennen, damit die App sie ohne Umrechnung zuordnen kann. |

## Antworten an den Grafik-Agenten (13.11.2026, 20:00) – auf `from-design/app-agent-animationen-zwischenstand.md`

| Frage | Antwort |
|---|---|
| Exakte Muskel-ID-Liste mit Ansichtszuordnung | Liegt vor: [muskelmodell-v1.json](muskelmodell-v1.json) (Feld `muscles[].view`: `front`, `back`, `both`, `deep`; `parent` für Köpfe und Anteile) und als Tabelle [muskelmodell-fuer-grafik.md](muskelmodell-fuer-grafik.md). Masken für die 81 Einträge ohne Untereinträge. |
| Priorisierte Übungs-IDs aus den 23 Vorlagen | [uebungen-prioritaet-v1.json](uebungen-prioritaet-v1.json): `priority1` = 64 Übungen der Vorlagen, sortiert nach Häufigkeit (`usesInTemplates`), danach `priority2` = die übrigen 33 Katalogübungen. |
| Varianten-IDs außerhalb des Katalogs | **Keine.** Varianten sind in der App andere bestehende Übungen derselben Muskeln (z. B. Kurzhantel- statt Langhantel-Bankdrücken). `variantIdsOutsideCatalog` ist leer; Basis bleiben 97 Übungen × 2 Figuren = 194 Paare. |
| Einseitige Übungen (`PER_SIDE_EXERCISE_IDS`) | 14 IDs, in [uebungen-prioritaet-v1.json](uebungen-prioritaet-v1.json) unter `perSideExerciseIds` und je Übung als `perSide`. |
| Eigene Clips für links und rechts? | **Nein, ein Clip je Übung und Figur**, der die rechte Körperseite arbeiten lässt. Für links spiegelt die App das Video waagerecht. Bitte deshalb keine seitenspezifischen Details im Bild, die beim Spiegeln falsch wirken (z. B. Schrift). Die Masken bitte wie bei den Bizeps-Kandidaten mit getrennten Pfaden `<id>__left` und `<id>__right`, damit die App bei einseitigen Übungen nur die arbeitende Seite markieren kann. |
| Muskelfasern | Entscheidung der Entwicklung nach der Nutzeranweisung „anatomisch korrekt bis zur kleinsten Faser“: **Einzeln anwählbar** sind Muskeln, Köpfe und Anteile nach Terminologia Anatomica (die 81 Einträge). **Sichtbare Faserverläufe** sollen in der Zeichnung anatomisch richtig verlaufen (Faserrichtung je Muskel und Anteil, z. B. gefiederte Muskeln). **Mikroskopische Einzelfasern** sind nicht gemeint und nicht vorgesehen. Sollte der Nutzer das anders sehen, melden wir uns. |

## Nutzerentscheidungen 13.11.2026, 21:00

**An den Grafik-Agenten:** N1–N8 in [00-AKTUELL-AN-GRAFIK.md](00-AKTUELL-AN-GRAFIK.md): Stil zurück zur Referenz `nutzer-referenz/stil-referenz-2026-11-13.png`, Bart und Gesichtsprofil erlaubt, keine Logos, Faserbündel/Segmente als eigene markierbare Einheiten (Vorschlag erbeten), Skelett als zuschaltbare Ebene, Mann/Frau wählbar, Dark Mode kommt. Die Antwort zu den Fasern von 20:00 ist damit erweitert.

**An den Design-Agenten (Design weiterhin zurückgestellt, nur zur Kenntnis):**
- Navigation künftig mit fünf Bereichen: Heute, Kalender, Pläne, Auswertung, Übungen. Das Tagebuch geht im Kalender auf (Liste und Monat), die Sprache wandert in die Einstellungen.
- Mehrere aktive Pläne gleichzeitig plus Archiv (ersetzt O16).
- Plan-Editor mobil: Übungen oben, Plan-Kopf als kompakte Zeile, Details per Tipp.
- Wahl Mann/Frau in den Einstellungen und per Umschalter an der Figur (O1).
- Dark Mode: ja (O6). App-Name: noch offen (O7).
- UX-Spezifikationen der Entwicklung: `docs/ux/01-planerstellung.md`, `02-tagebuch.md`, `03-analysen-und-architektur.md`.

