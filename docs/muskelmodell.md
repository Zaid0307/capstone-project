# Muskelmodell

Stand: 2026-11-13. Daten: `src/data/muscles.js`, Übungszuordnung: `src/data/exercises/*.js`.

## Grundsätze

- Nur echte anatomische Muskeln und ihre anerkannten Köpfe bzw. Teile (Terminologia Anatomica, TA2). Keine erfundenen Trainingszonen wie „untere Bauchmuskeln“ oder „obere Brust“ als eigene Muskeln.
- Hat ein Muskel anerkannte Köpfe/Teile, wird er als **Ganzes** (`parent`) plus seine Teile geführt. Übungen verweisen nur auf die **feinste Ebene** (Teile bzw. Muskeln ohne Teile); das prüft ein Test.
- Ohne anerkannte Köpfe bleibt ein Muskel ganz (z. B. Rectus abdominis, Latissimus dorsi, Gluteus medius).
- Jeder Eintrag hat `group` (eine der sechs App-Gruppen), `de`, `en`, `latin` und `view`: `front`, `back`, `both` (auf beiden Ansichten sichtbar) oder `deep` (von anderen Muskeln verdeckt).
- Alte IDs bleiben gültig: 35 der 39 alten IDs sind weiterhin Einträge (teils jetzt als Ganzes mit Teilen). Die vier alten Sammel-IDs, die keine einzelnen Muskeln waren, stehen in `LEGACY_MUSCLE_IDS`: `rhomboids`, `adductors`, `forearm_flexors`, `forearm_extensors`. `resolveMuscleId(id)` liefert für jede ID (neu, Ganzes, alt) die feinsten Muskeln.
- Die App kennt keine Halsgruppe: Halsmuskeln zählen zur Gruppe **Rücken** (wie schon der absteigende Trapezius-Teil).

## Muskeln (93 Einträge, davon 13 Ganze mit Teilen)

Ganze mit Teilen sind **fett**, ihre Teile eingerückt.

### Brust (chest) – 6
- **Großer Brustmuskel** (M. pectoralis major)
  - Pars clavicularis, Pars sternocostalis, Pars abdominalis
- Kleiner Brustmuskel (M. pectoralis minor) – tief
- Vorderer Sägemuskel (M. serratus anterior)

### Schultern (shoulders) – 8
- **Deltamuskel** (M. deltoideus)
  - Pars clavicularis (`deltoid_anterior`), Pars acromialis (`deltoid_lateral`), Pars spinalis (`deltoid_posterior`) – alte IDs beibehalten
- Rotatorenmanschette: M. supraspinatus (tief), M. infraspinatus, M. teres minor, M. subscapularis (tief)

### Arme (arms) – 22
- **Bizeps** (M. biceps brachii): Caput longum, Caput breve
- M. brachialis, M. coracobrachialis (tief)
- **Trizeps** (M. triceps brachii): Caput longum, Caput laterale, Caput mediale (tief)
- M. anconeus
- Unterarm, Beuger/Pronatoren: M. brachioradialis, M. pronator teres, M. flexor carpi radialis, M. palmaris longus, M. flexor carpi ulnaris, M. flexor digitorum superficialis, M. flexor digitorum profundus (tief)
- Unterarm, Strecker/Supinator: M. extensor carpi radialis longus, M. extensor carpi radialis brevis, M. extensor digitorum, M. extensor carpi ulnaris, M. supinator (tief)

### Rücken (back, inkl. Hals) – 20
- **Trapezmuskel** (M. trapezius): Pars descendens, Pars transversa, Pars ascendens
- M. latissimus dorsi, M. teres major
- M. rhomboideus major, M. rhomboideus minor (beide tief)
- M. levator scapulae (tief)
- **Rückenstrecker** (M. erector spinae): M. iliocostalis, M. longissimus, M. spinalis
- Mm. multifidi (tief), M. quadratus lumborum (tief)
- **Kopfwender** (M. sternocleidomastoideus): Caput sternale, Caput claviculare
- M. splenius capitis, M. splenius cervicis (tief)

### Bauch (abs) – 4
- M. rectus abdominis (ein Muskel; die Zwischensehnen, Intersectiones tendineae, teilen ihn optisch in Felder, sind aber keine eigenen Muskeln)
- M. obliquus externus abdominis, M. obliquus internus abdominis (tief), M. transversus abdominis (tief)

