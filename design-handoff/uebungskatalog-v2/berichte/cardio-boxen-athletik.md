# Bericht Katalog-Helfer: cardio-boxen-athletik

Stand 14.11.2026. Datei: `uebungen/cardio-boxen-athletik.json`.

## Anzahl und Prüfergebnis

- 61 Übungen: 9 bestehend (IDs unverändert), 52 neu.
- `python -I scripts/validate_exercise_catalog.py cardio-boxen-athletik`: 0 Meldungen (alle Varianten-, Regressions- und Progressionsverweise sind aufgelöst, auch die in andere Bereiche).
- Phasen nach der Klarstellung vom 14.11. (23:40): Winkel gelten am **Ende** der Phase, erste Phase heißt `start` (share 0). Die Einträge waren schon als Schlüsselposen geschrieben (share = Zeit bis zum Erreichen der Pose); nur der Name der ersten Phase wurde auf `start` gesetzt. Bei einseitigen Übungen steht die andere Seite in `equipmentMotion`.

## IDs nach Kategorie

**cardio (23):** easy_run (bestehend), brisk_walk (bestehend), incline_treadmill_walk (bestehend), jump_rope (bestehend), treadmill_run, interval_run, stair_climbing, rowing_machine_row, stationary_bike_ride, elliptical_trainer, stair_climber_climb, ski_erg_pull, jump_rope_alternate_step, agility_ladder_two_feet_in, agility_ladder_in_out, jumping_jack, high_knees, butt_kicks, fast_mountain_climber, battle_rope_alternating_wave, battle_rope_double_wave, sled_push, sled_drag_backward.

**boxing (19):** heavy_bag_jab, heavy_bag_cross, heavy_bag_jab_cross, heavy_bag_hook, shadow_boxing (alle bestehend), heavy_bag_uppercut, heavy_bag_body_hook, heavy_bag_jab_cross_hook (1-2-3), heavy_bag_jab_cross_hook_cross (1-2-3-2), focus_mitt_jab_cross, double_end_bag_punches, speed_bag_rhythm, boxing_slip, boxing_roll, boxing_footwork_forward_back, boxing_footwork_lateral, heavy_bag_front_kick, heavy_bag_roundhouse_kick, heavy_bag_knee_strike.

**plyometric (13):** jump_rope_double_under, burpee (ohne Liegestütz), burpee_push_up, jump_squat, jump_lunge, box_jump, drop_landing (Step-down mit Landung), broad_jump, skater_jump, tuck_jump, medicine_ball_slam, medicine_ball_chest_pass, medicine_ball_rotational_throw.

**strength (6):** kettlebell_clean, kettlebell_snatch, dumbbell_thruster, barbell_thruster, hang_power_clean, man_maker.

## Konventionen für die Grafik (wichtig)

- **Boxen, Führhand-Schläge** (Jab, Haken, Körperhaken, Doppelendball): Winkel gelten für den schlagenden Arm, als rechte Seite notiert, d. h. die Daten beschreiben die Rechtsauslage. Standard in der App ist die Normalauslage (linker Fuß vorn) – die Grafik spiegelt (`mirrorAllowed: true`). Steht so in jedem `equipmentMotion`.
- **Boxen, Schlaghand-Schläge und Kombinationen** (Cross, Uppercut, 1-2, 1-2-3, 1-2-3-2, Pratzen, Schattenboxen, Beinarbeit): Winkel für die rechte (hintere) Seite in Normalauslage; die linke Hand führt Jab/Haken spiegelbildlich zu den Einzeleinträgen.
- `trunk_rotation` in Normalauslage im Stand +30 Grad (Brust nach rechts gedreht, linke Schulter vorn).
- Kontaktpunkte mit Zeitbezug heißen `…_at_impact` (z. B. `lead_knuckles_on_bag_at_impact`); Kontakt besteht nur im Treffermoment. Bei Sprüngen ist Flugdauer und Landefolge (Vorfuß → ganze Sohle) in `equipmentMotion`/Schritten beschrieben.
- Tritte: Winkel für das rechte (hintere) Trittbein in Normalauslage; das Standbein steht in `equipmentMotion`.

