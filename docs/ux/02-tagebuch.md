# GetFit! – UX-Spezifikation Trainingstagebuch

Stand: 13.11.2026 · Zielgruppe: Entwicklung · Grundlage: [Konzept Pläne, Training, Auswertung](../konzept-plaene-training-auswertung.md) (Abschnitte 4, 5, 6.2, 7.2, 10), [Gesamtkonzept](../gesamtkonzept.md)

Dieses Dokument legt **Abläufe, Aufbau, Zustände, Texte und Bedienbarkeit** fest. Farben, Typografie, Abstände und Illustrationen liefert der Design-Agent; wo hier „hervorgehoben“, „gedämpft“ oder „Warnung“ steht, ist die Rolle gemeint, nicht eine Farbe.

**Feste Vorgaben des Eigentümers, die überall gelten:**

1. Der Plan wird im Training aktiv benutzt; pro Satz werden kg und Wiederholungen (bzw. Sekunden) eingetragen, bei einseitigen Übungen **pro Seite** (Zeilen L und R, Schalter „L/R“).
2. **Kein Bestätigen pro Satz.** Ein Satz gilt als gemacht, sobald Wiederholungen oder Sekunden eingetragen sind. ✕ entfernt Sätze, die nicht gemacht wurden; zusätzliche Sätze kommen unten dazu.
3. Ausgefallene, verschobene und geänderte Trainings müssen eingetragen und **später bearbeitet** werden können.
4. Mehrere Pläne parallel oder im Wechsel; **im Tagebuch wird immer zuerst der Plan gewählt** (keine stille Vorauswahl). Mehrfachfilter nach Plänen.
5. Kalender pro Tag: trainiert / nach Plan / mit Abweichungen / anderes Training / verpasst.
6. Alles wird so gespeichert, dass es später für einen Plan oder mehrere Pläne zusammen ausgewertet werden kann.
7. Optional später **pro Wiederholung**: mit Hilfe, Teilwiederholung, Gewichtswechsel (O14).

---

## 1. Bewertung des Ist-Stands

Geprüft im Code und per Bildschirmfoto bei 390 px Breite (Trainingsseite mit Beispieldaten: Bankdrücken mit Aufwärmsatz, Kurzhantelrudern pro Seite; Tagebuchseite mit einem trainierten und einem ausgefallenen Eintrag).

### 1.1 Was gut ist und bleiben soll

- **Soll-Kopie im Ist** (`set.planned` in `src/utils/workoutLog.js`): alte Trainings bleiben vergleichbar, auch wenn der Plan sich ändert.
- **Sofortiges Speichern** jeder Eingabe (`useWorkoutLog` → `localWorkoutStore`), kein „Speichern“-Knopf.
- **Satz gilt als gemacht, sobald Wiederholungen/Sekunden da sind** (`isSetDone`), Gewicht wird vorbelegt, Wiederholungen nie. Das ist die richtige Grundregel für schnelles Loggen ohne Haken.
- **Pro Seite** sauber modelliert (`set.sides.left/right`), Plantreue verlangt beide Seiten (`meetsTarget`).
- **Plan zuerst** und **Mehrfachfilter** sind umgesetzt (`DiaryPage.jsx`, `filterWorkoutsByPlans`).
- Tabellen-Semantik mit `th scope`, `aria-label` an jedem Eingabefeld, 44-px-Ziele bei Icon-Knöpfen und Chips.
- Verschobene Trainings werden erkannt (`isMoved`) und mit Text und Symbol gezeigt.

### 1.2 Probleme (nach Schwere)

| Nr. | Problem | Ort | Folge |
|---|---|---|---|
| I-1 | **Plantreue wird durch ✕ geschönt.** `workoutSummary` zählt geplante Sätze nur aus den noch vorhandenen Sätzen (`plannedSets = … filter(set.planned)`). Wer zwei von vier geplanten Sätzen mit ✕ entfernt, hat 100 % statt 50 %. Dasselbe beim Entfernen einer geplanten Übung. | `src/utils/workoutLog.js:189`, `removeLoggedSet`, `removeLoggedExercise` | Auswertung falsch – verletzt Vorgabe 6 |
| I-2 | **Speicherfehler sind unsichtbar.** `useWorkoutLog` liefert `error`, `App.jsx` liest es nicht aus. Volles `localStorage` (Quota) oder privater Modus → Eingaben gehen still verloren. | `src/App.jsx:16`, `src/hooks/useWorkoutLog.js` | Datenverlust ohne Hinweis |
| I-3 | **Kein Trainingszustand „läuft“.** Ein Training ist ab dem Start `status: 'done'`. „Fertig“ navigiert nur zurück (`WorkoutPage.jsx:301`). Es gibt keine Start-/Endzeit, keine Dauer, kein „Fortsetzen“, und ein versehentlich gestartetes leeres Training zählt in der Woche als „Training“ (`DiaryPage.jsx:98`). | `workoutLog.js` `baseWorkout`, `DiaryPage.jsx` | Falsche Statistik, kein Wiedereinstieg |
| I-4 | **Soll und letzte Werte sind beim Loggen kaum sichtbar.** Das Ziel steht nur als Platzhalter („8–12“) im Wdh.-Feld und verschwindet beim Tippen; das Zielgewicht nur als Platzhalter eines meist schon vorbelegten Feldes, also nie sichtbar; RIR-Ziel gar nicht. Die Werte vom letzten Mal werden nur als Gewicht vorbelegt, Wiederholungen vom letzten Mal sieht man nie. `aria-description` (Zeile 220) wird von Screenreadern uneinheitlich unterstützt. | `WorkoutPage.jsx:206–245`, `exerciseFromEntry` | Nutzer weiß nicht, was er schaffen soll bzw. letztes Mal geschafft hat – Kernfunktion jeder Logging-App |
| I-5 | **„Erledigt“ nur über Hintergrundfarbe** (`SetRow $isDone`). | `WorkoutPage.jsx` `SetRow` | WCAG 1.4.1 (Benutzung von Farbe) verletzt; im hellen Studio schlecht erkennbar |
| I-6 | **Pro-Seite-Satz zählt als erledigt, wenn nur eine Seite eingetragen ist** (`setValues(set).some`), ohne Hinweis, dass die andere Seite fehlt. | `workoutLog.js:41` | Halbe Sätze unbemerkt |
| I-7 | **L/R ausschalten verwirft die rechte Seite still** (`sides?.left`). | `workoutLog.js:269` | Datenverlust ohne Warnung |
| I-8 | **Zahlenfelder `type="number"`**: Dezimalkomma auf deutschen iOS-/Android-Tastaturen wird je nach Browser abgelehnt (Feldwert leer), Mausrad ändert Werte am Desktop, kein „Weiter“ von kg zu Wdh. zum nächsten Satz. | `WorkoutPage.jsx:215, 232` | Fehleingaben, langsames Loggen |
| I-9 | **Datum, Status und Notiz stehen ganz oben** im Live-Training und schieben die erste Übung unter die Falz. Der Status-Wechsel „Trainiert ↔ Ausgefallen“ ist ein normales Auswahlfeld und blendet alle Übungen aus (Daten bleiben verdeckt erhalten). | `WorkoutPage.jsx:75–110` | Platz verschwendet; leicht versehentlich umgestellt |
| I-10 | **Startbereich mischt drei Aufgaben**: Plan/Tag/Datum, „Grund, falls es ausfällt“ (immer sichtbar, obwohl nur für „Ausgefallen“ nötig) und „Freies Training“ in einer Karte. Für den häufigsten Fall (heute das fällige Training) sind 3 Eingaben + 1 Tipp nötig. | `DiaryPage.jsx:105–180` | Langsam, missverständlich |
| I-11 | **Ruhetage werden verschwiegen.** Bei Wochentags-Plänen schlägt `suggestDay` ohne passenden Tag einfach Tag 1 vor. | `workoutLog.js:153` | Falsche Vorschläge, Fehlbuchung als „verschoben“ |
| I-12 | **Verpasste Tage entstehen nur von Hand.** Es gibt keine Liste „geplant, aber nichts eingetragen“, kein „Nachholen“, und ein verschobenes Training ist nicht mit dem ausgefallenen Soll-Termin verknüpft. | `DiaryPage.jsx`, `workoutLog.js` | Kalender (Abschnitt 5 Konzept) später nicht korrekt ableitbar |
| I-13 | **Geplante Übungen lassen sich löschen** statt nur überspringen/ersetzen; „Ersetzen“ gibt es nicht (nur Entfernen + Hinzufügen, Bezug geht verloren). | `WorkoutPage.jsx:148–156` | Soll-Ist-Vergleich verliert Informationen |
| I-14 | **Browser-`confirm()`** beim Löschen von Eintrag und Übung; ✕ beim Satz ganz ohne Rückgängig. | `DiaryPage.jsx:82`, `WorkoutPage.jsx:153` | Nicht übersetzbare Knöpfe, unterbricht; Satz-✕ neben dem Daumen ohne Netz |
| I-15 | **Kein Pausentimer, keine Satzart wählbar, kein RIR, keine Notiz pro Übung/Satz, keine Bestleistungen, kein „Plan mit diesen Werten aktualisieren?“** | – | Funktionslücken gegenüber Konzept 4.2/4.3 |
| I-16 | **Aufwärmsatz heißt „A“** ohne Legende; Screenreader liest „A“. | `translations.js` `workout.warmupShort` | Unklar |
| I-17 | **Einträge-Liste ohne Gruppierung und Begrenzung**; nach einem Jahr 150+ Zeilen am Stück. Filter steht nicht in der URL (geht beim Zurück verloren). | `DiaryPage.jsx:88, 196` | Unübersichtlich |
| I-18 | **Mehrere Tabs**: jeder Tab schreibt das ganze Array; der zuletzt schreibende Tab überschreibt Änderungen des anderen still (`localWorkoutStore.update` liest/schreibt alles, kein `storage`-Ereignis). | `src/storage/localWorkoutStore.js` | Stiller Datenverlust |
| I-19 | **Bildschirm geht während der Pause aus** (keine Wake-Lock-Anfrage); nach dem Entsperren muss man scrollen und suchen. | – | Reibung bei jedem Satz |

---

## 2. Benchmark: Live-Logging in den besten Apps