### Beine (legs, inkl. Hüfte) – 33
- Hüfte: M. gluteus maximus, M. gluteus medius, M. gluteus minimus (tief), M. tensor fasciae latae, M. piriformis (tief)
- **Hüftbeuger** (M. iliopsoas): M. psoas major, M. iliacus (beide tief)
- **Vierköpfiger Oberschenkelmuskel** (M. quadriceps femoris): M. rectus femoris, M. vastus lateralis, M. vastus medialis, M. vastus intermedius (tief)
- M. sartorius
- **Zweiköpfiger Oberschenkelmuskel** (M. biceps femoris): Caput longum, Caput breve (tief)
- M. semitendinosus, M. semimembranosus
- Adduktoren: M. adductor magnus, M. adductor longus, M. adductor brevis (tief), M. gracilis, M. pectineus
- **Dreiköpfiger Wadenmuskel** (M. triceps surae): **M. gastrocnemius** (Caput mediale, Caput laterale) und M. soleus – zweistufige Hierarchie
- M. tibialis anterior, M. extensor digitorum longus, M. fibularis (peroneus) longus, M. fibularis brevis (tief)

## Entscheidungen zur Feinheit

- **Rectus abdominis** bleibt ein Muskel. EMG-Studien zeigen keine verlässlich getrennt trainierbaren „oberen/unteren“ Anteile.
- **Pectoralis major**: drei TA-Teile. Der Pars abdominalis ist klein, aber anatomisch eigenständig.
- **Rückenstrecker**: die drei Säulen (Iliocostalis, Longissimus, Spinalis) sind eigene Muskeln. Ihre Regionalteile (lumborum/thoracis/cervicis/capitis) werden nicht getrennt geführt, weil Übungen sie nicht gezielt ansprechen und eine Figur sie nicht unterscheidbar zeigt. Die tiefen Rotatores und Mm. interspinales/intertransversarii fehlen bewusst.
- **Unterarm**: alle oberflächlichen Hand- und Fingerbeuger/-strecker, die bei Griff- und Handgelenksarbeit tragen, plus M. flexor digitorum profundus (Hauptmuskel der Griffkraft), M. pronator teres und M. supinator (Unterarmdrehung). Nicht geführt: Daumen- und Kleinfingermuskeln (M. flexor pollicis longus, M. abductor pollicis longus, Mm. extensores pollicis, M. extensor digiti minimi), M. pronator quadratus. Hand- und Fußmuskeln fehlen ganz. M. palmaris longus fehlt bei etwa 10–15 % der Menschen, ist aber aufgenommen, weil er an der Figur sichtbar ist.
- **Serratus anterior, Latissimus dorsi, Gluteus maximus/medius, Adductor magnus**: Manche Lehrbücher beschreiben Faseranteile (z. B. „ischiokruraler Teil“ des Adductor magnus, obere/untere Fasern des Gluteus maximus). Das sind keine anerkannten Köpfe in der TA; die Muskeln bleiben ganz.
- **Tiefe Hüftaußenrotatoren**: nur M. piriformis (für Dehnungen und Clamshell relevant). Mm. gemelli, M. obturatorius internus/externus und M. quadratus femoris sind nicht geführt.
- **Nicht geführt**, weil variabel oder ohne Trainingsrelevanz: M. psoas minor, M. pyramidalis, M. subclavius, M. plantaris, M. popliteus, M. tibialis posterior, tiefe Nackenmuskeln (M. semispinalis, Mm. suboccipitales), Scalenusgruppe.
- **Ganze** (`parent`) sind nur echte Muskeln oder in der TA benannte Muskeleinheiten (Quadriceps femoris, Triceps surae, Iliopsoas, Erector spinae). Funktionsgruppen wie „Rotatorenmanschette“, „Ischiokrurale“ oder „Adduktoren“ sind keine Einträge.

## Übungszuordnung

Primär = Hauptbeweger der Übung; sekundär = deutliche Mithelfer oder Stabilisatoren. Die Muskelgruppen einer Übung ergeben sich weiter aus den primären Muskeln (`exerciseGroups`). Die einzige Gruppenänderung: **Face Pull** gehört jetzt zu Schultern **und** Rücken, weil der querverlaufende Trapezius-Teil als primär geführt wird. Cardio- und Boxübungen haben wie bisher keine primären Muskeln, nur sekundäre.

