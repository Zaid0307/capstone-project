# Mockup V5 · Prüfliste

25.11.2026 · Datei: [`mockup-v5.html`](mockup-v5.html). V4 bleibt unverändert. Grundlage ist die [Abnahme V4](../from-design/projekt-board/nachrichten/2026-11-15-e07-abnahme-mockup-v4.md): 8/10, nicht abgenommen.

Fortführung von [`mockup-v4-pruefliste.md`](mockup-v4-pruefliste.md). Unverändert gültig und hier nicht wiederholt:
- übernommene Muster mit Quellen (dort Abschnitt 3),
- Token-Liste (dort Abschnitt 5).

Neu in V5 sind die Klassen `.basis.warn` (Bernstein-Hinweis), `.ex-chip` (Auswahl-Chip, 44 px) und `.stage.compact`.

**Prüfansichten:**
- Bildschirme einzeln: `?solo=1` … `?solo=4`
- Muskelkarte: `&view=exercise|week|groups`
- Vorbelegung: `&mode=avg`
- `&confirm=N`, N-mal „bestätigen / Weiter“: `confirm=3` → Bankdrücken, `confirm=6` → Vorschau-Ende
- `?audit=1` misst:
  - Touch-Ziele,
  - Überlauf,
  - Randabstand,
  - **neu:** Schrift unter 11 px,
  - **neu:** umbrechender Tabellenkopf.

---

## 1. Herkunft der Zahlen: berechnet aus den echten App-Daten

Ein Skript (`compute.mjs`, liegt im Scratchpad, nicht im Repo) liest die echten App-Daten:
- `src/data/exerciseCatalog.json` mit den Rollen primary / secondary / stabilizers,
- `src/data/muscles.js` mit Gruppe, Teilen und Legacy-IDs.

Es rechnet mit denselben Regeln wie die App:
- **`groupSharesOf` / `weeklySetsByMuscle`:** pro Satz der höchste Wert je Gruppe, Primär 1, Sekundär ½.
- **`expand` / `muscleShare` / `weeklySetsFor`:** pro Satz der höchste Wert der Muskeln einer Fläche.
- **`loadLevel`** (`src/utils/analysis/muscleLoad.js`), 1:1 übernommen: 0 / unter 4 / unter 10 / bis 20 / über 20.
- Es zählen nur die Kategorien `strength` und `isometric`.

Die Ausgabe `data.json` steht unverändert als `DATA` in `mockup-v5.html`. Mockup und App haben damit dieselbe Quelle.

**Übungen (Katalog-IDs):**

| Plan | Übung | Arbeitssätze |
|---|---|---|
| A | `barbell_squat` | 3 |
| A | `barbell_bench_press` | 3 |
| A | `barbell_row` | 3 |
| A | `dumbbell_shoulder_press` | 3 |
| A | `reverse_lunge` (einseitig) | 2 |
| A | `plank` (isometric) | 2 |
| B | `romanian_deadlift` | 3 |
| B | `incline_dumbbell_press` | 3 |
| B | `cable_lat_pulldown` | 3 |
| B | `dumbbell_lateral_raise` | 3 |
| B | `leg_press` | 2 |
| B | `cable_crunch` | 2 |

**Woche 9.–15.11.:** Mo A, Mi B, Fr A (heute), also 2 × A + 1 × B.

Der Plan-Editor würde mit dem Wochenfaktor 1,5 je Tag rechnen (3 Trainings pro Woche auf 2 Tage verteilt). Die Wochenansicht zählt dagegen die tatsächlich gemachten Trainings.

### Ausgabe des Skripts

| Gruppe | Woche (2 × A + 1 × B) | Stufe `loadLevel` | je A | je B |
|---|---|---|---|---|
| Beine | 15 | 3 | 5 | 5 |
| Brust | 13,5 | 3 | 4,5 | 4,5 |
| Rücken | 15 | 3 | 4,5 | 6 |
| Schultern | 16,5 | 3 | 6 | 4,5 |
| Arme | 13,5 | 3 | 4,5 | 4,5 |
| Bauch | 6 | 2 | 2 | 2 |

