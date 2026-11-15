# Gemeinsame Aufgaben

| ID | Team | Aufgabe und Abnahme | Status |
|---|---|---|---|
| P01 | Grafik | B2 Live-App-Analyse samt Mobil-/Desktop-Screens und Messungen | Erledigt · [B2](../app-analyse-grafik-2026-11-14.md) |
| R01 | Grafik | Klickbaren responsiven Entwurf mit den fünf Hauptbereichen liefern | Prüfung · [Nutzerfeedback](nachrichten/2026-11-14-1517-r01-app-an-grafik-nutzerfeedback.md) · R08–R10 |
| R02 | Grafik | Mobile Abläufe für Heute, Kalender, Planerstellung, Satzprotokoll, Übungshinweise, Muskelgruppen und Auswertung | Prüfung · [Mobilentwurf](../redesign-mobile.md) |
| R03 | Grafik | Desktop-Auswertung mit Zeitraum, Plan-/Übungsfilter, Muskelkarte, Vergleich, Drilldown und Liste | Prüfung · [Desktopentwurf](../redesign-desktop.md) |
| R04 | Grafik | Helles und dunkles Designsystem, Typografie, Steuerungen, Zustände und Einstellungen ausarbeiten | Offen |
| R05 | Grafik-Kritiker | Prototyp unabhängig bei 390 × 844 und 1280 × 800 prüfen, mit Beleg und Schweregrad | Erledigt · [Befunde](../redesign-abnahmekriterien.md) · Browser-Nachprüfung R06F |
| R06 | Grafik | Kritikerbefunde beheben und erneute Prüfung veranlassen | Offen · R05 |
| G01 | Grafik | N1–N3 Figurenform, Stencil, Haltung, Haare, Bart, Hände, Beine und markenfreie Kleidung/Schuhe. V43 gegen Referenzen prüfen | Prüfung |
| G02 | Grafik | B1-Front und -Rücken je Figur, gleich gerahmt, transparent und auf hell/dunkel geprüft | Offen · G01 |
| G03 | Grafik | 81 App-Muskel-IDs mit registrierten neutralen Masken und beidseitigen Pfaden ausarbeiten. Tiefe Ebene getrennt | In Arbeit · [Maskenregister](../../fitness-graphics/production-v13/data/app-muscle-mask-coverage-v1.json) |
| G04 | Grafik | Anatomische Bündel und Segmente für Muskelmodell V2 vorschlagen | Prüfung · [Bündelvorschlag](../n4-muskelbuendel-vorschlag.md) |
| G05 | Grafik | Umschaltbare Ganzkörper-Skelettebene je Figur und Ansicht. Oberarm-Proof als Grundlage | In Arbeit |
| G06 | Grafik | Farbige Muskelübersicht, Rollenlegende und erste deckungsgleiche Rollenmaske in Bewegung | Offen |
| G07 | Grafik | Geräte und Zubehör pro Katalog-ID, Kontaktpunkte und Bewegung prüfen | In Arbeit · [Geräteübersicht](../geraete-und-zubehoer-2026-11-13.md) |
| G08 | Grafik | Eigene Icon-Sammlung ausarbeiten und in 20, 24 und 48 px auf hell/dunkel prüfen | In Arbeit · [Icon-Karten](icons.md) |
| A00 | Grafik | B1-Piloten in Katalogreihenfolge exportieren. MP4/WebM und Standbild je Figur, Szene mit Gerät/Boden und stabile Schleife prüfen | In Arbeit · [Übungskarten](uebungen.md) |
| B01 | Grafik | B1-Paket unter fitness-graphics/beta-1 mit Manifest, Figuren, Masken, 5–10 geprüften Übungen und bekannten Grenzen | Offen · G02, G03, A00 |
| B02 | App · App-Leitung (Claude Code) | Beta-Schalter in den Einstellungen, Platzhalter als Rückfall und Zuordnung nach stabilen IDs (Muskel-, Übungs-, Icon-IDs) prüfen | Offen · bestätigt · wartet auf B01 |
| E01 | App · App-Leitung (Claude Code) | Bestehende App-Aufgaben, laufende Arbeiten, offene Fehler und Verantwortliche importieren | Erledigt · Karten E08–E30 unten · [Antwort auf KICK-01](nachrichten/2026-11-14-1515-e01-app-an-grafik.md) |
| E02 | App · App-Leitung (Claude Code) | Navigation, Routing, Heute, Kalender und Trainingsabläufe nach Redesign für mobil umsetzen und testen. Grundstand (5 Bereiche, Heute, Kalender, Training) ist in der App | Offen · bestätigt · wartet auf Nutzerfreigabe des Redesigns (R01–R04) und R06 |
| E03 | App · App-Leitung (Claude Code) | Planerstellung, Vorlagen, Planeditor, Hinweise und Protokollierung nach Redesign für mobil umsetzen und testen. Grundstand in der App, siehe E08–E12 | Offen · bestätigt · wartet auf Nutzerfreigabe des Redesigns |
| E04 | App · App-Leitung (Claude Code) | Desktop-Auswertung, Filter, Muskelkarte und Drilldowns anbinden. Mobile Auswertung erhalten. Grundstand `/analysis` und Übungsdetail vorhanden | Offen · bestätigt · wartet auf R03-Freigabe und G02/G03 |
| E05 | App · App-Leitung (Claude Code) | Muskelmodell V2 (Bündel aus G04), Rollenfarben, Maskenebenen, L/R-Spiegelung und Figurwahl abstimmen | Offen · bestätigt · G04-Vorschlag wird geprüft, siehe E24 |
| E06 | App · App-Leitung (Claude Code) | Übungsmedien, Gerätezubehör-ID-Zuordnung, Icons und Hell-/Dunkelmodus anbinden | Offen · bestätigt · wartet auf B01/G08; Icons erst nach Freigabe zur Veröffentlichung (Repo ist öffentlich) |
| E07 | App-Kritiker (Fitness-App-Kritiker) | App-Umsetzung unabhängig in beiden Viewports prüfen. Befunde mit Reproduktion und Schweregrad | In Arbeit · erste Runde erledigt: [Bericht](../../../docs/review/kritik-fitness-2026-11-14.md), Nachprüfung Abschnitt 6 |
| Q01 | Beide Kritiker | Gemeinsame Abnahme von Grafik, Bedienung, Integration und offenen Blockern dokumentieren | Offen |
| Q02 | Beide Teams | Herkunft, Paketintegrität, externe Abhängigkeiten, Lieferumfang und Nutzertest für Freigabe prüfen | Offen |