| Muster | Hevy | Strong | Alpha Progression | Boostcamp | Fitbod / JEFIT | Garmin (Uhr) | Übernahme für GetFit! |
|---|---|---|---|---|---|---|---|
| **Werte vom letzten Mal** je Satz sichtbar | Spalte „PREVIOUS“ links, Quelle wählbar (alle Trainings / gleiche Routine) [1][2] | Vorherige Leistung unter der Übung, Antippen übernimmt [8][9] | Vor jedem Satz Gewicht+Wdh.-Empfehlung aus letzter Leistung, heutigen Sätzen und Ziel [11] | Letztes Gewicht + Ziel sichtbar, Autofill [13][14] | Fitbod: Werte vorbelegt, Feld antippen zum Ändern [16] | – | **Ja (P1)**: „Letztes Mal“ pro Satz sichtbar, Antippen übernimmt Werte |
| **Satz abschließen** | Haken pro Satz | Haken pro Satz | Haken pro Satz | Haken | JEFIT „Log“ | Automatische Satzerkennung [18] | **Nein** (Vorgabe 2): Satz ist erledigt, sobald Wdh./Sek. eingetragen sind. Der Pausentimer startet an diesem Ereignis (siehe 3.2.5) |
| **Pausentimer** | Startet beim Abschließen, pro Übung einstellbar, Standard in Einstellungen, nicht vor Dropsätzen [2][5] | Automatischer Countdown [10] | – | – | JEFIT: Timer wechselt nach dem Loggen automatisch in Pause, Zeit direkt anpassbar [17] | Pausenzeit erscheint nach Satzende [18] | **Ja (P1)**: startet automatisch, nutzt Pause aus dem Plan, ±15 s, überspringen |
| **Satzarten** | Antippen der Satznummer → Aufwärmen/Normal/Versagen/Drop [3] | Aufwärmen, Drop, Versagen | – | – | – | – | **Ja (P2)**: Satznummer antippen öffnet Menü |
| **Aufwärmsätze in Statistik** | Einstellbar, ob sie zu Volumen/PRs zählen [2] | – | – | – | – | – | Standard: zählen nicht; P3 Einstellung |
| **RPE/RIR** | RPE optional pro Satz | RPE optional | RIR optional, in „zwei Taps“ [11][12] | RPE 6–10 in 0,5-Schritten mit RIR-Hinweis [13] | – | – | **Ja (P2)**: RIR (Reserve) 0–5 als Chips, optional, nur wenn Plan ein RIR-Ziel hat oder eingeschaltet |
| **Routine nach Training aktualisieren** | „Update Routine“ oder „Keep Original“ beim Speichern [6], Werte-Übernahme abschaltbar [7] | – | Empfehlung fürs nächste Mal automatisch | Auto-Progression (Pro) [13] | Fitbod passt künftige Empfehlungen an [16] | – | **Ja (P2)**: gezielte Auswahl pro Übung, Standard „Plan bleibt“ (Konzept 4.3) |
| **Nachträglich bearbeiten** | Ja | Ja | Ja | Ja | Fitbod: Log → … → Übung antippen [16] | Garmin Connect [18] | **Ja (P1)**: dieselbe Seite im Bearbeitungsmodus |
| **Satz löschen** | Wischen | Wischen | – | – | Fitbod: nach links wischen → Löschen [16] | – | ✕ bleibt (Vorgabe), mit **Rückgängig** statt Rückfrage; kein Wischen als einziger Weg |
| **Übersicht/Fortschritt im Training** | Dauer, Volumen, Sätze oben | Dauer oben | – | – | – | – | **Ja (P1)**: Kopfleiste mit Dauer und „x von y Sätzen“ |

**Erkenntnisse, die die Entscheidungen tragen**

- Die schnellsten Logger brauchen **pro Satz einen einzigen Tipp**, wenn man das Gleiche wie letztes Mal schafft (Strong, Hevy). Ohne Haken erreichen wir das durch **„Letztes Mal antippen = Werte übernehmen“** – das ist eine Werte-Eingabe, kein Bestätigen, und passt zur Vorgabe 2.
- **Sichtbares Ziel + sichtbares letztes Mal** ist überall Standard; Platzhalter allein reichen nicht.
- **Timer an das Satz-Ende koppeln** ist Standard; bei uns ist das Satz-Ende „Wdh./Sek. eingetragen und Feld verlassen“ (siehe 3.2.5).
- **Plan-Update am Ende** als Frage mit sicherem Standard (Hevy).
- Garmin zeigt: Werte müssen **nachträglich korrigierbar** sein, weil Live-Erfassung immer unvollständig ist.

---

## 3. Ziel-Abläufe

### 3.1 Start

```
Tagebuch öffnen
 ├─ Läuft ein Training? ──ja──► Banner „Training läuft · Kraft Studio · Tag A · seit 0:42“ [Fortsetzen] [Beenden]
 │                              (nur eins gleichzeitig; neues Training starten → Rückfrage, siehe 4.2)
 └─ Bereich „Training starten“
     1. Plan wählen (Pflicht, keine Vorauswahl)
        • Pro Plan eine Kachel mit Vorschlag für heute:
          „Kraft Studio – Heute: Tag A – Oberkörper“      → [Starten]
          „Mobility – Heute kein Training geplant · nächstes: Sa, Tag 2“ → [Trotzdem trainieren]
          „Reihum-Plan – Als Nächstes: Tag C (2 von 3 diese Woche)“   → [Starten]
        • Darunter: [Freies Training] [Andere Aktivität] (immer sichtbar, kein Plan nötig)
     2. Optional „Anderen Tag oder anderes Datum wählen“ (aufklappen in der Kachel):
        Trainingstag (Auswahl), Datum (Standard heute)
        Hinweis bei Abweichung: „Geplant für Montag – wird als verschoben eingetragen.“
     3. [Training starten] → Trainingsseite (Live-Modus)
```

**Entscheidungen**
- **„Plan zuerst“ ohne Vorauswahl bleibt erhalten**: Die Kacheln sind gleichrangige Auswahlmöglichkeiten; nichts ist vorausgewählt, der Nutzer tippt bewusst eine Plan-Kachel an. Reihenfolge der Kacheln: Pläne mit Training heute zuerst, dann nach letzter Nutzung. Pläne ohne Training seit 90 Tagen stehen eingeklappt unter „Weitere Pläne (n)“.
- `?plan=<id>` (nach dem Anlegen eines Plans) klappt nur diese Kachel auf und scrollt hin; gestartet wird trotzdem erst per Tipp.
- **Ruhetag ehrlich zeigen** (behebt I-11): Wochentags-Plan ohne Tag heute → „Heute kein Training geplant“, Knopf „Trotzdem trainieren“ öffnet die Tagesauswahl ohne Vorauswahl.
- **Ein Tipp für den Normalfall**: Kachel „Heute: Tag A“ → [Starten] startet sofort mit heutigem Datum.
- Ein Training wird **erst gespeichert, wenn es gestartet ist**, und zählt erst als „Training“, wenn **mindestens ein Satz erledigt** ist oder es als Aktivität erfasst wurde (behebt I-3).

### 3.2 Während des Trainings

#### 3.2.1 Aufbau (mobil, Daumenzone)
- **Kopfleiste (klebt oben):** Zurück, Titel „Tag A – Oberkörper“ (Plan klein darunter), laufende Dauer, Speicherstatus, Menü „⋮“ (Details, Training verwerfen).
- **Fortschritt:** „7 von 16 Sätzen“ als Text + Balken (Balken nur Zusatz).
- **Übungskarten untereinander.** Die **aktuelle Übung** (erste mit offenen Sätzen) ist aufgeklappt, erledigte und spätere Übungen sind eingeklappt mit einer Zeile Zusammenfassung („3/3 · 60 kg × 10, 10, 9“). Antippen klappt auf. Nach dem letzten offenen Satz einer Übung scrollt die nächste Übung sanft nach oben (abschaltbar über `prefers-reduced-motion`: dann ohne Animation).
- **Pausenleiste (klebt unten über der Navigation):** erscheint nur während der Pause.
- **Unten auf der Seite:** [Übung hinzufügen], dann [Training beenden] (primär).
- Datum, Status und Notiz wandern in ein **Details-Blatt** (Menü ⋮ → „Datum und Notiz“) (behebt I-9). Die Trainingsnotiz ist zusätzlich auf dem Abschluss-Bildschirm.

#### 3.2.2 Satzzeile
Spalten (mobil, 390 px): `#/Art | Letztes Mal | kg | Wdh. (oder Sek.) | ✕`

- **#/Art:** „1“, „2“ … Aufwärmsätze „Aufw.“ (Screenreader: „Aufwärmsatz“) statt „A“ (I-16). P2: Antippen öffnet das Satzart-Menü.
- **Letztes Mal:** z. B. „60 × 10“ bzw. „L 22 × 12 / R 22 × 11“ verkürzt „22 × 12/11“. Ist ein Knopf: Antippen **übernimmt kg und Wdh.** in diesen Satz (Satz ist damit erledigt, Timer startet). Leer: „–“ (kein Knopf).
- **Ziel** steht als eigene zweite Zeile unter der Satznummer **oder** – bei gleichen Zielen für alle Sätze – einmal im Kartenkopf: „Ziel: 4 × 8–12 · 60 kg · Reserve 2 · Pause 2:00“. Pro Satz abweichende Ziele (Pyramide) werden pro Zeile gezeigt: „Ziel 12 · 50 kg“. Ziel bleibt sichtbar, auch wenn Werte eingetragen sind (I-4).
- **kg:** vorbelegt mit dem Gewicht vom letzten Mal, sonst mit dem Plan-Gewicht (wie heute). Vorbelegte, noch nicht angefasste Werte sind **gedämpft** dargestellt und für Screenreader als „vorgeschlagen“ ausgewiesen; nach Eingabe oder Übernahme normal.
- **Wdh./Sek.:** nie vorbelegt (sonst wäre der Satz erledigt). Platzhalter = Ziel („8–12“).
- **Erledigt-Zustand** (I-5): Häkchen-Symbol in der #-Spalte statt der Nummer **plus** Hervorhebung; Screenreader: Zeilenname „Satz 2, erledigt“.
- **Pro Seite:** zwei Zeilen L und R je Satz. Erledigt, sobald mindestens eine Seite Wdh./Sek. hat (Vorgabe 2). Fehlt eine Seite, zeigt die #-Zelle ein Halbsymbol und Text „nur links“ / „nur rechts“ (I-6). Gewicht L wird beim Verlassen des Feldes nach R übernommen, wenn R noch unberührt ist.
- **✕:** entfernt den Satz sofort, Hinweisleiste „Satz 3 entfernt · Rückgängig“ (5 s, `role="status"`). Bei erledigten Sätzen ebenfalls ✕, ebenfalls mit Rückgängig (keine Rückfrage). Die Plan-Vorgabe des entfernten Satzes bleibt im Soll erhalten (I-1, siehe Datenmodell).
- **[+ Satz]** unter der Tabelle: neuer Satz übernimmt kg (und Art) des letzten Satzes, **Fokus springt ins kg-Feld** des neuen Satzes.

#### 3.2.3 Eingabe: Tastatur zuerst, Stepper als Zusatz
**Entscheidung:** Zahlentastatur ist der Hauptweg (am schnellsten für beliebige Werte), Stepper sind P2 für Einhand-Bedienung ohne Tastatur.

