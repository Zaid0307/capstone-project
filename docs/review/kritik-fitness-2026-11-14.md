# Kritik GetFit! aus Sicht Trainingswissenschaft und Fitness-App-UX

Stand: 14.11.2026. Branch `ueberarbeitung`. Geprüft wurden Code, alle 23 Vorlagen in `src/data/planTemplates.json` und die laufende App (Chrome headless, 390 × 844, Testdaten: Vorlage `hypertrophy_upperlower_4` und `mobility_daily_light`, je ein Training eingetragen).
`src/data/inspiredTemplates.js` gibt es noch nicht. Diese Vorlagen sind deshalb nicht bewertet.
Grafiken (Figur, Animationen) fehlen absichtlich. Sie gelten hier nicht als Fehler.

Methode für die Vorlagen: Ein Skript hat für jede Vorlage die Wochensätze gezählt. Gezählt wurde pro Satz 1 für Hauptmuskeln und 0,5 für Hilfsmuskeln, mit den Daten aus `src/data/exercises/*.js`. In der Tabelle stehen meist die **direkten** Arbeitssätze, also nur Übungen, bei denen der Muskel Hauptmuskel ist. Diese Zahl ist für den Muskelaufbau aussagekräftiger.

---

## 1. Gesamtnoten

**App: 6/10.**
Das Datenmodell ist fachlich stark: Muskeln nach Terminologia Anatomica, Haupt- und Hilfsmuskeln, Sätze pro Seite, Soll-Ist-Vergleich, e1RM mit Grenze bei 12 Wiederholungen, Rekorde für 1–12 Wiederholungen.
Im Training selbst fehlen aber die Werkzeuge, die Fortschritt erst möglich machen: kein Pausen-Timer, kein „Letztes Mal“, kein RIR-Eintrag und kein Vorschlag für die Steigerung.
Dazu kommt ein Rechenfehler mit großer Wirkung: Dehnen, Mobility und Boxen zählen in Editor und Auswertung als Muskelaufbau-Sätze.

**Vorlagen: 5/10.**
Die Grundgerüste sind solide und vorsichtig: Ober-/Unterkörper, Push/Pull/Beine, RIR 2, sinnvolle Pausen von 60–180 s und keine Übungen, die bis zum Muskelversagen gehen.
Aber 23 Vorlagen sind in Wahrheit etwa 12 verschiedene. Mehrere sind Kopien mit anderem Namen oder einem anderen Niveau („advanced“ statt „intermediate“). Alle 23 haben denselben Text zu Beschreibung, Steigerung und RIR, auch Pilates und Dehnen.
Mehrere Pläne für Muskelaufbau trainieren Oberkörper oder Beine nur 1× pro Woche mit 3–6 direkten Sätzen. Das liegt klar unter dem eigenen Richtwert der App von 10 Sätzen (`src/utils/planAnalysis.js:9`).

---

## 2. Top 10 Probleme (nach Wirkung)

