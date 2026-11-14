# Bericht Bereich mobility-dehnen-yoga

Stand 14.11.2026. Datei: `design-handoff/uebungskatalog-v2/uebungen/mobility-dehnen-yoga.json`.

## Ergebnis

- **83 Übungen**: 10 bestehend (IDs unverändert), 73 neu.
- Kategorien: 33 `yoga`, 25 `stretch`, 25 `mobility` (davon 7 Faszienrolle).
- Prüfung `python -I scripts/validate_exercise_catalog.py mobility-dehnen-yoga`: **0 Meldungen**. Alle Verweise lösen auf; Verweise auf andere Bereiche nur auf dort vorhandene IDs (`bodyweight_squat`, `goblet_squat`, `glute_bridge`, `pilates_bridge`, `push_up`, `high_plank`, `bird_dog`, `dead_bug`, `v_up`, `hanging_knee_raise`).

## Konventionen

- **Gelenkwinkel** gelten am Ende jeder Phase (Schlüsselpose), erste Phase `start` mit `share` 0. Gehaltene Haltungen (`loop: hold`) haben genau eine Phase `start` = Haltepose.
- **Seiten:** Winkel für die rechte Seite. Bei einseitigen bzw. asymmetrischen Übungen ist rechts die gedehnte bzw. arbeitende Seite (Yoga-Standhaltungen: vorderes Bein; Dehnungen im Halbkniestand: hinteres Bein; `low_lunge_pose`/`lizard_pose`: vorderes Bein). Die Haltung der linken Seite steht als „Linke Seite: …“ mit ungefähren Winkeln am Ende von `equipmentMotion`.
- **`shoulder_horizontal_abduction`:** 0 = Arm seitlich in der Frontalebene (zusammen mit `shoulder_abduction` 90); Arm quer vor dem Körper etwa −120 (Cross-Body-Stretch). Bitte bestätigen oder in `gelenke.json` festlegen.
- `hip_flexion` = Winkel Oberschenkel–Becken, `trunk_flexion` = Wirbelsäule gegenüber dem Becken (nicht die Neigung im Raum).
- **Bestehende Übungen überarbeitet:** Gedehnte Muskeln stehen jetzt in `stretched` statt `primary` (`child_pose`, `hip_flexor_stretch`, `standing_calf_stretch`, `wall_pec_stretch`, `seated_glute_stretch`, `supine_hamstring_strap_stretch`). `downward_facing_dog`: Haltearbeit (Deltoideus vorn, Serratus) `primary`, Beinrückseite, Wade, Latissimus, Teres major `stretched`. `thoracic_open_book`: Brustmuskel und vorderer Deltoideus `stretched`, schräge Bauchmuskeln `secondary` (aktive Rotation). `seated_glute_stretch`: Gerät `mat` → `chair` (die Beschreibung war schon Sitzen auf einem Stuhl). `standing_shoulder_car`: Schulterblattdreher (Serratus, Trapezius ab-/aufsteigend) und Rotatoren `secondary`, Supraspinatus Stabilisator.

## Übungen

