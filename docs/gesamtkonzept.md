# GetFit! – Gesamtkonzept

Stand: 27.10.2026. Dieses Dokument beschreibt das Zielbild der App, die Bausteine, die Reihenfolge der Umsetzung und die Grenzen. Alles mit **Vorschlag** ist noch nicht entschieden.

**Pläne, Training, Kalender und Auswertung** sind im Detail in [konzept-plaene-training-auswertung.md](konzept-plaene-training-auswertung.md) beschrieben. Dieses Dokument gibt den Überblick.

## 1. Zielbild

Vom Nutzer gewünscht:

- **Anmeldung** mit eigenem Konto
- **Trainingspläne pro Nutzer** gespeichert, auf jedem Gerät verfügbar
- **Tracking:** Trainings protokollieren, **pro Satz und pro Wiederholung**, mit Abweichungen vom Plan
- **Kalender:** pro Tag sichtbar, ob trainiert wurde, ob nach Plan oder etwas anderes
- **Auswertung pro Nutzer:** Analysen, **filterbar**
- **Dashboard** und **eigenes, anpassbares Dashboard**
- **Ziele** setzen und verfolgen
- **Gesundheits-Apps anbinden**, zum Beispiel Apple Health auf dem iPhone, um Fitnessdaten zu übernehmen
- Bereits beschlossen: eigene Übungsdatenbank, Plan-Vorlagen, Figuren für Mann und Frau mit Muskelkarten, Übungsanimationen

## 2. Bausteine

```
┌──────────────────────────── App (React, im Browser) ─────────────────────────────┐
│  Übungen   Pläne & Vorlagen   Training (Tracking)   Analyse & Dashboard   Ziele  │
│  Profil & Einstellungen (Sprache, Mann/Frau)   Verbindungen (Gesundheits-Apps)   │
└───────────────┬───────────────────────────────────────────────────┬──────────────┘
                │ Anmeldung, Daten lesen/schreiben                  │ später: native Hülle
┌───────────────▼────────────────────────┐            ┌─────────────▼──────────────┐
│ Backend (Vorschlag: Supabase, EU)      │            │ iPhone-/Android-App         │
│  Anmeldung · PostgreSQL · Zugriffsregeln│            │ (Capacitor) → Apple Health, │
│  pro Nutzer · Serverfunktionen          │            │ Health Connect              │
└────────────────────────────────────────┘            └────────────────────────────┘
Fest in der App (kein Backend nötig): Übungsdatenbank, Muskeln, Plan-Vorlagen, Grafiken
```

| Baustein | Inhalt | Status |
|---|---|---|
| Übungsdatenbank | 97 Übungen, 39 Muskeln, Geräte, Deutsch und Englisch | **fertig** |
| Pläne | eigene Pläne erstellen und bearbeiten, mit Übungen aus der Datenbank, Wiederholungsbereichen, Dauer und Pausen | Planmodell 2 **fertig** (lokal, Speicher austauschbar). **Neu geplant:** Planmodell 3 mit benannten Tagen, Zeitplan und Vorgaben pro Satz |
| Plan-Vorlagen | 23 Vorlagen übernehmen und anpassen (7 Athleten-Vorlagen zurückgestellt, O9) | Daten da, Funktion geplant |
| Konto | Registrierung, Anmeldung, Passwort vergessen, Konto löschen | geplant |
| Synchronisation | Pläne pro Nutzer im Backend, lokale Pläne werden beim ersten Anmelden übernommen | geplant |
| Tracking | Training aus einem Plan starten, frei trainieren, andere Aktivität, nachtragen; Sätze und optional einzelne Wiederholungen; Soll und Ist getrennt | geplant |
| Kalender | Monatsansicht mit Status (nach Plan, mit Abweichungen, anderes Training, verpasst), Soll-Ist-Vergleich | geplant |
| Analyse | Kennzahlen und Diagramme, filterbar | geplant |
| Dashboard | Standard-Dashboard plus eigenes Dashboard mit frei gewählten Elementen | geplant |
| Ziele | Ziele anlegen und den Fortschritt sehen | geplant |
| Gesundheits-Apps | Daten aus Apple Health und anderen Apps übernehmen | geplant, mit Grenzen (Abschnitt 5) |
| Figuren & Muskelkarten | Mann/Frau, trainierte Muskeln hervorgehoben | beim Grafik-Agenten |
| Design | Oberfläche aller Seiten | beim Designer-Agenten |

## 3. Was Analyse, Dashboard und Ziele zeigen könnten (Vorschlag)

Die Daten dafür entstehen durch das Tracking. Die Übungsdatenbank kennt zu jeder Übung die Haupt- und Hilfsmuskeln. Deshalb lässt sich auch auswerten, **welche Muskeln** wie stark trainiert wurden, und auf der Muskelfigur als Karte zeigen.