| # | Prio | Problem | Beleg | Folge für Nutzer | Vorschlag |
|---|---|---|---|---|---|
| 1 | **P1** | Dehnen, Mobility, Pilates und Boxen zählen als Muskelaufbau-Sätze. | `src/utils/planAnalysis.js:63-74` (`weeklyEntries` filtert nicht nach `category`), `src/utils/workoutPlan.js` `weeklySetsByMuscle` (zählt jeden Eintrag), `src/utils/analysis/muscleLoad.js` `effectiveSets`; Filter `kind` ist standardmäßig leer (`filters.js:40`). In der App zeigt der Editor für den Tag „Mobility und Dehnen“ den Wert *Brust 4 Sätze* (Bruststretch an Wand, Open Book). Im Dashboard stammen 3 von 8 „Brust-Sätzen“ aus Dehnübungen. | Wer `mobility_daily_light` aktiv hat, sieht pro Woche etwa 24 Brust- und 18 Schultersätze und hält sich für gut trainiert. Die Hinweise („zu wenig“, „Ungleichgewicht“) werden falsch. | Nur die Kategorien `strength` und `isometric` zählen für Volumen und Hinweise. `stretch`, `mobility`, `yoga`, `pilates`, `boxing` und `cardio` kommen in eine eigene Karte „Andere Belastung“ (Minuten). Im Dashboard ist `kind` standardmäßig `strength`. |
| 2 | **P1** | Es gibt keinen Weg zur Steigerung: RIR wird im Training nicht angezeigt und nicht erfasst, und es gibt keinen Vorschlag. | `src/pages/WorkoutPage.jsx:76-80` (`target()` zeigt nur Dosis und kg, nicht `rirTarget`); `workoutLog.js` hat im Satz kein Feld für RIR. Kanban: „Progressionsvorschlag“ steht als P2, RIR als P3. | Die Vorlagen sagen „RIR 2“ und „obere Grenze erreicht → steigern“. Die App kann beides aber weder zeigen noch prüfen. Der Nutzer trainiert Woche für Woche gleich, und es gibt keine progressive Überlastung. | Ziel-RIR im Training anzeigen („8–12 · RIR 2“). Optional pro Satz RIR 0–4 eintragen. Doppelte Progression: Erreichen alle Arbeitssätze die obere Grenze bei RIR ≥ 1, dann nächstes Mal +2,5 kg (Langhantel) bzw. +1–2 kg (Kurzhantel) vorschlagen. Auf P1 hochstufen. |
| 3 | **P1** | Vorlagen sind doppelt oder falsch beschriftet. | `strength_hypertrophy_4` (Zeile 1929) hat genau die Tage, Übungen und Wiederholungen von `hypertrophy_upperlower_4` (Zeile 297), aber das Niveau „advanced“ und das Ziel „strength“, ohne einen Satz unter 6 Wiederholungen. `women_fullbody_strength_3` (7341) entspricht `hypertrophy_fullbody_3`. `women_home_glutes_band_3` (7011) ist `home_band_3` in anderer Reihenfolge. `mobility_strength_3` hat laut ID 3 Tage, aber `weeklyTrainingDays: 4`. `bodyweight_beginner_3` („Eigengewicht“) nutzt `band_squat`, `band_row` und `band_external_rotation`. | Vertrauensverlust. Wer „Kraft“ wählt, bekommt kein Krafttraining. Frauen bekommen dieselben Pläne mit anderem Etikett. | Kopien zusammenlegen und Zielgruppe als Filter-Tag statt als eigene Vorlage. `strength_hypertrophy_4` echt machen (siehe Tabelle). IDs und Namen an die tatsächliche Zahl der Tage und die Ausrüstung anpassen. |
| 4 | **P1** | Die Vorlagenauswahl hilft nicht bei der Entscheidung. | `src/components/planEditor/TemplatePicker.jsx:35-58`: 23 Karten untereinander, angezeigt werden nur Name, Tage und Beschreibung. Es gibt nur **eine** Beschreibung für alle 23 („Originales, vollständig editierbares Trainingsprogramm…“). `level`, `goals`, `setting` und Ausrüstung sind in den Daten vorhanden, werden aber nicht angezeigt. | Einsteiger wählen „Push/Pull/Legs 6 Tage“ (advanced), weil nichts davor warnt. Die Seite ist am Handy etwa 6000 px lang (Screenshot `new`). | Chips für Niveau, Ort, Tage und Ziel zeigen. Filter (steht im Backlog als P2) auf P1 heben. Pro Vorlage 1–2 Sätze „Für wen / was erwartet dich“ und eine Dauer pro Einheit angeben. |
| 5 | **P1** | Es gibt keinen Pausen-Timer. | `WorkoutPage.jsx:124-125`: `restSeconds` erscheint nur als Text „Pause 150 s“. | Ohne Timer werden Pausen bei schweren Übungen zu kurz oder zu lang. Das ist die meistgenutzte Funktion in Strong und Hevy. | Timer startet automatisch, wenn ein Satz eingetragen ist, mit ±15 s und Vibration (Kanban P1 – vorziehen). |
| 6 | **P1** | „Letztes Mal“ fehlt. Nur das Gewicht wird übernommen. | `workoutLog.js` `exerciseFromEntry`: übernimmt `weight`, die Wiederholungen bleiben leer. Als Platzhalter steht nur der Planbereich „8–12“ (Screenshot `workout`). | Der Nutzer weiß nicht, ob er letztes Mal 8 oder 12 Wiederholungen geschafft hat. Ohne das ist keine gezielte Steigerung möglich. | Unter jedem Satz „Letztes Mal: 60 kg × 10“. Ein Tipp darauf übernimmt die Werte (Kanban P1). |
| 7 | **P2** | Die Gruppenwerte im Editor werden anders gerechnet als die Muskelliste und das Dashboard. | `workoutPlan.js` `weeklySetsByMuscle` zählt jeden Satz voll für `entry.muscle` (nur die erste Gruppe aus `exerciseGroups`). `planAnalysis.weeklySetsPerMuscle` und `muscleLoad.effectiveSets` rechnen mit 1 / 0,5 und dem Höchstwert. Beispiel: Bankdrücken gibt in der Gruppenleiste 0 für Arme, in der Muskelliste 0,5 für den Trizeps. `dumbbell_pullover` zählt nur für Brust. | Zwei verschiedene Zahlen für denselben Plan. Die Hinweise `groupLow` beruhen auf der einen Zählung, die Figur auf der anderen. | Eine einzige Zählung (die effektiven Sätze aus `muscleLoad.js`) überall verwenden. Die Erklärung in der Legende stimmt dann auch. |
| 8 | **P2** | Das Wochenziel addiert alle aktiven Pläne. | `src/utils/analysis/consistency.js:21-29`. Dashboard-Text: „Ziel: 10 Trainings pro Woche“ bei 4 Krafttagen und 6 Mobility-Tagen. | Die Wochenserie bleibt dauerhaft bei 0. Das demotiviert, gerade bei leichten Ergänzungsplänen. | Ein Plan wird als „Hauptplan“ markiert, oder Mobility-, Pilates- und Boxtage zählen getrennt. Das Ziel kann der Nutzer selbst einstellen. |
| 9 | **P2** | Reihum-Pläne springen nach einem Ausfall weiter. Ein Ausfall gilt als „heute trainiert“. | `workoutLog.js:151-163` (der nächste Tag folgt auch nach `skipped`). `TodayPage.jsx:33` (`doneToday` prüft den `status` nicht). | Wer Tag A (Beine) ausfallen lässt, bekommt Tag B vorgeschlagen. Die Beine fallen dann eine ganze Runde aus. Nach einem eingetragenen Ausfall steht auf der Heute-Seite „Heute schon trainiert.“ | Nach `skipped` denselben Tag erneut vorschlagen (Option „überspringen“). `doneToday` nur bei `status === 'done'`. |
| 10 | **P2** | Volumen und Eingabe passen nicht für Eigengewicht und Zeitübungen. | `workoutLog.js` `volumeOf` und `strength.js` `volume`: kg × Wdh. Liegestütz und Klimmzug ergeben 0 kg. Im Editor hat jede Dehnübung ein Feld „kg“ (Text `edit-mob`: „Sekunden / kg“). Kein Plan hat Aufwärmsätze (`templateToPlan` erzeugt nur `working`). | Home- und Eigengewicht-Pläne zeigen „0 kg Volumen“, als wäre nichts passiert. Bei Kniebeuge 3 × 6–10 mit Langhantel fehlt der Hinweis zum Aufwärmen. | Bei Übungen mit Eigengewicht Wiederholungen und Sätze als Hauptkennzahl verwenden, optional mit Körpergewicht. Das Feld kg bei `stretch`, `mobility` und `yoga` ausblenden. In Vorlagen vor der ersten Langhantelübung 1–2 Aufwärmsätze (`warmup`) eintragen, z. B. 1 × 8 bei 50 % und 1 × 4 bei 75 %. |