- Felder als `type="text"` mit `inputmode="decimal"` (kg) bzw. `inputmode="numeric"` (Wdh., Sek.), `enterkeyhint="next"`, `autocomplete="off"`. Komma und Punkt erlaubt, Anzeige im Sprachformat („62,5“ / „62.5“) (I-8).
- Fokus markiert den ganzen Inhalt (Überschreiben statt Löschen).
- **Enter/Weiter** springt: kg → Wdh. → (pro Seite: L kg → L Wdh. → R kg → R Wdh.) → kg des nächsten offenen Satzes → nächste Übung. Am Ende: Tastatur schließen.
- Ungültige Werte (Buchstaben, negativ, > 999 kg, > 999 Wdh., > 3600 s): Feld behält den letzten gültigen Wert, Fehlertext unter der Zeile „Bitte eine Zahl eingeben“ (`aria-describedby`, `aria-invalid`). Nie still leeren.
- Mausrad ändert keine Werte (Folge von `type="text"`).
- **P2 Stepper:** Langes Drücken (500 ms) oder Antippen der Satznummer im aufgeklappten Zustand öffnet unten ein **Satz-Blatt** mit großen −/+ Knöpfen (kg ±2,5; Wdh. ±1; Sek. ±5), Schrittweite für kg pro Übung umstellbar (1 / 1,25 / 2,5 / 5). Alle Knöpfe ≥ 48 px, im unteren Bildschirmdrittel.

#### 3.2.4 Werte vom letzten Mal
- Quelle: das letzte erledigte Training mit derselben Übung (`exerciseId`, bei eigenen Übungen gleicher Name) – **planübergreifend**; P3 Einstellung „nur gleicher Plan“ (wie Hevy [1]).
- Zuordnung Satz für Satz nach Position unter den Arbeitssätzen; Aufwärmsätze zu Aufwärmsätzen. Hat das letzte Mal weniger Sätze, bekommen überzählige Sätze „–“.
- Unter dem Übungsnamen: „Letztes Mal: Di, 10.11. · 3 Sätze“ als Link, öffnet ein Blatt mit dem ganzen letzten Satzverlauf dieser Übung (P2).

#### 3.2.5 Pausentimer
- **Start:** wenn ein Satz von „offen“ auf „erledigt“ wechselt **und** das Wdh./Sek.-Feld verlassen wird (Weiter, Fokuswechsel, Tastatur zu) bzw. „Letztes Mal“ übernommen wird. Nicht bei jedem Tastendruck. Nicht im Bearbeitungsmodus (Historie, nachgetragenes Datum).
- **Dauer:** Pause der Übung aus dem Plan (`restSeconds`), sonst Standard 90 s (Einstellung P3). Kein Timer nach dem letzten Satz des Trainings. P3: vor Dropsätzen kein Timer (wie Hevy [2]).
- **Leiste unten:** „Pause 1:23“ groß, darunter „Nächster Satz: Bankdrücken · Satz 3 · Ziel 8–12“. Knöpfe: [−15 s] [+15 s] [Überspringen]. Antippen der Zeit springt zur nächsten offenen Zeile.
- **Ende:** Leiste wechselt auf „Pause vorbei“, kurzes Vibrieren (wo verfügbar [24]), optionaler Ton (Einstellung, Standard aus), Leiste bleibt 10 s, dann zu. Screenreader: eine Ansage „Pause vorbei“ (`aria-live="assertive"`), keine Sekundenansagen; Countdown selbst hat `aria-live="off"`, sichtbarer Text wird beim Fokussieren gelesen.
- **Technik:** Timer speichert `endsAt` (Zeitstempel), nicht die Restzeit – übersteht Neuladen, Tab-Wechsel, Bildschirmsperre. **Screen Wake Lock** [23] während eines laufenden Trainings anfordern, bei `visibilitychange` erneut; Einstellung „Bildschirm anlassen“ (Standard an).
- **Gemessene Pause** wird gespeichert (Abstand zwischen zwei Satz-Erledigt-Zeitpunkten), unabhängig davon, ob der Timer benutzt wurde.

#### 3.2.6 Notizen, Gefühl, RIR
- **Trainingsnotiz:** im Details-Blatt und auf dem Abschluss-Bildschirm.
- **Übungsnotiz (P2):** Menü ⋮ der Übung → „Notiz“. Notiz aus dem Plan wird oben in der Karte gedämpft als „Hinweis aus dem Plan“ gezeigt (nur lesen).
- **Satznotiz (P2):** im Satz-Blatt.
- **RIR (P2):** Spalte erscheint nur, wenn der Plan für die Übung ein RIR-Ziel hat oder die Einstellung „Reserve erfassen“ an ist. Eingabe als Chips „0 1 2 3 4 5+“ im Satz-Blatt oder als schmale Spalte (Desktop). Optional, ändert „erledigt“ nicht. Gespeichert wird RIR; RPE wird für die Anzeige berechnet (RPE = 10 − RIR), kein zweites Feld.
- **Gefühl (P2):** Abschluss-Bildschirm, 5 Stufen mit Text („sehr schwer … sehr leicht“), nicht nur Emojis.

#### 3.2.7 Aufwärmsätze
- Aus dem Plan übernommen, eigene Zeilenart „Aufw.“, zählen nicht zu Sätzen, Volumen, Plantreue und Bestleistungen (wie heute).
- P2: Satzart im Training ändern (Satznummer antippen).
- P3: Aufwärm-Rechner („3 Aufwärmsätze bis 60 kg vorschlagen“).

#### 3.2.8 Übungen im Training ändern
Menü ⋮ pro Übung (statt drei Knöpfen nebeneinander, entlastet die Kopfzeile):

| Aktion | Geplante Übung | Zusätzliche Übung |
|---|---|---|
| Überspringen / Doch machen | ja | – |
| **Ersetzen** (Übungsauswahl, Sätze/Ziele bleiben, Status „ersetzt“) | ja (P1) | – |
| Pro Seite (L/R) ein/aus | ja | ja |
| Notiz | P2 | P2 |
| Nach oben / nach unten | P2 | P2 |
| Entfernen | **nein** (nur überspringen; I-13) | ja, mit Rückgängig |

- L/R ausschalten bei vorhandenen Werten rechts: Blatt „Rechte Seite verwerfen?“ mit Auswahl „Linke Werte behalten“ / „Höheren Wert behalten“ / „Abbrechen“ (I-7). Ohne Werte rechts: sofort.
- **Supersätze (P3):** zwei bis drei Übungen in einer gemeinsamen Karte mit Klammer; Weiter springt A1 → B1 → A2 → B2; Pausentimer erst nach dem letzten Glied der Runde.

#### 3.2.9 Pro Wiederholung (P3, Entscheidung O14)
- Im Satz-Blatt Abschnitt „Einzelne Wiederholungen“, standardmäßig zu. Aufgeklappt: Chips „1 … n“ (n = eingetragene Wdh.). Antippen eines Chips öffnet drei Schalter: **mit Hilfe**, **Teilwiederholung**, **Gewicht geändert auf … kg** (gilt ab dieser Wiederholung).
- Schnellaktion „letzte 2 mit Hilfe“: Mehrfachauswahl durch Antippen mehrerer Chips, dann Merkmal setzen.
- Satzzeile zeigt danach ein kleines Zeichen „+“ mit Text für Screenreader „2 Wiederholungen mit Hilfe“.
- Auswertung: „saubere Wiederholungen“ = Wdh. − mit Hilfe − Teilwdh.; Plantreue nutzt saubere Wdh. (O15 bleibt sonst unverändert).

### 3.3 Abschluss
1. [Training beenden] → Prüfung: Gibt es offene Sätze? Blatt „Noch 3 Sätze offen“ mit [Offene Sätze entfernen und beenden] / [Offene Sätze behalten und beenden] / [Weiter trainieren]. „Behalten“ speichert sie als nicht gemacht (zählen gegen Plantreue, wie entfernte). Keine erledigten Sätze → „Training verwerfen?“ [Verwerfen] [Weiter trainieren].
2. **Abschluss-Bildschirm** (`/diary/:id/summary`):
   - Kopf: „Training gespeichert“, Datum, Dauer (Start–Ende, korrigierbar).
   - Kennzahlen: Sätze „14 von 16“, Volumen, Plantreue in % + Status „Nach Plan“ / „Mit Abweichungen“ (Schwelle 80 %, O15).
   - **Bestleistungen (P2):** je Übung höchstes Gewicht, meiste Wdh. bei einem Gewicht, bestes geschätztes Maximum (Epley), mit Symbol und Text „Neue Bestleistung“.
   - **Abweichungen** als Liste: „Rudern: übersprungen“, „Bankdrücken: 1 Satz weniger“, „Kniebeuge: +5 kg mehr als geplant“.
   - Gefühl (5 Stufen) und Notiz.
   - **Plan aktualisieren? (P2)** nur wenn es Unterschiede gibt: Checkliste pro Übung „Bankdrücken: Zielgewicht 60 → 62,5 kg“, „Facepulls neu in Tag A aufnehmen“, „Rudern ersetzt durch Kabelrudern übernehmen“. Standard: nichts angehakt. [Übernehmen] / [Plan unverändert lassen]. Übernahme erzeugt eine neue Planversion (`version` +1), das Training behält seine Soll-Kopie.
   - [Fertig] → Tagebuch; [Training ansehen] → Eintrag.
3. Doppelte Progression (Konzept 3.6, P3): Wenn in allen Arbeitssätzen das obere Ende erreicht wurde, schlägt die Checkliste das nächste Gewicht schon vor (nicht angehakt).

### 3.4 Ausgefallen, verschoben, nachgeholt, andere Aktivität

| Fall | Ablauf | Gespeichert als |
|---|---|---|
| **Ausfall vorab oder nachträglich** | Plan-Kachel ⋮ → „Ausfall eintragen“ oder Tagebuch „Offene Tage“ → [Ausgefallen]. Blatt: Tag, Datum, Grund als Chips (Krank, Verletzt, Keine Zeit, Urlaub, Sonstiges) + Freitext optional | `status: 'skipped'`, `skipReason`, `note` |
| **Verschoben** (anderer Tag als geplant) | Beim Start Hinweis „Geplant für Montag – wird als verschoben eingetragen“ und Auswahl „Ersetzt das Training vom Mo, 9.11.“ (Standard: der jüngste offene Soll-Termin dieses Tags in den letzten 7 Tagen) | `scheduledFor: '2026-11-09'` |
| **Nachholen** | Offene Tage → [Nachholen] startet den Tag mit heutigem Datum und `scheduledFor` = verpasstes Datum | wie verschoben |
| **Nachtragen** (Training fand statt, aber nicht geloggt) | Kachel → „Anderen Tag oder anderes Datum“ → Datum in der Vergangenheit → [Nachtragen]. Öffnet Bearbeitungsmodus (kein Timer), Start-/Endzeit optional | `status: 'done'`, `startedAt` optional, `entryMode: 'backfill'` |
| **Freies Training** | [Freies Training] → leere Trainingsseite mit [Übung hinzufügen] im Fokus | `kind: 'free'` |
| **Andere Aktivität (P2, O17)** | [Andere Aktivität] → Blatt: Art (Laufen, Radfahren, Schwimmen, Gehen, Mannschaftssport, Kurs, Sonstiges+Freitext), Datum, Dauer (Pflicht, Minuten), Distanz km (optional, nur bei Laufen/Rad/Schwimmen/Gehen), Gefühl, Notiz → [Speichern] | `kind: 'activity'`, `activity{…}` |