| Auswertung | Beispiel |
|---|---|
| Trainingshäufigkeit | Trainings pro Woche, Serie (Tage in Folge), Kalender |
| Plantreue | Anteil der Vorgaben, die erfüllt wurden, pro Training, Woche und Plan |
| Volumen | Sätze × Wiederholungen × Gewicht, pro Woche, pro Muskelgruppe, pro Übung |
| Muskelkarte | Figur, auf der die Muskeln nach Trainingsumfang eingefärbt sind |
| Bestleistungen | schwerstes Gewicht, meiste Wiederholungen, geschätztes Maximum pro Übung |
| Körperwerte | Gewicht, Körperfett, Umfänge, eingegeben oder aus Gesundheits-Apps |
| Aktivität | Schritte, Kalorien, Herzfrequenz, aus Gesundheits-Apps |

**Filter (Vorschlag):** Zeitraum, Muskelgruppe, Übung, Plan, Kategorie (Kraft, Mobility …).

**Eigenes Dashboard (Vorschlag):** Der Nutzer wählt Elemente aus einer Liste, ordnet sie an und legt pro Element Zeitraum und Filter fest. Gespeichert wird das pro Nutzer.

**Ziele (Vorschlag):** zum Beispiel „3 Trainings pro Woche“, „Bankdrücken 100 kg“, „Körpergewicht 80 kg bis Juni“, jeweils mit Fortschrittsanzeige.

## 4. Backend (Vorschlag: Supabase)

**Warum Supabase:**
- PostgreSQL passt zu den verschachtelten Daten (Plan → Tag → Übung → Satz).
- Anmeldung ist eingebaut, auch mit Google oder Apple möglich.
- Zugriffsregeln direkt in der Datenbank: Jeder Nutzer sieht nur seine eigenen Daten.
- Open Source, also auch selbst betreibbar. Damit sind wir nicht an den Anbieter gebunden.

**Kostenloser Tarif** (laut Vergleichsartikeln, vor dem Start auf der offiziellen Preisseite prüfen):
- 500 MB Datenbank, 1 GB Dateien, 50.000 aktive Nutzer pro Monat
- **Das Projekt pausiert nach 7 Tagen ohne Nutzung.** Für die Entwicklung ist das in Ordnung, für eine echte Veröffentlichung wäre der Bezahltarif (ca. 25 $/Monat) nötig.
- Ein Konto legst **du** an, eine Kreditkarte ist dafür laut Vergleichsartikeln nicht nötig. Region: EU (Frankfurt).

**Datenmodell (Entwurf):**

| Tabelle | Inhalt |
|---|---|
| `profiles` | Anzeigename, Sprache, Ansicht Mann/Frau, Einwilligungen |
| `plans`, `plan_days`, `plan_entries` | eigene Pläne mit Tagen und Einträgen (Übungs-ID, Sätze, Wiederholungsbereich oder Zeit, Pause), Herkunft bei Vorlagen |
| `workouts`, `workout_sets` | protokollierte Trainings mit Kopie der Vorgaben, allen Sätzen und optional Wiederholungen; flache Satz-Tabelle für Auswertungen |
| `body_metrics` | Körperwerte mit Datum und Quelle (manuell oder App) |
| `goals` | Ziel, Zielwert, Termin, Status |
| `dashboards`, `dashboard_widgets` | eigene Dashboards mit Elementen, Reihenfolge und Filtern |
| `health_imports` | aus Gesundheits-Apps übernommene Werte mit Quelle und Zeitpunkt |

Übungen, Muskeln und Vorlagen bleiben in der App und werden nur über ihre ID referenziert.

**Grundsatz (Vorschlag):** Die App funktioniert weiterhin ohne Konto mit lokaler Speicherung. Wer sich anmeldet, bekommt seine Daten gesichert und auf allen Geräten.

## 5. Gesundheits-Apps: was geht und was nicht

| Quelle | Weg | Kosten | Bewertung |
|---|---|---|---|
| **Apple Health (iPhone)** | Nur aus einer **echten iPhone-App** lesbar, nicht aus dem Browser. Weg: unsere App mit dem kostenlosen **Capacitor** verpacken, Plugin `@capacitor/health-fitness`. | Bauen nur auf einem **Mac** mit Xcode. App Store: **99 $/Jahr**. Ohne Programm nur 7 Tage gültig und nur auf eigenen Geräten. | technisch gut, aber Mac und Gebühr nötig |
| **Apple Health Export** | Der Nutzer exportiert in der Health-App alle Daten als Datei (ZIP) und lädt sie in unserer Web-App hoch, wir lesen sie aus. | kostenlos | **sofort machbar**, aber manuell und nicht automatisch |
| **Health Connect (Android)** | Ebenfalls nur aus einer echten Android-App, wieder mit Capacitor und demselben Plugin. Android Studio läuft auch unter Windows. | Google Play: einmalige Gebühr. Zum Testen ohne Store kostenlos. | gut machbar |
| **Google Fit** | Wird 2026 abgeschaltet | – | nicht mehr nutzen |
| **Fitbit** | Alte Schnittstelle wird im Oktober 2026 abgeschaltet. Der Nachfolger „Google Health API“ verlangt eine Sicherheitsprüfung. | Prüfaufwand | eher später |
| **Strava, Withings, Garmin** | eigene Online-Schnittstellen | noch nicht geprüft | später prüfen |