Weitere Punkte (P3):
- Die Ziel-Vorgaben passen nicht zum Plantyp. `GUIDELINE_SETS = 10` gilt auch für Pilates- und Mobility-Pläne. Bei `women_pilates_beginner_3` kommen deshalb Hinweise wie „Brust fehlt“. Hinweise nach `goals` der Vorlage steuern.
- Kein Deload und keine Wochenplanung (Kanban P3). Für die Vorlagen mit „advanced“ reicht ein Textsatz: „alle 6–8 Wochen eine Woche mit halbem Satzvolumen“.
- Die Kategorie stimmt bei einigen Übungen nicht. `band_pull_apart` ist `mobility`, obwohl es eine Kraftübung für den hinteren Deltamuskel ist. `dead_bug` und `bird_dog` sind `mobility`, obwohl es Übungen für die Rumpfstabilität sind. Das wirkt sich auf den Filter „Art“ und künftig auf Punkt 1 aus.

Anatomie: Das Muskelmodell (`src/data/muscles.js`) ist korrekt nach TA. Es gibt keine erfundenen Zonen. Die Zuordnungen der Übungen sind plausibel, zum Beispiel: Kopf des Bizeps femoris *kurz* nur beim Beinbeugen, nicht beim RDL. Trapezius *pars ascendens* ist Hilfsmuskel beim Schulterdrücken (Aufwärtsrotation).

---

## 3. Bewertung jeder Vorlage

Abkürzungen: **D** = direkte Arbeitssätze pro Woche. Quads = M. quadriceps femoris. Hams = ischiocrurale Muskeln.