| R06A | Grafikleitung | Neue Trainingseinheit mit leeren Satzfeldern starten, ohne laufende Eingaben beim Lesen von Hinweisen zu verlieren | Prüfung · [Entwurf](../redesign/index.html) |
| R06B | Grafikleitung | Alle Planübungen im Training erreichbar machen. Leeren Plan korrekt behandeln | Prüfung · [Entwurf](../redesign/index.html) |
| R06C | Grafikleitung | Direkte Rückkehr aus Technikhinweisen zur geöffneten Übung und zum Satz ermöglichen | Prüfung · [Entwurf](../redesign/index.html) |
| R06D | Grafikleitung | Zeitraumwechsel aktualisiert Diagramm, Kennzahlen und Vergleich gemeinsam | Offen |
| R06E | Grafikleitung | Muskel-Drilldown, Fokusführung und aria-current ergänzen | Offen |
| R06F | Grafik-Kritiker | Korrekturen im Browser in beiden Viewports unabhängig nachprüfen | Offen · R06A–E |
| A01A | Bewegung | Glute Bridge: Durchdringung der Bodenfläche im Hochpunkt lokalisieren, korrigieren und erneut messen | In Arbeit · [Befund und Kandidaten](../b1-beckenheben-kandidat-2026-11-14.md) |

## App-Karten aus E01 (14.11.2026, 15:15)

Verantwortlich ist die App-Leitung; Helfer-Agenten bekommen den Board-Pfad und ihre Karten-ID, wenn sie eingesetzt werden. Prüfung durch den App-Kritiker unter E07. Die frühere Teamliste `docs/kanban.md` bleibt als Teamansicht und verweist auf diese Karten.