**Offene Tage** (P2, behebt I-12): Abschnitt im Tagebuch über den Einträgen, nur wenn vorhanden: „Offen: Mo, 9.11. – Kraft Studio · Tag A“ mit [Nachholen] [Ausgefallen] [Ignorieren]. Quelle: Wochentags-Pläne mit Startdatum, geplanter Tag in den letzten 14 Tagen, kein Eintrag mit `date` oder `scheduledFor` an diesem Tag. Reihum-Pläne: nur Wochenebene „Diese Woche 1 von 3“. „Ignorieren“ speichert nichts im Training, nur eine Liste ignorierter Termine (der Kalender zeigt sie weiter als „verpasst“).

### 3.5 Verlauf bearbeiten
- Ein Eintrag mit `status: 'done'` öffnet im **Bearbeitungsmodus**: gleiche Satztabelle, kein Pausentimer, keine Kopfleiste mit laufender Dauer; oben „Training vom Fr, 13.11. · 18:05–19:10“ mit [Datum und Zeit ändern].
- Alles änderbar: Datum, Zeiten, Status, Tag (Plan-Bezug), Übungen, Sätze, Notizen. Plan-Bezug ändern = Blatt „Anderer Trainingstag“; die Soll-Kopie wird **nicht** neu gezogen (sonst ändert sich die Historie), nur `dayId/dayName`. Option „Soll aus aktuellem Plan neu übernehmen“ ist bewusst nicht vorgesehen.
- Status „Ausgefallen ↔ Trainiert“ nur über das Menü ⋮ mit Erklärung; wechselt ein Eintrag mit erledigten Sätzen auf „Ausgefallen“, kommt die Rückfrage „Die 12 eingetragenen Sätze werden ausgeblendet, nicht gelöscht.“
- Unten: „Zuletzt geändert am 14.11., 08:12“ (aus `updatedAt`).
- Löschen: Menü ⋮ → „Eintrag löschen“ → sofort weg, Hinweisleiste „Eintrag gelöscht · Rückgängig“ (8 s). Intern weiches Löschen (`deletedAt`), endgültig nach 30 Tagen bzw. beim nächsten Start nach Ablauf (I-14).

### 3.6 Kalenderansicht (P2, Konzept Abschnitt 5)
- Tagebuch hat oben einen Umschalter **„Liste | Kalender“** (Segment, URL `?view=calendar`).
- Monatsraster Mo–So, Monat wechseln mit ‹ › und Wischen (Wischen nur zusätzlich). Heute umrandet.
- Pro Tag **Symbol + Kürzel**, nie nur Farbe:

| Status | Symbol (react-icons) | Text im Tag (Screenreader-Langtext) |
|---|---|---|
| Nach Plan | `MdCheckCircle` | „✓“ – „Nach Plan, 92 %“ |
| Mit Abweichungen | `MdChangeCircle` | „≈“ – „Mit Abweichungen, 64 %“ |
| Anderes Training | `MdFitnessCenter` / `MdDirectionsRun` | „Frei“ / „Akt.“ – „Freies Training“ / „Laufen 40 min“ |
| Verpasst | `MdEventBusy` | „✕“ – „Verpasst: Tag A“ bzw. „Ausgefallen: krank“ |
| Verschoben | `MdRedo` | „→“ – „Verschoben von Mo“ |
| Geplant | `MdEvent` (umrisslinie) | „Tag A“ – „Geplant: Tag A“ |
| Ruhetag | – | leer – „Ruhetag“ |

- Mehrere Trainings an einem Tag: bis zu 2 Symbole, sonst „+2“.
- Antippen eines Tags: **Tagesdetails** darunter (mobil) bzw. rechts (Desktop): je Eintrag Titel, Status, Plantreue, Soll-Ist-Vergleich pro Übung (Vorgabe | Ist | Abweichung), Aktionen [Öffnen] [Bearbeiten]; leerer Tag: [Training nachtragen] [Ausfall eintragen] [Aktivität eintragen].
- Plan-Filter des Tagebuchs gilt auch im Kalender; „Geplant/Verpasst“ nur für Pläne im Filter.
- Raster ist eine Tabelle mit `role="grid"`, Pfeiltasten-Navigation, jeder Tag ein Knopf mit vollem Langtext als Name.

### 3.7 Offline, Autosave, Konflikte
- **Autosave** bleibt: jede Änderung sofort. Kopfleiste zeigt Status: „Gespeichert“ (ruhig, `MdCloudDone`), „Speichert …“ nur wenn > 500 ms, **„Nicht gespeichert“** (Warnung, `MdErrorOutline`) mit [Erneut versuchen] und Hilfe „Speicher voll? Alte Einträge exportieren.“ (I-2). Fehler zusätzlich einmal per `role="alert"`.
- **Laufendes Training überlebt alles:** Neuladen, Tab schließen, Akku leer – beim nächsten Öffnen der App erscheint das Fortsetzen-Banner (3.1). Läuft ein Training seit > 6 h ohne Änderung, fragt das Banner: „Training von gestern 18:05 beenden?“ [Beenden (Ende = letzter Satz 19:10)] [Fortsetzen].
- **Mehrere Tabs/Geräte (lokal):** auf das `storage`-Ereignis [25] hören; geänderte Einträge neu laden. Wird gerade derselbe Eintrag bearbeitet: Hinweis „In einem anderen Fenster geändert. [Neu laden]“; Schreiben nur auf Ebene des einzelnen Eintrags mit Vergleich von `updatedAt` (I-18).
- **Speicher dauerhaft machen:** einmalig `navigator.storage.persist()` [26] beim ersten gespeicherten Training anfragen.
- **Mit Konto (Phase E, Supabase):** lokale Daten sind die Quelle; Warteschlange für Änderungen, Synchronisation bei Verbindung. Konfliktregel: pro **Satz** gewinnt der neuere `updatedAt`; gelöschte Einträge als Grabstein (`deletedAt`). Laufende Trainings werden erst synchronisiert, wenn sie beendet sind oder 60 s nichts geändert wurde. Offline-Zustand nur als kleines Symbol `MdCloudOff` + „Offline – wird später übertragen“, nie blockierend.

### 3.8 Mehrere Pläne
- Start: eine Kachel pro Plan (3.1). Kein „aktiver Plan“ nötig zum Starten (O16: andere Pläne bleiben startbar); der aktive Plan steht zuerst und trägt das Kennzeichen „Aktiv“.
- Filter: Chips „Alle Pläne“ + je Plan + „Frei“ + „Aktivitäten“, Mehrfachauswahl (wie heute), **in der URL** (`?plans=a,b`) und für die Sitzung gemerkt (I-17).
- Wochenzahlen: bei Filter „Alle“ Summe plus auf Antippen Aufschlüsselung pro Plan („Kraft Studio 2 · Mobility 3“).
- Plantreue über mehrere Pläne: Mittelwert der Trainings mit Plan; freie Trainings und Aktivitäten zählen nicht hinein.
- Einträge zeigen den Plannamen immer als erste Zeile; gelöschte Pläne „(gelöscht)“.

---

## 4. Bildschirme im Einzelnen

Allgemein für alle Bildschirme:
- **Ziele ≥ 44 × 44 px** (WCAG 2.5.8 verlangt 24 px [21]; wir nehmen 44 px, im Live-Training für Hauptaktionen 48 px). Abstand zwischen ✕ und Eingabefeldern ≥ 8 px.
- **Einhand:** Häufige Aktionen (Satzwerte, Weiter, Pausenleiste, Training beenden) in der unteren Hälfte; selten genutzte (Details, Verwerfen, Löschen) im Menü oben.
- **Fokus** immer sichtbar; nach Entfernen eines Satzes Fokus auf den nächsten Satz bzw. [+ Satz]; nach Rückgängig zurück auf den wiederhergestellten Satz.
- **Statusmeldungen** (gespeichert, entfernt, Pause vorbei) über einen einzigen Live-Bereich (`role="status"`) [22].
- **Ohne Farbe verständlich:** jeder Status hat Symbol + Text.
- **Zahlen** mit `font-variant-numeric: tabular-nums`, Sprachformat über `toLocaleString`.
- **Bewegung** respektiert `prefers-reduced-motion`.
- Symbole aus `react-icons` (bereits im Projekt); Design-Agent kann sie austauschen.

### 4.1 S1 – Tagebuch (Übersicht) `/diary`

**Mobil, von oben nach unten**
1. Seitentitel „Trainingstagebuch“.
2. **Fortsetzen-Banner** (nur bei laufendem Training).
3. **Offene Tage** (P2, nur wenn vorhanden, max. 3, „Alle anzeigen (n)“).
4. **Training starten**: Plan-Kacheln, darunter Zeile [Freies Training] [Andere Aktivität].
5. **Umschalter** „Liste | Kalender“ (P2) und **Plan-Filter** (Chips, quer scrollbar).
6. **Diese Woche**: Trainings, Ausgefallen, Sätze, Volumen, Plantreue (wie heute; „Trainings“ zählt nur Trainings mit ≥ 1 erledigtem Satz + Aktivitäten).
7. **Einträge**, gruppiert nach Woche: Kopf „KW 46 · 9.–15. Nov. · 3 Trainings“. Erst die letzten 4 Wochen, dann [Ältere laden].
   Eintragszeile: Status-Symbol, Datum, Titel (Link), Zeile mit Status-Text · Sätze · Volumen · Plantreue · Dauer. Menü ⋮: Öffnen, Bearbeiten, Löschen (statt Papierkorb direkt in der Zeile).

**Desktop (≥ 1024 px):** zwei Spalten: links Start + Offene Tage + Woche (feste Breite ~ 360 px), rechts Liste oder Kalender mit Tagesdetails.

**Zustände**
| Zustand | Anzeige |
|---|---|
| Kein Plan | Start-Karte: „Du hast noch keinen Trainingsplan.“ [Plan erstellen] + [Freies Training] [Andere Aktivität] |
| Keine Einträge | „Noch keine Einträge. Starte oben dein erstes Training.“ |
| Filter ohne Treffer | „Keine Einträge für die gewählten Pläne.“ [Filter zurücksetzen] |
| Laufendes Training | Banner oben; Plan-Kacheln zeigen bei [Starten] die Rückfrage (4.2) |
| Speicherfehler | Warnhinweis oben (`role="alert"`) |

