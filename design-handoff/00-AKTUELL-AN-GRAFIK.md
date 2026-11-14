# AKTUELL: Auftrag der Entwicklung an den Grafik-Agenten

> **NEU (13.11.2026, 21:00, ergänzt 22:00): Nutzerentscheidungen N1–N13 – bitte zuerst lesen und eure laufenden Arbeiten danach korrigieren.** Sie gehen allen älteren Punkten in dieser Datei vor. Referenzbilder: [Stil](nutzer-referenz/stil-referenz-2026-11-13.png), [Farb-Übersicht und Übungsbilder](nutzer-referenz/uebersicht-referenz-2026-11-13.png). Neu: Icons (N12, [icons-bedarf-v1.json](icons-bedarf-v1.json)).

> **NEU (14.11.2026, später): Auftrag B2 – die App selbst ansehen und aus Grafiksicht analysieren.** Vor B1 erledigen, das Ergebnis fließt in B1 ein.

## B2 – App-Analyse aus Grafiksicht (Nutzerwunsch 14.11.2026)

Der Nutzer möchte, dass du dir die **laufende App** ansiehst, bevor du das Beta-Paket baust. So passen Figuren, Masken, Animationen und Icons genau in die Stellen, an denen die App sie zeigt.

**Zugang:**
- Laufende App: **http://localhost:5173** (Vite-Entwicklungsserver auf diesem Rechner). Falls er nicht läuft: im Projektordner `npm run dev` (Node liegt unter `C:\Program Files\nodejs`). Nichts installieren.
- Quellcode zum Nachlesen: `src/` im Projekt (nur lesen, **nichts in `src/` ändern**, kein git commit).
- Testdaten: Unter „Pläne“ → „Neuer Trainingsplan“ eine Vorlage wählen und speichern, dann „Trainieren“ und ein paar Sätze eintragen. Erst dann füllen sich Kalender und Auswertung.
- Screenshots im Handyformat (390 × 844) und Desktop (1280 × 800), z. B. mit Chrome headless (`chrome.exe --headless --screenshot=... --window-size=390,844 http://localhost:5173/today`).

**Stellen, an denen Grafik vorgesehen ist (heute Platzhalter):**

| Stelle | Datei | Was dort hinkommt |
|---|---|---|
| Muskel-Monitor im Plan-Editor (unten, Tag und ganzer Plan) | `src/components/planEditor/PlanAnalysis.jsx` | Figur vorne/hinten mit Masken, eingefärbt nach Auslastung; später Hinweise auf der Figur |
| Übungsvorschau beim Hinzufügen (ⓘ in der Übungsauswahl) | `src/components/planEditor/ExercisePreview.jsx`, `ExercisePicker.jsx` | Übungsanimation und Standbild mit Farblogik N9, Varianten |
| Auswertung, Karte Muskelfigur | `src/components/analysis/DashboardCards.jsx`, `src/pages/AnalysisPage.jsx` | Figur mit Sätzen pro Muskel über einen Zeitraum |
| Übungsseiten | `src/pages/ExercisesPage.jsx`, `src/components/exercises/MuscleIcon.jsx`, `muscleIcons.js` | Muskelgruppen-Icons (ersetzen die fremden Icons, N12) |
| Navigation unten | `src/components/navigation/Navigation.jsx` | 5 Navigations-Icons (Heute, Kalender, Pläne, Auswertung, Übungen) |
| Einstellungen | `src/pages/SettingsPage.jsx` | Auswahl Mann/Frau (später mit kleiner Vorschau der Figur) |
| Training und Kalender | `src/pages/WorkoutPage.jsx`, `src/pages/CalendarPage.jsx` | Status- und Aktions-Icons aus [icons-bedarf-v1.json](icons-bedarf-v1.json) |

**Bitte prüfen und beantworten:**
1. **Platz und Größe:** Wie groß ist jede Grafikfläche bei 390 px und bei 1280 px? Passen Vorder- und Rückansicht nebeneinander, oder besser umschaltbar? Welche Seitenverhältnisse und Auflösungen brauchst du daher für Figuren, Masken und Clips?
2. **Lesbarkeit:** Bleiben kleine Muskeln (z. B. Brachialis, Teres minor, Köpfe des Trizeps) bei dieser Größe erkennbar? Falls nicht: Vorschlag (Zoom, Ausschnitt, Liste daneben).
3. **Farben:** Funktionieren Blau/Schwarz (Mann), Grün/Schwarz (Frau) und die Farblogik Rot/Orange/Grau/Dunkel mit den App-Farben (`src/styles/tokens.js`) im hellen Modus, und später im Dark Mode?
4. **Icons:** Welche der 92 Icons aus der Bedarfsliste siehst du in der App wirklich gebraucht, welche fehlen, welche sind überflüssig?
5. **Stil:** Was an der heutigen App-Oberfläche passt nicht zum Stil der Referenz ([stil-referenz](nutzer-referenz/stil-referenz-2026-11-13.png))? Nur feststellen; das Redesign der Oberfläche ist Aufgabe des Design-Agenten.
6. **Folgen für B1:** Was änderst du dadurch am Beta-Paket (Formate, Größen, Reihenfolge)?