Wichtige Regeln, die aus der Anatomie folgen:
- **Hüftstreckung (RDL, Good Morning, Hip Thrust, Kickback)**: nur Caput longum des Biceps femoris; das Caput breve überquert die Hüfte nicht. Beinbeuger (Leg Curl) und Dehnungen mit gestrecktem Knie enthalten beide Köpfe.
- **Kniebeugen, Beinpresse, Ausfallschritte**: alle drei Vasti primär, Rectus femoris sekundär (er ist zweigelenkig und wird bei gleichzeitiger Hüft- und Kniestreckung wenig aktiviert). Beinstrecker: alle vier Köpfe primär.
- **Bankdrücken flach**: Pars sternocostalis primär; **schräg**: Pars clavicularis primär. Flys und Dips entsprechend; bei Dips Pars sternocostalis und abdominalis.
- **Trizeps**: Pushdown (Arm am Körper) – Caput laterale und mediale primär, Caput longum sekundär. Überkopf-Strecken – alle drei Köpfe primär (Caput longum gedehnt, zweigelenkig).
- **Curls**: Bizeps (beide Köpfe) und Brachialis primär, Brachioradialis sekundär. Hammer Curl: Brachialis und Brachioradialis primär, Bizeps sekundär.
- **Ziehübungen**: Latissimus primär; Rudern zusätzlich Rhomboidei und Pars transversa des Trapezius primär; Bizepsköpfe, Brachialis, Brachioradialis sekundär.
- **Seitheben**: nur Pars acromialis des Deltamuskels primär.
- **Griff** (Kreuzheben, RDL, Shrugs, Hängen): M. flexor digitorum superficialis und profundus sekundär.

### Unsichere Zuordnungen

- `close_grip_bench_press`, `close_grip_push_up`: Anteil des Caput longum (hier sekundär) ist in Studien uneinheitlich.
- `preacher_curl`: Die oft behauptete Betonung des kurzen Bizepskopfs ist nicht belastbar belegt; beide Köpfe primär.
- `cable_chest_fly`, `dumbbell_chest_fly`, `wall_pec_stretch`: Welcher Brustmuskelteil dominiert, hängt vom Armwinkel ab; Annahme: horizontale Ebene, Pars sternocostalis primär.
- `straight_arm_pulldown`, `machine_pullover`, `dumbbell_pullover`: Beteiligung von Pars sternocostalis und Trizeps-Caput longum an der Schulterstreckung, Gewichtung geschätzt.
- `dumbbell_shoulder_press` u. a.: Pars ascendens des Trapezius und Serratus anterior als Aufwärtsrotatoren des Schulterblatts sekundär – funktionell begründet, EMG-Daten begrenzt.
- `pilates_swimming`: Armheben in Bauchlage (ähnlich „Y-Raise“) – hinterer Deltamuskel und Pars ascendens des Trapezius als sekundär geschätzt.
- `thoracic_open_book`, `child_pose`, `downward_facing_dog`, `seated_glute_stretch`: Dehnungen; „primär“ meint hier den hauptsächlich gedehnten Muskel, die Auswahl ist eine Einschätzung.
- `pilates_side_kick`: Abduktoren halten das Bein (primär Gluteus medius), Vor-/Rückschwung über Hüftbeuger und Gluteus maximus – geschätzt.
- Boxen und Cardio: nur sekundäre Muskeln, grob nach Bewegungsablauf.

Alle Zuordnungen sind redaktionell und nicht von einer Trainerin oder einem Trainer geprüft.

## Quellen

- Federative International Programme for Anatomical Terminology (FIPAT): *Terminologia Anatomica*, 2. Aufl. (TA2), 2019 – Namen und anerkannte Teile.
- Standring S. (Hrsg.): *Gray's Anatomy*, 42. Aufl., Elsevier 2020.
- OpenStax: *Anatomy and Physiology 2e*, Kap. 11 „The Muscular System“ (openstax.org).
- Kenhub (kenhub.com) und TeachMeAnatomy (teachmeanatomy.info): Artikel zu den einzelnen Muskeln (Ursprung, Ansatz, Köpfe, Funktion).
- Schünke M., Schulte E., Schumacher U.: *Prometheus LernAtlas der Anatomie – Allgemeine Anatomie und Bewegungssystem* – deutsche Namen.
- Rodríguez-Ridao D. et al. (2020): Effect of five bench inclinations on the electromyographic activity of the pectoralis major, anterior deltoid, and triceps brachii during the bench press exercise. *Int J Environ Res Public Health* 17(19):7339.
- Maeo S. et al. (2023): Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead versus neutral arm position. *Eur J Sport Sci* 23(7):1240–1250.
- Escamilla R. F. et al. (2009): Shoulder muscle activity and function in common shoulder rehabilitation exercises. *Sports Med* 39(8):663–685.
- Schoenfeld B. J. (2010): Squatting kinematics and kinetics and their application to exercise performance. *J Strength Cond Res* 24(12):3497–3506 – Quadrizeps-Aktivierung (Rectus femoris) in der Kniebeuge.
- McGill S. M.: *Low Back Disorders*, 3. Aufl., Human Kinetics 2016 – Rumpfmuskulatur (Quadratus lumborum im Seitstütz, Multifidus).