| ID | Team | Aufgabe und Abnahme | Status |
|---|---|---|---|
| E08 | App · App-Leitung (Claude Code) | Plan-Editor: kompakter Kopf, Tagesleiste, Sätze −/＋, kg mit Komma, leerer Plan mit Tag A | Erledigt · `src/components/planEditor/`, Tests `PlanEditor.test.jsx` |
| E09 | App · App-Leitung (Claude Code) | Vorlagen: Kategorien, 5 Anime-Fan-Pläne, Korrekturen nach App-Kritik (Version 1.1.0) | Erledigt · `src/data/planTemplates.json`, `src/data/inspiredTemplates.js`, `planTemplates.test.js` |
| E10 | App · App-Leitung (Claude Code) | Muskelauslastung nur aus Kraft- und Halteübungen (Editor, Auswertung, Soll) | Erledigt · `src/utils/planAnalysis.js`, `src/utils/analysis/muscleLoad.js`, Tests |
| E11 | App · App-Leitung (Claude Code) | Planliste: Zusammenfassung, „Trainieren“, ⋮-Menü, Archiv | Erledigt · `src/components/workoutPlans/WorkoutPlanCard.jsx` |
| E12 | App · App-Leitung (Claude Code) | Training: Ziel-RIR, „Letztes Mal“, Steigerungsvorschlag, kein kg-Feld bei Dehnen/Mobility/Cardio | Erledigt · `src/pages/WorkoutPage.jsx`, `src/utils/workoutLog.js` |
| E13 | App · App-Leitung (Claude Code) | Kalender, Auswertung, Übungsauswertung (Helfer-Agent) eingebunden | Erledigt · `src/pages/CalendarPage.jsx`, `AnalysisPage.jsx`, `ExerciseAnalysisPage.jsx` |
| E14 | App · App-Leitung (Claude Code) | Pausen-Timer: startet nach eingetragenem Satz, ±15 s, übersteht Neuladen | Erledigt · `src/hooks/useRestTimer.js`, `src/components/workout/RestTimer.jsx`, Test `RestTimer.test.jsx` · Bildschirm-an (Wake Lock) folgt |
| E15 | App · App-Leitung (Claude Code) | Training läuft / fortsetzen / verwerfen; Datenmodell 2 mit Migration (Start, Ende, Zeit pro Satz) | Offen |
| E16 | App · App-Leitung (Claude Code) | Abschluss-Bildschirm (Dauer, Sätze, Volumen, Plantreue, Abweichungen) | Offen · E15 |
| E17 | App · Helfer „Kalender“ | Ausfall-Dialog mit Grund-Chips; Bearbeitungsmodus für beendete Trainings | Erledigt · Ausfall-Dialog `src/components/diary/SkipDialog.jsx` (+Test), im Tagebuch und Kalender · Bearbeitungsmodus offen (App-Leitung) |
| E18 | App · App-Leitung (Claude Code) | RIR pro Satz optional erfassen und im Steigerungsvorschlag nutzen | Offen |
| E19 | App · Helfer „Statistik“ | Eine Zählung überall: Gruppenleiste im Editor auf effektive Sätze (1/0,5, Höchstwert) | Erledigt · effektive Sätze in `weeklySetsByMuscle`, Editor und Dashboard gleich, Legende im Editor |
| E20 | App · Helfer „Statistik“ | Wochenziel nicht über alle aktiven Pläne addieren (Hauptplan oder eigenes Ziel) | Erledigt · Wochenziel = Maximum der Kraftpläne, Serie zählt alle Trainings aktiver Pläne (`consistency.js`) |
| E21 | App · App-Leitung (Claude Code) | Eigengewicht: Wiederholungen statt 0 kg Volumen; Aufwärmsätze in Vorlagen; RIR-Texte je Plantyp | Teilweise erledigt · Training zeigt „Wdh. ohne Gewicht“ und Haltezeit statt 0 kg (`workoutSummary`) · Aufwärmsätze in Vorlagen und RIR-Texte offen |
| E22 | App · Helfer „Editor“ | Planerstellung: Übungskarte mit ⋮-Menü, Sortiermodus, Tag-Menü, Ziehen zum Sortieren (dnd-kit) | Erledigt · ⋮-Menüs für Übung und Tag (`ActionMenu.jsx`), Sortiermodus mit Ansage · Ziehen (dnd-kit) offen |
| E23 | App · Helfer „Kalender“ | Kalender: Training löschen und „als ausgefallen eintragen“ im Tagesdetail | Erledigt · Löschen mit Rückgängig und „Als ausgefallen eintragen“ im Tagesdetail |
| E24 | App · Helfer „Anatomie“ | G04-Bündelvorschlag fachlich prüfen und Muskelmodell V2 mit endgültigen IDs festlegen, Rückmeldung an Grafik | Erledigt · [Muskelmodell V2](../../../docs/muskelmodell-v2.md), [Nachricht](nachrichten/2026-11-14-1528-e24-app-an-grafik-muskelmodell-v2.md) · Nutzerfrage offen (Latissimus/Serratus-Flächen ohne TA2-Begriff) |
| E25 | App · App-Leitung (Claude Code) | Rolle „Stabilisator“ in den Übungsdaten (Farblogik N9) | Offen |
| E26 | App · App-Leitung (Claude Code) | Dark Mode: Tokens für Dunkel, Umschalter in den Einstellungen | Offen · R04 |
| E27 | App · App-Leitung (Claude Code) | Medienflächen vergrößern: Muskel-Monitor mobil eine große umschaltbare Ansicht plus Ausschnitt, Desktop zwei Ansichten (Befund B2: heute 160 px hoch) | Offen · B2-Bericht |
| E28 | App · App-Leitung (Claude Code) | Figurwahl in den Einstellungen mit kleiner Vorschau und Umschalter an der Figur | Offen · G02 |
| E29 | App · App-Leitung (Claude Code) | Speicherfehler: „Erneut versuchen“; Daten später in Supabase (Konto) statt nur lokal | Offen · Nutzerentscheidung Supabase |
| E30 | App · App-Leitung (Claude Code) | Neue Übungen `sit_up` und `easy_run` in Übungskarten aufnehmen (spätere Animation) | Offen · Grafik, nicht Beta 1 |
| E31 | App · App-Leitung mit 6 Katalog-Helfern | Übungskatalog V2: große Übungsliste (Geräte, Bänder, Körpergewicht, Yoga, Mobility, Pilates, Cardio, Boxen) mit Ausführung, Muskelrollen (primär, sekundär, Stabilisator, gedehnt) und Bewegungsdaten für Animationen. Format: [README](../../uebungskatalog-v2/README.md), Prüfer `scripts/validate_exercise_catalog.py` | Erledigt · 432 Übungen in 6 Bereichen, Prüfer 0 Meldungen · Quellen einzelner Bereiche noch gegenprüfen |
| E32 | App · App-Leitung | Katalog V2 in die App übernehmen (Daten, Geräte, Stabilisator-Rolle, gedehnte Muskeln, Ausführung in der Übungsvorschau) | Offen · E31 |
| E33 | App · App-Leitung | Testphase ohne Backend vorbereiten: „Meine Daten exportieren“ (JSON) und „Trainingsdaten löschen“ mit Bestätigung in den Einstellungen | Erledigt · `src/utils/dataExport.js`, `SettingsPage.jsx`, Tests |
| E34 | App · App-Leitung | Backend Testphase: Supabase (Frankfurt) + Vercel, offene Registrierung; Tabelle `workouts` (`supabase/migrations/0002_workouts.sql`) und `remoteWorkoutStore` vorbereitet | In Prüfung · Supabase `getfit` (Frankfurt) mit Tabellen, Anmeldung/Konto/Datenschutzseite in der App, online unter https://getfit-rosy.vercel.app · offen: GitHub-Verbindung in Vercel |
| E35 | App · App-Leitung | Vor dem ersten Tester: Datenschutzerklärung mit Einwilligung, Hinweis „Testversion“, Konto löschen | In Arbeit · Datenschutzerklärung als Entwurf (`src/pages/PrivacyPage.jsx`), Einwilligung beim Registrieren, Konto löschen fertig · Verantwortlicher muss vom Nutzer eingetragen werden |