| ID | Note | Hauptproblem | Korrektur (konkret) |
|---|---|---|---|
| `hypertrophy_fullbody_3` | 7 | Gut für Einsteiger. Aber `pull_up` 3 × 5–10 ist für viele Einsteiger nicht machbar. Keine direkte Arbeit für den seitlichen Deltamuskel, die Waden und die Arme (D jeweils 0). Brust D 6. | Statt `pull_up` den `assisted_pull_up` (oder `cable_lat_pulldown`) 3 × 8–12. An Tag B `dumbbell_lateral_raise` 2 × 12–20 ergänzen. An A und B `calf_raise` 2 × 12–20. |
| `hypertrophy_upperlower_4` | 8 | Gute Struktur, Brust D 8, Rücken D 12, Quads D 12. Kern-Arbeit nur 2 Sätze (`cable_crunch`), Gesäß D 3. | An Unterkörper A `plank` 2 × 30–45 s ergänzen. `hip_thrust` an Tag B von 3 auf 4 Sätze. 1–2 Aufwärmsätze vor `barbell_squat` und `barbell_bench_press`. |
| `hypertrophy_ppl_6` | 7 | 2 Runden pro Woche, Volumen ok (Brust D 12, Rücken D 18, Bizeps D 10). **Bauch D 0.** Push A und B sind identisch, ebenso Pull A und B. Seitlicher Deltamuskel D 6 ist für „advanced“ wenig. | Legs B: `hanging_knee_raise` 3 × 8–12, Legs A: `cable_crunch` 3 × 10–15. Push B mit Variation: `incline_barbell_press` statt `barbell_bench_press`, `dumbbell_lateral_raise` 4 Sätze. Pull B: `barbell_row` statt `chest_supported_dumbbell_row`. |
| `hypertrophy_chest_back_split_4` | 5 | Trotz des Namens „Brust/Rücken“: Rücken D nur 6 (`cable_lat_pulldown` 3 + `barbell_row` 3), Brust D 8. Beide nur 1× pro Woche. Der Arm- und Schultertag (19 Sätze) bekommt mehr Volumen als der Fokus. | Brust/Rücken 2× pro Woche: Donnerstag zu „Oberkörper B“ machen (`incline_dumbbell_press` 3, `seated_cable_row` 3, `pull_up` 3, plus Seitheben und Arme je 2). Ziel: Rücken D ≥ 12, Brust D ≥ 10. |
| `hypertrophy_5day_bodypart` | 5 | Für „advanced“ zu wenig. Jeder Muskel nur 1× pro Woche (Brust D 9, Quads D 9, Seitlicher Deltamuskel D 3). Bauch D 0. Trizeps 2×, Bizeps 1× pro Woche. | Brust 12 Sätze (Fly auf 3, plus `parallel_bar_dip` 3). Seitheben 4 × 12–20 (Fr) plus 3 (Mo). `cable_crunch` 3 am Mi und `hanging_knee_raise` 3 am Sa. `dumbbell_curl` 3 am Freitag. Oder Niveau auf „intermediate“ senken. |
| `strength_hypertrophy_4` | 3 | Kopie von `hypertrophy_upperlower_4`. Kein Kraftblock: kleinste Wiederholungszahl 6, kein Kreuzheben, RIR 2 überall. | Hauptübungen nach Kraftschema: `barbell_squat` 4 × 3–5 (Pause 180–240 s, RIR 2), `barbell_bench_press` 4 × 3–5, `conventional_deadlift` 3 × 3–5 (an Unterkörper B statt `hip_thrust` als erste Übung), `barbell_overhead_press` 3 × 4–6. Danach Hilfsübungen 2–3 × 8–12. Steigerung: +2,5 kg pro Woche, solange RIR ≥ 1. |
| `gym_short_3` | 6 | Zeitsparend und ok. Beine wenig (Quads D 6, Hams D 3). Das Studio-Setting ist nicht genutzt (`push_up`, `band_row`). | `band_row` → `seated_cable_row`. Supersatz `push_up` + `one_arm_dumbbell_row` (Pause 60 s), um Zeit zu sparen. `dumbbell_rdl` auf 3 × 8–12 an Tag A ergänzen. |
| `bodyweight_beginner_3` | 5 | Name „Eigengewicht“, aber Widerstandsband nötig. Nur 2 Krafttage. Liegestütz 3 × 8–15 ist für echte Einsteiger oft zu schwer. | Umbenennen in „Einstieg zu Hause (Band)“ oder `bodyweight_squat` und `glute_bridge` statt Bandübungen. Liegestütz-Hinweis: erhöht an Bank oder Wand, 3 × 6–12. Mittwoch zu einer dritten kurzen Krafteinheit machen. |
| `home_band_3` | 6 | Brust nur über Liegestütz (D 3 für Brust). Keine Übung über Kopf. `calf_raise` und `reverse_lunge` brauchen Kurzhanteln, aber `setting: home` sagt nichts dazu. | Freitag: `close_grip_push_up` 2 × 8–15 ergänzen. Ausrüstungsliste in der Vorlage nennen (Band, Miniband, 1 Paar Kurzhanteln). |
| `home_band_4` | 5 | „Intermediate“ mit Brust D 6 nur aus Liegestützen, kein Drücken über Kopf. Gesäß deutlich höher (D 12 Bridge, Good Morning plus Ausfallschritt) als der Oberkörper. Beide Ober- und beide Unterkörpertage sind identisch. | Oberkörper B: Liegestütz mit erhöhten Füßen 3 × 6–12, `band_lateral_raise` 4. Pike Push-up oder `dumbbell_shoulder_press` 3 × 8–12. Beine B: `bulgarian_split_squat` 3 statt `band_squat`. |
| `home_heavybag_band_4` | 6 | Sinnvolle Mischung. Der Boxtag hat keinen Teil zum Aufwärmen und Seilspringen fehlt. Die Box-Sätze laufen in der Analyse als Trizeps-Volumen (siehe Problem 1). | Boxtag: zuerst `jump_rope` 3 × 60 s. `heavy_bag_hook` 2 × 45 s ergänzen. Rundenzeit 2–3 min mit 60 s Pause wie im Boxtraining. |
| `boxing_technical_3` | 5 | Nur 1 Krafttag. Die Sicherheit (Bandagen) steht nur in der Tagesnotiz, nicht in `safety.caution`. Es gibt keinen Haken (`heavy_bag_hook`) und keine Beinarbeit. | `safety.caution` wie bei `home_heavybag_band_4`. Mittwoch plus `plank` → `side_plank` 2 × 20–30 s. Freitag: `heavy_bag_hook` 2 × 45 s, `shadow_boxing` mit Beinarbeit. |
| `boxing_and_strength_4` | 5 | Oberkörper und Beine nur 1× pro Woche (Brust D 5, Rücken D 6). Zwei Boxtage belasten zusätzlich vorderen Deltamuskel und Trizeps, aber hinterer Deltamuskel D 0. | An Oberkörper A `face_pull` 3 × 12–20 ergänzen. Wenn möglich, einen kurzen Ganzkörperteil an Freitag hängen (`goblet_squat` 3, `pull_up` 3). |
| `mobility_strength_3` | 4 | Ziel Muskelaufbau, aber nur 2 Krafttage mit je 1 Übung pro Muster: Brust D 3, Quads D 6. ID sagt 3, Tage sind 4. | Dienstag oder Freitag zu „Ganzkörper C“ (`machine_chest_press` 3, `cable_lat_pulldown` 3, `leg_press` 3, `plank` 2) plus 10 min Mobility danach. ID zu `mobility_strength_4`. |
| `mobility_daily_light` | 6 | Sechsmal die gleiche Einheit. Text zu RIR und Lasterhöhung passt nicht zu Dehnen. Zählt in der App als 24 Brustsätze (Problem 1). | Zwei Abläufe abwechseln (A: Schultern/BWS, B: Hüfte/Beinrückseite mit `seated_glute_stretch`, `standing_calf_stretch`, `downward_facing_dog`). Steigerung: Haltezeit 30 → 45 → 60 s. Den RIR-Text entfernen. |
| `women_strength_glutes_4` | 7 | Gutes Gesäß-Programm (Hüftstoß 7 Sätze, BSS 6 Sätze). Waden D 0, Kern-Arbeit 2 Sätze. | `calf_raise` 3 × 12–20 am Montag. `pallof_press` 2 × 10–12 pro Seite am Donnerstag. |
| `women_strength_pilates_4` | 4 | Wie `mobility_strength_3`: nur 2 Krafttage, Brust D 3, Rücken D 6. Für „Muskelaufbau“ zu wenig. | Krafttage auf 3 erweitern oder jeden Krafttag um 1 Übung für Ober- und eine für Unterkörper (3 Sätze) ergänzen. Ziel: pro Muskelgruppe D ≥ 8. |
| `women_pilates_beginner_3` | 7 | Passend für den Einstieg. Text zu RIR und Lasterhöhung ist sinnlos. `pilates_hundred` 1 × 50 s ist für Anfänger lang. | Steigerung über Wiederholungen und Haltezeit beschreiben. `pilates_hundred` mit 30 s starten, Kopf abgelegt als Variante. |
| `women_pilates_strength_5` | 5 | „Definierter Muskelaufbau“ ist ein Mythos-Begriff: „definiert“ hängt vom Körperfett ab, nicht vom Training. Gesäß ist stark betont (Hüftstoß, Bridge, Pilates-Bridge: 12 Sätze nur für das Gesäß), Oberkörper nur 1× pro Woche (Brust D 5, Rücken D 6). | Name ohne „definiert“. Samstag Pilates B kürzen und `cable_lat_pulldown` 3, `dumbbell_shoulder_press` 3, `push_up` 3 ergänzen. `pilates_bridge` an einem der Tage streichen. |
| `women_home_glutes_band_3` | 4 | Kopie von `home_band_3` ohne mehr Gesäß-Fokus. Der Sicherheitstext nennt den „Hip-Thrust mit Langhantel“, der nicht im Plan ist (Zeile 7050). Tagesname „ersetzt Gym-Übungen“. | Mit `home_band_3` zusammenlegen oder echt auf das Gesäß ausrichten: Montag `glute_bridge` mit Band 4 × 12–20 statt 3, `pilates_clamshell` 2 × 15, `step_up` 3 × 10–12. Sicherheitstext und Tagesname korrigieren. |
| `women_fullbody_strength_3` | 4 | Kopie von `hypertrophy_fullbody_3`. „Starker Ganzkörper“ ohne Kraftteil. | Streichen und `hypertrophy_fullbody_3` mit dem Tag „Frauen“ anzeigen. Oder Kraftvariante: `goblet_squat` → `barbell_squat` 3 × 5–8, `dumbbell_bench_press` 3 × 6–8. |
| `women_mobility_stretch_4` | 7 | Sinnvoller Wechsel von Pilates und Mobility. Gleicher unpassender Text zu RIR und Steigerung. | Steigerung über Haltezeit und Bewegungsumfang. Ein Tag mit `downward_facing_dog` und `seated_glute_stretch`. |
| `women_athlete_5` | 6 | `hypertrophy_upperlower_4` plus Pilates, beschriftet als „advanced“ mit Ziel „strength“. Kein Kraftblock. | Oberkörper und Unterkörper A als Krafttage mit 4 × 4–6 (siehe `strength_hypertrophy_4`). B-Tage bleiben Muskelaufbau mit 8–15. |