**Ergebnis:** Datei `from-design/app-analyse-grafik-2026-11-14.md` mit den Antworten 1–6, dazu die Screenshots in `from-design/app-analyse-screens/` (bleibt lokal). Kurze, klare Sätze.

---

> **NEU (14.11.2026): Auftrag B1 – Beta-Paket für einen ersten App-Test. Bitte direkt nach der Figurenanpassung (N1) liefern.**

## B1 – Beta-Paket (Nutzerwunsch 14.11.2026)

Der Nutzer möchte die App **mit echten Grafiken testen**. Sobald die Figuren nach N1 angepasst sind, bitte ein **Beta-Paket** liefern. Die Entwicklung baut es als „Beta“ in die App ein (eigener Schalter in den Einstellungen, die Platzhalter bleiben als Rückfall). Es muss nicht vollständig sein. Es muss aber in sich stimmig sein, damit man Figur, Muskel-Monitor und Übungsanimation zusammen erleben kann.

**Inhalt (Mindestumfang):**

| Teil | Was | Format |
|---|---|---|
| B1.1 Figuren | Mann (Blau/Schwarz) und Frau (Grün/Schwarz), je **vorne und hinten**, angepasster Stil nach N1–N3, gleiche Pose und Kamera wie die Masken | SVG oder PNG (transparent, mind. 1024 px hoch), dazu je eine Version für den dunklen Hintergrund, falls nötig (N7) |
| B1.2 Muskel-Monitor | Neutrale **Masken** passend zu B1.1 für möglichst viele der 81 Blatt-IDs aus [muskelmodell-v1.json](muskelmodell-v1.json), mit `__left`/`__right`; tiefe Muskeln als eigene Ebene. Mindestens alle Muskeln der 6 Gruppen (Brust, Rücken, Schultern, Arme, Bauch/Rumpf, Beine) in der sichtbaren Schicht. Die App färbt die Masken nach Auslastung (Monitor im Plan-Editor und in der Auswertung) und nach N9 (rot/orange/grau/dunkel). | SVG mit einer Gruppe bzw. einem Pfad je Maske, `id` = App-ID, ohne Füllfarbe (oder `fill="currentColor"`); alternativ PNG-Masken je ID |
| B1.3 Übungsanimationen | Die ersten **5 bis 10 Übungen** aus `priority1` in [uebungen-prioritaet-v1.json](uebungen-prioritaet-v1.json), je Figur eine Schleife (die App spiegelt für links, N8), dazu je ein Standbild (N10). Wenn möglich mit Masken für die Farblogik N9. | WebM oder MP4 (H.264), höchstens ca. 2 MB je Clip, quadratisch oder 4:5, transparenter oder neutraler Hintergrund; Standbild PNG/WebP |
| B1.4 Skelett (optional) | Wenn schon vorhanden: Skelett-Ebene zu B1.1 (N5) | SVG oder PNG, deckungsgleich |
| B1.5 Icons (optional) | Wenn schon vorhanden: die 6 Navigations-Icons aus [icons-bedarf-v1.json](icons-bedarf-v1.json) | SVG 24 × 24, `currentColor` |

**Ablage und Beschreibung:**
- Ordner `fitness-graphics/beta-1/` (bleibt lokal, Repo ist öffentlich).
- Dazu eine Datei `fitness-graphics/beta-1/manifest.json` mit: Version, Datum, Liste aller Dateien mit Figur (`male`/`female`), Ansicht (`front`/`back`), Art (`figure`/`mask`/`skeleton`/`exercise-loop`/`exercise-still`/`icon`), App-ID (Muskel- bzw. Übungs-ID), Seite (`left`/`right`/`both`), Bildgröße und gemeinsamer Bezugsrahmen (viewBox), damit Figur und Masken exakt übereinanderliegen.
- Eine kurze Statusdatei `from-design/beta-1-lieferung.md`: was drin ist, was fehlt, bekannte Mängel.

