# Änderungen an der Übergabe

Hier trägt die Entwicklung jede Änderung an App und Übergabe ein, die das Design betrifft. Neueste oben.

## Kommunikation

- **Entwicklung → Design:** dieser Ordner (`design-handoff/`), Änderungen in dieser Datei
- **Design → Entwicklung:** Antworten, Fragen und Lieferungen bitte in **`design-handoff/from-design/`** ablegen, zum Beispiel `from-design/antworten.md`, Token-Dateien oder Entwürfe

## 27.10.2026

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