## Neue visuelle Richtung

| ID | Team | Aufgabe und Abnahme | Status |
|---|---|---|---|
| R08 | App-Kritiker | Visuelle Kritik des Prototyps mit konkreten Befunden zu Typografie, Hierarchie und professioneller Anmutung | Erledigt · [E07-Bericht](nachrichten/2026-11-14-1519-e07-app-kritiker-an-grafik-redesign.md) |
| R09 | Grafikleitung | Zwei bis drei klar unterschiedliche Richtungen für Heute und Training bei 390 × 844, jeweils hell und dunkel | Prüfung · zwei klickbare Mobilstudien |
| R10 | Nutzer | Visuelle Richtung anhand der Vergleichsentwürfe auswählen | Offen · R09 |

| R09A | Grafik · Grafikleitung | Kühle, präzise Richtung für Heute und Training, beide Themes, eigene Figurenstudie | Prüfung · [Entwurf](../redesign/richtung-a.html) |
| R09B | Grafik · Grafikleitung | Warm-neutrale Richtung für Heute und Training, beide Themes, eigene Figurenstudie | Prüfung · [Entwurf](../redesign/richtung-b.html) |

| R09C | Grafik-Kritiker | Raster und Trainingsjournal unabhängig gegen E07 prüfen. Befunde mit Beleg und Prüfgrenzen im Board ablegen. | Erledigt · [Prüfung](nachrichten/r09-grafik-kritiker-an-beide-teams.md) |
| R09D | Grafikleitung | Kritikerbefunde bewerten, Korrekturen in kleine Teilkarten teilen, Ergebnisse zusammenführen und erneut prüfen. | In Arbeit · R09F–I |


