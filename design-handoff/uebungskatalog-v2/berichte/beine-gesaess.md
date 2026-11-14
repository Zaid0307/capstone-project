# Bericht Übungskatalog V2 – Bereich beine-gesaess

Stand 14.11.2026. Datei: `uebungen/beine-gesaess.json`.

## Ergebnis

- **75 Übungen**: 20 bestehend (IDs unverändert), 55 neu.
- Prüfung `python -I scripts/validate_exercise_catalog.py beine-gesaess`: **0 Meldungen** (keine Fehler, keine offenen Varianten-Verweise). Verweise in andere Bereiche nur auf bestehende IDs `pilates_bridge`, `pilates_clamshell`, `pilates_side_kick` (rumpf-pilates); alle drei sind im Katalog vorhanden.
- Gesamtprüfung: keine doppelten IDs. Die einzige Meldung (`dumbbell_shrug` fehlt) gehört zu brust-ruecken.

## Liste der IDs

| ID | Status | Kategorie | Muster |
|---|---|---|---|
| bodyweight_squat, barbell_squat, goblet_squat, band_squat, leg_press, hack_squat | bestehend | strength | squat |
| front_squat, smith_machine_squat, box_squat, kettlebell_goblet_squat, sumo_squat, assisted_pistol_squat, pistol_squat, sissy_squat, single_leg_press | neu | strength | squat |
| wall_sit | neu | isometric | squat |
| romanian_deadlift, dumbbell_rdl, conventional_deadlift, banded_good_morning, hip_thrust, glute_bridge | bestehend | strength | hinge |
| sumo_deadlift, trap_bar_deadlift, dumbbell_deadlift, single_leg_rdl, barbell_good_morning, kettlebell_swing, machine_hip_thrust, single_leg_hip_thrust, band_hip_thrust, dumbbell_hip_thrust, single_leg_glute_bridge, feet_elevated_glute_bridge, glute_bridge_march, frog_pump | neu | strength | hinge |
| bulgarian_split_squat, reverse_lunge, step_up | bestehend | strength | lunge |
| forward_lunge, lateral_lunge, walking_lunge, curtsy_lunge, barbell_reverse_lunge, cable_reverse_lunge, split_squat, lateral_step_up, barbell_step_up | neu | strength | lunge |
| leg_extension, lying_leg_curl | bestehend | strength | isolation |
| single_leg_extension, seated_leg_curl, standing_leg_curl, nordic_hamstring_curl, stability_ball_leg_curl | neu | strength | isolation |
| lateral_band_walk | bestehend | strength | locomotion |
| monster_walk | neu | strength | locomotion |
| hip_abduction_machine, cable_hip_abduction, side_lying_hip_abduction, fire_hydrant | neu | strength | isolation |
| hip_adduction_machine, cable_hip_adduction, side_lying_hip_adduction | neu | strength | isolation |
| copenhagen_plank | neu | isometric | anti_lateral_flexion |
| cable_glute_kickback | bestehend | strength | isolation |
| machine_glute_kickback, band_glute_kickback, quadruped_glute_kickback | neu | strength | isolation |
| calf_raise | bestehend | strength | isolation |
| standing_calf_raise_machine, seated_calf_raise, single_leg_calf_raise, leg_press_calf_raise, tibialis_raise | neu | strength | isolation |

## Fehlende Geräte

| Vorschlag ID | Name | Begründung |
|---|---|---|
| `belt_squat_machine` | Belt-Squat-Maschine | Kniebeuge ohne Last auf der Wirbelsäule; vom Auftrag gewünscht, deshalb nicht angelegt. |
| `pendulum_squat_machine` | Pendel-Kniebeuge-Maschine | Wie oben; Bewegung auf einem Kreisbogen, braucht eigene Grafik. |
| `sliders` | Gleitscheiben | Für Slider-Leg-Curl, Gleit-Ausfallschritte, Adduktoren-Gleiten; nicht angelegt. |
| `nordic_bench` | Nordic-Curl-Bank / Fersenhalterung | `nordic_hamstring_curl` steht vorerst mit `pad`; Fersen werden laut Text unter einer Halterung oder von einer Partnerin fixiert. |
| `tibialis_bar` | Tibialis-Stange | `tibialis_raise` steht vorerst mit `wall` (Körpergewicht-Variante). |
| `sissy_squat_bench` | Sissy-Squat-Bank | `sissy_squat` steht vorerst mit `wall` (Hand an der Wand). |
| `standing_leg_curl_machine` / `seated_leg_curl_machine` | Beinbeuger stehend / sitzend | `leg_curl_machine` deckt liegend, sitzend und stehend ab; die drei Geräte sehen für die Grafik ganz unterschiedlich aus. Vorschlag: eigene IDs oder `leg_curl_machine` mit Varianten-Feld. |
| `ghd` | Glute-Ham-Developer | Für Glute-Ham-Raise und Nordic-Varianten (nicht angelegt). |
| `ankle_strap` | Fußschlaufe für den Kabelzug | Bei allen Kabel-Kickbacks, -Abduktionen, -Adduktionen nötig; aktuell nur im Text und als Kontakt `strap_on_right_ankle`. |