**Neue Übungen (14.11.2026):** `sit_up` (Sit-up) und `easy_run` (lockerer Dauerlauf) sind neu in der Bibliothek, Muskeln stehen in `src/data/exercises/coreMobilityCardio.js`. Sie gehören zu neuen Fan-Vorlagen (Anime-inspiriert). Bitte in die Liste für spätere Animationen aufnehmen, nicht in Beta 1.

**Lizenz:** nur eigene oder frei nutzbare Quellen (wie bisher), keine Marken, keine fremden Figuren.

Rückfragen bitte als Datei in `from-design/`. Sobald `beta-1-lieferung.md` liegt, baut die Entwicklung das Paket ein und der Nutzer testet.

---

## Nutzerentscheidungen vom 13.11.2026, 21:00 und 22:00

| Nr. | Entscheidung | Was das für die Grafik bedeutet |
|---|---|---|
| N1 | **Stil zurück zur ursprünglichen Idee.** Die Figuren V33/V36 sind dem Nutzer zu weit von der ursprünglichen Idee entfernt. Maßgeblich ist die Referenz [nutzer-referenz/stil-referenz-2026-11-13.png](nutzer-referenz/stil-referenz-2026-11-13.png) (Mann blau/schwarz, Frau grün/schwarz, Vorder-, Rück- und beide Seitenansichten). | Massive, klar ausgeformte Muskulatur mit deutlich sichtbaren Muskelgrenzen; kräftige schwarze Stencil-Negativflächen; leuchtende Konturen; dynamische, detaillierte Haare. Die heutigen Figuren wirken zu schmal, die Muskelzeichnung wie ein flaches Muster, Haare blockartig, Hände zu groß. Die Muskelform muss trotzdem anatomisch stimmen und zu den Masken passen. Bitte einen Vorschlag zum Weg dorthin (3D-Basis anpassen oder anderer Ansatz) mit Vergleichsbildern ablegen. |
| N2 | **Kopf:** Bart beim Mann bleibt, Gesichtsprofil (Nase, Lippen, Kinn in der Seitenansicht) ist in Ordnung, von vorne weiter ohne Gesichtszüge. | Wie in der Referenz. Ersetzt die frühere Vorgabe „auch im Profil ohne Gesichtszüge“ (F2). |
| N3 | **Keine Markenlogos.** | Schuhe ohne Haken- oder andere Markenzeichen; sonst wie in der Referenz. |
| N4 | **Faserbündel:** Einzeln markierbar sollen zusätzlich zu Muskeln, Köpfen und Anteilen auch die **sichtbaren Faserbündel bzw. Segmente größerer Muskeln** sein (z. B. Rückenstrecker abschnittsweise, Fasergruppen des großen Brustmuskels, des Trapezmuskels, des Latissimus). Keine mikroskopischen Einzelfasern. | Bitte aus eurem TA-Namenskatalog und der Anatomie einen **Vorschlag** ablegen: welche Muskeln in welche anatomisch begründeten Bündel/Segmente geteilt werden, mit vorgeschlagenen IDs (`<muskel-id>__<bündel>`). Die Entwicklung übernimmt die Liste dann ins Muskelmodell (Version 2) und meldet die endgültigen IDs zurück. |
| N5 | **Skelett als zuschaltbare Ebene.** | Pro Figur und Ansicht eine Skelett-Ebene, deckungsgleich mit Figur und Masken, neutral (App färbt), ohne Text. |
| N6 | **Mann und Frau wählbar** (in den Einstellungen und per Umschalter an der Figur). | Beide Figuren mit identischem Masken- und ID-Satz. |
| N7 | **Dark Mode kommt.** | Figuren, Masken und Skelett müssen auf dunklem und hellem Hintergrund funktionieren (transparenter Hintergrund). |
| N9 | **Farblogik für Übungen** (zweite Nutzerreferenz [nutzer-referenz/uebersicht-referenz-2026-11-13.png](nutzer-referenz/uebersicht-referenz-2026-11-13.png)): Primärmuskel (Zielmuskel) rot, Sekundärmuskel (Hilfsmuskel) orange, Stabilisator grau, inaktiv dunkel. | Masken bleiben neutral, die App färbt nach dieser Logik. Neu ist die Rolle **Stabilisator**: Die Entwicklung erweitert die Übungsdaten um Stabilisatoren; bitte in den Animationen dieselbe Dreiteilung sichtbar machen können (über die Masken). |
| N10 | **Übungsbilder:** Jede Übung als Bild bzw. Clip mit der Figur am passenden Gerät, die beteiligten Muskeln farbig nach N9 markiert (z. B. Bankdrücken auf der Flachbank, Kniebeuge mit Langhantel, Latzug am Kabelzug, Beinpresse). | Ergänzt A1: neben der Schleife ein Standbild je Übung und Figur mit Gerät, ohne Text. Gerätemodelle wie bei euch begonnen (Langhantel, Bänke, Rack, Kabelzug, Kurzhanteln, SZ-Stange, Bänder). |
| N11 | **Farbige Muskelübersicht als Legende:** Vorder- und Rückansicht, jeder Muskel bzw. Anteil in eigener Farbe, mit Gruppenlegende (Brust oben/mitte/unten = Pectoralis-Anteile, gerader Bauchmuskel in Segmenten, Trapez oben/mitte/unten usw.). | Gleiche Masken wie M1 und N4; die Farben pro Muskel legt die App fest. Die Figurenfarben bleiben **Mann Blau/Schwarz, Frau Grün/Schwarz** (die Rot/Lila-Figuren der Referenz sind nicht gemeint). |
| N8 | **Antworten von 20:00 bestätigt:** ein Clip je Übung und Figur (App spiegelt für links), Masken mit `__left`/`__right`, Prioritäten aus [uebungen-prioritaet-v1.json](uebungen-prioritaet-v1.json). | Unverändert. |
| N12 | **Icons gestaltet der Grafik-Agent** (Nutzerentscheidung 13.11.2026). Alle Symbole der App, im Stil der Referenz. Liste mit IDs und Bedeutungen: [icons-bedarf-v1.json](icons-bedarf-v1.json) – 92 Icons: Navigation 6, Muskelgruppen 7, Trainingsarten 8, Geräte 32, Aktionen 31, Trainingsstatus 7, App-Symbol 1. | SVG 24 × 24, `currentColor`, ohne Text und Marken, einheitlicher Strich bzw. Füllung, lesbar ab 20 px, funktioniert hell und dunkel. Ablage `fitness-graphics/icons/<gruppe>/<id>.svg` plus Vorschau-Tafel als PNG. Die heutigen Muskelgruppen-Icons kommen von einer fremden Website und werden damit ersetzt; bis zur Lieferung nutzt die App Platzhalter. |
| N13 | **Beschreibung der zweiten Referenz** (Farb-Übersicht des Nutzers, Datei: [nutzer-referenz/uebersicht-referenz-2026-11-13.png](nutzer-referenz/uebersicht-referenz-2026-11-13.png)): Tafel je Figur mit (a) Ansichten vorne/hinten/links/rechts in App-Pose, (b) Muskelgruppen-Übersicht vorne und hinten, jeder Muskel bzw. Anteil in eigener Farbe mit Legende (Brust oben/mittel/unten, gerader Bauchmuskel in Segmenten, äußerer und innerer schräger Bauchmuskel, Serratus, Deltamuskel vorne/seitlich/hinten, Bizeps langer/kurzer Kopf, Brachialis, Trizeps lang/seitlich/medial, Unterarmbeuger/-strecker, Brachioradialis, Trapez oben/mittel/unten, Latissimus, Rautenmuskeln, Teres major/minor, Infraspinatus, Rückenstrecker, Quadrizeps-Köpfe, Adduktoren, ischiocrurale Muskeln, Waden, Tibialis anterior, Gesäßmuskeln), (c) Farblogik Primär rot / Sekundär orange / Stabilisator grau / inaktiv dunkel, (d) Dateiliste je Figur (front/back/left/right als SVG, muscle_regions.json, Vorschau-PNG, Ordner exercises mit einer SVG je Übung), (e) Beispiel-Übungen mit Figur am Gerät und farbig markierten Muskeln (Bankdrücken, Schrägbankdrücken, Dips brust- und trizepsbetont, Klimmzüge, Rudern, Kabelzug, Kniebeuge, Beinpresse, Beinbeuger, Beinstrecker; Frau zusätzlich Hip Thrust, Ausfallschritte, Rumänisches Kreuzheben, Latzug, Schulterdrücken, Seitheben). | Übernommen werden (b), (c) und (e) – siehe N9 bis N11. Die Rot/Lila-Figurenfarben der Tafel sind **nicht** gemeint; es bleibt Blau/Schwarz und Grün/Schwarz im Stil der ersten Referenz. Die Dateistruktur (d) ist ein guter Vorschlag; maßgeblich sind die Muskel- und Übungs-IDs der App. |