| ID | Name | Kategorie | Status |
|---|---|---|---|
| `downward_facing_dog` | Herabschauender Hund | yoga | bestehend |
| `supine_hamstring_strap_stretch` | Beinrückseiten-Dehnung mit Gurt | stretch | bestehend |
| `standing_shoulder_car` | Schulter-CARs im Stand | mobility | bestehend |
| `cat_cow` | Katze-Kuh | mobility | bestehend |
| `hip_flexor_stretch` | Hüftbeuger-Dehnung im Halbkniestand | stretch | bestehend |
| `thoracic_open_book` | Open Book für die Brustwirbelsäule | mobility | bestehend |
| `child_pose` | Kindhaltung | yoga | bestehend |
| `seated_glute_stretch` | Gesäß-Dehnung im Sitzen | stretch | bestehend |
| `standing_calf_stretch` | Waden-Dehnung an der Wand | stretch | bestehend |
| `wall_pec_stretch` | Brust-Dehnung an der Wand | stretch | bestehend |
| `hip_car` | Hüft-CARs im Stand | mobility | neu |
| `hip_90_90_switch` | 90/90-Hüftwechsel | mobility | neu |
| `worlds_greatest_stretch` | World's Greatest Stretch | mobility | neu |
| `thread_the_needle` | Thread the Needle | mobility | neu |
| `quadruped_thoracic_rotation` | Brustwirbel-Rotation im Vierfüßler | mobility | neu |
| `shoulder_dislocate_band` | Schulter-Dislocates mit Band | mobility | neu |
| `wall_slide` | Wall Slides (Rücken zur Wand) | mobility | neu |
| `knee_to_wall_ankle_mobilization` | Sprunggelenk-Mobilisation Knie zur Wand | mobility | neu |
| `standing_hip_circle` | Hüftkreisen im Stand | mobility | neu |
| `inchworm` | Inchworm | mobility | neu |
| `cossack_squat_mobility` | Cossack Squat als Mobility | mobility | neu |
| `deep_squat_hold` | Tiefe Hocke halten | mobility | neu |
| `neck_car` | Nackenmobilisation (Halbkreise) | mobility | neu |
| `leg_swing_sagittal` | Beinpendel vor und zurück | mobility | neu |
| `quadruped_wrist_rock` | Handgelenk-Mobilisation im Vierfüßler | mobility | neu |
| `standing_quad_stretch` | Oberschenkel-Dehnung im Stand | stretch | neu |
| `side_lying_quad_stretch` | Oberschenkel-Dehnung in Seitlage | stretch | neu |
| `couch_stretch` | Couch Stretch | stretch | neu |
| `standing_hamstring_stretch` | Beinrückseiten-Dehnung im Stand | stretch | neu |
| `butterfly_stretch` | Schmetterling | stretch | neu |
| `frog_stretch` | Froschposition | stretch | neu |
| `supine_figure_four_stretch` | Gesäß-Dehnung im Liegen (Figur Vier) | stretch | neu |
| `half_kneeling_hip_flexor_overhead_reach` | Hüftbeuger-Dehnung kniend mit Arm über Kopf | stretch | neu |
| `bench_lat_stretch` | Latissimus-Dehnung an der Bank | stretch | neu |
| `overhead_triceps_stretch` | Trizeps-Dehnung über Kopf | stretch | neu |
| `wall_biceps_stretch` | Bizeps-Dehnung an der Wand | stretch | neu |
| `wrist_flexor_stretch` | Unterarmbeuger-Dehnung | stretch | neu |
| `wrist_extensor_stretch` | Unterarmstrecker-Dehnung | stretch | neu |
| `doorway_pec_stretch_low` | Brust-Dehnung im Türrahmen, tief | stretch | neu |
| `doorway_pec_stretch_mid` | Brust-Dehnung im Türrahmen, mittel | stretch | neu |
| `doorway_pec_stretch_high` | Brust-Dehnung im Türrahmen, hoch | stretch | neu |
| `neck_side_stretch` | Nacken-Dehnung seitlich | stretch | neu |
| `soleus_wall_stretch` | Waden-Dehnung mit gebeugtem Knie (Soleus) | stretch | neu |
| `supine_spinal_twist` | Liegende Drehung | stretch | neu |
| `cross_body_shoulder_stretch` | Schulter-Dehnung vor dem Körper | stretch | neu |
| `foam_roll_quadriceps` | Faszienrolle Oberschenkel vorn | mobility | neu |
| `foam_roll_it_band` | Faszienrolle Oberschenkel seitlich | mobility | neu |
| `foam_roll_hamstrings` | Faszienrolle Oberschenkel hinten | mobility | neu |
| `foam_roll_calves` | Faszienrolle Wade | mobility | neu |
| `foam_roll_glutes` | Faszienrolle Gesäß | mobility | neu |
| `foam_roll_thoracic_spine` | Faszienrolle Brustwirbelsäule | mobility | neu |
| `foam_roll_lats` | Faszienrolle Latissimus | mobility | neu |
| `mountain_pose` | Berghaltung | yoga | neu |
| `standing_forward_fold` | Stehende Vorwärtsbeuge | yoga | neu |
| `half_forward_fold` | Halbe Vorwärtsbeuge | yoga | neu |
| `warrior_one_pose` | Krieger I | yoga | neu |
| `warrior_two_pose` | Krieger II | yoga | neu |
| `warrior_three_pose` | Krieger III | yoga | neu |
| `extended_side_angle_pose` | Erweiterter Seitwinkel | yoga | neu |
| `triangle_pose` | Dreieck | yoga | neu |
| `revolved_triangle_pose` | Gedrehtes Dreieck | yoga | neu |
| `tree_pose` | Baum | yoga | neu |
| `half_moon_pose` | Halbmond | yoga | neu |
| `chair_pose` | Stuhl | yoga | neu |
| `chaturanga` | Chaturanga (tiefer Stütz) | yoga | neu |
| `upward_facing_dog` | Heraufschauender Hund | yoga | neu |
| `cobra_pose` | Kobra | yoga | neu |
| `sphinx_pose` | Sphinx | yoga | neu |
| `locust_pose` | Heuschrecke | yoga | neu |
| `bow_pose` | Bogen | yoga | neu |
| `bridge_pose` | Brücke (Yoga) | yoga | neu |
| `wheel_pose` | Rad | yoga | neu |
| `pigeon_pose` | Taube | yoga | neu |
| `lizard_pose` | Eidechse | yoga | neu |
| `low_lunge_pose` | Niedriger Ausfallschritt | yoga | neu |
| `seated_forward_fold` | Sitzende Vorwärtsbeuge | yoga | neu |
| `head_to_knee_pose` | Kopf-zum-Knie-Haltung | yoga | neu |
| `seated_twist_pose` | Gedrehter Sitz | yoga | neu |
| `boat_pose` | Boot | yoga | neu |
| `happy_baby_pose` | Glückliches Baby | yoga | neu |
| `shoulder_stand` | Schulterstand (Kerze) | yoga | neu |
| `plow_pose` | Pflug | yoga | neu |
| `sun_salutation_a` | Sonnengruß A | yoga | neu |