| Ansicht | Fläche | Muskeln (IDs) | Woche | Stufe |
|---|---|---|---|---|
| vorne | Trapezmuskel | trapezius_descending | 4,5 | 2 |
| vorne | Deltamuskel | deltoid_anterior, deltoid_lateral | 13,5 | 3 |
| vorne | Großer Brustmuskel | pectoralis_major | 12 | 3 |
| vorne | Vorderer Sägemuskel | serratus_anterior | 4,5 | 2 |
| vorne | Bizeps, Oberarmmuskel | biceps_brachii, brachialis | 4,5 | 2 |
| vorne | Unterarm | flexor_carpi_radialis, palmaris_longus, flexor_carpi_ulnaris, flexor_digitorum_superficialis, flexor_digitorum_profundus, brachioradialis, pronator_teres | 6 | 2 |
| vorne | Gerader Bauchmuskel | rectus_abdominis | 6 | 2 |
| vorne | Schräge Bauchmuskeln | external_oblique, internal_oblique | 3 | 1 |
| vorne | Mm. vasti | vastus_lateralis, vastus_medialis, vastus_intermedius | 12 | 3 |
| vorne | M. rectus femoris | rectus_femoris | 6 | 2 |
| vorne | Adduktoren | adductor_longus, adductor_magnus, adductor_brevis, gracilis, pectineus | 7,5 | 2 |
| vorne | Schienbeinmuskeln | tibialis_anterior, extensor_digitorum_longus | 0 | 0 |
| hinten | Trapezmuskel | trapezius | 12 | 3 |
| hinten | Deltamuskel | deltoid_posterior, deltoid_lateral | 12 | 3 |
| hinten | Latissimus, großer Rundmuskel | latissimus_dorsi, teres_major | 9 | 2 |
| hinten | Rückenstrecker | erector_spinae | 1,5 | 1 |
| hinten | Trizeps | triceps_brachii | 7,5 | 2 |
| hinten | Unterarm | extensor_carpi_radialis_longus, extensor_carpi_radialis_brevis, extensor_digitorum, extensor_carpi_ulnaris, brachioradialis | 4,5 | 2 |
| hinten | Gesäß | gluteus_maximus, gluteus_medius | 15 | 3 |
| hinten | Oberschenkelrückseite | biceps_femoris, semitendinosus, semimembranosus | 3 | 1 |
| hinten | Adduktoren | adductor_magnus, gracilis | 7,5 | 2 |
| hinten | Wade | triceps_surae | 0 | 0 |

| Übung | Fläche → Rolle (vorne / hinten) |
|---|---|
| Langhantel-Kniebeuge (`barbell_squat`) | Gerader Bauchmuskel: Stabilisator, Schräge Bauchmuskeln: Stabilisator, Mm. vasti: Primär, M. rectus femoris: Sekundär, Adduktoren: Sekundär / Trapezmuskel: Stabilisator, Latissimus: Stabilisator, Rückenstrecker: Stabilisator, Gesäß: Primär, Oberschenkelrückseite: Stabilisator, Adduktoren: Sekundär, Wade: Stabilisator |
| Langhantel-Bankdrücken (`barbell_bench_press`) | Deltamuskel: Sekundär, Großer Brustmuskel: Primär, Vorderer Sägemuskel: Stabilisator, Gerader Bauchmuskel: Stabilisator / Trapezmuskel: Stabilisator, Trizeps: Sekundär |
| Vorgebeugtes Langhantelrudern (`barbell_row`) | Bizeps, Oberarmmuskel: Sekundär, Unterarm: Sekundär, Gerader Bauchmuskel: Stabilisator / Trapezmuskel: Primär, Deltamuskel: Sekundär, Latissimus: Primär, Rückenstrecker: Stabilisator, Unterarm: Sekundär, Gesäß: Stabilisator, Oberschenkelrückseite: Stabilisator |
| Schulterdrücken mit Kurzhanteln (`dumbbell_shoulder_press`) | Trapezmuskel: Sekundär, Deltamuskel: Primär, Großer Brustmuskel: Sekundär, Vorderer Sägemuskel: Sekundär, Gerader Bauchmuskel: Stabilisator / Trapezmuskel: Sekundär, Deltamuskel: Primär, Trizeps: Sekundär |
| Ausfallschritt rückwärts (`reverse_lunge`) | Unterarm: Stabilisator, Mm. vasti: Primär, M. rectus femoris: Sekundär, Adduktoren: Sekundär / Gesäß: Primär, Oberschenkelrückseite: Stabilisator, Adduktoren: Sekundär, Wade: Stabilisator |
| Unterarmstütz (`plank`) | Deltamuskel: Stabilisator, Großer Brustmuskel: Stabilisator, Vorderer Sägemuskel: Stabilisator, Gerader Bauchmuskel: Primär, Schräge Bauchmuskeln: Sekundär, Mm. vasti: Stabilisator, M. rectus femoris: Stabilisator / Gesäß: Stabilisator |

**Regel für die Rolle einer Fläche:** Die Fläche bekommt die stärkste Rolle, die einer ihrer Muskeln hat (Primär vor Sekundär vor Stabilisator). Beispiel: Beim Rudern ist der Trapezmuskel hinten primär, weil die Pars transversa primär ist.

**Ansicht „Woche“:** Jede Fläche hat die Farbe ihres **eigenen** Werts, zum Beispiel:
- Wade und Schienbein: 0, „nicht trainiert“,
- Rückenstrecker: 1,5, „wenig“,
- Oberschenkelrückseite: 3, „wenig“.

