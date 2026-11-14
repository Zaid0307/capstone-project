# Muskelmodell für die Grafik (Version 1)

Stand: 13.11.2026. Verbindliche Muskelliste der App für Muskelfigur, Masken und Hervorhebungen. Maschinenlesbar mit allen Übungszuordnungen: [muskelmodell-v1.json](muskelmodell-v1.json). Herleitung und Quellen: `docs/muskelmodell.md` (Terminologia Anatomica, Gray's Anatomy, OpenStax, Kenhub, TeachMeAnatomy).

**Gilt für den ganzen Körper**, nicht nur für Beispiele wie Arme oder Bauch.

- **93 Einträge.** Davon sind 13 **Ganze** (übergeordnete Muskeln wie `biceps_brachii`), darunter liegen ihre Köpfe oder Anteile. **Masken werden für die feinste Ebene gebraucht** (Einträge ohne Unterteilung, in der Tabelle „Maske: ja“). Ein Ganzes ergibt sich aus seinen Teilen.
- **Sichtbarkeit:** `vorne`, `hinten`, `vorne und hinten` = Maske in der jeweiligen Ansicht. `tief` = von außen verdeckt (z. B. Rotatorenmanschette, Rautenmuskeln, innerer schräger Bauchmuskel, Hüftbeuger). Die App wertet tiefe Muskeln aus und zeigt sie in Listen und Hinweisen. **Für die Figur bitte zusätzlich eine Tiefenansicht vorsehen** (z. B. eine zweite Ebene oder halbtransparente Darstellung), damit auch tiefe Muskeln markiert werden können. Vorschlag erwünscht.
- Die Hervorhebung liegt über der Kleidung (Entscheidung F3/F4).
- Masken neutral, ohne eingebrannte Farbe; die App färbt sie je nach Zustand (Hauptmuskel, unterstützend, Hinweis).

## Brust (6)

| ID | Deutsch | Latein | Teil von | Sichtbar | Maske |
|---|---|---|---|---|---|
| `pectoralis_major` | Großer Brustmuskel | Musculus pectoralis major | – | vorne | nein (Ganzes) |
| `pectoralis_major_clavicular` | Großer Brustmuskel, Schlüsselbeinteil | Pars clavicularis musculi pectoralis majoris | `pectoralis_major` | vorne | ja |
| `pectoralis_major_sternocostal` | Großer Brustmuskel, Brustbein-Rippen-Teil | Pars sternocostalis musculi pectoralis majoris | `pectoralis_major` | vorne | ja |
| `pectoralis_major_abdominal` | Großer Brustmuskel, Bauchteil | Pars abdominalis musculi pectoralis majoris | `pectoralis_major` | vorne | ja |
| `pectoralis_minor` | Kleiner Brustmuskel | Musculus pectoralis minor | – | tief | ja |
| `serratus_anterior` | Vorderer Sägemuskel | Musculus serratus anterior | – | vorne | ja |

## Schultern (8)

| ID | Deutsch | Latein | Teil von | Sichtbar | Maske |
|---|---|---|---|---|---|
| `deltoid` | Deltamuskel | Musculus deltoideus | – | vorne und hinten | nein (Ganzes) |
| `deltoid_anterior` | Vorderer Deltamuskel (Schlüsselbeinteil) | Pars clavicularis musculi deltoidei | `deltoid` | vorne | ja |
| `deltoid_lateral` | Seitlicher Deltamuskel (Schulterhöhenteil) | Pars acromialis musculi deltoidei | `deltoid` | vorne und hinten | ja |
| `deltoid_posterior` | Hinterer Deltamuskel (Schulterblattgräten-Teil) | Pars spinalis musculi deltoidei | `deltoid` | hinten | ja |
| `supraspinatus` | Obergrätenmuskel | Musculus supraspinatus | – | tief | ja |
| `infraspinatus` | Untergrätenmuskel | Musculus infraspinatus | – | hinten | ja |
| `teres_minor` | Kleiner Rundmuskel | Musculus teres minor | – | hinten | ja |
| `subscapularis` | Unterschulterblattmuskel | Musculus subscapularis | – | tief | ja |

## Arme (22)

| ID | Deutsch | Latein | Teil von | Sichtbar | Maske |
|---|---|---|---|---|---|
| `biceps_brachii` | Bizeps | Musculus biceps brachii | – | vorne | nein (Ganzes) |
| `biceps_brachii_long` | Bizeps, langer Kopf | Caput longum musculi bicipitis brachii | `biceps_brachii` | vorne | ja |
| `biceps_brachii_short` | Bizeps, kurzer Kopf | Caput breve musculi bicipitis brachii | `biceps_brachii` | vorne | ja |
| `brachialis` | Oberarmmuskel | Musculus brachialis | – | vorne | ja |
| `coracobrachialis` | Hakenarmmuskel | Musculus coracobrachialis | – | tief | ja |
| `triceps_brachii` | Trizeps | Musculus triceps brachii | – | hinten | nein (Ganzes) |
| `triceps_brachii_long` | Trizeps, langer Kopf | Caput longum musculi tricipitis brachii | `triceps_brachii` | hinten | ja |
| `triceps_brachii_lateral` | Trizeps, seitlicher Kopf | Caput laterale musculi tricipitis brachii | `triceps_brachii` | hinten | ja |
| `triceps_brachii_medial` | Trizeps, mittlerer Kopf | Caput mediale musculi tricipitis brachii | `triceps_brachii` | tief | ja |
| `anconeus` | Knorrenmuskel | Musculus anconeus | – | hinten | ja |
| `brachioradialis` | Oberarmspeichenmuskel | Musculus brachioradialis | – | vorne und hinten | ja |
| `pronator_teres` | Runder Einwärtsdreher | Musculus pronator teres | – | vorne | ja |
| `supinator` | Auswärtsdreher | Musculus supinator | – | tief | ja |
| `flexor_carpi_radialis` | Speichenseitiger Handbeuger | Musculus flexor carpi radialis | – | vorne | ja |
| `palmaris_longus` | Langer Hohlhandmuskel | Musculus palmaris longus | – | vorne | ja |
| `flexor_carpi_ulnaris` | Ellenseitiger Handbeuger | Musculus flexor carpi ulnaris | – | vorne | ja |
| `flexor_digitorum_superficialis` | Oberflächlicher Fingerbeuger | Musculus flexor digitorum superficialis | – | vorne | ja |
| `flexor_digitorum_profundus` | Tiefer Fingerbeuger | Musculus flexor digitorum profundus | – | tief | ja |
| `extensor_carpi_radialis_longus` | Langer speichenseitiger Handstrecker | Musculus extensor carpi radialis longus | – | hinten | ja |
| `extensor_carpi_radialis_brevis` | Kurzer speichenseitiger Handstrecker | Musculus extensor carpi radialis brevis | – | hinten | ja |
| `extensor_digitorum` | Fingerstrecker | Musculus extensor digitorum | – | hinten | ja |
| `extensor_carpi_ulnaris` | Ellenseitiger Handstrecker | Musculus extensor carpi ulnaris | – | hinten | ja |

## Rücken und Nacken (20)

| ID | Deutsch | Latein | Teil von | Sichtbar | Maske |
|---|---|---|---|---|---|
| `trapezius` | Trapezmuskel | Musculus trapezius | – | vorne und hinten | nein (Ganzes) |
| `trapezius_descending` | Trapezmuskel, absteigender Teil | Pars descendens musculi trapezii | `trapezius` | vorne und hinten | ja |
| `trapezius_transverse` | Trapezmuskel, querverlaufender Teil | Pars transversa musculi trapezii | `trapezius` | hinten | ja |
| `trapezius_ascending` | Trapezmuskel, aufsteigender Teil | Pars ascendens musculi trapezii | `trapezius` | hinten | ja |
| `latissimus_dorsi` | Breiter Rückenmuskel | Musculus latissimus dorsi | – | hinten | ja |
| `teres_major` | Großer Rundmuskel | Musculus teres major | – | hinten | ja |
| `rhomboid_major` | Großer Rautenmuskel | Musculus rhomboideus major | – | tief | ja |
| `rhomboid_minor` | Kleiner Rautenmuskel | Musculus rhomboideus minor | – | tief | ja |
| `levator_scapulae` | Schulterblattheber | Musculus levator scapulae | – | tief | ja |
| `erector_spinae` | Rückenstrecker | Musculus erector spinae | – | hinten | nein (Ganzes) |
| `iliocostalis` | Darmbein-Rippen-Muskel | Musculus iliocostalis | `erector_spinae` | hinten | ja |
| `longissimus` | Längster Rückenmuskel | Musculus longissimus | `erector_spinae` | hinten | ja |
| `spinalis` | Dornmuskel | Musculus spinalis | `erector_spinae` | hinten | ja |
| `multifidus` | Vielgespaltener Muskel | Musculi multifidi | – | tief | ja |
| `quadratus_lumborum` | Quadratischer Lendenmuskel | Musculus quadratus lumborum | – | tief | ja |
| `sternocleidomastoid` | Kopfwender | Musculus sternocleidomastoideus | – | vorne | nein (Ganzes) |
| `sternocleidomastoid_sternal` | Kopfwender, Brustbeinkopf | Caput sternale musculi sternocleidomastoidei | `sternocleidomastoid` | vorne | ja |
| `sternocleidomastoid_clavicular` | Kopfwender, Schlüsselbeinkopf | Caput claviculare musculi sternocleidomastoidei | `sternocleidomastoid` | vorne | ja |
| `splenius_capitis` | Riemenmuskel des Kopfes | Musculus splenius capitis | – | hinten | ja |
| `splenius_cervicis` | Riemenmuskel des Halses | Musculus splenius cervicis | – | tief | ja |

## Bauch (4)

| ID | Deutsch | Latein | Teil von | Sichtbar | Maske |
|---|---|---|---|---|---|
| `rectus_abdominis` | Gerader Bauchmuskel | Musculus rectus abdominis | – | vorne | ja |
| `external_oblique` | Äußerer schräger Bauchmuskel | Musculus obliquus externus abdominis | – | vorne | ja |
| `internal_oblique` | Innerer schräger Bauchmuskel | Musculus obliquus internus abdominis | – | tief | ja |
| `transversus_abdominis` | Querer Bauchmuskel | Musculus transversus abdominis | – | tief | ja |

## Hüfte und Beine (33)

| ID | Deutsch | Latein | Teil von | Sichtbar | Maske |
|---|---|---|---|---|---|
| `gluteus_maximus` | Großer Gesäßmuskel | Musculus gluteus maximus | – | hinten | ja |
| `gluteus_medius` | Mittlerer Gesäßmuskel | Musculus gluteus medius | – | hinten | ja |
| `gluteus_minimus` | Kleiner Gesäßmuskel | Musculus gluteus minimus | – | tief | ja |
| `tensor_fasciae_latae` | Schenkelbindenspanner | Musculus tensor fasciae latae | – | vorne | ja |
| `piriformis` | Birnenförmiger Muskel | Musculus piriformis | – | tief | ja |
| `iliopsoas` | Lenden-Darmbein-Muskel (Hüftbeuger) | Musculus iliopsoas | – | tief | nein (Ganzes) |
| `psoas_major` | Großer Lendenmuskel | Musculus psoas major | `iliopsoas` | tief | ja |
| `iliacus` | Darmbeinmuskel | Musculus iliacus | `iliopsoas` | tief | ja |
| `quadriceps_femoris` | Vierköpfiger Oberschenkelmuskel | Musculus quadriceps femoris | – | vorne | nein (Ganzes) |
| `rectus_femoris` | Gerader Oberschenkelmuskel | Musculus rectus femoris | `quadriceps_femoris` | vorne | ja |
| `vastus_lateralis` | Äußerer Oberschenkelmuskel | Musculus vastus lateralis | `quadriceps_femoris` | vorne | ja |
| `vastus_medialis` | Innerer Oberschenkelmuskel | Musculus vastus medialis | `quadriceps_femoris` | vorne | ja |
| `vastus_intermedius` | Mittlerer Oberschenkelmuskel | Musculus vastus intermedius | `quadriceps_femoris` | tief | ja |
| `sartorius` | Schneidermuskel | Musculus sartorius | – | vorne | ja |
| `biceps_femoris` | Zweiköpfiger Oberschenkelmuskel | Musculus biceps femoris | – | hinten | nein (Ganzes) |
| `biceps_femoris_long` | Zweiköpfiger Oberschenkelmuskel, langer Kopf | Caput longum musculi bicipitis femoris | `biceps_femoris` | hinten | ja |
| `biceps_femoris_short` | Zweiköpfiger Oberschenkelmuskel, kurzer Kopf | Caput breve musculi bicipitis femoris | `biceps_femoris` | tief | ja |
| `semitendinosus` | Halbsehnenmuskel | Musculus semitendinosus | – | hinten | ja |
| `semimembranosus` | Plattsehnenmuskel | Musculus semimembranosus | – | hinten | ja |
| `adductor_magnus` | Großer Schenkelanzieher | Musculus adductor magnus | – | vorne und hinten | ja |
| `adductor_longus` | Langer Schenkelanzieher | Musculus adductor longus | – | vorne | ja |
| `adductor_brevis` | Kurzer Schenkelanzieher | Musculus adductor brevis | – | tief | ja |
| `gracilis` | Schlanker Muskel | Musculus gracilis | – | vorne und hinten | ja |
| `pectineus` | Kammmuskel | Musculus pectineus | – | vorne | ja |
| `triceps_surae` | Dreiköpfiger Wadenmuskel | Musculus triceps surae | – | hinten | nein (Ganzes) |
| `gastrocnemius` | Zwillingswadenmuskel | Musculus gastrocnemius | `triceps_surae` | hinten | nein (Ganzes) |
| `gastrocnemius_medial` | Zwillingswadenmuskel, innerer Kopf | Caput mediale musculi gastrocnemii | `gastrocnemius` | hinten | ja |
| `gastrocnemius_lateral` | Zwillingswadenmuskel, äußerer Kopf | Caput laterale musculi gastrocnemii | `gastrocnemius` | hinten | ja |
| `soleus` | Schollenmuskel | Musculus soleus | `triceps_surae` | vorne und hinten | ja |
| `tibialis_anterior` | Vorderer Schienbeinmuskel | Musculus tibialis anterior | – | vorne | ja |
| `extensor_digitorum_longus` | Langer Zehenstrecker | Musculus extensor digitorum longus | – | vorne | ja |
| `fibularis_longus` | Langer Wadenbeinmuskel | Musculus fibularis longus | – | vorne und hinten | ja |
| `fibularis_brevis` | Kurzer Wadenbeinmuskel | Musculus fibularis brevis | – | tief | ja |

## Zählung

- Masken auf feinster Ebene: **81**, davon von außen sichtbar: **58**, tief: **23**.
- Alte IDs aus Version 0.7 (z. B. `rhomboids`, `adductors`, `forearm_flexors`, `forearm_extensors`) sind in `legacyIds` der JSON-Datei den neuen IDs zugeordnet.