Für alle Vorlagen gilt:
1. Pro Vorlage eigene Texte für Beschreibung, Steigerung und RIR (heute 1 Text für 23).
2. Feld `equipment` oder `durationMinutes` pro Vorlage.
3. Aufwärmsätze vor der ersten schweren Übung.
4. Hinweis zur Deload-Woche bei Plänen ab „intermediate“.

---

## 4. Vergleich mit Strong, Hevy und Fitbod

**Was fehlt:**
- Pausen-Timer mit automatischem Start (Strong, Hevy). Steht im Kanban als P1, ist aber noch nicht gebaut.
- „Vorher“-Spalte pro Satz mit den Werten vom letzten Mal (Strong, Hevy).
- Automatische Steigerung und Empfehlung für das Gewicht (Fitbod, Boostcamp). Bei GetFit! gibt es sie bisher nur als Text.
- Erfassung von RPE/RIR pro Satz (Hevy, Strong).
- Supersätze, Satzarten wie Drop-Satz und Muskelversagen (Hevy). Steht im Backlog.
- Rechner für Hantelscheiben und für Aufwärmsätze (Strong).
- Trainingsdauer und Zeitpunkt pro Satz (alle drei). Steht als Datenmodell 2 im Kanban.
- Fitbod-artige Erholung pro Muskel („Muskel bereit“) auf Basis der letzten Belastung.
- Filter in der Vorlagenauswahl, Vorschau und Programme über mehrere Wochen (Boostcamp).