Der Tooltip jeder Fläche nennt den Wert. Die Liste darunter zeigt die Gruppen und trägt die Überschrift „Pro Gruppe (höchster Wert je Satz)“.

**Bewusste Abweichung von den Beispielwerten der Abnahme:** Beim Deltamuskel zählen je Ansicht nur seine **sichtbaren** Teile:
- vorne Pars clavicularis + acromialis = 13,5,
- hinten Pars spinalis + acromialis = 12.

Den ganzen Muskel (16,5) zeigt die Gruppe „Schultern“. Würde man vorne und hinten mit 16,5 färben, käme hinten mehr Belastung an, als Schulterdrücken und Seitheben dort wirklich erzeugen.

**Kniebeuge laut Katalog (`barbell_squat`):**
- **Primär:** Mm. vastus lateralis, medialis und intermedius, M. gluteus maximus.
- **Sekundär:** M. rectus femoris und M. adductor magnus. Der M. rectus femoris ist als eigener schraffierter Streifen auf der Oberschenkelvorderseite gezeichnet.
- **Stabilisatoren (16 Muskeln):**
  - ischiocrurale Muskulatur,
  - Mm. iliocostalis, longissimus und multifidus,
  - Mm. rectus abdominis, transversus abdominis, obliquus externus und internus,
  - Mm. gluteus medius und soleus,
  - M. latissimus dorsi, M. trapezius (Pars transversa), Mm. rhomboidei.

---

## 2. Beispiel-Datensatz: Änderungen gegenüber V4

**Kniebeuge:**
- Am 9.11. 60 kg × 12, 12, 12. Alle Sätze an der oberen Grenze, darum heute **62,5 kg**, Ziel **ab 8 Wdh.** (Entscheidung 3).
- Die offenen Sätze sind mit **62,5 × 8** vorbelegt.
- Satz 1 ist mit 62,5 × 11 bestätigt.
- **Durchschnitt** der letzten 5: 58 kg, gerundet 57,5 kg × 12, 11, 11. Weil heute schon 62,5 kg bestätigt sind, bleiben die offenen Sätze bei 62,5 kg; die Wdh. kommen aus dem Durchschnitt (11, 11). Der Hinweis sagt das.

**Bankdrücken** (neu ausgearbeitet, erreichbar über „Weiter: Bankdrücken“):

| Datum | kg | Wdh. |
|---|---|---|
| 21.10. | 47,5 | 10, 9, 9 |
| 26.10. | 47,5 | 11, 10, 10 |
| 30.10. | 47,5 | 12, 12, 12 → +2,5 |
| 4.11. | 50 | 9, 8, 8 |
| 9.11. | 50 | 9, 9, 8 |

- **Letztes Mal:** keine Steigerung. Vorbelegt 50 × 9, 9, 8, Hinweis „Gleiches Gewicht, Ziel: mehr Wdh.“
- **Durchschnitt:** 48,5 kg, gerundet 47,5 kg × 10, 10, 9. Es ist noch kein Satz bestätigt, darum wird gesenkt, aber mit Bernstein-Hinweis „weniger als letztes Mal (50 kg)“.
- **Ergebnis heute** (Zusammenfassung): 50 kg × 10, 9, 9.

**Regel der Vorbelegung (so auch für die App):**
1. Der Umschalter ändert nur **nicht bestätigte** Sätze.
2. **Letztes Mal:**
   - Alle Arbeitssätze an der oberen Grenze: Gewicht + Schrittweite, Wdh. = **untere Grenze**.
   - Sonst: gleiches Gewicht, Wdh. wie letztes Mal.
3. **Durchschnitt:**
   - Durchschnitt der letzten 5, auf die Schrittweite gerundet.
   - **Nie unter dem heute schon bestätigten Gewicht.**
   - Liegt der Wert unter dem letzten Gewicht, erscheint ein Hinweis.
4. Beim Wechsel zur nächsten Übung gilt wieder „Letztes Mal“.

**Wochenwerte:**

| Gruppe | V4 | V5 |
|---|---|---|
| Beine | 15 | 15 |
| Brust | 9 | **13,5** |
| Rücken | 12 | **15** |
| Schultern | 16,5 | 16,5 |
| Arme | 12 | **13,5** |
| Bauch | 6 | 6 |

Alle Gruppen außer Bauch sind „im Bereich“; Bauch ist „mäßig“.

Die übrigen Zahlen sind unverändert und in der Abnahme bestätigt: Zeitachse, Serie, Wochenziel, Bestleistung, Zusammenfassung.

---

## 3. Mängel der Abnahme und ihre Behebung