**Empfehlung:** Zuerst den kostenlosen **Import der Apple-Health-Exportdatei** und die manuelle Eingabe von Körperwerten. Die automatische Anbindung über eine native App folgt, wenn die Frage nach Mac und Gebühr geklärt ist.

## 6. Recht und Datenschutz

Mit Konten und Trainingsdaten wird die App datenschutzrechtlich relevant. Das ist keine Rechtsberatung, aber diese Punkte sind absehbar:

- **Datenschutzerklärung** und, bei öffentlicher Nutzung, ein **Impressum**
- **Auftragsverarbeitungsvertrag** mit dem Backend-Anbieter, Daten auf **EU-Servern**
- **Gesundheitsdaten** (Herzfrequenz, Körperwerte, Daten aus Apple Health) sind besonders geschützt. Dafür braucht es eine **ausdrückliche Einwilligung**, die man auch widerrufen kann.
- Nutzer müssen ihre Daten **exportieren** und ihr **Konto löschen** können.
- Bei der Anbindung von Apple Health gelten zusätzlich Apples Regeln, zum Beispiel keine Weitergabe an Dritte und keine Werbung mit diesen Daten.

## 7. Reihenfolge (Vorschlag, überarbeitet am 27.10.2026)

| Phase | Inhalt | Braucht |
|---|---|---|
| **0 – erledigt** | Plan-Speicher als austauschbare Schnittstelle. Planmodell 2. Alte Pläne werden automatisch umgewandelt. | – |
| **A – Plan-Editor (umgesetzt 13.11.2026)** | Planmodell 3, benannte Tage, Zeitplan, Übungsauswahl mit Filtern, Vorgaben pro Satz, Vorlagen übernehmen | – |
| **B – Training** | Training protokollieren, pro Satz und optional pro Wiederholung, freie Trainings und andere Aktivitäten | Entscheidungen O14, O17 |
| **C – Kalender** | Monatsansicht, Status, Plantreue, Soll-Ist-Vergleich | Entscheidung O15 |
| **D – Auswertung** | Verlauf, Volumen, Bestleistungen, Filter, Dashboards, Ziele | Muskelfiguren für die Muskelkarte |
| **E – Konto** (vorbereitet, siehe `supabase/README.md`) | Supabase, Anmeldung, Synchronisation von Plänen und Trainings, Konto löschen, Export | dein Supabase-Konto |
| **F – Gesundheitsdaten** | Import der Apple-Health-Exportdatei, Körperwerte | Einwilligung, Datenschutz |
| **G – Native App** | Capacitor-Hülle | **Zurückgestellt**, kein Mac |

A bis D laufen ohne Konto, lokal im Browser. E kann jederzeit dazwischen kommen. Die Gestaltung neuer Seiten kommt vom Design-Agenten, sobald das App-Design freigegeben ist; bis dahin nutzt die Entwicklung die vorhandenen Bausteine.

## 8. Entscheidungen (27.10.2026)

| Frage | Entscheidung |
|---|---|
| Backend | Supabase wird **später** entschieden. Erinnerung, sobald Phase 1 ansteht. |
| Anmeldung | E-Mail und Google. **Apple-Anmeldung zurückgestellt:** „Mit Apple anmelden“ braucht auch im Web das Apple-Entwicklerprogramm (99 $/Jahr). |
| Ohne Konto nutzbar | **Ja**, lokale Speicherung bleibt. Mit Konto werden die Daten gesichert und synchronisiert. |
| Öffentlich | **Nein**, vorerst ein privates Projekt. Impressum und Bezahltarife sind damit kein Thema. Wer außer dir die App mit Konto nutzt, dessen Daten verarbeitest du trotzdem, also bleiben Datenschutzhinweise und Einwilligung wichtig. |
| Mac | **Kein Mac.** Keine native iPhone-App und keine automatische Apple-Health-Anbindung. Apple-Health-Daten kommen über den **Import der Exportdatei**. |
| Phase 0 | **Ja**, wird umgesetzt. |

Noch offen: welche Auswertungen, Dashboard-Elemente, Filter und Ziele genau (Abschnitt 3), sowie O8 und O14–O18 im [Detailkonzept](konzept-plaene-training-auswertung.md#10-offene-fragen-an-den-nutzer).

## Quellen

- Capacitor Health & Fitness Plugin (HealthKit und Health Connect, nicht im Web verfügbar): https://capacitorjs.com/docs/apis/health-fitness
- Apple-Entwicklerprogramm, Kosten: https://studio.adalo.com/blog/apple-developer-program-guide
- Kostenlose Bereitstellung nur mit Xcode auf dem Mac: https://developer.apple.com/forums/thread/90133
- Google Fit wird ersetzt: https://en.wikipedia.org/wiki/Google_Fit
- Fitbit Web API → Google Health API: https://developers.google.com/health/about
- Supabase-Tarife (Vergleichsartikel): https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/