## Fehlende Geräte

- **`door_frame` (Türrahmen)** – für `doorway_pec_stretch_low/mid/high`; vorerst `wall` (Wandecke funktioniert gleich). Vorschlag: kind `surface`.
- **`dowel` (Gymnastikstab/PVC-Stab)** – klassisches Gerät für Schulter-Dislocates, Hüftscharnier-Übungen und Ausrichtung; `shoulder_dislocate_band` nutzt vorerst `resistance_band`. Vorschlag: kind `mobility_aid`, dann Variante `shoulder_dislocate_dowel`.
- **`yoga_blanket` (Yoga-Decke)** – Unterlage unter den Schultern in Schulterstand/Pflug und unter dem Gesäß bei Sitzhaltungen; vorerst `pad`. Für die Grafik wichtig (gefaltete Decke = feste, kantige Erhöhung). Vorschlag: kind `mobility_aid`.
- **`massage_ball` (Faszienball)** – für Fußsohle, Gesäß, Brustmuskel; nicht verwendet, Übungen ließen sich ergänzen. Vorschlag: kind `mobility_aid`.
- **`slant_board` (Keilbrett)** – Fersenerhöhung bei tiefer Hocke und Wadendehnung; im Text vorerst Hantelscheibe/Handtuch. Vorschlag: kind `surface`.
- **`yoga_bolster` (Bolster)** – für restorative Haltungen; optional.

## Fehlende Muskeln

- **Mm. scaleni** – werden bei `neck_side_stretch` wesentlich mitgedehnt und bei `neck_car` aktiv; vorerst nur Trapezius absteigend, Levator scapulae und SCM (Schlüsselbeinkopf). Vorschlag: `scalenus_anterior/medius/posterior` (oder Ganzes `scaleni`), Gruppe `back` wie die übrigen Halsmuskeln.
- **M. semispinalis capitis/cervicis, Mm. suboccipitales** – Hauptgedehnte der Nackenbeugung in Schulterstand und Pflug; vorerst Splenius capitis/cervicis und Trapezius absteigend.
- **M. tibialis posterior, M. flexor hallucis longus, M. flexor digitorum longus** – werden in allen Waden-/Sprunggelenksdehnungen mitgedehnt; nicht eingetragen.
- **Tiefe Hüftaußenrotatoren (Mm. gemelli, M. obturatorius internus/externus, M. quadratus femoris)** – wesentlich bei Figur Vier, Taube, 90/90; vorerst nur Piriformis.
- **Zwerchfell, Zwischenrippenmuskeln** – Atemmuskeln im Yoga; ohne sie lässt sich die Totenstellung nicht mit Muskeln beschreiben (siehe unten).
- **M. popliteus, Fußmuskulatur** – nur der Vollständigkeit halber.

