# Bericht Übungskatalog V2 – Bereich schultern-arme

Stand 14.11.2026. Datei: `uebungen/schultern-arme.json`.

## Anzahl

**74 Übungen**: 21 bestehend (alle IDs unverändert), 53 neu.

Prüfung `python -I scripts/validate_exercise_catalog.py schultern-arme`: keine Fehler. Es bleiben 2 Hinweise, beide auf `dumbbell_shrug` (bestehende ID von brust-ruecken, dort noch nicht angelegt).

Bewegungsdaten nach der korrigierten README: Winkel je Phase gelten am **Ende** der Phase (Schlüsselpose), `start` = Ausgangsstellung mit share 0. Die Anteile (`share`) leiten sich aus dem Tempo ab (exzentrisch-Pause unten-konzentrisch-Pause oben). Bei einseitigen Übungen gelten die Winkel für die rechte Seite; `equipmentMotion` sagt bei jeder einseitigen oder abwechselnden Übung, wie die Gegenseite arbeitet.

## IDs nach Gruppe (Status, Kategorie)

**Schulterdrücken (vertical_push):** dumbbell_shoulder_press (b), barbell_overhead_press (b), arnold_press (b), smith_shoulder_press (b), machine_shoulder_press, kettlebell_overhead_press, landmine_single_arm_press, band_overhead_press, pike_push_up, wall_handstand_push_up – alle strength.

**Seit-/Frontheben, aufrechtes Rudern:** dumbbell_lateral_raise (b), band_lateral_raise (b), band_dumbbell_lateral_raise (b), cable_lateral_raise, side_lying_lateral_raise, dumbbell_front_raise, plate_front_raise, cable_front_raise, band_front_raise, cable_upright_row, dumbbell_upright_row – strength.

**Hintere Schulter:** reverse_fly (b), cable_reverse_fly, machine_reverse_fly, face_pull (b), band_pull_apart (b) – strength.

**Rotatorenmanschette:** band_external_rotation (b), cable_external_rotation, side_lying_dumbbell_external_rotation, band_external_rotation_90, cable_internal_rotation, band_internal_rotation – strength.

**Schulterblatt:** prone_y_raise, prone_t_raise, prone_w_raise, serratus_wall_slide, scapular_push_up – strength.

**Bizeps/Brachialis/Brachioradialis:** barbell_curl (b), dumbbell_curl (b), band_curl (b), preacher_curl (b), 21s_barbell_curl (b), hammer_curl (b), cable_curl, concentration_curl, incline_dumbbell_curl, spider_curl, ez_bar_curl, cable_rope_hammer_curl, reverse_curl, zottman_curl – strength.

**Trizeps:** triceps_pushdown (b), overhead_triceps_extension (b), band_triceps_extension (b), close_grip_push_up (b), dumbbell_triceps_kickback, ez_bar_skull_crusher, dumbbell_skull_crusher, cable_overhead_triceps_extension, single_arm_cable_pushdown, bench_dip, diamond_push_up, jm_press – strength.

**Unterarm/Griff:** dumbbell_wrist_curl, dumbbell_reverse_wrist_curl, wrist_roller, dumbbell_pronation_supination (strength); plate_pinch, dead_hang (isometric).

**Nacken:** neck_isometric_flexion, neck_isometric_extension, neck_isometric_lateral_flexion (isometric); supine_neck_flexion, prone_neck_extension (strength, nur Körpergewicht, kleiner Bewegungsweg). Alle mit Sicherheitshinweis (30–50 % Kraft, kein Ruck, Abbruch bei Kribbeln, Schwindel oder ausstrahlenden Beschwerden) und eigenen Kontraindikationen.

Verweise auf andere Bereiche nur auf bestehende IDs: push_up, parallel_bar_dip, close_grip_bench_press, pull_up, dumbbell_shrug, standing_shoulder_car.

## Fehlende Geräte

| Vorschlag ID | Name | Begründung | Vorläufig eingetragen |
|---|---|---|---|
| `wrist_roller` | Unterarmroller / Wrist roller | Eigenes Gerät (Stab mit Seil), für die Grafik nötig | `weight_plate`; der Setup-Text nennt das Gerät |
| `lateral_raise_machine` | Seitheben-Maschine | Auf Wunsch „Seitheben Maschine“; ohne Gerät-ID **nicht angelegt**, damit keine falsche Geräteangabe entsteht | – |
| `neck_harness` (optional) | Nackengeschirr | Für gewichtete Nackenübungen; bewusst nicht aufgenommen (höheres Risiko), nur als spätere Erweiterung | – |
| `towel` (optional) | Handtuch | Kleines gerolltes Handtuch bei Außenrotation und als Stirnauflage in Bauchlage; steht nur im Text | – |

## Fehlende Muskeln

| Vorschlag | Begründung |
|---|---|
| M. semispinalis capitis (`semispinalis_capitis`) | Stärkster Nackenstrecker neben dem Splenius; ohne ihn ist die Nackenstreckung nur unvollständig abgebildet. Im Muskelmodell bisher bewusst ausgelassen. |
| Tiefe Halsbeuger: M. longus colli, M. longus capitis | Hauptziel des Kinn-Einziehens (`supine_neck_flexion`); vorerst nur der Kopfwender eingetragen. |
| Mm. scaleni (anterior, medius, posterior) | Tragen deutlich zur seitlichen Halsneigung bei (`neck_isometric_lateral_flexion`). |
| M. pronator quadratus | Hauptpronator in jeder Ellbogenstellung (`dumbbell_pronation_supination`, `zottman_curl`). |
| M. flexor pollicis longus, M. adductor pollicis / Daumenballen | Daumengegendruck beim Pinchgriff (`plate_pinch`). |

