# Bericht Bereich brust-ruecken

Stand 14.11.2026. Datei: `uebungen/brust-ruecken.json`.

## Anzahl

71 Übungen: 25 bestehend (IDs unverändert), 46 neu. Prüfung `python -I scripts/validate_exercise_catalog.py brust-ruecken`: **0 Meldungen**. Alle Verweise in `variants`, `regression` und `progression` lösen auf. Verweise in andere Bereiche: `close_grip_push_up`, `reverse_fly`, `face_pull`, `pilates_swimming`, `bird_dog`, `conventional_deadlift`, `romanian_deadlift`.

Bewegungsdaten: Die Winkel gelten am **Ende** jeder Phase, `start` ist die Ausgangsstellung (wie im korrigierten README). Bei einseitigen Übungen gelten die Winkel für den rechten Arm. Was die linke Seite tut, steht in `equipmentMotion`.

## IDs nach Kategorie

Alle Einträge haben `category: strength`.

**Drücken horizontal (horizontal_push):** barbell_bench_press, incline_barbell_press, incline_dumbbell_press, dumbbell_bench_press, machine_chest_press, close_grip_bench_press, decline_barbell_bench_press*, landmine_two_arm_press*, band_chest_press*, svend_press*, suspension_chest_press*, push_up, knee_push_up*, incline_push_up*, decline_push_up*, band_push_up*, ring_push_up*

**Fliegende (isolation):** dumbbell_chest_fly, incline_dumbbell_fly*, cable_chest_fly, incline_cable_fly*, pec_deck_fly*, high_to_low_cable_crossover*, low_to_high_cable_crossover*

**Dips (vertical_push):** parallel_bar_dip, assisted_dip_machine*

**Überzüge (extension):** dumbbell_pullover, straight_arm_pulldown, machine_pullover

**Ziehen vertikal (vertical_pull):** pull_up, chin_up*, neutral_grip_pull_up*, wide_grip_pull_up*, negative_pull_up*, weighted_pull_up*, scapular_pull_up*, assisted_pull_up, machine_assisted_pull_up*, cable_lat_pulldown, close_grip_lat_pulldown*, reverse_grip_lat_pulldown*, single_arm_cable_pulldown*, machine_lat_pulldown*, band_lat_pulldown

**Rudern (horizontal_pull):** barbell_row, pendlay_row*, yates_row, t_bar_row, landmine_row*, meadows_row*, dumbbell_bent_over_row*, one_arm_dumbbell_row, kettlebell_row*, chest_supported_dumbbell_row, seal_row*, seated_cable_row, single_arm_cable_row*, machine_row*, band_row, band_bent_over_row*, inverted_row*, suspension_row*

**Trapez / Rückenstrecker:** dumbbell_shrug, barbell_shrug*, trap_bar_shrug*, cable_shrug*, rack_pull* (hinge), back_extension*, reverse_hyperextension*, superman* (extension), incline_y_raise* (isolation)

`*` = neu

Bewusst weggelassen oder anderen Bereichen überlassen: Good Morning (beine-gesaess). Ein liegender Kabel-Pullover fehlt, weil der bestehende `straight_arm_pulldown` auf Deutsch schon „Kabel-Pullover“ heißt. T- und W-Heben auf der Schrägbank gehören zu schultern-arme (Schwerpunkt hinterer Delta bzw. Außenrotation). Diamant-Liegestütz gehört zu den Armen. Parallettes-Liegestütz, Kurzhantel-Negativdrücken und Bodendrücken sind weggelassen, damit der Katalog bei rund 70 Übungen bleibt.

## Änderungen an bestehenden Einträgen (fachlich)