## Strittige Punkte und Entscheidungen

1. **Faszienrolle** (`foam_roll_*`): Kategorie `mobility`, `primary` leer, die gerollten Muskeln in `stretched` – gemäß Vorgabe. Begründung: Rollen ist keine Dehnung im engeren Sinn; die Wirkung (kurzfristig mehr Beweglichkeit, weniger Spannungsgefühl) entsteht vor allem über nervale Mechanismen, nicht durch Verlängerung oder „Lösen“ von Faszien (Behm & Wilke 2019; Wiewelhove et al. 2019). `stretched` heißt hier „behandelter Muskel“; der Hinweis steht in jedem `safety`-Text. Der Tractus iliotibialis ist kein Muskel; bei `foam_roll_it_band` stehen Vastus lateralis und Tensor fasciae latae. Vorschlag: später eigene Rolle `treated`.
2. **Totenstellung (Savasana) weggelassen.** Kein Muskel des Modells wird begründbar gedehnt oder arbeitet; einen zu erfinden wäre falsch. Falls gewünscht: Formatausnahme (Yoga ohne Muskeln wie Cardio) oder Zwerchfell ins Muskelmodell.
3. **Keine Doppelungen zwischen Dehnen und Yoga:** Schmetterling = Baddha Konasana (`butterfly_stretch`, `stretch`, Sanskrit in `aliases`); Liegende Drehung = Wirbelsäulen-Drehdehnung = Supta Matsyendrasana (`supine_spinal_twist`, `stretch`); Piriformis liegend = liegende Taube (`supine_figure_four_stretch`); Tiefe Hocke = Malasana (`deep_squat_hold`, `mobility`). Brettstellung gibt es als `high_plank` (rumpf-pilates); hier nur `chaturanga` mit Verweis.
4. **ID-Abgrenzung:** `cossack_squat_mobility` (nicht `cossack_squat`), damit beine-gesaess eine Kraftvariante unter `cossack_squat` anlegen kann. `wall_slide` ist die Rücken-zur-Wand-Variante (Wall Angel); eine Gesicht-zur-Wand-Variante (Serratus-Fokus, Hardwick et al. 2006) bräuchte eine eigene ID.
5. **Pectoralis minor:** bei `wall_pec_stretch` (entspricht dem „unilateral self-stretch“ bei Borstad & Ludewig 2006) und `doorway_pec_stretch_mid/high` als gedehnt geführt; Muraki et al. (2009, Leichenstudie) fanden die größte Verlängerung bei Retraktion und hoher Armhebung, daher nicht bei der tiefen Variante. Zuordnung der Brustmuskelteile zu den drei Höhen (tief = Schlüsselbeinteil, mittel = Brustbein-Rippen-Teil, hoch = untere Anteile) folgt dem Faserverlauf; direkte Messungen je Teil fehlen.
6. **Piriformis in Figur Vier/Taube:** Oberhalb etwa 60–90 Grad Hüftbeugung kehrt sich seine Rotationsfunktion um; Außenrotation in Beugung dehnt ihn trotzdem (Neumann). Verbreitet, aber nicht unumstritten; beibehalten.
7. **Gluteus medius/minimus** bei Außenrotationsdehnungen: vordere Fasern sind Innenrotatoren und werden gedehnt; das Modell teilt die Muskeln nicht, daher ganz in `stretched`.
8. **Berghaltung:** `primary` = Soleus (wichtigster Haltemuskel im ruhigen Stand), Rest Stabilisatoren; geringe Aktivität.
9. **Dreieck:** Schräge Bauchmuskeln und Quadratus lumborum `primary` (halten den seitlich geneigten Rumpf), Beinrückseite und Adduktoren `stretched`. Seitenunterschiede (oben arbeitend, unten verkürzt) kann das seitenlose Modell nicht abbilden – gilt ebenso für Drehungen.
10. **Beinpendel:** Hüftbeuger und Gluteus maximus `primary`, Beinrückseite `stretched`, Rectus femoris `secondary` (wird beim Rückschwung auch gedehnt – nur eine Rolle möglich). Seitliches Beinpendel bewusst weggelassen, weil Beweger und Gedehnte (Adduktoren) sich nicht sauber trennen lassen.
11. **Schulterstand und Pflug:** `advanced`, Deckenunterlage, ausführliche Sicherheitshinweise und Kontraindikationen; Halswirbelsäulen-Beugung etwa 70 Grad (mit Decken). Chaturanga mit Hinweis auf häufige Schulterreizungen (Cramer et al. 2018).
12. **Sonnengruß A** als ein Eintrag (`loop: repeat`, 12 Phasen, Dosis 3–6 Runden); der Hund (5 Atemzüge) hat `share` 0,45.

