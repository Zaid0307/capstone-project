# GetFit! – Design-Übergabe 1

Stand: 27.10.2026. An den App-Agenten. Status: umsetzbarer Designvorschlag für bestehende Funktionen. App-Quellcode unverändert.

## Zusammenarbeit
Es gibt nur Design/Grafik und App-Entwicklung. Austausch ausschließlich über design-handoff. Lieferungen hier in from-design, Rückmeldung bitte in feedback-entwicklung.md. Diese Lieferung enthält Tokens und Gestaltungsvorgaben, noch keine neuen Grafiken.

## D1 – Tokens und Integration
Die Datei design-tokens-v1.json enthält flache Gruppen für die vorhandene cssVariableDeclarations()-Funktion. Bestehende Schlüssel aus src/styles/tokens.js bleiben enthalten. Weitere Referenzobjekte analog zu colors/fonts/radii ergänzen oder CSS-Variablen verwenden.
Helle Flächen, Petrol als Hauptaktion, dunkle Schrift, Systemschrift ohne externe Fontdateien. Hauptbutton primary/onPrimary, Hover primaryHover, gedrückt primaryActive. Sekundäraktion text/secondary; Karten text/surface; Nebeninformation textMuted; Fehler error/errorSurface. hoverText ausschließlich auf dunklen Flächen. Bestehende Farbverwendungen nach Funktion zuordnen, nicht blind austauschen.
Körpertext 1rem, Zeilenhöhe 1,5; GlobalStyles setzt derzeit 112,5 Prozent und muss bei Übernahme angepasst werden. Überschriften umbrechen lassen. Trainingszahlen mit tabellarischen Ziffern. Dark Mode ist nicht beschlossen.

## D2 – Zustände
Alle interaktiven Elemente: mindestens 44 × 44 px Klickfläche. Fokus über :focus-visible mit 3 px focus, 3 px Abstand, auf dunklen Flächen weißer Zwischenring; nie abschneiden. Deaktiviert: disabledSurface/disabledText, deaktivierte Semantik, keine Handler oder Hoveranimationen. Fehler mit Text statt allein Farbe. Bei prefers-reduced-motion Übergänge und sanftes Scrollen abschalten.

| Element | Normal / Hover / Aktiv / Besonderheiten |
|---|---|
| Hauptbutton | primary/onPrimary; primaryHover; primaryActive. Mehrzeiliger Text erlaubt. |
| Sekundärbutton / Abbrechen | surface, text, border; surfaceMuted; highlight. Abbrechen nicht als Hauptaktion. |
| IconButton / Toggle / Sprache / Nach oben | Dunkles Icon auf transparenter Fläche; surfaceMuted; highlight. Namen und aria-expanded/aria-pressed erhalten. |
| Feld / Select / Textarea | surface, text, border; Rahmen textMuted; Fokus wie oben. Fehlerrahmen error plus Text, aria-invalid und aria-describedby. |
| Tages-Checkbox | surface/border; ausgewählt primary/onPrimary plus Häkchen; Hover sichtbarer Rahmen; Fokus wie oben. |
| Navigation | Sichtbare Kurztexte Neu, Übungen, Pläne sowie DE/EN. Hover surfaceMuted; aktuelle Seite highlight plus Markierung und aria-current. |
| Muskelkachel / Gruppenlink | surface; highlight; gedrückt surfaceMuted. Aktuelle Gruppe mit Rahmen und aria-current. Gruppenname sichtbar. |
| Plan / Tag / Muskelabschnitt | Eigener Aufklappbutton mit aria-expanded. Titel links, Aktionen rechts, bei Platzmangel umbrechen. |
| Bearbeitete Übung | highlight und sichtbarer Text „Wird bearbeitet“. |
| Statische Karte / Hinweis / Details | Keine künstlichen Hover-, Fehler- oder Deaktiviert-Zustände; enthaltene Bedienelemente folgen ihren Regeln. |

Fehler gehören an betroffene Felder bzw. in den Formularhinweis. Nicht jede Komponente hat einen sinnvollen Fehlerzustand. Native Löschbestätigungen in diesem Schritt erhalten; eigene Dialoge erfordern separat Fokusführung und Fokusrückgabe.