| R09E | Grafikleitung | Text-, Hauptknopf- und Feldrand-Kontrast beider Entwürfe messen | Erledigt · [Messung](nachrichten/r09e-grafik-tokenkontrast.md) |

| R09F | Grafikleitung | Kompositionen deutlich auseinanderziehen | In Arbeit · [Journal-Startansicht mit Figur neben Trainingseintrag](../redesign/richtung-b.html). Journal-Trainingsansicht als Protokoll unterhalb der Technikhinweise ergänzt. Browservergleich offen. Feldränder siehe R09F1 |
| R09G | Grafikleitung | Satz speichern, Pausentimer und Trainingsabschluss als durchgängigen Ablauf zeigen | Prüfung · [Trainingsskript](../redesign/r09-training.js) in beiden Entwürfen. Zustandsprüfungen bestanden, Browserprüfung offen |
| R09H | Grafikleitung | Desktop-Auswertung je Richtung und Darstellung der Muskelrollen mit Figurenstudien ergänzen | Prüfung · [Desktop-Vergleich](../redesign/r09-desktop.html), Pfade und Syntax geprüft |
| R09I | Grafik-Kritiker | Beide Richtungen im Browser mit Tastatur, Hell/Dunkel und den Zielgrößen prüfen | Erledigt · [Browserbefunde](nachrichten/r09i-grafik-kritiker-browserpruefung.md) · Nachtest R09L |
| R09F1 | Grafikleitung | Helle Feldränder auf mindestens 3:1 anheben | Prüfung · [Messung](nachrichten/r09f1-grafik-feldraender.md) |
| R09J | Grafikleitung | Fokus nach Wechsel zwischen Heute und Training an die neue Überschrift setzen | Erledigt · [Chrome-Nachtest R09L](nachrichten/r09l-grafik-kritiker-tastatur-und-rollen.md) |
| R09K | Grafikleitung | Rollenfarben bei Muskelauswahl erhalten und Auswahl mit eigener Kontur zeigen | Erledigt · [Chrome-Nachtest R09L](nachrichten/r09l-grafik-kritiker-tastatur-und-rollen.md) |
| R09L | Grafik-Kritiker | Fokus und Rollen im Browser erneut prüfen, Tastaturfolge ergänzen | Erledigt · [Chrome-Nachtest](nachrichten/r09l-grafik-kritiker-tastatur-und-rollen.md) |
| R09N | Atlas-Agent · defensive Codeprüfung | Eingabepfade, dynamisches HTML, externe Ressourcen und Datenspeicherung der lokalen Entwürfe prüfen | Erledigt · [Statischer Prüfbericht](nachrichten/r09n-grafik-codepruefung.md) |
| R09O | Grafikleitung | Lokale SVG-Masken im Mobilentwurf passiv als Bilder einbinden | Erledigt · [Chrome-Nachtest auf beiden Mobilentwürfen](nachrichten/r09o-grafik-kritiker-masken.md) |
| R09P | Grafikleitung | Dynamische Texte und Diagrammwerte für App-Daten defensiv über DOM und geprüfte Werte ausgeben | Erledigt · [Unabhängiger Chrome-Nachtest](nachrichten/r09p-grafik-kritiker-browser.md) |
| R09Q | Atlas-Agent | Vier Rollen gleichzeitig an vorhandenen Masken als Beispiel zeigen | Prüfung · [Vier-Rollen-Studie](../redesign/r09q-vier-rollen.html). [Browserbefund](nachrichten/r09q-grafik-kritiker-browser.md). Vorderansicht und Übungsbezug offen |
| R09R | Grafikleitung | Beide Mobilrichtungen und Desktop-Vergleich auf einer Seite verlinken | Erledigt · [Vergleichsseite](../redesign/r09-vergleich.html) · [Browsertest](nachrichten/r09q-grafik-kritiker-browser.md) |
| G08A | Grafik-Kritiker | 15 neue Icons in drei Größen auf Hell/Dunkel prüfen | In Arbeit |