## Fehlende Geräte

| Vorschlag ID | Name | Begründung |
|---|---|---|
| `thai_pads` | Thai-Pads / Trittpolster | Frontkick, Roundhouse und Knie werden üblicherweise an Thai-Pads gehalten. Pratzen (`focus_mitts`) sind dafür nicht geeignet (Verletzungsgefahr für die haltende Person). Eingetragen vorerst am `heavy_bag`. |
| `shin_guards` | Schienbeinschoner | Für Tritt-Übungen empfohlen; im Text erwähnt, nicht als Gerät. |
| `stairs` | Treppe | `stair_climbing` nutzt eine echte Treppe; vorerst ohne Gerät eingetragen (`step` ist nur eine einzelne Stufe). |
| `bumper_plates` | Bumper-Scheiben / Heberplattform | Für `hang_power_clean` und `barbell_thruster` sicherheitsrelevant (Fallenlassen); im Text erwähnt. |
| `speed_rope` | Speed Rope | Für Doppelsprünge üblich; vorerst `jump_rope`. Optional, eher Variante als eigenes Gerät. |
| `wall_ball` | Wallball (weicher Medizinball) | Für Wandwürfe besser als harter Medizinball; vorerst `medicine_ball`. |

## Fehlende Muskeln

- **Hand- und Fußmuskeln** fehlen bewusst im Modell (siehe muskelmodell.md). Relevant hier: Fußgewölbe-Muskeln bei Sprüngen und Seilspringen; nicht eingetragen, kein Handlungsbedarf.
- **M. tibialis posterior** (fehlt bewusst): stabilisiert das Fußgewölbe bei allen Landungen und beim Laufen deutlich. Vorschlag: aufnehmen, wenn Lauf-/Sprungübungen genauer ausgewertet werden sollen.
- **M. flexor pollicis longus** (Daumenbeuger): beim Hakengriff des Hang Power Clean wichtig; fehlt bewusst, nur Hinweis.
- **Mm. rotatores / tiefe Rumpfrotatoren**: für Rotationswürfe und Boxen relevant; die Rotation ist über die schrägen Bauchmuskeln und Multifidus abgebildet.

## Strittige Punkte und Entscheidungen

- **Cardio-Muskeln**: Bei Geräten mit klarer Hauptarbeit (Rudern, Rad, Laufen, Stepper, Ski-Erg, Schlitten, Sprünge) sind Muskeln in `primary` eingetragen; bei `brisk_walk` und `shadow_boxing` (niedrige Belastung bzw. unspezifisch) nur `secondary`. Primär zählt laut README bei cardio/boxing/plyometric ohnehin nicht als Muskelaufbau-Satz.
- **Laufen**: Soleus/Gastrocnemius, Vasti und Gluteus maximus primär (Hauptbeiträge zu Stütz und Vortrieb nach Modellstudien, z. B. Hamner et al. 2010); ischiokrurale Muskeln sekundär, im Intervall-Lauf wegen höherer Geschwindigkeit primär.
- **Rudern**: Vasti und Gluteus maximus primär (Beinarbeit trägt den Großteil der Zugkraft), Latissimus ebenfalls primär; Rhomboidei/Trapezius sekundär. Gewichtung geschätzt.
- **Ski-Ergometer**: Latissimus, Teres major und Trizeps (alle drei Köpfe, Schulterstreckung mit fast gestrecktem Arm) primär – der laterale und mediale Kopf arbeiten hier vor allem isometrisch zur Ellbogenstabilisierung; vorsichtiger wäre nur der lange Kopf primär. Bei Bedarf herabstufen.
- **Boxen**: Für Jab/Cross sind Deltoid (vorn), Trizeps und Serratus anterior primär (Armstreckung + Protraktion); für Haken der Pectoralis major und die schrägen Bauchmuskeln. Die Kraft entsteht laut Literatur größtenteils aus Beinen und Rumpf (Lenetsky et al. 2013) – die Beinmuskeln sind deshalb sekundär bzw. Stabilisatoren. Bizeps/Brachialis beim Haken und Uppercut als Stabilisatoren (halten den Ellbogenwinkel isometrisch).
- **Battle-Rope-Wechselwellen**: `pattern` = `anti_rotation` gewählt (Rumpf hält gegen die wechselseitigen Armimpulse); kein passenderes Muster in der Liste. Alternativ wäre ein neues Muster `oscillation` denkbar.
- **Kettlebell-Clean/-Snatch, Thruster, Hang Power Clean, Man Maker**: als `strength` eingestuft (Last, Wiederholungen), damit sie in der App als Kraftsätze zählen. Wenn die App olympische Bewegungen nicht als Hypertrophie-Satz werten soll, auf `plyometric` umstellen.
- **Kicks**: Nur einfache Grundtechniken auf mittlerer Höhe, `level` mindestens `intermediate` (Roundhouse `advanced`), deutliche Sicherheits- und Kontraindikationstexte. Nicht an Pratzen (siehe Fehlende Geräte).
- **Beinarbeit, Slip, Roll**: `primary` leer, nur `secondary`/`stabilizers` – Muskelbeteiligung ist gering und verteilt.
- **Mountain Climber schnell**: eigene ID `fast_mountain_climber` (cardio), um keine Dopplung mit einer eventuellen Rumpf-Variante zu erzeugen.