## Fehlende Muskeln

| Muskel | Wofür | Vorschlag |
|---|---|---|
| M. tibialis posterior | Stabilisator bei Wadenheben (Inversion, Fußgewölbe), einbeinigen Übungen | Aufnehmen (tief, Gruppe legs). |
| M. flexor hallucis longus, M. flexor digitorum longus | Plantarflexion beim Wadenheben, Zehenstand | Aufnehmen, tief. |
| M. extensor hallucis longus | Mitarbeit beim Tibialis Raise | Aufnehmen. |
| Mm. gemelli, M. obturatorius internus/externus, M. quadratus femoris | Tiefe Außenrotatoren: Frog Pump, Fire Hydrant, Clamshell, Sumo-Varianten | Aufnehmen; aktuell nur `piriformis` stellvertretend. |
| M. popliteus | Kniestabilisierung bei tiefen Kniebeugen, Nordic Curl | Optional. |
| M. plantaris | Kleiner Wadenmuskel | Optional (fehlt bei etwa 10 %). |

## Fachliche Entscheidungen und strittige Punkte

- **Rückenstrecker bei Kniebeugen**: früher sekundär, jetzt `stabilizers` (sie halten die Wirbelsäule isometrisch, bewegen aber nicht). Bei Kreuzheben, RDL, Good Morning und Swing stehen `iliocostalis` und `longissimus` als **sekundär**, weil sie dort sehr stark arbeiten. Bei `conventional_deadlift` und `banded_good_morning` waren sie bisher primär; nach der Regel „im Zweifel die vorsichtigere Rolle“ jetzt sekundär. `multifidus` ist überall Stabilisator.
- **Ischiokrurale in der Kniebeuge**: `stabilizers` (Ko-Kontraktion, kaum Netto-Hüftstreckungsbeitrag beim Aufstehen; Schoenfeld 2010).
- **Biceps femoris, kurzer Kopf**: nur bei Kniebeugern (Leg Curls, Nordic, Ball-Curl); bei Hüftstreckern nur der lange Kopf (wie in docs/muskelmodell.md).
- **Rectus femoris**: bei Kniebeugen/Ausfallschritten sekundär, bei `leg_extension`, `single_leg_extension` und `sissy_squat` primär (Hüfte gestreckt, Knie beugt → zweigelenkiger Muskel voll beteiligt).
- **Gluteus medius bei Ausfallschritten und Step-ups**: bisher sekundär, jetzt Stabilisator (frontale Beckenkontrolle); bei `curtsy_lunge`, `lateral_step_up` sekundär, weil er dort deutlich gegen Adduktion/Innenrotation arbeitet.
- **Wadenmuskeln beim Step-up**: bisher sekundär, jetzt nur `soleus` als Stabilisator; der Anteil der Plantarflexion ist beim sauberen Step-up gering.
- **Seated Calf Raise**: `soleus` primär, Gastrocnemius sekundär (bei 90 Grad Kniebeugung aktiv insuffizient).
- **Abduktoren-Maschine / Fire Hydrant**: Bei gebeugter Hüfte trägt der obere Anteil des Gluteus maximus und der Piriformis zur Abduktion bei (Neumann 2010). Gluteus maximus beim Fire Hydrant primär, an der Maschine sekundär – geschätzt.
- **Hüftbeuger beim Bulgarian Split Squat**: `psoas_major` und `iliacus` als `stretched` (hinteres Bein); die Dehnung ist ein Nebeneffekt, aber in der Literatur oft genannt.
- **Lateral Lunge**: `gracilis` als `stretched` (gestrecktes Bein, zweigelenkig); andere Adduktoren stehen als sekundär (arbeitendes Bein) – eine Muskel-ID kann nur eine Rolle haben, obwohl links und rechts verschieden arbeiten.
- **Copenhagen Plank**: als `isometric` und Muster `anti_lateral_flexion` eingeordnet; Primärmuskeln sind die Adduktoren des oberen Beins.
- **Griffmuskeln**: bei Langhantel-Kreuzheben, RDL, Sumo, Trap-Bar sekundär (Regel aus docs/muskelmodell.md), bei leichteren Kurzhantel- und Kettlebell-Varianten Stabilisatoren.

