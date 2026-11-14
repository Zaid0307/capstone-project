# GetFit! – Kanban-Board

Stand: 13.11.2026, 21:30. Gepflegt von der Entwicklung. Neueste Änderungen oben in jeder Spalte. Prioritäten: **P1** zuerst, dann P2, P3. Herkunft in Klammern.

> **Ab 14.11.2026 führend:** das gemeinsame Board mit dem Grafikteam, [design-handoff/from-design/redesign-kanban.md](../design-handoff/from-design/redesign-kanban.md). Die App-Karten heißen dort E01–E30. Diese Datei bleibt die Teamansicht der Entwicklung.

Spalten: **Entscheidungen (Nutzer)** → **Backlog** → **Bereit** → **In Arbeit** → **Prüfen (Nutzer)** → **Erledigt**. Blockiert steht in einer eigenen Spalte mit Grund.

---

## In Arbeit

- **Grafik-Agent: Beta-Paket B1** (Figuren, Muskel-Monitor-Masken, erste Übungsanimationen) – Auftrag in `design-handoff/00-AKTUELL-AN-GRAFIK.md`.
- **Grafik-Agent: Stil zurück zur Referenz, Faserbündel-Vorschlag, Skelett-Ebene, Masken, Animationen** – Auftrag N1–N8 in `design-handoff/00-AKTUELL-AN-GRAFIK.md` (21:00). 0 von 194 Übungsmedien fertig. *(Grafik-Agent)*

## Entscheidungen (Nutzer)

- **Commit des aktuellen Stands** – wartet auf Freigabe.
- **App-Name** – noch offen.

## Prüfen (Nutzer)

- **Plan-Editor und Trainingstagebuch** – zum Ausprobieren unter http://localhost:3000.

## Bereit (P1, nächste Umsetzung)