**Was GetFit! besser macht:**
- Ein Muskelmodell nach Terminologia Anatomica mit Köpfen und Teilen. Keine der genannten Apps ist so genau und fachlich korrekt.
- Balance-Paare (12 Agonist/Antagonist-Paare, `planAnalysis.js:31-61`) schon bei der Planung, mit Hinweisen. Strong und Hevy haben das nicht.
- Echter Soll-Ist-Vergleich: Plantreue, Termintreue, häufig ausgelassene Übungen (Dashboard). Strong kennt nur „erledigt“.
- Sätze pro Seite (L/R) mit eigenen Rekorden. Das ist bei Hevy und Strong nur ein Notbehelf.
- Rückgängig statt Rückfrage, und ausgelassene geplante Übungen bleiben in der Statistik.
- Ehrliche Effektivsätze: Höchstwert pro Satz statt Doppelzählung von Köpfen.

---

## 5. Schnell behebbar (unter 1 Stunde)

1. **Volumen nur aus Kraftübungen zählen:** In `planAnalysis.js` `weeklyEntries`, `workoutPlan.js` `weeklySetsByMuscle` und `muscleLoad.js` `effectiveSets` alle Kategorien außer `strength` und `isometric` ausschließen (Problem 1, Kernteil).
2. **Ziel-RIR im Training zeigen:** In `WorkoutPage.jsx:76-80` `target()` um `· RIR ${set.planned.rirTarget}` ergänzen.
3. **`doneToday` nur bei `status === 'done'`** (`TodayPage.jsx:33`).
4. **Grammatik:** „1 Sätze“ → „1 Satz“. Plural in `planEditor.analysis.setsValue` (`translations.js:317/693`) und in der Dashboard-Karte.
5. **Vorlagendaten korrigieren:**
   - Sicherheitstext von `women_home_glutes_band_3` (Zeile 7050).
   - `safety.caution` von `boxing_technical_3` wie bei `home_heavybag_band_4`.
   - Name von `bodyweight_beginner_3`.
   - „definiert“ aus `women_pilates_strength_5`.
   - Niveau von `strength_hypertrophy_4` und `women_athlete_5` auf „intermediate“, bis es einen echten Kraftblock gibt.