Rückfragen bitte als Datei in `from-design/`.

---

## Bisheriger Auftrag (13.11.2026, 16:30)


Stand: 13.11.2026, 16:30. **Bitte zuerst lesen.** Diese Datei ist vollständig; dieselben Punkte stehen auch in [feedback-entwicklung.md](feedback-entwicklung.md) (Abschnitte ab „Auftrag Muskelfigur und Übungsanimationen“).

## Nutzerauftrag

- Im Trainingsplan soll eine **Figur genau zeigen, welche Muskeln trainiert werden**. Bei einer isolierten Übung wird **nur dieser Muskel** markiert.
- Das gilt für den **kompletten Körper**, anatomisch korrekt bis zur kleinsten Unterteilung (Köpfe und Anteile nach Terminologia Anatomica). Keine erfundenen Zonen wie „unterer Bauch“.
- Beim Hinzufügen einer Übung zeigt ein Fenster die **Animation der Übung**. Zu jeder Übung gibt es **Varianten** (Langhantel, Kurzhantel, Kabel, Band, Maschine, Körpergewicht), jede mit eigener Animation.
- Die Grafiken müssen an das neue Muskelmodell angepasst werden.

## Verbindliche Muskelliste

- [muskelmodell-fuer-grafik.md](muskelmodell-fuer-grafik.md): Tabelle mit allen 93 Einträgen (ID, Deutsch, Latein, übergeordneter Muskel, Sichtbarkeit, Maske ja/nein).
- [muskelmodell-v1.json](muskelmodell-v1.json): dieselben Daten maschinenlesbar, dazu Haupt- und Hilfsmuskeln aller 97 Übungen.
- Herleitung und Quellen: `docs/muskelmodell.md`.

