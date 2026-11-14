# Bericht Bereich rumpf-pilates

Stand 14.11.2026. Datei: `uebungen/rumpf-pilates.json`.

## Ergebnis

- **68 Übungen**: 14 bestehend (IDs unverändert), 54 neu.
- Prüfung `python -I scripts/validate_exercise_catalog.py rumpf-pilates`: **0 Meldungen** (auch alle Verweise auf andere Bereiche sind aufgelöst: `glute_bridge`, `hip_thrust`, `lying_leg_curl`, `lateral_band_walk`, `push_up`, `cat_cow`, `thoracic_open_book`, `supine_hamstring_strap_stretch`).

- Nachprüfung nach README-Korrektur: Alle Phasenwinkel sind als Schlüsselpose am Ende der Phase eingetragen (erste Phase `start` = Ausgangsstellung, share 0). Bei allen 34 einseitigen oder wechselseitigen Übungen steht in `equipmentMotion` jetzt ein Satz dazu, was die andere Seite macht.

## Liste der IDs mit Kategorie

Bestehend: plank (isometric), side_plank (isometric), dead_bug (strength), bird_dog (strength), pallof_press (strength), sit_up (strength), hanging_knee_raise (strength), cable_crunch (strength), pilates_hundred, pilates_single_leg_stretch, pilates_bridge, pilates_side_kick, pilates_swimming, pilates_clamshell (alle pilates).

Neu – Bauch/Rumpf:
- strength: crunch, reverse_crunch, bicycle_crunch, v_up, hanging_leg_raise, captains_chair_knee_raise, toes_to_bar, ab_wheel_rollout_kneeling, ab_wheel_rollout_standing, stability_ball_stir_the_pot, body_saw, ab_crunch_machine, plank_shoulder_tap, plank_leg_lift, side_plank_hip_dip, hollow_body_rock, russian_twist, slow_mountain_climber, bear_crawl, cable_woodchopper_high_to_low, cable_woodchopper_low_to_high, band_woodchopper, landmine_rotation, half_kneeling_pallof_press, pallof_press_overhead, suitcase_carry, farmers_walk, overhead_carry, turkish_get_up, rotary_torso_machine
- isometric: high_plank, rkc_plank, kneeling_side_plank, hollow_body_hold, bear_plank

Neu – Pilates (alle pilates): pilates_roll_up, pilates_roll_over, pilates_single_leg_circle, pilates_rolling_like_a_ball, pilates_double_leg_stretch, pilates_scissors, pilates_double_straight_leg_stretch, pilates_criss_cross, pilates_spine_stretch_forward, pilates_saw, pilates_swan, pilates_single_leg_kick, pilates_teaser, pilates_side_leg_lift, pilates_side_inner_thigh_lift, pilates_leg_pull_front, pilates_leg_pull_back, pilates_ring_inner_thigh_squeeze, pilates_ring_chest_press

Nicht angelegt (Zuständigkeit anderer Bereiche): Superman (brust-ruecken), schneller Mountain Climber (cardio-boxen-athletik).

## Fehlende Geräte

| Vorschlag ID | Name | Begründung | Vorläufig eingetragen |
|---|---|---|---|
| `captains_chair` | Knieheben-Station / Captain's Chair (Rückenpolster + Armauflagen) | eigenes, häufiges Studiogerät; Grafik braucht Rückenpolster und Unterarmauflagen | `dip_station` |
| `gliding_discs` | Gleitscheiben (Slider) | Body Saw, Mountain Climber, Pike werden oft mit Slidern gemacht | Body Saw mit `suspension_trainer` |
| `pilates_ball` | Kleiner Pilates-Ball (Overball, ca. 20–25 cm) | Standard-Kleingerät im Matten-Pilates (zwischen Knie, unter Becken) | nicht verwendet |
| `ab_roller_wheel` | – | vorhanden als `ab_wheel`, kein Bedarf | – |

Hinweis: Für Turkish Get-up, Suitcase Carry und Overhead Carry ist `kettlebell` eingetragen; Kurzhanteln gehen ebenso (im Setup-Text erwähnt).

## Fehlende Muskeln

- **Beckenboden (M. levator ani)** – bei Pilates (Hundred, Ring-Übungen, Bridge) ein ausdrücklicher Bestandteil der Anleitung; im Modell fehlt er. Vorschlag: `levator_ani` (Gruppe abs, view deep). Bis dahin nur im Text erwähnt.
- **Zwerchfell (Diaphragma)** – zentral für Atemanleitungen, aber keine Trainingsmuskel-Zuordnung nötig; nur zur Kenntnis.
- **M. obturatorius internus / Mm. gemelli / M. quadratus femoris** – tiefe Außenrotatoren, relevant bei Clamshell; bewusst nicht im Modell (docs/muskelmodell.md). Keine Änderung nötig, nur Hinweis.
- **Scalenusgruppe / tiefe Halsbeuger (M. longus colli, longus capitis)** – halten den Kopf bei allen Pilates-Übungen mit eingerolltem Kopf (Hundred, Stretches). Eingetragen ist ersatzweise der Sternocleidomastoideus als Stabilisator. Vorschlag: `longus_colli` (Gruppe back/Hals, deep), falls Nackenbelastung später ausgewertet werden soll.