6. **`pull_up` → `assisted_pull_up`** in `hypertrophy_fullbody_3`, `women_fullbody_strength_3`, `mobility_strength_3` und `women_strength_pilates_4`.
7. **Niveau, Ort und Tage als Chips** auf der Vorlagenkarte zeigen (`TemplatePicker.jsx:40-43`). Die Daten sind schon da.
8. **kg-Feld ausblenden** bei `stretch`, `mobility` und `yoga` im Editor und im Training.
9. **Bauchübungen ergänzen** in `hypertrophy_ppl_6` und `hypertrophy_5day_bodypart` (je 2 Einträge, siehe Tabelle).
10. **Text zu RIR und Lasterhöhung entfernen** bei `mobility_daily_light`, `women_pilates_beginner_3` und `women_mobility_stretch_4`. Ersatz: „Haltezeit oder Wiederholungen langsam steigern, schmerzfrei bleiben.“

Was die Grafik später leisten muss: Die Figur muss effektive Sätze aus **Kraftübungen** in 5 Stufen (`loadLevel`) zeigen und gedehnte Muskeln getrennt markieren, etwa mit einer anderen Schraffur. Sonst wiederholt die Figur den Fehler aus Problem 1. Tiefe Muskeln (`view: 'deep'`) brauchen eine eigene Darstellung, zum Beispiel gestrichelt oder als Schnitt.

---

## 6. Nachprüfung 14.11.

Geprüft wurden `src/data/inspiredTemplates.js` (5 Pläne) und `src/data/planTemplates.json` (Version 1.1.0). Gezählt wurde mit dem gleichen Skript wie oben. Die Zählung nur aus `strength` und `isometric` ist in `planAnalysis.js:78`, `workoutPlan.js:274` und `muscleLoad.js:103/137` umgesetzt. Damit ist Problem 1 erledigt.

### 6.1 Anime-Pläne

**D** = direkte Arbeitssätze pro Woche.

| ID | Note | Hauptproblem | Korrektur (konkret) |
|---|---|---|---|
| `anime_hero_100_start` | 5 | Es gibt keine Zugübung: Drücken 15 Sätze, Ziehen 0. Bei Push-ups 5 × 6–10 schaffen viele Einsteiger nicht einmal 6 saubere Wiederholungen. `easy_run` mit 20 min am Stück ist für Einsteiger (`level: beginner`) zu viel. | Jeden Tag `band_row` 3 × 12–15 dazu. Liegestütz mit erhöhten Händen 4 × 5–8. Laufen als Intervall starten: 8 × (1 min laufen / 1,5 min gehen) und bis Woche 6 auf 20 min am Stück steigern. |
| `anime_hero_100_full` | 3 | Brust D 40/Woche (10 × 10 Liegestütz, 4×), Rücken D 0: grobes Ungleichgewicht zwischen Drücken und Ziehen, die Schultern sind gefährdet. Laufen 4 × 60 min = 240 min/Woche ist ein großer Sprung vom Einstiegsplan (60 min). Montag und Dienstag sind identisch und folgen direkt aufeinander. | Jeden Tag `pull_up` oder `assisted_pull_up` 5 × 5–10 oder `band_row` 5 × 12–15. Laufen: 2 × 10 km und 2 × 5 km (~180 min). Tage auf Mo/Mi/Fr/Sa legen. Die Liegestütze an 2 der 4 Tage auf 5 × 10 halbieren. |
| `anime_boxer_roadwork` | 7 | Guter Mix. Kraft nur 1× pro Woche (Quads D 6, Rücken D 6). Kein Drücken über Kopf und keine Übung für den hinteren Deltamuskel, obwohl Boxen den vorderen stark belastet. | Am Donnerstag `face_pull` 3 × 12–20 (zu Hause: `reverse_fly` 3 × 12–20). Am Montag `goblet_squat` 2 × 10–12 nach dem Lauf. |
| `anime_scout_regiment` | 7 | Ziehen und Rumpf sind gut (Ziehen D 13, Drücken D 7). Beine nur 1× pro Woche (Quads D 6). `medicalClearance: false`, obwohl alle anderen Pläne mit Hängen und Laufen `true` haben. `face_pull` braucht einen Kabelzug, `band_row` ein Band: Die Ausrüstung ist gemischt. | Am Freitag `goblet_squat` 3 × 8–12. `medicalClearance: true`. Ausrüstung im Text nennen, oder `face_pull` durch `reverse_fly` ersetzen. |
| `anime_saiyan_strength` | 8 | Fachlich der beste Anime-Plan: echte Kraftblöcke (4 × 4–6, Kreuzheben 3 × 3–5), klare Steigerung in kg, 48 h zwischen schweren Einheiten. Brust D 7 und Seitlicher Deltamuskel D 3 sind etwas knapp. Keine Aufwärmsätze. | Am Donnerstag `cable_chest_fly` 2 × 10–15 (Brust D 9). Am Montag `dumbbell_lateral_raise` 2 × 12–20. Vor Bankdrücken, Kniebeuge und Kreuzheben je 2 Aufwärmsätze (`warmup`: 1 × 8 bei 50 %, 1 × 3 bei 75 %). Steigerung bei den Beinen pro Einheit besser 2,5 kg, 5 kg nur beim Kreuzheben. |