### 4.2 S2 – Plan-Kachel und Start

Kachel-Aufbau: Planname (Überschrift h3), Kennzeichen „Aktiv“ falls aktiv, Vorschlagszeile, Primärknopf, Link „Anderen Tag oder anderes Datum“ (Aufklapper mit `aria-expanded`), Menü ⋮ (Ausfall eintragen, Plan öffnen).

Aufgeklappt: Auswahl Trainingstag (ohne Vorauswahl, wenn heute kein Tag geplant), Datum, Hinweis verschoben, „Ersetzt das Training vom …“ (Auswahl, P2), Knopf: „Training starten“ (Datum heute) bzw. „Training nachtragen“ (Datum in der Vergangenheit) bzw. „Für später nicht möglich“ deaktiviert mit Erklärung bei Datum in der Zukunft → stattdessen nur „Ausfall eintragen“ erlaubt.

**Rückfrage, wenn schon ein Training läuft:** Dialog „Es läuft bereits ein Training (Kraft Studio · Tag A, seit 0:42).“ [Laufendes fortsetzen] (primär) [Laufendes beenden und neues starten] [Abbrechen].

### 4.3 S3 – Ausfall eintragen (Blatt/Dialog)
Felder: Plan (fest), Trainingstag, Datum, Grund (Chips, Einzelauswahl, optional), Notiz (optional, max. 200). Knöpfe: [Als ausgefallen eintragen] [Abbrechen]. Danach Hinweisleiste „Ausfall eingetragen · Rückgängig“.

### 4.4 S4 – Training (Live) `/diary/:id`

```
┌──────────────────────────────────────┐
│ ‹  Tag A – Oberkörper        0:42  ⋮ │  klebt oben
│    Kraft Studio · ✓ Gespeichert      │
│ 7 von 16 Sätzen ▓▓▓▓▓░░░░░            │
├──────────────────────────────────────┤
│ Bankdrücken                        ⋮ │  aktuelle Übung, offen
│ Brust · Ziel 3 × 8–12 · 60 kg · R 2  │
│ Letztes Mal: Di 10.11.               │
│  #     Letztes   kg     Wdh.         │
│ Aufw.  40×10    [40 ]  [10 ]     ✕   │
│  ✓1    60×10    [60 ]  [10 ]     ✕   │
│  2     60×10    [60 ]  [8–12]    ✕   │ ← Fokus
│  3     60×9     [60 ]  [8–12]    ✕   │
│ [+ Satz]                             │
├──────────────────────────────────────┤
│ Kurzhantelrudern einarmig  1/3     ⋮ │  eingeklappt
├──────────────────────────────────────┤
│ [+ Übung hinzufügen]                 │
│ [ Training beenden ]                 │
├──────────────────────────────────────┤
│ Pause 1:23   [−15] [+15] [Überspr.]  │  klebt unten (nur in Pause)
│ Nächster: Bankdrücken · Satz 2       │
└──────────────────────────────────────┘
```

**Desktop:** Übungsliste links (Spalte mit allen Übungen und Fortschritt als Navigation, `nav` mit Liste), aktuelle Übung rechts groß; Pausenleiste rechts oben in der Übungsspalte. Alle Spalten sichtbar inkl. RIR, falls aktiv. Tastatur: Enter = weiter, Strg+Z = letzte Entfernung rückgängig (nur solange Hinweisleiste sichtbar).

**Zustände der Übungskarte**
| Zustand | Darstellung |
|---|---|
| Offen (aktuell) | aufgeklappt, Kopf mit Ziel und Letztes Mal |
| Teilweise | eingeklappt „2/4 · 60 × 10, 10“ |
| Fertig | eingeklappt, Symbol `MdCheckCircle` + „Fertig · 4/4“ |
| Übersprungen | eingeklappt, gedämpft, `MdSkipNext` + „Übersprungen“, Knopf [Doch machen] |
| Ersetzt | Name der neuen Übung, darunter „ersetzt Rudern“ |
| Zusätzlich | Kennzeichen „Zusätzlich“ |
| Ohne Sätze | „Keine Sätze.“ [+ Satz] |

**Zustände der Satzzeile:** vorgeschlagen (gedämpfte Werte) · in Eingabe · erledigt (✓ + Hervorhebung) · pro Seite unvollständig („nur links“) · ungültige Eingabe (Fehlertext) · gerade entfernt (Hinweisleiste mit Rückgängig).

**Seitenzustände:** Eintrag nicht gefunden (wie heute + Link) · laufendes Training · Bearbeitungsmodus (3.5) · Ausgefallen (nur Kopf, Grund, Notiz, Menü „Doch trainiert“) · Aktivität (Formular 3.4).

### 4.5 S5 – Satz-Blatt (P2)
Unten aufgehendes Blatt (`role="dialog"`, `aria-modal`, Fokus gefangen, Schließen mit Esc/Wischen/Knopf). Inhalt: Überschrift „Bankdrücken · Satz 2“; Satzart (Aufwärmen, Arbeitssatz, Dropsatz, Bis Versagen) als Segment; kg und Wdh. mit −/+; Reserve 0–5+ Chips; Notiz; Abschnitt „Einzelne Wiederholungen“ (P3); [Fertig].

### 4.6 S6 – Abschluss `/diary/:id/summary`
Siehe 3.3. Aufbau mobil: Kopf, Kennzahlen (3 Kacheln), Bestleistungen, Abweichungen, Gefühl, Notiz, Plan aktualisieren, [Fertig]. Desktop: Kennzahlen und Bestleistungen links, Abweichungen und Plan-Update rechts.

### 4.7 S7 – Kalender (P2) siehe 3.6.

### 4.8 S8 – Andere Aktivität (P2) siehe 3.4; Formular mit normalen Beschriftungen, Pflichtfeld Dauer mit Fehlertext „Bitte die Dauer in Minuten eingeben.“

### 4.9 Texte (Deutsch / Englisch)

Neue und geänderte Schlüssel. Bestehende Schlüssel bleiben, sofern nicht unten ersetzt.

| Schlüssel | Deutsch | Englisch |
|---|---|---|
| `diary.resume.title` | Training läuft | Training in progress |
| `diary.resume.text` | {plan} · {day} · seit {duration} | {plan} · {day} · for {duration} |
| `diary.resume.continue` | Fortsetzen | Continue |
| `diary.resume.finish` | Beenden | Finish |
| `diary.resume.stale` | Training von {date}, {time} beenden? | Finish the training from {date}, {time}? |
| `diary.start.today` | Heute: {day} | Today: {day} |
| `diary.start.next` | Als Nächstes: {day} | Next: {day} |
| `diary.start.restDay` | Heute kein Training geplant · nächstes: {weekday}, {day} | No training planned today · next: {weekday}, {day} |
| `diary.start.anyway` | Trotzdem trainieren | Train anyway |
| `diary.start.weekCount` | {done} von {planned} diese Woche | {done} of {planned} this week |
| `diary.start.other` | Anderen Tag oder anderes Datum | Other day or date |
| `diary.start.backfill` | Training nachtragen | Log past training |
| `diary.start.futureHint` | Für ein Datum in der Zukunft kannst du nur einen Ausfall eintragen. | For a future date you can only record a missed training. |
| `diary.start.active` | Aktiv | Active |
| `diary.start.morePlans` | Weitere Pläne ({count}) | More plans ({count}) |
| `diary.start.activity` | Andere Aktivität | Other activity |
| `diary.start.replaces` | Ersetzt das Training vom {date} | Replaces the training of {date} |
| `diary.running.title` | Es läuft bereits ein Training ({plan} · {day}, seit {duration}). | A training is already running ({plan} · {day}, for {duration}). |
| `diary.running.continue` | Laufendes fortsetzen | Continue current |
| `diary.running.replace` | Laufendes beenden und neues starten | Finish current and start new |
| `diary.skip.title` | Ausfall eintragen | Record missed training |
| `diary.skip.reason` | Grund (optional) | Reason (optional) |
| `diary.skip.reasons.sick` | Krank | Ill |
| `diary.skip.reasons.injured` | Verletzt | Injured |
| `diary.skip.reasons.noTime` | Keine Zeit | No time |
| `diary.skip.reasons.vacation` | Urlaub | Holiday |
| `diary.skip.reasons.other` | Sonstiges | Other |
| `diary.skip.done` | Ausfall eingetragen | Missed training recorded |
| `diary.open.title` | Offene Tage | Open days |
| `diary.open.item` | {date} – {plan} · {day} | {date} – {plan} · {day} |
| `diary.open.makeUp` | Nachholen | Make up |
| `diary.open.missed` | Ausgefallen | Missed |
| `diary.open.ignore` | Ignorieren | Ignore |
| `diary.view.list` | Liste | List |
| `diary.view.calendar` | Kalender | Calendar |
| `diary.week.heading` | KW {week} · {range} · {count} Trainings | Week {week} · {range} · {count} trainings |
| `diary.loadOlder` | Ältere laden | Load older |
| `diary.filter.none` | Keine Einträge für die gewählten Pläne. | No entries for the selected plans. |
| `diary.filter.reset` | Filter zurücksetzen | Reset filter |
| `diary.filter.activities` | Aktivitäten | Activities |
| `diary.deleted` | Eintrag gelöscht | Entry deleted |
| `common.undo` | Rückgängig | Undo |
| `workout.progress` | {done} von {total} Sätzen | {done} of {total} sets |
| `workout.save.saved` | Gespeichert | Saved |
| `workout.save.saving` | Speichert … | Saving … |
| `workout.save.failed` | Nicht gespeichert | Not saved |
| `workout.save.retry` | Erneut versuchen | Try again |
| `workout.save.quotaHint` | Speicher voll? Alte Einträge exportieren. | Storage full? Export old entries. |
| `workout.otherWindow` | In einem anderen Fenster geändert. | Changed in another window. |
| `workout.reload` | Neu laden | Reload |
| `workout.menu` | Weitere Aktionen für {name} | More actions for {name} |
| `workout.details` | Datum und Notiz | Date and note |
| `workout.discard` | Training verwerfen | Discard training |
| `workout.target` | Ziel: {target} | Target: {target} |
| `workout.previous` | Letztes Mal | Last time |
| `workout.previousOn` | Letztes Mal: {date} | Last time: {date} |
| `workout.usePrevious` | {values} vom letzten Mal für Satz {number} übernehmen | Use {values} from last time for set {number} |
| `workout.suggested` | vorgeschlagen | suggested |
| `workout.setDone` | Satz {number}, erledigt | Set {number}, done |
| `workout.onlyLeft` | nur links | left only |
| `workout.onlyRight` | nur rechts | right only |
| `workout.warmupShort` | Aufw. | WU |
| `workout.warmup` | Aufwärmsatz | Warm-up set |
| `workout.setRemoved` | Satz {number} entfernt | Set {number} removed |
| `workout.invalidNumber` | Bitte eine Zahl eingeben. | Please enter a number. |
| `workout.replace` | Ersetzen | Replace |
| `workout.replaces` | ersetzt {name} | replaces {name} |
| `workout.extra` | Zusätzlich | Extra |
| `workout.done` | Fertig · {done}/{total} | Done · {done}/{total} |
| `workout.dropRight.title` | Rechte Seite verwerfen? | Discard right side? |
| `workout.dropRight.keepLeft` | Linke Werte behalten | Keep left values |
| `workout.dropRight.keepHigher` | Höheren Wert behalten | Keep higher value |
| `workout.rest.label` | Pause | Rest |
| `workout.rest.next` | Nächster Satz: {name} · Satz {number} · Ziel {target} | Next set: {name} · set {number} · target {target} |
| `workout.rest.minus` | 15 Sekunden weniger | 15 seconds less |
| `workout.rest.plus` | 15 Sekunden mehr | 15 seconds more |
| `workout.rest.skip` | Überspringen | Skip |
| `workout.rest.over` | Pause vorbei | Rest over |
| `workout.finish` | Training beenden | Finish training |
| `workout.open.title` | Noch {count} Sätze offen | {count} sets still open |
| `workout.open.remove` | Offene Sätze entfernen und beenden | Remove open sets and finish |
| `workout.open.keep` | Offene Sätze behalten und beenden | Keep open sets and finish |
| `workout.open.continue` | Weiter trainieren | Keep training |
| `workout.discard.title` | Training verwerfen? Es wurde noch kein Satz eingetragen. | Discard training? No set has been logged yet. |
| `workout.rir` | Reserve (Wdh.) | Reps in reserve |
| `workout.feeling` | Wie war das Training? | How was the training? |
| `workout.feeling.1` … `.5` | Sehr schwer · Schwer · Okay · Gut · Sehr gut | Very hard · Hard · Okay · Good · Very good |
| `workout.editedAt` | Zuletzt geändert am {date}, {time} | Last changed on {date}, {time} |
| `summary.title` | Training gespeichert | Training saved |
| `summary.duration` | Dauer | Duration |
| `summary.onPlan` | Nach Plan | On plan |
| `summary.deviated` | Mit Abweichungen | With deviations |
| `summary.records` | Neue Bestleistungen | New personal records |
| `summary.record.weight` | Schwerstes Gewicht: {value} kg | Heaviest weight: {value} kg |
| `summary.record.reps` | Meiste Wdh. mit {weight} kg: {reps} | Most reps at {weight} kg: {reps} |
| `summary.record.e1rm` | Geschätztes Maximum: {value} kg | Estimated max: {value} kg |
| `summary.deviations` | Abweichungen vom Plan | Deviations from the plan |
| `summary.updatePlan` | Plan mit diesen Werten aktualisieren? | Update the plan with these values? |
| `summary.updatePlan.weight` | {name}: Zielgewicht {from} → {to} kg | {name}: target weight {from} → {to} kg |
| `summary.updatePlan.add` | {name} in {day} aufnehmen | Add {name} to {day} |
| `summary.updatePlan.replace` | {old} durch {new} ersetzen | Replace {old} with {new} |
| `summary.updatePlan.apply` | Übernehmen | Apply |
| `summary.updatePlan.keep` | Plan unverändert lassen | Keep plan unchanged |
| `activity.title` | Andere Aktivität | Other activity |
| `activity.type` | Art | Type |
| `activity.types.run` … | Laufen · Radfahren · Schwimmen · Gehen · Mannschaftssport · Kurs · Sonstiges | Running · Cycling · Swimming · Walking · Team sport · Class · Other |
| `activity.duration` | Dauer (Minuten) | Duration (minutes) |
| `activity.distance` | Distanz (km, optional) | Distance (km, optional) |
| `activity.durationError` | Bitte die Dauer in Minuten eingeben. | Please enter the duration in minutes. |
| `calendar.status.onPlan` … | Nach Plan · Mit Abweichungen · Anderes Training · Verpasst · Verschoben · Geplant · Ruhetag | On plan · With deviations · Other training · Missed · Moved · Planned · Rest day |
| `calendar.backfill` | Training nachtragen | Log past training |