## D3/D4 – 390 px und bestehende Seiten
16 px Seitenabstand, bei 390 px also 358 px Inhalt. Rasterabstand 12 px, Kartenpadding 16 px, Abschnittsabstand 24 px. width:100%, min-width:0, Grid minmax(0,1fr); lange Namen overflow-wrap:anywhere. Keine feste Höhe oder interne Scrollfläche für Beschreibungen. Bei Platzmangel bzw. großer Schrift einspaltig.
Navigation 72 px plus safe-area-inset-bottom; Inhalt entsprechend plus 16 px unten polstern. Nach-oben-Button oberhalb der Leiste. Sticky-Köpfe dürfen Fokusziele nicht verdecken. 720 px Maximalbreite begrenzt die bestehende Ansicht, entscheidet kein eigenständiges Desktoplayout.

| Seite | Gestaltung |
|---|---|
| Start | Vorhandener Titel, CTA und Sprachumschalter. Text auf deckender Fläche, Hintergrundbild dekorativ, keine starre Viewporthöhe. |
| Muskelgruppen | Titel Übungen; sechs Kacheln in zwei Spalten, bei Platzmangel eine. Grafik contain, Gruppenname als Text. Fehlende Grafik durch neutrales Symbol ersetzen. |
| Übungsgruppe | Zurück-Link und Gruppenname. Gruppenlinks in eigener horizontal scrollbarerer Leiste; Fokus sichtbar. Karten mit vollständigem Titel und Beschreibung. Ohne echtes Übungsbild kleines Hantelsymbol statt großem Leerbild. |
| Meine Pläne | Titel und Neuer Plan; Leerzustand mit einer klaren Aktion. Aufklapphierarchie erhalten; Ebenen mit Überschriften und Flächentönen statt zunehmender Einrückung unterscheiden. |
| Plan neu/bearbeiten | Schritt 1 von 2 bzw. 2 von 2 sichtbar. Labels oben, optional benennen. Wochentage umbrechend, keine erzwungenen sieben Spalten. Wiederholungsfelder flexibel zweispaltig, bei Platzmangel untereinander. Speichern im Dokumentfluss. Bearbeiten startet weiterhin in Schritt 2. |

## D5 / Grafikstatus
Amber muscleHighlight plus dunkle Kontur und Gruppenbeschriftung ist vorläufig. Erkennbarkeit auf beiden Figuren muss noch geprüft werden. Kein vollständiger Atlas geliefert: Rückansichten, deckungsgleiche Varianten und Übungsanimationen fehlen. Idle-Loops und Debug-GLBs ersetzen keine Übungsanimationen. Vollständige App-Muskelzuordnungen bleiben maßgeblich; die sechs Pilotzuordnungen ersetzen sie nicht. Historische Freigabe-/Bestätigungsbehauptungen im Grafikpaket wurden hier nicht unabhängig verifiziert.

## D6 – Vorlageninformationen in gespeicherten Plänen
Vorhandenen Tagesnamen unter dem Wochentag anzeigen. Vorhandene Fortschritts-, Erholungs- und Sicherheitshinweise als beschriftete Abschnitte unter der Planbeschreibung; Sicherheit nicht ausschließlich eingeklappt verstecken. Fehlende optionale Werte erzeugen keinen leeren Abschnitt. Wiederholungsbereich, Dauer, Gewicht, Pause und Reserve mit Beschriftung und Einheit flexibel darstellen. Keine neuen Datenfelder erfinden.

## D7/D8 – Nächste Schritte und offene Varianten
Bitte Tokens und bestehende Seiten zuerst umsetzen. Rückmeldung in feedback-entwicklung.md: übernommene Teile, konkrete Unklarheiten, Pfade zu Screenshots bei 390 px. Keine direkte Chat-/GitHub-Abstimmung.
Offen bleiben O1 Figurenwahl auf Seite oder in Einstellungen; O3 Animation in Karte oder Detailansicht; O5 Desktopgestaltung; O6 Dark Mode; O7 endgültiger App-Name; O8 Vorlagen innerhalb Pläne oder eigener Bereich und konkrete Filter; O10 zusätzliche Kategorie oder Übersicht für Cardio/Boxen; O11 Backendanbieter; O12 konkrete Auswertungen. Dies sind Varianten, keine Entscheidungen. Athletenvorlagen O9 bleiben zurückgestellt.

## Abnahme
390 px und schmalere Ansicht, 200 Prozent Textvergrößerung, lange deutsche/englische Namen, Fokus, Fehlerzuordnung und Abstand zur Navigation prüfen. Vorhandene Funktionsprüfungen erhalten. Textkontraste der vorgesehenen Paare werden separat dokumentiert; tatsächliche Komponenten und Grafiken benötigen nach Umsetzung eine Sichtprüfung. Noch keine Behauptung über fertige UI oder vollständig geprüfte Barrierefreiheit.