- [P2] RIR pro Satz optional erfassen und in den Steigerungsvorschlag einbeziehen. *(Kritik #2)*
- [P2] Allgemeinen RIR-Text in den übrigen Vorlagen je Plantyp schärfen; Aufwärmsätze in Vorlagen; 5er-Split für „advanced“ auf 2× pro Woche umbauen. *(Kritik, Abschnitt 6)*
- [P2] Eine Zählung überall: Gruppenleiste im Editor auf effektive Sätze (1/0,5, Höchstwert) umstellen. *(Kritik #7)*
- [P2] Wochenziel nicht über alle aktiven Pläne addieren (Hauptplan oder eigenes Ziel). *(Kritik #8)*
- [P2] Eigengewicht: Wiederholungen statt 0 kg Volumen; Aufwärmsätze in Vorlagen. *(Kritik #10)*

Reihenfolge nach Abhängigkeit. Herkunft: 01 = Planerstellung, 02 = Tagebuch, 03 = Analysen/Architektur (`docs/ux/`).

**Gemeinsame Grundlagen**

**Planerstellung** *(01)*
- [P1] Filter „Muskel“ + „Ausstattung“ (Arten oben, einzelne Geräte aufklappbar), abhängig, mit Trefferzahlen.
- [P1] Übungskarte mit ⋮-Menü.
- [P1] Sortiermodus mit ↑/↓ und Ansage für Screenreader.
- [P1] Tag-Menü in der Tagesleiste.

**Tagebuch** *(02)*
- [P1] Datenmodell 2 mit Migration und Sicherung (läuft/beendet, Start/Ende, Art, `scheduledFor`, Zeitpunkte pro Satz). *(02, 03)*
- [P1] Zustand „Training läuft“ mit Fortsetzen und Verwerfen; leere Trainings zählen nicht.
- [P1] Start mit Plan-Kacheln, „Heute: Tag A“ mit einem Tipp, Ruhetag ehrlich angezeigt.
- [P1] Ausfall-Dialog mit Grund-Chips.
- [P1] Ziel und „Letztes Mal“ pro Satz; Antippen übernimmt kg und Wdh.
- [P1] Schnelle Zahleneingabe (Komma/Punkt, Enter springt weiter, Inhalt markiert).
- [P1] „Erledigt“ mit ✓ und Text statt nur Farbe; „nur links/rechts“ bei halb ausgefüllten Seiten.
- [P1] Kopfleiste mit Fortschritt, Details-Blatt, Übungsmenü; erste Übung ohne Scrollen sichtbar.
- [P1] Pausen-Timer mit Bildschirm-an, ±15 s, übersteht Neuladen.
- [P1] Geplante Übungen nur überspringen oder ersetzen, nicht löschen.
- [P1] Abschluss-Bildschirm (Dauer, Sätze, Volumen, Plantreue, Abweichungen).
- [P1] Bearbeitungsmodus für beendete Trainings.
- [P1] Aufwärmsatz verständlich beschriftet („Aufw.“).
- [P1] Speicherfehler: Knopf „Erneut versuchen“ ergänzen (Anzeige ist erledigt).

**Kalender und Auswertungen** *(03)*
- [P1] Kalender mit Status und Soll-Ist (Symbol + Text). *(02, 03)*
- [P1] Standard-Auswertung `/analysis` mit Karten, Leerzuständen und Tabellen-Alternative.
- [P1] Übungs-Detail mit Verlauf, Seitenlinien links/rechts und Rekorden 1–12 Wdh.

## Backlog

- [P2] Kalender: Training löschen und „als ausgefallen eintragen“ direkt im Tagesdetail; Umschalter Monat/Liste. *(02)*
- [P2] Auswertung: Reiter „Mein Dashboard“/„Ziele“, Balance-Karte, „Andere Aktivitäten“, Sparklines, Filter Status/Art/Muskel; Muskelnamen verlinken, sobald es die Muskel-Detailseite gibt. *(03)*

**P2**
- Rolle „Stabilisator“ in den Übungsdaten (Farblogik: Primär rot, Sekundär orange, Stabilisator grau, inaktiv dunkel). *(Nutzer, N9)*
- Muskelmodell 2 mit Faserbündeln/Segmenten – nach Vorschlag des Grafik-Agenten (N4). *(Nutzer)*
- Einstellungen-Seite: Sprache, Mann/Frau, später Dark Mode; Umschalter Mann/Frau an der Figur. *(Nutzer)*
- Skelett-Ebene an der Figur zuschaltbar (nach Grafik-Lieferung). *(Nutzer)*
- Dark Mode (Tokens für Dunkel; Gestaltung durch Design-Agent). *(Nutzer)*
- Archiv und Planansicht `/plans/:planId`; Entwurfs-Kennzeichen in der Planliste. *(01)*
- Vorlagen mit Filtern (Ziel, Ort, Tage, Niveau) und Vorschau. *(01)*
- Mehrere Wochentage pro Trainingstag (Planmodell 4). *(01)*
- Ort und Ausstattungsprofil pro Plan (Studio/Zuhause), filtert die Auswahl vor. *(01)*
- Desktop zweispaltig (Editor mit Auswahl rechts, Tagebuch Liste/Inhalt). *(01, 02)*
- Auswahl: „In diesem Plan“, „Zuletzt verwendet“, Suche nach Muskeln. *(01)*
- Supersätze in Plan und Training. *(01, 02)*
- Ziehen zum Sortieren (dnd-kit erlaubt); Kopieren zwischen Tagen; Wischen zum Entfernen. *(01)*
- Analyse über alle aktiven Pläne, Hinweise ausblendbar und zielabhängig. *(01)*
- Start/Dauer: Hinweis „Dauer erreicht“ mit Archivieren. *(01)*
- Satzart-Menü, RIR optional, Satz-Blatt mit −/＋, Notizen pro Übung und Satz, Gefühl 1–5. *(02)*
- Bestleistungen im Abschluss; „Plan mit diesen Werten aktualisieren“ ohne Vorauswahl. *(02)*
- Offene Tage, Nachholen, Verschoben mit Bezug; andere Aktivitäten; Liste nach Wochen. *(02)*
- Mehrere Browser-Tabs synchron; Übungen im Training umsortieren; L/R ausschalten ohne Verlust; Verlauf der Übung im Training. *(02)*
- Plan-Auswertung (Soll-Ist pro Muskelgruppe), Pläne und Zeiträume vergleichen (max. 3). *(03)*
- Muskel-Detail und Muskelkarte (fünf Stufen, Figur über `data-muscle`). *(03)*
- Balance links/rechts und Gegenspieler. *(03)*
- Ziele. *(03)*
- Speicher auf IndexedDB, Export/Import (Pläne JSON, Trainings JSON/CSV). *(01, 02, 03)*
- Progressionsvorschlag „bereit für mehr Gewicht“, Jahresraster. *(02, 03)*
- Muskelgruppen-Icons ersetzen (fremder Server, Lizenz ungeklärt). *(Projektprüfung)*
- Tagebuch im Supabase-Schema. *(Projektprüfung)*

**P3**
- Wochen planen (Periodisierung, Deload). *(01)*
- Satzarten Drop und Muskelversagen. *(01, 02)*
- Muskelauswahl über die Körperfigur; Animationen in der Vorschau (nach Grafik-Lieferung). *(01)*
- Aufwärmsätze vorschlagen bzw. berechnen. *(01, 02)*
- Erfassung und Auswertung pro Wiederholung. *(02, 03)*
- Einstellungen Tagebuch; Timer-Benachrichtigung im Hintergrund; Sync-Konfliktregel mit Konto. *(02)*
- Eigenes Dashboard (ohne Ziehen bedienbar, max. 12 Karten). *(03)*
- RIR/RPE-Auswertung; Körpergewicht und Apple-Health-Import; Konto-Synchronisation. *(03)*
- Ladegröße verkleinern (Code-Splitting). *(Projektprüfung)*
- Design-Handoff-Dokumente aktualisieren. *(Projektprüfung)*

## Blockiert

- **Figur und Animationen einbauen** – wartet auf das vollständige Grafik-Paket und die Bitte des Grafik-Agenten um Prüfung. Bis dahin Platzhalter.
- **App-Gesamtdesign** – zurückgestellt; erst nach Abschluss der Grafik und Abnahme eines Mockups durch den Nutzer.

## Erledigt

- Training: „Letztes Mal (Datum): 60 × 10 · …“ pro Übung (L/R getrennt) und Steigerungsvorschlag, wenn alle Arbeitssätze das obere Ende erreicht haben (+2,5 kg bzw. +2 kg Kurzhantel); Anime-Pläne nach Nachprüfung korrigiert (Hero-100 komplett 3×/Woche mit Zugübungen und Laufaufbau, Einstieg mit Rudern und Geh-Lauf-Intervallen, Beine 2× bei Boxer und Aufklärungstrupp, mehr Brust/Seitheben bei Saiyajin) *(14.11.)*
- Nach Kritiker-Review (`docs/review/kritik-fitness-2026-11-14.md`): nur Kraft- und Halteübungen zählen für Muskelauslastung, Hinweise und Soll (Editor und Auswertung); kg-Feld entfällt bei Dehnen/Mobility/Yoga/Pilates/Boxen/Cardio; Ziel-RIR im Training; Ausfall zählt nicht als „heute trainiert“; Reihum wiederholt einen ausgefallenen Tag; „1 Satz“; Kategorien von Band Pull-Apart, Dead Bug, Bird Dog korrigiert; Vorlagen 1.1.0 (Kraftblock in Kraft & Masse, Bauch in PPL und 5er-Split, unterstützte Klimmzüge für Einsteiger, eigene Beschreibungen, Steigerung über Haltezeit bei Mobility/Pilates, Deload-Hinweis, Sicherheitstexte, Namen) *(14.11.)*
- Vorlagen-Auswahl mit Kategorien (Studio, Zuhause, Boxen, Mobility/Pilates, Fokus Frauen, Anime-inspiriert) als Filter-Chips mit Anzahl und Level; 5 Anime-Fan-Pläne (One Punch Man Einstieg/komplett, Hajime no Ippo, Attack on Titan, Dragon Ball), realistisch skaliert mit Ruhetagen und Sicherheitshinweis; neue Übungen Sit-up und lockerer Dauerlauf; ▶-Symbole durch Text „Trainieren“/„Training starten“ ersetzt *(14.11.)*
- Planliste: Karte mit Zeitplan (Wochentagskürzel bzw. „Reihum · n×/Woche“), Anzahl Tage und Übungen, „zuletzt trainiert“ aus dem Tagebuch; ▶ Trainieren und ⋮-Menü (Bearbeiten, Duplizieren, Archivieren, Löschen – Trainings bleiben); zuletzt trainierte Pläne zuerst; Tage werden nicht mehr in der Liste gelöscht (B17) *(14.11.)*
- Kalender (Monatsraster mit Tastatur, Status mit Symbol und Text, Tagesdetails mit Soll/Ist, Monatsliste nach KW), Auswertung (Zeitraum- und Planfilter in der URL, Kennzahlen mit Vergleich, Wochenserie, Säulen mit Tabellen-Umschalter, Sätze pro Muskelgruppe, Bestleistungen) und Übungsauswertung (e1RM-/Gewichtsverlauf, L/R getrennt, Satz-Rekorde) – vom Helfer gebaut, in Navigation und Routen eingebunden *(14.11.)*
- Leerer Plan startet mit Namensvorschlag „Mein Plan n“, Reihum 3×/Woche und Tag A, Übungsauswahl „Übungen für Tag A“ offen; leerer Tagesname wird beim Verlassen wieder „Tag X“; „12 bis 8“ wird beim Verlassen zu „8 bis 12“ *(14.11.)*
- Plan-Editor: kompakter Kopf (Name + Zeitplan-Knopf, Beschreibung/Zeitplan/Daten per Tipp), Tage und Übungen direkt darunter; Tagesleiste mit Wochentag, Name und Anzahl; Sätze per −/＋ (1–20); kg-Felder nehmen Komma und Punkt (Editor und Tagebuch) *(14.11.)*
- Neue Navigation (Heute, Kalender, Pläne, Auswertung, Übungen), Heute-Seite (Training mit einem Tipp, Ruhetag mit nächstem Training), Einstellungen (Sprache, Figur Mann/Frau, Dark Mode folgt), mehrere aktive Pläne mit Archiv und Rückgängig, Start-/Enddatum im Plan *(14.11.)*
- Rechengrundlage Auswertungen in `src/utils/analysis/` (Satzliste, Muskelbeiträge, Filter mit URL, e1RM, Volumen, Bestleistungen, Satz-Rekorde, Plantreue gepoolt, Termintreue, Wochenserie; 63 Tests); Zielregel geteilt, fehlende Seite abgesichert, Übungssuche per Map *(13.11.)*
- Übungsauswahl als Vollbild-Dialog mit Mehrfachauswahl („Hinzufügen (n)“), Vorschau über ⓘ, keine 40er-Grenze; Übung ersetzen mit Varianten (Sätze, Gewicht, Pause, Notiz, Position bleiben) *(13.11.)*
- Plan-Editor: Kopfleiste (← · Titel · ↶ · Speichern) bleibt oben, Navigation im Editor ausgeblendet, Verlauf mit 50 Schritten und Strg+Z, Verlassen-Auswahl (Speichern / Entwurf behalten / Verwerfen / Weiter bearbeiten) *(13.11.)*
- Rückgängig statt Rückfragen: Meldung mit „Rückgängig“ (8 s) beim Entfernen von Übungen, Tagen, Plänen, Tagebucheinträgen, Sätzen und zusätzlichen Übungen; geplante Übungen im Training nur überspringen *(13.11.)*
- Muskelzählung ohne Doppelzählung (Höchstwert pro Satz), „Trainings pro Woche“ für Reihum-Pläne, Legende, keine tiefen Muskeln in Hinweisen, höchstens 3 Hinweise sichtbar *(13.11.)*
- Nutzerentscheidungen 21:00: mehrere aktive Pläne + Archiv, neue Navigation, kompakter Editor, dnd-kit erlaubt, Faserbündel, Skelett zuschaltbar, Figurenstil zurück zur Referenz (Bart, Profil ok, keine Logos), Mann/Frau-Wahl, Dark Mode ja *(13.11.)*
- UX-Spezifikation Planerstellung: `docs/ux/01-planerstellung.md` (34 Aufgaben); alle drei Spezifikationen zusammengeführt *(13.11.)*
- Fehler behoben: Plantreue zählt entfernte geplante Sätze als nicht gemacht; Speicherfehler werden auf jeder Seite angezeigt („Nicht gespeichert“) *(13.11.)*
- UX-Spezifikation Trainingstagebuch: `docs/ux/02-tagebuch.md` (Abläufe, Bildschirme, Datenmodell 2, 41 Aufgaben) *(13.11.)*
- UX-Spezifikation Analysen und Gesamtarchitektur: `docs/ux/03-analysen-und-architektur.md` (Kennzahlen mit Formeln, Filter, Seiten, Backlog P1–P3, 25 Aufgaben) *(13.11.)*
- Projektprüfung: 392 Tests, Lint, Build, 0 Sicherheitsmeldungen; keine verwaisten Dateien, Übersetzungen vollständig; Aufräumen (`FormTitle`), README aktualisiert, `.env` in `.gitignore` *(13.11., 20:30)*
- Tagebuch: pro Seite (L/R), Sätze ohne Bestätigen, Planwahl ohne Vorauswahl, Plan-Filter *(13.11.)*
- Trainingstagebuch erste Fassung: Training starten, Sätze eintragen, Ausfall, Verschiebung, Wochenzahlen *(13.11.)*
- Plan-Editor kompakt: Schnelleingabe, Symbole, Filter „Art“, Auslastung pro Tag/Plan ganz unten *(13.11.)*
- Muskelmodell 93 Einträge nach Terminologia Anatomica, alle 97 Übungen neu zugeordnet *(13.11.)*
- Auswertung im Editor: Diagramm, Hinweise, 12 Muskelpaare vom Nacken bis zum Unterschenkel *(13.11.)*
- Verbundene Filter, Übungsvorschau mit Varianten *(13.11.)*
- Planmodell 3 und neuer Plan-Editor mit Vorlagen und Entwurf *(13.11.)*
- Konzept Pläne, Training, Kalender, Auswertung *(27.10.)*
- Design-Übergabe 1 umgesetzt (vorläufig, Design zurückgestellt) *(27.10.)*