### 4.10 Barrierefreiheit (WCAG 2.2 AA) – Prüfliste für die Abnahme
- 1.3.1: Satztabelle bleibt `<table>` mit `<th scope="row">` „Satz 2“ und Spaltenköpfen; pro Seite: Zeilenkopf „Satz 2 links“. Ziel und Letztes Mal als echter Text in der Zeile, nicht nur `aria-description`.
- 1.4.1: Erledigt, Status, Kalender: Symbol + Text.
- 1.4.3/1.4.11: Kontraste liefert das Design; gedämpfte Vorschlagswerte müssen trotzdem 4,5 : 1 erreichen (Unterscheidung über Schriftstil/Kennzeichen, nicht über Blässe).
- 2.1.1: Alles per Tastatur; Satz-Blatt und Menüs mit Esc schließbar; Kalender mit Pfeiltasten.
- 2.2.1: Pausentimer ist vom Nutzer gestartet und verlängerbar; Hinweisleisten mit Rückgängig bleiben bei Fokus/Maus darüber stehen.
- 2.4.3/2.4.11: Fokusreihenfolge = Lesereihenfolge; klebende Kopf- und Pausenleiste dürfen das fokussierte Feld nicht verdecken (`scroll-padding-top/-bottom` auf Höhe der Leisten).
- 2.5.7: Wischen (Kalender, Blatt schließen) hat immer Knopf-Alternative.
- 2.5.8: Ziele ≥ 44 px (Projektstandard).
- 3.3.1/3.3.3: Fehlertexte am Feld, mit Lösungsvorschlag.
- 4.1.3: Statusmeldungen über `role="status"`; „Pause vorbei“ und Speicherfehler `role="alert"`.
- Screenreader-Test: VoiceOver iOS Safari und TalkBack Chrome mit einem kompletten Satz-Durchlauf (kg, Wdh., Weiter, Pause, Rückgängig).

---

## 5. Datenmodell (Training, Schema-Version 2)

Ziel: alles, was das Konzept 7.2 und die Auswertung (Abschnitt 6) brauchen, ohne den bestehenden Code umzuwerfen. Felder **fett** = neu.

```text
Workout
  id, schemaVersion: 2, date (Kalendertag des Trainings)
  status: 'inProgress' | 'done' | 'skipped'           // NEU: inProgress
  kind: 'plan' | 'free' | 'activity'                   // NEU (bisher aus plan abgeleitet)
  plan: { planId, planName, planVersion,               // NEU: planVersion
          dayId, dayName, weekday | null,
          scheduleType: 'weekdays' | 'rotation' } | null
  scheduledFor: dateKey | null    // NEU: geplanter Termin, den dieses Training erfüllt (verschoben/nachgeholt)
  entryMode: 'live' | 'backfill'  // NEU: live geloggt oder nachgetragen (Zeiten dann unsicher)
  startedAt, finishedAt: ISO | null                     // NEU
  skipReason: 'sick'|'injured'|'noTime'|'vacation'|'other' | null   // NEU
  activity: { type, customType?, durationMinutes, distanceKm? } | null // NEU
  note, feeling: 1–5 | null                             // feeling NEU
  exercises[]
  createdAt, updatedAt, deletedAt: ISO | null           // deletedAt NEU (weiches Löschen, Sync-Grabstein)

Exercise
  id, exerciseId | null, exercise, muscle, perSide, restSeconds
  plannedEntryId | null
  status: 'planned' | 'skipped' | 'replaced' | 'extra'  // ersetzt skipped:boolean
  replacesEntryId | null, replacedExercise: { exerciseId, exercise } | null
  planned: { sets: SetTarget[], restSeconds, note } | null   // NEU: Soll-Kopie der ganzen Übung (behebt I-1)
  note | null, supersetId | null (später)
  sets[]

Set
  id, type: 'warmup' | 'working' | 'drop' | 'failure'
  plannedSetIndex: number | null       // NEU: Bezug zu planned.sets[i]; null = zusätzlich
  planned                              // bleibt (Kompatibilität), = planned.sets[plannedSetIndex]
  weight, reps, seconds                // bei perSide null
  rir: number | null                   // NEU
  note | null                          // NEU
  doneAt: ISO | null                   // NEU: Zeitpunkt, an dem der Satz erledigt wurde
  restBeforeSeconds: number | null     // NEU: gemessene Pause seit dem vorigen erledigten Satz
  source: 'typed' | 'previous' | null  // NEU: eingetippt oder „Letztes Mal“ übernommen
  sides: { left: SideValues, right: SideValues } | undefined
  repetitions: Rep[] | undefined       // NEU, nur markierte Wdh. (spärlich)

SideValues  { weight, reps, seconds, rir?, doneAt?, repetitions? }
Rep         { index (1-basiert), assisted?: true, partial?: true, weight?: number }   // weight = ab hier
```

**Regeln**
- **Plantreue** (`workoutSummary`) zählt geplante Arbeitssätze aus `exercise.planned.sets` (nicht aus den vorhandenen Sätzen). Ein mit ✕ entfernter geplanter Satz zählt als nicht erfüllt. Übersprungene Übung: alle geplanten Sätze nicht erfüllt. Ersetzte Übung: erfüllte Sätze × 0,5 (Konzept 6.2 „teilweise“), Kennzeichen „ersetzt“.
- `doneAt` wird gesetzt, wenn ein Satz von offen auf erledigt wechselt, und gelöscht, wenn die Wdh./Sek. wieder geleert werden. Nachträgliche Wertänderung ändert `doneAt` nicht.
- `restBeforeSeconds` = `doneAt` − `doneAt` des vorigen erledigten Satzes im selben Training (über Übungen hinweg), nur im Live-Modus, gekappt bei 20 min.
- **Dauer** = `finishedAt − startedAt`; im Nachtrag optional.
- **Zählt als Training:** `status 'done'` und (≥ 1 erledigter Satz oder `kind 'activity'`).
- **Pausentimer-Zustand** (`endsAt`, `exerciseId`, `setId`) gehört **nicht** ins Training, sondern unter eigenen Schlüssel `workoutRestTimer` im `localStorage` (flüchtig).
- **Ignorierte offene Tage** unter eigenem Schlüssel `diaryIgnoredSlots: [{ planId, dayId, date }]`.