- Isometrisch arbeitende Muskeln stehen jetzt unter `stabilizers` statt `secondary`, also nicht mehr als halbe Sätze. Das betrifft die Rückenstrecker beim vorgebeugten Rudern (barbell_row, yates_row, t_bar_row) und den Rectus abdominis beim Liegestütz.
- Bei Klimmzügen sind die Fingerbeuger (FDS, FDP) jetzt sekundär, wie es docs/muskelmodell.md für Hängen vorsieht. Beim Latzug im Sitzen stehen sie unter Stabilisatoren.
- Bei allen Fliegenden ist der Coracobrachialis sekundär (horizontale Adduktion). Der Bizeps ist Stabilisator, weil er den Ellbogenwinkel hält.
- Bei Dips ist der Latissimus Stabilisator (Schulterblatt nach unten), der Pars clavicularis sekundär.
- `dumbbell_shrug`: Rhomboidei und Rückenstrecker sind Stabilisatoren.

## Fehlende Geräte

| Vorschlag ID | Name | Begründung / betroffene Übungen |
|---|---|---|
| `lat_bar` | Latzugstange | Lange Stange für den Kabel-Latzug. Bisher nur `cable_machine`. |
| `v_handle` | V-Griff / enger Parallelgriff | close_grip_lat_pulldown, seated_cable_row, landmine_row (unter die Stange gehakt) |
| `cable_handle` | Einzelgriff (D-Griff) | Alle einarmigen und Crossover-Übungen am Kabel |
| `rope_attachment` | Seilgriff | Häufige Variante bei straight_arm_pulldown. Wird wohl auch in schultern-arme gebraucht (Face Pull, Trizepsdrücken). |
| `dip_belt` | Dip-Gürtel | weighted_pull_up, gewichtete Dips. Vorerst ist `weighted_vest` eingetragen. |
| `reverse_hyper_machine` | Reverse-Hyper-Gerät mit Pendel | reverse_hyperextension. Vorerst ist `bench_flat` eingetragen. |
| `high_bench` | Hohe Ruderbank (Seal-Row-Bank) | seal_row. Vorerst `bench_flat` + `plyo_box` als erhöhte Bank. |
| `lifting_straps` | Zughilfen | rack_pull, meadows_row, schwere Shrugs (optional) |

Kabel-Zubehör wäre für die Grafik wichtig, weil Griffform und Handstellung von ihm abhängen. Vorschlag: eine eigene Art `attachment` in `kinds`.

## Fehlende Muskeln

Für diesen Bereich fehlt kein Muskel zwingend. Hinweise:
- **M. subclavius** und **Mm. rotatores / interspinales** sind bewusst nicht im Modell. Für Brust- und Rückenübungen ist das kein Problem.
- **M. serratus posterior superior/inferior** fehlen. Sie sind Atemhilfsmuskeln ohne Trainingsrelevanz, also kein Vorschlag.
- **M. semispinalis** (tiefe Nackenstrecker) würde beim Superman und bei Shrugs passen, wenn eine Halsgruppe kommt. Vorerst sind `splenius_capitis`/`splenius_cervicis` als Stabilisatoren eingetragen.

## Strittige Punkte (vorsichtigere Rolle gewählt)