## Was gebraucht wird

| Nr. | Was | Anforderung |
|---|---|---|
| M1 | Masken | Für **jede Figur** (Mann, Frau) und **jede Ansicht** (vorne, hinten) eine Maske pro Muskel der **feinsten Ebene: 81 Muskeln**, davon 58 von außen sichtbar und 23 tief. Deckungsgleich mit der Figur, gleiche Leinwand (mindestens 512 × 768 px), ohne Text. Bevorzugt SVG mit einem Pfad oder einer Gruppe pro ID (`id` = Muskel-ID), sonst PNG mit Alpha pro ID. Eure bisherigen 35 Atlas-IDs bitte auf diese Liste abbilden und Abweichungen zurückmelden. |
| M2 | Neutral | Masken ohne eingebrannte Farbe. Die App färbt selbst: Hauptmuskel, unterstützender Muskel, Hinweis (zu wenig trainiert). |
| M3 | Verdeckte Muskeln | Die Hervorhebung liegt über der Kleidung an der anatomischen Stelle (Entscheidung F3/F4). |
| M5 | Tiefe Muskeln | Vorschlag für eine Tiefenansicht der Figur (z. B. zweite Ebene oder halbtransparent), damit auch verdeckte Muskeln markiert werden können: Rotatorenmanschette, Rautenmuskeln, innerer schräger und querer Bauchmuskel, Hüftbeuger, Multifidus, tiefe Unterarm- und Wadenmuskeln u. a. |
| M6 | Übungszuordnung | Die Animationen zeigen genau die in der JSON genannten Haupt- und Hilfsmuskeln in Arbeit. Bei isolierten Übungen arbeitet sichtbar nur der genannte Muskel. |
| M7 | Gleiche IDs | Figur, Masken und Animationen tragen dieselben Muskel- und Übungs-IDs wie die App. |
| A1 | Animationen | Pro Übungs-ID und Figur eine Schleife (WebM oder MP4/H.264) plus Standbild (PNG), ohne Text, transparenter oder neutraler Hintergrund. Reihenfolge: zuerst die Übungen der 23 Vorlagen, dann der Rest. |
| A2 | Varianten | Jede Variante ist eine eigene Übungs-ID und braucht eine eigene Animation. |
| L1 | Ablage | Unter `fitness-graphics/` mit einer Liste, welche IDs fertig sind. Integration erst nach eurer Bitte um Prüfung. |

## Stand der App

Der Plan-Editor ist vorbereitet. Er hat drei Bereiche: ein Diagramm der Sätze pro Muskelgruppe, die Muskelabdeckung mit Platz für die Figur und die Übungsvorschau mit Platz für die Animation. Bis zur Lieferung zeigt die App Platzhalter sowie eine Liste aller 81 Muskeln mit ihren Sätzen. Hinweise auf Lücken und Ungleichgewichte prüft die App an 12 Muskelpaaren vom Nacken bis zum Unterschenkel.

Rückfragen bitte als Datei in `from-design/`.