**Migration v1 → v2** (beim Lesen, wie `migratePlan`; Funktion `migrateWorkout` in `workoutLog.js`, mit Tests):
| Alt | Neu |
|---|---|
| `schemaVersion: 1` | `2` |
| – | `kind = plan ? 'plan' : 'free'` |
| `status 'done'` | bleibt `'done'` (alte Trainings gelten als beendet) |
| – | `startedAt = null`, `finishedAt = null` (keine geschätzten Zeiten erfinden), `entryMode = 'backfill'` |
| `exercise.skipped: true/false` | `status = skipped ? 'skipped' : (plannedEntryId ? 'planned' : 'extra')` |
| – | `exercise.planned = { sets: sets.filter(s => s.planned).map(s => ({type, ...s.planned})), restSeconds, note: null }` – **Einschränkung:** bereits per ✕ entfernte Sätze sind nicht rekonstruierbar; im Eintrag wird dann kein Hinweis gezeigt, die Auswertung markiert v1-Trainings intern mit `plannedReconstructed: true` |
| `set.planned` | bleibt; `plannedSetIndex` = Position unter den Sätzen mit `planned` |
| – | `rir, note, doneAt, restBeforeSeconds, source = null` |
| `plan` ohne `planVersion` | `planVersion = null`, `scheduleType` aus `weekday` (null → `'rotation'`) |

Gespeichert wird beim nächsten Schreiben im neuen Format; alte Daten bleiben lesbar. Vor dem ersten Schreiben einmalig Sicherung unter `workoutLog.backup.v1`.

**Für Supabase (Phase E):** Tabelle `workouts` (id, user_id, date, status, kind, plan_id, plan_version, day_id, scheduled_for, started_at, finished_at, data jsonb, updated_at, deleted_at) und flache Tabelle `workout_sets` (eine Zeile **pro Satz und Seite**: workout_id, set_id, side null|'left'|'right', date, plan_id, day_id, exercise_id, exercise, muscle, type, planned_reps_min/max, planned_seconds, planned_weight, weight, reps, seconds, rir, assisted_reps, partial_reps, done_at, rest_before_seconds). Damit sind Auswertungen pro Plan und über mehrere Pläne mit einfachem SQL möglich.

---

## 6. Backlog mit Abnahmekriterien

Reihenfolge innerhalb einer Priorität = empfohlene Umsetzungsreihenfolge. Jede Aufgabe mit Tests (Vitest), Deutsch und Englisch.

### P1 – vor dem nächsten echten Training im Studio

| ID | Aufgabe | Abnahmekriterien |
|---|---|---|
| T-01 | **Datenmodell v2 + Migration** | `migrateWorkout` wandelt v1 verlustfrei laut Tabelle 5; Tests für v1 mit/ohne pro Seite, übersprungen, zusätzlich; Sicherung `workoutLog.backup.v1` existiert nach erstem Schreiben. |
| T-02 | **Plantreue aus Soll-Kopie** (I-1) | Vier geplante Sätze, zwei mit ✕ entfernt, zwei erfüllt → 50 %; geplante Übung übersprungen → 0 % für diese Übung; zusätzliche Übung ändert Plantreue nicht; Test vorhanden. |
| T-03 | **Speicherfehler und Speicherstatus sichtbar** (I-2) | Simulierter `QuotaExceededError` → Kopfleiste „Nicht gespeichert“ + `role="alert"` + [Erneut versuchen]; Eingaben bleiben im Zustand erhalten; Erfolg → „Gespeichert“. |
| T-04 | **Trainingszustand „läuft“, Start-/Endzeit, Fortsetzen, Verwerfen** (I-3) | Start setzt `inProgress` + `startedAt`; Banner im Tagebuch mit Dauer; [Training beenden] setzt `done` + `finishedAt`; leeres Training → Verwerfen-Dialog; leere Trainings zählen nicht in „Diese Woche“; nur ein laufendes Training gleichzeitig mit Rückfrage. |
| T-05 | **Start mit Plan-Kacheln** (I-10, I-11) | Je Plan eine Kachel ohne Vorauswahl; „Heute: Tag X“ startet mit einem Tipp; Ruhetag zeigt „Heute kein Training geplant“ und schlägt keinen Tag still vor; Ausfall-Grund nicht mehr im Startformular; `?plan=` klappt Kachel auf, startet nicht. |
| T-06 | **Ausfall-Dialog mit Grund-Chips** | Dialog aus Kachel-Menü; speichert `skipped`, `skipReason`, Notiz; Hinweisleiste mit Rückgängig. |
| T-07 | **Ziel und Letztes Mal pro Satz sichtbar** (I-4) | Kartenkopf zeigt Ziel (bzw. pro Zeile bei unterschiedlichen Zielen); Spalte „Letztes Mal“ mit Werten aus dem letzten Training dieser Übung; Antippen übernimmt kg+Wdh., Satz zählt als erledigt, `source: 'previous'`; Screenreader liest Ziel und letztes Mal als Text. |
| T-08 | **Schnelle Zahleneingabe** (I-8) | `type="text"` + `inputmode`; „62,5“ und „62.5“ ergeben 62.5; Enter springt in der Reihenfolge aus 3.2.3; Inhalt beim Fokus markiert; ungültige Eingabe zeigt Fehlertext und verwirft keinen Wert; neuer Satz bekommt Fokus. |
| T-09 | **Erledigt nicht nur über Farbe; pro Seite unvollständig** (I-5, I-6) | Erledigte Zeile zeigt ✓-Symbol und Screenreader-Text „erledigt“; nur eine Seite eingetragen → „nur links/rechts“ sichtbar; Gewicht L wird nach R übernommen, wenn R unberührt. |
| T-10 | **Live-Aufbau: klebende Kopfleiste, Fortschritt, Details-Blatt, Übungsmenü** (I-9) | Erste Übung ohne Scrollen sichtbar bei 390 × 844; Datum/Notiz/Status im Details-Blatt; Skip/L/R/Ersetzen/Entfernen im Menü ⋮; fokussierte Felder nie unter klebenden Leisten. |
| T-11 | **Pausentimer mit Wake Lock** | Startet nach Satz-Ende (3.2.5) mit Pause aus dem Plan; ±15 s, Überspringen; übersteht Neuladen (`endsAt`); „Pause vorbei“ sichtbar, vibriert wo möglich, Screenreader-Ansage einmal; Wake Lock während laufendem Training aktiv; nicht im Bearbeitungsmodus. |
| T-12 | **Geplante Übungen nur überspringen/ersetzen; Ersetzen** (I-13) | Kein „Entfernen“ bei geplanten Übungen; Ersetzen öffnet Übungsauswahl, behält Sätze und Ziele, setzt `status: 'replaced'` + `replacedExercise`; Anzeige „ersetzt …“. |
| T-13 | **Rückgängig statt Rückfrage** (I-14) | ✕ Satz, Übung entfernen, Eintrag löschen → sofort, Hinweisleiste 5–8 s mit [Rückgängig] stellt exakt wieder her (Position, Werte); kein `window.confirm` mehr im Tagebuch. |
| T-14 | **Abschluss-Bildschirm (ohne Plan-Update)** | Offene-Sätze-Dialog; Zusammenfassung mit Dauer, Sätzen, Volumen, Plantreue + Status (80 %-Schwelle), Abweichungsliste, Notiz; [Fertig] zum Tagebuch. |
| T-15 | **Bearbeitungsmodus für Historie** | Beendete Einträge ohne Timer und ohne laufende Dauer; Datum/Zeiten änderbar; „Zuletzt geändert“ sichtbar; Status-Wechsel nur über Menü mit Erklärung. |
| T-16 | **Aufwärmsatz verständlich** (I-16) | Kürzel „Aufw.“/„WU“, Screenreader „Aufwärmsatz“. |

### P2 – nächster Ausbau (Schritt B vollständig, Schritt C)

| ID | Aufgabe | Abnahmekriterien |
|---|---|---|
| T-20 | **Satzart-Menü** | Satznummer antippen → Aufwärmen/Arbeitssatz/Drop/Versagen; Auswertung berücksichtigt Art. |
| T-21 | **RIR optional** | Nur sichtbar bei RIR-Ziel oder Einstellung; Chips 0–5+; ändert „erledigt“ nicht; gespeichert in `rir`. |
| T-22 | **Satz-Blatt mit Steppern** | −/+ für kg (Schritt pro Übung), Wdh., Sek.; alle Ziele ≥ 48 px im unteren Drittel; Fokus gefangen, Esc schließt. |
| T-23 | **Notiz pro Übung und Satz, Plan-Hinweis sichtbar** | Notizen gespeichert und im Eintrag/Kalender sichtbar; Plan-Notiz nur lesbar. |
| T-24 | **Bestleistungen im Abschluss** | Schwerstes Gewicht, meiste Wdh. je Gewicht, Epley-Maximum je Übung gegen alle früheren Trainings; Aufwärmsätze ausgeschlossen; Tests. |
| T-25 | **Plan mit diesen Werten aktualisieren?** | Nur bei Unterschieden; Checkliste ohne Vorauswahl; Übernehmen erhöht Planversion; Training behält Soll-Kopie; „Plan unverändert“ ändert nichts. |
| T-26 | **Gefühl 1–5** | Fünf Stufen mit Text, gespeichert in `feeling`. |
| T-27 | **Offene Tage, Nachholen, Verschoben mit Bezug** (I-12) | Wochentags-Pläne: verpasste Termine der letzten 14 Tage gelistet; Nachholen setzt `scheduledFor`; Ignorieren ausgeblendet; Reihum-Pläne zeigen „x von y diese Woche“. |
| T-28 | **Andere Aktivität** (O17) | Formular mit Pflicht-Dauer; erscheint in Liste, Woche (zählt als Training) und Filter „Aktivitäten“; keine Plantreue. |
| T-29 | **Kalenderansicht mit Tagesdetails** | Monatsraster Mo–So; Status mit Symbol+Text laut Tabelle 3.6; Tagesdetails mit Soll-Ist pro Übung; Plan-Filter wirkt; Tastatur-Navigation; Nachtragen aus leerem Tag. |
| T-30 | **Liste nach Wochen, Filter in URL** (I-17) | Wochenköpfe mit KW; 4 Wochen + „Ältere laden“; `?plans=` und `?view=` bleiben bei Zurück erhalten. |
| T-31 | **Mehrere Tabs synchron** (I-18) | `storage`-Ereignis lädt neu; gleicher Eintrag in zwei Tabs → Hinweis + [Neu laden]; kein stilles Überschreiben (Test mit zwei Store-Instanzen). |
| T-32 | **Übungen im Training umsortieren** | Hoch/Runter im Menü, per Tastatur und Screenreader bedienbar. |
| T-33 | **L/R ausschalten ohne stillen Verlust** (I-7) | Rechte Werte vorhanden → Auswahl-Blatt; ohne Werte sofort. |
| T-34 | **Verlauf der Übung im Training** | „Letztes Mal: Datum“ öffnet Blatt mit allen Sätzen des letzten Trainings dieser Übung. |
| T-35 | **Desktop-Zweispalter** (Tagebuch und Training) | Ab 1024 px Layout laut 4.1/4.4; mobil unverändert. |

### P3 – später