## Quellen

- Haff G. G., Triplett N. T. (Hrsg.): NSCA – Essentials of Strength Training and Conditioning, 4th ed., Human Kinetics 2016.
- ACSM's Guidelines for Exercise Testing and Prescription, 11th ed., Wolters Kluwer 2021.
- Chu D. A., Myer G. D.: Plyometrics, Human Kinetics 2013.
- Dawes J., Roozen M. (Hrsg.): NSCA – Developing Agility and Quickness, Human Kinetics 2012.
- Lenetsky S., Harris N., Brughelli M. (2013): Assessment and contributors of punching forces in combat sports athletes. Strength Cond J 35(2):1–7.
- Hamner S. R., Seth A., Delp S. L. (2010): Muscle contributions to propulsion and support during running. J Biomech 43(14):2709–2716.
- Novacheck T. F. (1998): The biomechanics of running. Gait Posture 7(1):77–95.
- Perry J., Burnfield J. M.: Gait Analysis – Normal and Pathological Function, 2nd ed., SLACK 2010.
- Hug F., Dorel S. (2009): Electromyographic analysis of pedaling: a review. J Electromyogr Kinesiol 19(2):182–198.
- Burnfield J. M. et al. (2010): Similarity of joint kinematics and muscle demands between elliptical training and walking. Phys Ther 90(2):289–305.
- Concept2: Rowing technique und SkiErg technique (concept2.com).
- Hewett T. E. et al. (2005): Biomechanical measures of neuromuscular control and valgus loading of the knee predict ACL injury risk in female athletes. Am J Sports Med 33(4):492–501.
- Suchomel T. J., Comfort P., Stone M. H. (2015): Weightlifting pulling derivatives. Sports Med 45(6):823–839.
- Fountaine C. J., Schmidt B. J. (2015): Metabolic cost of rope training. J Strength Cond Res 29(4):889–893.
- Trecroci A. et al. (2015): Jump rope training: balance and motor coordination in preadolescent soccer players. J Sports Sci Med 14(4):792–798.
- Lake J. P., Lauder M. A. (2012): Kettlebell swing training improves maximal and explosive strength. J Strength Cond Res 26(8):2228–2233.
- Estevan I. et al. (2015): Impact force and time analysis influenced by execution distance in a roundhouse kick to the head in taekwondo. J Strength Cond Res 29(10):2851–2856.

Alle Zuordnungen sind redaktionell und nicht von einer Trainerin oder einem Trainer geprüft.