## Quellen

- Long R.: The Key Poses of Yoga (Scientific Keys Vol. II), Bandha Yoga Publications 2009
- Yoga Journal – Pose Library, https://www.yogajournal.com/poses/
- Ni M. et al. (2014): Muscle utilization patterns vary by skill levels of the practitioners across specific yoga poses (asanas). Complement Ther Med 22(4):662–669
- Bandy W. D., Irion J. M. (1994): The effect of time on static stretch on the flexibility of the hamstring muscles. Phys Ther 74(9):845–850
- ACSM's Guidelines for Exercise Testing and Prescription, 11th ed., Wolters Kluwer 2021 (Kapitel Flexibility)
- Kendall F. P. et al.: Muscles – Testing and Function with Posture and Pain, 5th ed., Lippincott Williams & Wilkins 2005
- Functional Range Conditioning: Controlled Articular Rotations (CARs), https://functionalanatomyseminars.com
- Neumann D. A.: Kinesiology of the Musculoskeletal System, 3rd ed., Elsevier 2017
- Kisner C., Colby L. A., Borstad J.: Therapeutic Exercise – Foundations and Techniques, 7th ed., F. A. Davis 2017
- McGill S. M.: Low Back Disorders, 3rd ed., Human Kinetics 2016
- Ylinen J.: Stretching Therapy for Sport and Manual Therapies, Churchill Livingstone 2008
- Iyengar B. K. S.: Light on Yoga, Schocken Books 1979 (Haltungen und Sanskrit-Namen)
- Borstad J. D., Ludewig P. M. (2006): Comparison of three stretches for the pectoralis minor muscle. J Shoulder Elbow Surg 15(3):324–330
- Haff G. G., Triplett N. T. (Hrsg.): NSCA Essentials of Strength Training and Conditioning, 4th ed., Human Kinetics 2016 – Warm-up and Flexibility Training
- Opplert J., Babault N. (2018): Acute effects of dynamic stretching on muscle flexibility and performance: an analysis of the current literature. Sports Med 48(2):299–325
- Hardwick D. H. et al. (2006): A comparison of serratus anterior muscle activation during a wall slide exercise and other traditional exercises. J Orthop Sports Phys Ther 36(12):903–910
- Bennell K. L. et al. (1998): Intra-rater and inter-rater reliability of a weight-bearing lunge measure of ankle dorsiflexion. Aust J Physiother 44(3):175–180
- Behm D. G. et al. (2016): Acute effects of muscle stretching on physical performance, range of motion, and injury incidence in healthy active individuals: a systematic review. Appl Physiol Nutr Metab 41(1):1–11
- Muraki T. et al. (2009): Lengthening of the pectoralis minor muscle during passive shoulder motions and stretching techniques: a cadaveric biomechanical study. Phys Ther 89(4):333–341
- Wiewelhove T. et al. (2019): A meta-analysis of the effects of foam rolling on performance and recovery. Front Physiol 10:376
- Behm D. G., Wilke J. (2019): Do self-myofascial release devices release myofascia? Rolling mechanisms: a narrative review. Sports Med 49(8):1173–1181
- Cramer H., Ostermann T., Dobos G. (2018): Injuries and other adverse events associated with yoga practice: a systematic review of epidemiological studies. J Sci Med Sport 21(2):147–154