- **Pectoralis major beim Klimmzug:** Nur beim Chin-up sekundär. Youdas et al. 2010 messen dort eine deutliche Aktivität des Pars sternocostalis. Beim Obergriff ist er weggelassen, weil die Daten zu dünn sind.
- **Rack Pull:** Gluteus maximus, Ischiokrurale (Hüftanteil) **und** Iliocostalis/Longissimus sind primär. Die Rückenstrecker arbeiten zwar isometrisch, tragen aber die Hauptlast, und genau dafür wird die Übung im Rückentraining eingesetzt. Wer das streng sieht, kann sie zu `secondary` verschieben.
- **Back Extension:** Beschrieben ist die Variante mit neutralem Rücken (Bewegung aus der Hüfte). Rückenstrecker und Gluteus maximus sind primär, die Ischiokruralen sekundär. Bei der Variante mit gerundetem Rücken wären die Rückenstrecker allein primär.
- **Superman:** Pars ascendens des Trapezius und hinterer Delta sind sekundär (Armheben über Kopf in Bauchlage, analog zu `pilates_swimming`). Das ist geschätzt.
- **Y-Heben:** Primär ist der Pars ascendens (Ekstrom 2003: höchste EMG-Aktivität beim Armheben über Kopf in Bauchlage). Die Rhomboidei sind nur Stabilisatoren, weil die Bewegung eine Aufwärtsrotation des Schulterblatts verlangt. Liegt im Grenzbereich zu schultern-arme.
- **Scapular Pull-up:** Primär sind Pars ascendens und Latissimus (Senken des Schulterblatts), sekundär Pectoralis minor und Rhomboidei.
- **Svend Press:** Pars sternocostalis und clavicularis sind beide primär (isometrische Adduktion plus Flexion). Kaum EMG-Daten, daher eine Einschätzung.
- **Crossover hoch/tief:** Von hoch nach tief ist der Pars sternocostalis primär und der Pars abdominalis sekundär. Von tief nach hoch ist der Pars clavicularis primär. Beides folgt dem Faserverlauf, belastbare EMG-Daten dazu fehlen (Glass & Armstrong 1997 nur für Bankneigungen).
- **Gelenkwinkel:** Der Bank-Standard folgt dem README-Beispiel (`shoulder_abduction` bleibt als Maß für das Abspreizen der Ellbogen gleich, Flexion 90 → 0). Beim Fliegen ist das Muster Abduktion 85 plus horizontale Abduktion −85 → +10. Die Werte sind gerundet und nicht gemessen.
- **bodyPosition:** Für `one_arm_dumbbell_row` ist `quadruped` gewählt (Knie und Hand auf der Bank, ein Fuß am Boden). Ganz passt keine der erlaubten Lagen, die Kontaktpunkte beschreiben es genau.

## Quellen

- Haff G. G., Triplett N. T. (Hrsg.): NSCA Essentials of Strength Training and Conditioning, 4. Aufl., Human Kinetics 2016
- Delavier F.: Strength Training Anatomy, 3. Aufl., Human Kinetics 2010
- ACSM's Guidelines for Exercise Testing and Prescription, 11. Aufl., 2021
- Neumann D. A.: Kinesiology of the Musculoskeletal System, 3. Aufl., Elsevier 2017
- McGill S. M.: Low Back Disorders, 3. Aufl., Human Kinetics 2016
- Rodríguez-Ridao D. et al. (2020), Int J Environ Res Public Health 17(19):7339 – Bankneigung und EMG
- Glass S. C., Armstrong T. (1997), J Strength Cond Res 11(3):163–167 – Schräg- vs. Negativbank
- Saeterbakken A. H. et al. (2011), J Sports Sci 29(5):533–538 – Stabilität beim Brustdrücken
- Solstad T. E. J. et al. (2020), J Sports Sci Med 19(4):645–651 – Bankdrücken vs. Fliegende
- Calatayud J. et al. (2015), J Strength Cond Res 29(1):246–253 – Liegestütz mit Band vs. Bankdrücken
- Snarr R. L., Esco M. R. (2013), J Hum Kinet 39:75–83 – Liegestütz am Schlingentrainer
- Youdas J. W. et al. (2010), J Strength Cond Res 24(12):3404–3414 – Pull-up vs. Chin-up
- Lusk S. J. et al. (2010), J Strength Cond Res 24(7):1895–1900 – Griff beim Latzug
- Signorile J. F. et al. (2002), J Strength Cond Res 16(4):539–546 – Handposition beim Latzug
- Fenwick C. M. J., Brown S. H. M., McGill S. M. (2009), J Strength Cond Res 23(5):1408–1417 – Ruderübungen, Rumpfbelastung
- Ekstrom R. A. et al. (2003), J Orthop Sports Phys Ther 33(5):247–258 – Trapezius- und Serratus-Übungen
- Escamilla R. F. et al. (2009), Sports Med 39(8):663–685 – Schultermuskulatur in Übungen

Alle Zuordnungen sind redaktionell und nicht von einer Trainerin oder einem Trainer geprüft.
