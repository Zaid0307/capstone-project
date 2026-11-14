# Änderungen an der Übergabe

Hier trägt die Entwicklung jede Änderung an App und Übergabe ein, die das Design betrifft. Neueste oben.

## Kommunikation

- **Entwicklung → Design:** dieser Ordner (`design-handoff/`), Änderungen in dieser Datei
- **Design → Entwicklung:** Antworten, Fragen und Lieferungen bitte in **`design-handoff/from-design/`** ablegen, zum Beispiel `from-design/antworten.md`, Token-Dateien oder Entwürfe

## 14.11.2026

- **An den Grafik-Agenten:** Auftrag B2 – die laufende App (http://localhost:5173) aus Grafiksicht analysieren (Platz, Lesbarkeit, Farben, Icons, Stil, Folgen für B1); Ergebnis in `from-design/app-analyse-grafik-2026-11-14.md`.
- **An den Grafik-Agenten:** Auftrag B1 – Beta-Paket (angepasste Figuren, Muskel-Monitor-Masken, erste 5–10 Übungsanimationen, optional Skelett und Navigations-Icons) in `fitness-graphics/beta-1/` mit `manifest.json`, Meldung in `from-design/beta-1-lieferung.md`. Details oben in [00-AKTUELL-AN-GRAFIK.md](00-AKTUELL-AN-GRAFIK.md).

## 13.11.2026

- **22:00 an den Grafik-Agenten:** Icons liegen jetzt beim Grafik-Agenten (N12, 92 Icons in [icons-bedarf-v1.json](icons-bedarf-v1.json)); zweite Nutzerreferenz beschrieben (N13); Aufforderung, die laufenden Arbeiten nach N1–N13 zu korrigieren.
- **Nutzerentscheidungen 21:00:** Figurenstil zurück zur Referenz (N1–N3), Faserbündel als markierbare Einheiten (N4, Vorschlag vom Grafik-Agenten erbeten), Skelett zuschaltbar (N5), Mann/Frau wählbar (N6), Dark Mode ja (N7); neue Navigation, mehrere aktive Pläne, kompakter Editor; App-Name offen. Details: [00-AKTUELL-AN-GRAFIK.md](00-AKTUELL-AN-GRAFIK.md), [feedback-entwicklung.md](feedback-entwicklung.md).
- **Antworten an den Grafik-Agenten** (20:00): Muskel-IDs mit Ansicht, Übungsprioritäten aus den 23 Vorlagen ([uebungen-prioritaet-v1.json](uebungen-prioritaet-v1.json)), keine Varianten-IDs außerhalb des Katalogs, ein Clip je Übung (App spiegelt für links), Masken mit `__left`/`__right`, Faser-Begriff geklärt.
- **Tagebuch erweitert:** Übungen pro Seite (Zeilen L und R pro Satz, Umschalter „L/R“), Sätze ohne Bestätigungsknopf (✕ zum Entfernen), Planwahl ohne Vorauswahl, Filter nach Plänen. Für Animationen relevant: Übungen pro Seite stehen in `PER_SIDE_EXERCISE_IDS` (`src/data/exerciseLibrary.js`).
- **Neu: Trainingstagebuch** (Funktion, kein neues Design): Seite „Tagebuch“ mit Navigationseintrag (Symbol Buch), Trainingsseite zum Eintragen pro Satz (kg, Wiederholungen bzw. Sekunden, erledigt), Ausfall und Verschiebung. Plan-Editor: Übungszeile mit Schnelleingabe und Symbolen, Muskelauslastung ganz unten mit Umschalter Tag/ganzer Plan, Filter „Art“ (Körpergewicht, Kurzhanteln, Langhantel, Bänder, Kabelzug, Maschine, Boxen, Cardiogeräte). Neue Bildschirme für das spätere Design: Tagebuch, Trainingsseite.
- **Muskelmodell Version 1 für den ganzen Körper** an den Grafik-Agenten: [muskelmodell-fuer-grafik.md](muskelmodell-fuer-grafik.md), [muskelmodell-v1.json](muskelmodell-v1.json). 93 Einträge, 81 Masken auf feinster Ebene. Auftrag M1 (neu), M5–M7 in [feedback-entwicklung.md](feedback-entwicklung.md). Die App wertet jetzt alle Muskeln aus, auch tiefe, und prüft 12 Muskelpaare vom Nacken bis zum Unterschenkel auf Ungleichgewichte.
- **Auftrag an den Grafik-Agenten (M1–M4, A1–A2, L1):** Muskelmasken pro Muskel-ID und Ansicht, Übungsanimationen pro Übungs-ID, siehe [feedback-entwicklung.md](feedback-entwicklung.md). Plan-Editor mit drei Bereichen (Diagramm, Muskelabdeckung, Übungsvorschau mit Varianten), Platzhalter für Figur und Animation.
- **Neuer Plan-Editor (Funktion, kein neues Design):** Anlegen und Bearbeiten auf einer Seite, Start mit leerem Plan oder Vorlage, benannte Trainingstage (feste Wochentage oder reihum), Übungsauswahl mit Suche und Filtern, Vorgaben pro Satz, Umsortieren und Duplizieren, Wochenübersicht, automatischer Entwurf. Gebaut mit den vorhandenen Bausteinen. Neue Bildschirme für ein späteres Design: Vorlagenwahl, Editor (Allgemein, Trainingstage, Übungsauswahl, Sätze), Fehlerliste. Konzept: `docs/konzept-plaene-training-auswertung.md`.
- **Grafik-Lieferungen bis 08.11. gelesen** (Status V13 bis V36, Antwort auf V1–V6/F1–F11). Keine Rückfragen; nichts integriert, wie verlangt. Die ZIP-Pakete in `from-design/` bleiben lokal.

## 27.10.2026

- **Grafik-Produktionsstand V13 gelesen** (`fitness-graphics/production-v13/`, nicht zur Integration freigegeben). Anmerkungen V1–V6 in [feedback-entwicklung.md](feedback-entwicklung.md). Die App bleibt unverändert.
- **Anmerkungen zum Figuren-Mockup v1** (F1–F11) in [feedback-entwicklung.md](feedback-entwicklung.md): Schuhlogos, Gesichtsprofile, verdeckte Muskeln, Detailgrad, Einheitlichkeit und Hinweise zur Einbindung. Nutzerabnahme steht aus. **Nutzerentscheidung:** Verdeckte Muskeln werden über der Kleidung hervorgehoben (F3, F4).
- **STOPP-Anweisung des Designs gelesen:** Lieferung V1 ist nicht zur Umsetzung freigegeben, zuerst Figuren und Mockup-Abnahme. Die bereits erfolgte Umsetzung ist dokumentiert und nicht zurückgesetzt; der Nutzer entscheidet.
- **Design-Übergabe 1 umgesetzt** (Tokens, Zustände, alle bestehenden Seiten bei 390 px, Vorlagenhinweise D6). Rückmeldung und Prüfpunkte in [feedback-entwicklung.md](feedback-entwicklung.md), Screenshots in `screenshots/design-v1-390/`.
- **Grafik-Paket V1.1 eingegangen** (`design-handoff/fitness-graphics/`). Geprüft: G1 und G2 sind behoben, die Geräte-IDs stimmen mit der App überein. **Farben entschieden:** Mann Königsblau/Schwarz, Frau Königsgrün/Schwarz (O2). Vorhanden sind 2 Vorderansichten (512 × 768 px, transparent) und vorläufige Muskelregionen der Vorderseite für 8 Muskeln. Es fehlen Rückansichten, die Hervorhebungen je Muskelgruppe und Übungsanimationen.
- **Rückmeldung der Entwicklung** an Grafik- und Design-Agent: [feedback-entwicklung.md](feedback-entwicklung.md). Darin stehen Fehler im Grafik-Paket (G1–G4), Hinweise zu den Figuren (G5–G9) und Bitten an das Design (D1–D8).
- **Plan-Vorlagen als Daten in der App:** 23 Vorlagen auf Deutsch und Englisch (`src/data/planTemplates.json`). Die 7 Athleten-Vorlagen sind nicht enthalten (O9). Noch keine Oberfläche, die Seiten dafür sind weiterhin offen (O8).
- **Neue Muskelgruppe „Sonstiges“ / „Other“** für Übungen ohne Muskelgruppe (Cardio, Boxen). Sie ist im Plan-Formular wählbar und erscheint in der Planansicht als letzte Gruppe.
- **Neue Zeile in der Übungsanzeige:** „Reserve (Wdh.)“ / „Reps in reserve“. Erscheint nur bei Übungen aus Vorlagen.
- **Kopierte Pläne enthalten zusätzlich:** Tagesnamen (z. B. „Push: Brust/Schultern/Trizeps“), Hinweise zu Fortschritt, Erholung und Sicherheit, und ob vor Beginn eine ärztliche Abklärung empfohlen wird. Diese Daten werden heute noch nicht angezeigt. Ihre Darstellung gehört zum Design der Plan- und Vorlagenansicht.
- **Pläne, Datenmodell 2:** Übungen werden aus der Übungsdatenbank gewählt (Vorschlagsliste), Freitext bleibt möglich. Neu sind Wiederholungsbereiche (8–12) oder Dauer (45 s), Pause, und das Gewicht ist optional. Das Formular hat neue Felder und einen neuen Fehlerzustand, siehe [02-komponenten.md](02-komponenten.md) unter `DayExercisesForm` und [03-inhalte-und-daten.md](03-inhalte-und-daten.md).
- **Entscheidungen des Nutzers:** Anmeldung per E-Mail und Google (Apple zurückgestellt), App ohne Konto nutzbar, nicht öffentlich, keine native iPhone-App. Apple-Health-Daten kommen per Import der Exportdatei. Siehe [07-offene-punkte.md](07-offene-punkte.md) O11 und O13.
- **Neue geplante Bereiche:** Konto, Profil und Einstellungen, Tracking, Analyse, Dashboard und eigenes Dashboard, Ziele, Gesundheitsdaten. Ziele sind bestätigt, Inhalte offen (O12). Vorschlag: `docs/gesamtkonzept.md`.
- **Plan-Vorlagen** als geplante Funktion aufgenommen (O8–O10).
- **Eigene Übungsdatenbank** statt wger: 97 Übungen, kein Lade- und Fehlerzustand mehr, vorerst ohne Bilder.
- **Technik:** Vite, React 19, Design-Tokens als CSS-Variablen in `src/styles/tokens.js`.
- **Erste Fassung** der Übergabe.