## Strittige Punkte und Entscheidungen

- **Clamshell**: Gluteus minimus von primär auf sekundär gesetzt. Seine vorderen Fasern sind Innenrotatoren; EMG-Daten zum Minimus bei der Clamshell fehlen. Gluteus maximus sekundär (EMG zeigt deutliche Aktivität, Distefano 2009 / Ekstrom 2007).
- **Pallof Press (alle Varianten)**: vorderer Deltamuskel, Brustmuskel und Trizeps als Stabilisatoren statt sekundär, weil die Last gering ist und sie sonst in der App als halbe Brust-/Schultersätze zählen würden.
- **Seitstütz**: Quadratus lumborum sekundär (McGill beschreibt hohe Aktivität, aber die Obliques sind Hauptmuskeln); im Hip Dip (dynamisch) primär.
- **Farmer's Walk**: Fingerbeuger primär, Pars descendens des Trapezius sekundär (vorsichtigere Rolle; der Trapezius arbeitet isometrisch gegen den Zug).
- **Overhead Carry**: Deltamuskel (vorn/seitlich) primär, Serratus und Trapezius als Aufwärtsrotatoren sekundär – funktionell begründet, EMG begrenzt.
- **Turkish Get-up**: Pattern `rotation` gewählt (Aufrollen über die Seite); passt nur teilweise, ein Pattern „transition / ground-to-stand“ fehlt. Primär Obliques und Gluteus maximus (Brücke, Aufstehen) – Einschätzung.
- **Pilates-Trennung**: In Pilates-Übungen ist die Bauchmuskulatur bei Bein-Übungen (Single Leg Circle, Side Kick, Side Leg Lift) bewusst **Stabilisator**, die bewegenden Hüftmuskeln primär. Bei Roll Up, Roll Over, Rolling Like a Ball, Spine Stretch Forward und Saw sind Rückenstrecker (und je nach Übung Ischiokrurale/Waden) als **gedehnt** eingetragen. Swan dehnt Rectus abdominis und Iliopsoas, Leg Pull Back die vordere Schulter (Pars clavicularis, vorderer Delta, langer Bizepskopf), Single Leg Kick den Rectus femoris.
- **Pilates Bridge**: Rückenstrecker aus den sekundären Muskeln genommen (beim Abrollen steuert vor allem die Bauchmuskulatur); Iliopsoas und Rectus femoris als gedehnt ergänzt.
- **Hanging/Captain's Chair**: Griff (FDS/FDP) bei hängenden Varianten sekundär (Regel aus docs/muskelmodell.md), beim Captain's Chair nicht beteiligt.
- **Halbkniestand-Pallof**: Iliopsoas des hinteren Beins als gedehnt eingetragen (Gesäß angespannt im Halbkniestand).
- **Russian Twist**: Sicherheits- und Kontraindikationshinweise wegen Rotation unter Rumpfbeugung (McGill); Regression auf Pallof Press.
- **Dose**: Carries und Bear Crawl in Sekunden (das Format kennt keine Meter); Turkish Get-up 1–3 Wiederholungen pro Seite.
- Tempo-Feld: bei gehaltenen Übungen `hold`, bei Carries `kontinuierlich`, beim Hundred `100 Armschläge` (Freitext, Prüfer verlangt kein festes Format).

## Quellen

- McGill S. M.: Low Back Disorders, 3rd ed., Human Kinetics 2016.
- NSCA: Essentials of Strength Training and Conditioning, 4th ed., Human Kinetics 2016.
- ACSM's Guidelines for Exercise Testing and Prescription, 11th ed., 2021.
- Escamilla R. F. et al. (2006): Electromyographic analysis of traditional and nontraditional abdominal exercises. Phys Ther 86(5):656-671.
- Schoenfeld B. J. et al. (2014): An electromyographic comparison of a modified version of the plank with a long lever and posterior tilt versus the traditional plank exercise. Sports Biomech 13(3):296-306.
- Ekstrom R. A., Donatelli R. A., Carp K. C. (2007): Electromyographic analysis of core trunk, hip, and thigh muscles during 9 rehabilitation exercises. J Orthop Sports Phys Ther 37(12):754-762.
- Snarr R. L., Esco M. R. (2014): Electromyographical comparison of plank variations performed with and without instability devices. J Strength Cond Res 28(11):3298-3305.
- McGill S. M., McDermott A., Fenwick C. M. (2009): Comparison of different strongman events: trunk muscle activation and lumbar spine motion, load, and stiffness. J Strength Cond Res 23(4):1148-1161.
- Distefano L. J. et al. (2009): Gluteal muscle activation during common therapeutic exercises. J Orthop Sports Phys Ther 39(7):532-540.
- Isacowitz R., Clippinger K.: Pilates Anatomy, 2nd ed., Human Kinetics 2020.
- Isacowitz R.: Pilates, 2nd ed., Human Kinetics 2014.
- Pilates J. H., Miller W. J.: Return to Life Through Contrology, 1945.
- Cook G.: Movement – Functional Movement Systems, On Target Publications 2010.
- Standring S. (ed.): Gray's Anatomy, 42nd ed., Elsevier 2020.
- ACE Exercise Library: https://www.acefitness.org/resources/everyone/exercise-library/