| ID | Aufgabe | Abnahmekriterien |
|---|---|---|
| T-40 | **Pro Wiederholung erfassen** (O14) | Satz-Blatt-Abschnitt mit Chips; mit Hilfe/Teilwdh./Gewicht ab Wdh.; spärlich gespeichert; Plantreue nutzt saubere Wdh. |
| T-41 | **Supersätze** | Gruppierung im Plan und Training; Weiter springt A1→B1→A2; Timer nach Rundenende. |
| T-42 | **Aufwärm-Rechner** | Schlägt 2–4 Aufwärmsätze bis zum Arbeitsgewicht vor; Übernahme per Tipp. |
| T-43 | **Doppelte Progression als Vorschlag** | Obere Wdh. in allen Arbeitssätzen erreicht → nächstes Gewicht im Plan-Update vorgeschlagen (nicht angehakt). |
| T-44 | **Einstellungen Tagebuch** | Standard-Pause, Ton, Bildschirm anlassen, Quelle „Letztes Mal“ (alle/gleicher Plan), Aufwärmsätze in Statistik. |
| T-45 | **Timer-Benachrichtigung im Hintergrund** | Mit Service Worker und Erlaubnis; ohne Erlaubnis keine Nachfrage-Schleife. |
| T-46 | **Export aller Trainings (JSON/CSV)** | Datei mit allen Feldern aus Abschnitt 5; CSV eine Zeile pro Satz und Seite. |
| T-47 | **Speicher auf IndexedDB** | Gleiche Store-Schnittstelle; Migration aus `localStorage`; schneller bei > 500 Trainings. |
| T-48 | **Sync-Konfliktregel mit Konto** | Pro Satz neuer `updatedAt` gewinnt; Grabsteine; laufende Trainings erst nach Ende synchronisiert. |

---

## 7. Quellen

1. Hevy – Track exercises (Spalte „Previous“): https://www.hevyapp.com/features/track-exercises/
2. Hevy Hilfe – Workout-Einstellungen (Timer, Aufwärmsätze in Statistik, Previous-Quelle): https://help.hevyapp.com/hc/en-us/articles/33882110558743-Workout-Settings-Preferences-Timer-Warm-up-calculator-Plate-Calculator-Smart-Superset-Scrolling
3. Hevy – Satzarten: https://www.hevyapp.com/features/workout-set-types/
4. Hevy – Programmieroptionen: https://www.hevyapp.com/features/exercise-programming-options/
5. Hevy Hilfe – Pausentimer: https://help.hevyapp.com/hc/en-us/articles/35385404949143-Rest-Timer-Default-Rest-Timer-How-to-Add-Adjust-Volume-and-Sound
6. Hevy Hilfe – Update Routine vs. Keep Original: https://help.hevyapp.com/hc/en-us/articles/38387296276375-Update-Routine-vs-Keep-Original-Routine
7. Hevy Hilfe – Previous Workout Values: https://help.hevyapp.com/hc/en-us/articles/34105442929943
8. Strong – Review (vorherige Leistung, Antippen übernimmt): https://repreturn.com/strong-app-review/
9. Strong – Review: https://lifting-apps.pages.dev/reviews/strong
10. Strong – App Store: https://apps.apple.com/za/app/id464254577
11. Alpha Progression – Website: https://alphaprogression.com/en
12. Alpha Progression – App Store: https://apps.apple.com/us/app/gym-workout-alpha-progression/id1462277793
13. Boostcamp – RPE-Logging: https://www.boostcamp.app/features/rpe-logging
14. Boostcamp – Workout-Tracker: https://boostcamp.app/workout-tracker
15. Strongsplit – Update-Notiz (letzter Satz unter aktuellem Satz): https://strongsplit.userjot.com/updates/p/214
16. Fitbod Hilfe – Editing Workouts: https://help.fitbod.me/hc/en-us/articles/360006335593-Editing-Workouts-in-Fitbod
17. JEFIT – Überarbeiteter Logging-Bildschirm: https://www.jefit.com/blog/upcoming-enhancements-revamped-workout-tab-and-improved-exercise-screens
18. Garmin – Krafttraining aufzeichnen (Satzerkennung, Edit Last Set): https://www8.garmin.com/manuals/webhelp/GUID-8674F17E-62B2-48DE-927A-251611664658/EN-US/GUID-F979765F-302B-4C5D-8E53-AA0A9EB3BD08.html
19. Hevy Hilfe – Workout loggen: https://help.hevyapp.com/hc/en-us/articles/35361530647959-How-to-Log-a-Workout-in-the-Hevy-App-Step-by-Step-Guide
20. Hevy – Gym Routines (Routine nach Training aktualisieren): https://www.hevyapp.com/features/gym-routines/
21. W3C – WCAG 2.2, Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
22. W3C – WCAG 2.2, Status Messages: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
23. MDN – Screen Wake Lock API: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
24. MDN – Vibration API (nicht in Safari): https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
25. MDN – `storage`-Ereignis: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
26. MDN – `StorageManager.persist()`: https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
27. MDN – `inputmode`: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode

Hinweis zu den Quellen: Strong, Alpha Progression und Boostcamp sind teils über Herstellerseiten und Testberichte belegt; Details können sich mit App-Versionen ändern.

---

## Kanban-Aufgaben

- [P1] Datenmodell v2 + Migration – v1-Einträge werden verlustfrei gelesen, Sicherung `workoutLog.backup.v1` vorhanden
- [P1] Plantreue aus Soll-Kopie – 2 von 4 geplanten Sätzen per ✕ entfernt ergibt 50 %, nicht 100 %
- [P1] Speicherfehler und Speicherstatus sichtbar – Quota-Fehler zeigt „Nicht gespeichert“ mit Erneut-versuchen, nichts geht still verloren
- [P1] Trainingszustand „läuft“ mit Start/Ende, Fortsetzen, Verwerfen – Banner „Training läuft“, leere Trainings zählen nicht
- [P1] Start mit Plan-Kacheln ohne Vorauswahl – heutiges Training mit einem Tipp, Ruhetag wird ehrlich angezeigt
- [P1] Ausfall-Dialog mit Grund-Chips – Ausfall mit Grund und Notiz speicherbar, Rückgängig möglich
- [P1] Ziel und Letztes Mal pro Satz sichtbar – Antippen von „Letztes Mal“ übernimmt kg und Wdh., Ziel bleibt sichtbar
- [P1] Schnelle Zahleneingabe – Komma/Punkt, Enter springt kg→Wdh.→nächster Satz, ungültige Werte mit Fehlertext
- [P1] Erledigt nicht nur über Farbe, pro Seite unvollständig markiert – ✓-Symbol plus Text, „nur links/rechts“ sichtbar
- [P1] Live-Aufbau mit Kopfleiste, Fortschritt, Details-Blatt, Übungsmenü – erste Übung ohne Scrollen bei 390 px sichtbar
- [P1] Pausentimer mit Wake Lock – startet nach Satz-Ende mit Plan-Pause, ±15 s, übersteht Neuladen
- [P1] Geplante Übungen nur überspringen oder ersetzen – Ersetzen behält Sätze und setzt Status „ersetzt“
- [P1] Rückgängig statt Rückfrage – ✕ Satz, Übung, Eintrag mit 5–8 s Rückgängig, kein window.confirm mehr
- [P1] Abschluss-Bildschirm – Dauer, Sätze, Volumen, Plantreue mit Status und Abweichungsliste nach „Training beenden“
- [P1] Bearbeitungsmodus für Historie – beendete Einträge ohne Timer, Datum/Zeiten änderbar, „Zuletzt geändert“ sichtbar
- [P1] Aufwärmsatz verständlich beschriften – „Aufw.“/„WU“, Screenreader liest „Aufwärmsatz“
- [P2] Satzart-Menü – Satznummer antippen wechselt Aufwärmen/Arbeitssatz/Drop/Versagen
- [P2] RIR optional erfassen – Chips 0–5+ nur bei RIR-Ziel oder Einstellung, ändert „erledigt“ nicht
- [P2] Satz-Blatt mit Steppern – −/+ für kg, Wdh., Sek. mit 48-px-Zielen im unteren Drittel
- [P2] Notiz pro Übung und Satz – Notizen gespeichert, Plan-Hinweis nur lesbar sichtbar
- [P2] Bestleistungen im Abschluss – Gewicht, Wdh. je Gewicht und Epley-Maximum gegen alle früheren Trainings
- [P2] Plan mit diesen Werten aktualisieren – Checkliste ohne Vorauswahl, Übernahme erhöht Planversion
- [P2] Gefühl 1–5 – fünf Stufen mit Text gespeichert
- [P2] Offene Tage, Nachholen, Verschoben mit Bezug – verpasste Termine gelistet, Nachholen setzt `scheduledFor`
- [P2] Andere Aktivität – Art, Dauer Pflicht, Distanz optional, erscheint in Liste, Woche und Filter
- [P2] Kalenderansicht mit Tagesdetails – Status mit Symbol und Text, Soll-Ist pro Übung, Tastaturbedienung
- [P2] Liste nach Wochen, Filter in der URL – KW-Gruppen, „Ältere laden“, Filter bleibt bei Zurück erhalten
- [P2] Mehrere Tabs synchron – kein stilles Überschreiben, Hinweis mit Neu laden
- [P2] Übungen im Training umsortieren – Hoch/Runter per Tastatur und Screenreader
- [P2] L/R ausschalten ohne stillen Verlust – Auswahl-Blatt, wenn rechte Werte vorhanden sind
- [P2] Verlauf der Übung im Training – „Letztes Mal“ öffnet alle Sätze des letzten Trainings
- [P2] Desktop-Zweispalter – ab 1024 px Liste/Navigation links, Inhalt rechts, mobil unverändert
- [P3] Pro Wiederholung erfassen – mit Hilfe, Teilwdh., Gewicht ab Wdh.; Plantreue nutzt saubere Wdh.
- [P3] Supersätze – Weiter springt A1→B1→A2, Timer nach Rundenende
- [P3] Aufwärm-Rechner – 2–4 Aufwärmsätze bis Arbeitsgewicht per Tipp übernehmen
- [P3] Doppelte Progression als Vorschlag – nächstes Gewicht im Plan-Update vorgeschlagen, nicht angehakt
- [P3] Einstellungen Tagebuch – Standard-Pause, Ton, Bildschirm an, Quelle „Letztes Mal“, Aufwärmsätze in Statistik
- [P3] Timer-Benachrichtigung im Hintergrund – nur mit Erlaubnis, über Service Worker
- [P3] Export aller Trainings – JSON und CSV mit einer Zeile pro Satz und Seite
- [P3] Speicher auf IndexedDB – gleiche Schnittstelle, Migration aus localStorage
- [P3] Sync-Konfliktregel mit Konto – pro Satz gewinnt neuerer Stand, Grabsteine für Gelöschtes