## Hinweise für die Grafik

- Gelenkwinkel je Phase gelten **am Ende** der Phase (wie im README-Beispiel: `start` = Ausgangshaltung, danach der jeweils erreichte Zielwinkel).
- `hip_flexion` ist Oberschenkel zum Becken bei neutraler Wirbelsäule; die Rumpfneigung ergibt sich daraus etwa als `hip_flexion − knee_flexion + ankle_dorsiflexion` (bei Füßen am Boden). `trunk_flexion` nur dort gesetzt, wo sich die Wirbelsäule wirklich beugt.
- Einbeinige und wechselnde Übungen: Winkel für das **rechte** (arbeitende bzw. führende) Bein; Haltung des linken Beins steht in `equipmentMotion`.
- Kontakt-IDs wurden frei vergeben (z. B. `feet_on_floor_wide`, `heels_under_anchor`, `strap_on_right_ankle`); eine gemeinsame Liste wäre sinnvoll.

## Quellen

- Haff GG, Triplett NT (Hrsg.): NSCA Essentials of Strength Training and Conditioning, 4. Aufl., 2016.
- ACSM's Guidelines for Exercise Testing and Prescription, 11. Aufl., 2021.
- Standring S (Hrsg.): Gray's Anatomy, 42. Aufl., 2020.
- Neumann DA (2010) J Orthop Sports Phys Ther 40(2):82–94 – Muskelfunktionen der Hüfte.
- Schoenfeld BJ (2010) J Strength Cond Res 24(12):3497–3506; Escamilla RF (2001) Med Sci Sports Exerc 33(1):127–141; Escamilla RF et al. (1998) Med Sci Sports Exerc 30(4):556–569.
- Gullett JC et al. (2009) J Strength Cond Res 23(1):284–292; Schwanbeck S et al. (2009) J Strength Cond Res 23(9):2588–2591; McCaw ST, Melrose DR (1999) Med Sci Sports Exerc 31(3):428–436.
- Escamilla RF et al. (2002) Med Sci Sports Exerc 34(4):682–688; Swinton PA et al. (2011) J Strength Cond Res 25(7):2000–2009; Vigotsky AD et al. (2015) PeerJ 3:e708; Zebis MK et al. (2013) Br J Sports Med 47(18):1192–1198.
- Contreras B et al. (2015) J Appl Biomech 31(6):452–458; Distefano LJ et al. (2009) J Orthop Sports Phys Ther 39(7):532–540; Reiman MP et al. (2012) Physiother Theory Pract 28(4):257–268.
- Ebben WP (2009) Int J Sports Physiol Perform 4(1):84–96; McAllister MJ et al. (2014) J Strength Cond Res 28(6):1573–1580; Maeo S et al. (2021) Med Sci Sports Exerc 53(4):825–837; van der Horst N et al. (2015) Am J Sports Med 43(6):1316–1323.
- Farrokhi S et al. (2008) J Orthop Sports Phys Ther 38(7):403–409; Mackey ER, Riemann BL (2021) Int J Exerc Sci 14(1):533–543; Simenz CJ et al. (2012) J Strength Cond Res 26(12):3398–3405.
- Ishøi L et al. (2016) Scand J Med Sci Sports 26(11):1334–1342; Hébert-Losier K et al. (2009) Phys Ther Sport 10(4):142–149.

Alle Zuordnungen sind redaktionell und nicht von einer Trainerin oder einem Trainer geprüft.