| # | Mangel | Behebung in V5 |
|---|---|---|
| 1 | Wochenwerte weichen von der App ab | Aus dem Katalog berechnet: Brust 13,5 · Rücken 15 · Arme 13,5. |
| 2 | Stufengrenzen anders als `loadLevel` | `levelOf` = `loadLevel` (unter 4). Beschriftung „unter 4 · 4–9,5“. Wörter „nicht trainiert · wenig · mäßig · im Bereich · viel“. |
| 3 | Nach Steigerung 12 Wdh. vorgeschlagen | Untere Grenze: 62,5 × **8**, Hinweis „Ziel: ab 8 Wdh.“ |
| 4 | Durchschnitt springt nach bestätigtem Satz um −5 kg | Nur offene Sätze ändern sich, nie unter das heute bestätigte Gewicht. Senken ohne bestätigten Satz nur mit Hinweis. |
| 5 | Wochen-Figur färbt nach Gruppe | Jede Fläche nach ihrem eigenen Wert (`weeklySetsFor`). Wade und Schienbein sind jetzt dunkel; Brustmuskel 12 = „im Bereich“. |
| 6 | Kniebeuge-Rollen anders als im Katalog | Rollen aller 6 Übungen von Plan A direkt aus `exerciseCatalog.json`, mit Stabilisatoren. Neue Flächen: M. rectus femoris, M. serratus anterior. Legende mit den deutschen Namen aus `muscles.js`. |
| 7 | „Weiter: Bankdrücken“ ohne Funktion | Wechselt zu Übung 2: Titel, Ziel, Rollenfigur, Bild, Vorwerte, „Übung 2 von 6“. Danach ein sichtbar deaktivierter Knopf „Vorschau endet hier“ (`aria-disabled`). |
| 8 | Muskelkarte „Übung“ fest auf Kniebeuge | Auswahl-Chip (44 px, `select`) mit den 6 Übungen des Trainings. Er folgt der aktuellen Übung im Training, bis du selbst wählst. |
| 9 | Schrift 9 px / 10 px | Timer „Pause“ und Badge „+2,5“ sind jetzt 11 px. Das Audit findet keine Schrift unter 11 px. |
| 10 | Gestrichelter Rand 2,99 : 1 | Vorschlagsrand in `--color-suggest` #8fb0ff: 6,88 : 1 auf der aktiven Zeile. |
| 11 | Tabellenkopf bricht um | „Zuletzt“ statt „Letztes Mal“, `nowrap`, Spalte „Satz“ 34 px; das Audit prüft den Umbruch. |

**Selbst gefunden und behoben:** Mit den langen Katalognamen passte die Rollen-Legende der Kniebeuge nicht mehr auf den Bildschirm.
- Gleichartige Namen werden zusammengefasst, z. B. „Äußerer, innerer, mittlerer Oberschenkelmuskel“ und „Trizeps (seitlicher, mittlerer, langer Kopf)“.
- Die Stabilisatoren nennen die sichtbaren Bereiche plus die Gesamtzahl der Muskeln.
- Die Bühne in der Ansicht „Übung“ ist kompakter.

---

## 4. Neue Kontraste und Audit

| Paar | Kontrast | Ergebnis |
|---|---|---|
| Vorschlagsrand #8fb0ff auf aktiver Satzzeile | 6,88 : 1 | ✔ ≥ 3 |
| Bernstein-Hinweis, Text #ffe2a8 | 12,59 : 1 | ✔ ≥ 4,5 |
| Auswahl-Chip: Rand / Text | 3,75 / 13,68 : 1 | ✔ |
| Belastungsstufe 1 #4466c4 auf Figur | 3,13 : 1 | ✔ |
| Deaktivierter Knopf, Text | 5,74 : 1 | ✔ |

**Audit** (`?audit=1`; Ausgangszustand, `&view=exercise` und `&confirm=6`):
- keine Befunde zu Zielgröße, Überlauf, Randabstand, Schriftgröße und Tabellenkopf,
- alle vier Bildschirme passen in 844 px.

---

## 5. Offene Punkte

1. **Stabilisatoren der Kniebeuge:** Mockup und App nutzen jetzt dieselben Katalogdaten. Wem die 16 Stabilisatoren zu breit sind, ändert sie im Katalog, nicht im Mockup.
2. **Ausgearbeitete Übungen:** Nur Kniebeuge und Bankdrücken. Ab Übung 3 endet die Vorschau sichtbar.
3. **Abweichung beim Durchklicken:** Wer die Kniebeugen-Vorschläge unverändert abhakt, erhält 62,5 × 11, 8, 8. Die feste Zusammenfassung zeigt die eingetippten Werte 11, 10, 10.
4. **Weiter offen aus V4:**
   - echte Figuren (Mann/Frau, antippbare Köpfe und Anteile),
   - Bildschirm „Pläne“,
   - Schrittweite je Übung.