Für alle Anime-Pläne gilt: Die Hinweise zur Sicherheit („Fan-Plan, nicht offiziell“, Ruhetage, Abbruch bei Schmerzen) sind gut. Auch `PROGRESSION_RAMP` mit höchstens 10 % mehr Laufzeit pro Woche ist fachlich korrekt. Die Rechte an den Serien- und Figurennamen sind keine Fachfrage. Ich habe sie nicht geprüft.

### 6.2 Stichprobe der Korrekturen

| ID | Trifft den Vorschlag? | Bewertung neu | Rest |
|---|---|---|---|
| `strength_hypertrophy_4` | **Ja.** Kniebeuge und Bankdrücken 4 × 3–5, Kreuzheben 3 × 3–5 als erste Übung an Unterkörper B, Schulterdrücken mit Langhantel 3 × 4–6, Pause 210 s. Steigerung mit +2,5/5 kg und Deload alle 6–8 Wochen. Niveau jetzt „intermediate“. | 3 → 8 | Der RIR-Text sagt noch „ca. 2-3“ für alle Übungen. Besser: „Grundübungen RIR 2, Hilfsübungen RIR 1–2“. Keine Aufwärmsätze. |
| `hypertrophy_ppl_6` | **Ja.** `cable_crunch` 3 und `hanging_knee_raise` 3 (Bauch D 6). Push B mit `incline_barbell_press` und Seitheben 4 Sätze. Pull B mit `barbell_row`. Deload-Satz ist ergänzt. | 7 → 8 | Seitlicher Deltamuskel D 7: für „advanced“ noch knapp, 4 Sätze auch an Push A wären besser. |
| `hypertrophy_5day_bodypart` | **Größtenteils.** Dips 3, Seitheben 4, `cable_crunch` 3, `hanging_knee_raise` 3 und `dumbbell_curl` 3 sind umgesetzt. Brust D 12, Bizeps D 8. | 5 → 6 | Die Hauptschwäche bleibt: jeder Muskel nur 1× pro Woche, Quads D 9, Seitlicher Deltamuskel nur am Freitag (2 × 12–20 am Montag fehlt). Das Niveau „advanced“ passt deshalb weiter nicht. Entweder auf „intermediate“ setzen oder ein zweites Bein-Training (Quads) einbauen. |
| `women_fullbody_strength_3` | **Ja, Variante „Kraft“.** `barbell_squat` 3 × 5–8, `dumbbell_bench_press` 3 × 6–8, `assisted_pull_up`. Der Plan unterscheidet sich jetzt von `hypertrophy_fullbody_3`. | 4 → 6 | Der Text zur Steigerung ist noch der allgemeine („obere Grenze … klein steigern“). Für 5–8 Wiederholungen besser: „alle Sätze 8 sauber → +2,5 kg Kniebeuge, +1 kg pro Kurzhantel“. Keine Waden und keine Arbeit für den seitlichen Deltamuskel. |
| `women_home_glutes_band_3` | **Ja.** Sicherheitstext korrigiert (kein Hüftstoß mit Langhantel mehr), `glute_bridge` 4 Sätze, `pilates_clamshell` 2 × 15, `step_up` 3 × 10–12, Tagesname „Zuhause Ganzkörper“. Der Plan ist jetzt von `home_band_3` zu unterscheiden. | 4 → 7 | `pilates_clamshell` hat die Kategorie `pilates` und zählt deshalb nicht mehr für den mittleren Gesäßmuskel. Entweder `lateral_band_walk` auch am Freitag 2 × 15–20, oder die Kategorie der Muschel in `strength` ändern. `step_up` braucht eine Stufe: Das muss in der Ausrüstung stehen. |

Allgemein offen: In 23 Vorlagen steht als RIR-Text weiter überwiegend „ca. 2-3, bei längerer Erfahrung …“. Aufwärmsätze gibt es in keiner Vorlage.