## Strittige Punkte und Entscheidungen

- **Aufwärtsrotatoren beim Drücken über Kopf:** Serratus anterior sowie Pars descendens und ascendens des Trapezius stehen wie in `docs/muskelmodell.md` als **sekundär** (aktive Aufwärtsrotation des Schulterblatts). Die Rotatorenmanschette steht als Stabilisator.
- **Curls:** Die Hand- und Fingerbeuger (FCR, FCU, Palmaris, FDS, FDP) stehen jetzt als **Stabilisatoren** und nicht mehr als sekundär wie in `src/data/exercises` (FCR/FCU). Sie halten Griff und Handgelenk, beugen den Ellbogen aber kaum. Das ist die vorsichtigere Rolle.
- **Face Pull:** Brachialis und Brachioradialis sind zusätzlich sekundär, weil der Ellbogen gegen das Kabel aktiv gebeugt wird.
- **Seitheben:** Supraspinatus ist sekundär. Er ist beim Abspreizen über den ganzen Weg aktiv, auch nach dem ersten Abschnitt.
- **Aufrechtes Rudern:** Es ist wegen Abspreizen plus Innendrehung als Risikoübung gekennzeichnet (Ellbogen höchstens auf Schulterhöhe, breiter Griff, Kontraindikation bei Impingement), Quelle Schoenfeld 2011. Priorität 3.
- **Dead Hang:** Latissimus dorsi und Teres major stehen unter `stretched`, die Fingerbeuger unter primär. Das Hängen dient hier dem Griff, die Dehnung ist ein Nebeneffekt.
- **Pronation/Supination:** Primär sind Pronator teres und Supinator. Der Bizeps ist sekundär, obwohl er bei 90° Ellbogenbeugung ein starker Supinator ist; die Pronation leistet er nicht.
- **Y/T/W-Heben:** Sie sind auf der Schrägbank (30–45°) und nicht flach auf dem Boden beschrieben, weil die Gelenkwinkel dort klarer und realistischer sind. Die Muskelrollen folgen Ekstrom 2003 und Cools 2007; beim Y-Heben arbeitet der Deltamuskel deutlich mit (sekundär).
- **bench_dip:** `bodyPosition` ist `seated`, weil es keine Stützposition gibt. Die Grafik sollte beachten, dass das Gesäß frei vor der Bank schwebt.
- **neck_isometric_lateral_flexion:** pattern ist `isolation`, nicht `anti_lateral_flexion`, damit die Übung nicht zwischen den Rumpfübungen landet.
- **Gelenkwinkel bei Schulterbewegungen:** Kombinationen aus `shoulder_flexion`, `shoulder_abduction` und `shoulder_horizontal_abduction` sind Näherungen, z. B. Reverse Fly mit Abspreizung 80° und horizontaler Abspreizung −75° für hängende Arme in der Vorbeuge. Die Grafik sollte sie als Richtwerte nehmen.
- **wrist_roller:** Das Tempo steht als Text „kontinuierlich / continuous“, die Dosis als 2–3 vollständige Auf- und Abwickelgänge (unit repetitions).

## Quellen

- Haff & Triplett (Hrsg.): NSCA – Essentials of Strength Training and Conditioning, 4th ed., 2016
- NSCA: Exercise Technique Manual for Resistance Training, 3rd ed., 2016
- ACSM's Guidelines for Exercise Testing and Prescription, 11th ed., 2021
- Neumann: Kinesiology of the Musculoskeletal System, 3rd ed., 2017
- Schünke, Schulte, Schumacher: Prometheus LernAtlas der Anatomie – Allgemeine Anatomie und Bewegungssystem
- Boeckh-Behrens & Buskies: Fitness-Krafttraining
- Reinold et al. 2004, JOSPT 34(7) – Außenrotation, EMG Rotatorenmanschette
- Ekstrom et al. 2003, JOSPT 33(5) – Trapezius und Serratus, EMG
- Cools et al. 2007, AJSM 35(10) – Schulterblatt-Übungen
- Ludewig et al. 2004, AJSM 32(2) – Push-up plus
- Hardwick et al. 2006, JOSPT 36(12) – Wall Slide
- Decker et al. 2003, AJSM 31(1) – Subscapularis
- Schoenfeld et al. 2011, Strength Cond J 33(5) – Upright Row
- Maeo et al. 2023, Eur J Sport Sci 23(7) – Trizeps überkopf vs. neutral
- Oliveira et al. 2009, J Sports Sci Med 8(1) – Curl-Varianten
- Ylinen et al. 2003, JAMA 289(19) – Nackentraining
- Tsatsouline: Enter the Kettlebell!, 2006; Sommer: Building the Gymnastic Body, 2008; Simmons: Westside Barbell Book of Methods, 2007

Hinweis: Die Literaturangaben stammen aus Fachwissen und wurden in dieser Sitzung nicht online geprüft. Vor einer Veröffentlichung DOIs und Seitenzahlen kurz gegenprüfen.
