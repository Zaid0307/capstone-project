// The app's muscle model: real anatomical muscles and their recognised heads/parts
// (Terminologia Anatomica), with the app muscle group each one belongs to.
// Granularity decisions and sources: docs/muskelmodell.md.
//
// Fields:
// - group: one of the six app groups (src/data/muscleGroups.js)
// - de / en / latin: names
// - parent: the whole muscle (or muscle unit) a head/part belongs to. Exercises only
//   refer to the finest entries (leaves); wholes exist for display and legacy data.
// - view: where the muscle is visible on a body figure: 'front', 'back', 'both',
//   or 'deep' (covered by other muscles, not visible superficially)
//
// IDs of the earlier 39-entry model stay valid: every old ID is either still an
// entry here or resolves through LEGACY_MUSCLE_IDS.
export const MUSCLES = {
  // Chest
  pectoralis_major: { group: 'chest', view: 'front', de: 'Großer Brustmuskel', en: 'Pectoralis major', latin: 'Musculus pectoralis major' },
  pectoralis_major_clavicular: { group: 'chest', view: 'front', parent: 'pectoralis_major', de: 'Großer Brustmuskel, Schlüsselbeinteil', en: 'Pectoralis major, clavicular part', latin: 'Pars clavicularis musculi pectoralis majoris' },
  pectoralis_major_sternocostal: { group: 'chest', view: 'front', parent: 'pectoralis_major', de: 'Großer Brustmuskel, Brustbein-Rippen-Teil', en: 'Pectoralis major, sternocostal part', latin: 'Pars sternocostalis musculi pectoralis majoris' },
  pectoralis_major_abdominal: { group: 'chest', view: 'front', parent: 'pectoralis_major', de: 'Großer Brustmuskel, Bauchteil', en: 'Pectoralis major, abdominal part', latin: 'Pars abdominalis musculi pectoralis majoris' },
  pectoralis_minor: { group: 'chest', view: 'deep', de: 'Kleiner Brustmuskel', en: 'Pectoralis minor', latin: 'Musculus pectoralis minor' },
  serratus_anterior: { group: 'chest', view: 'front', de: 'Vorderer Sägemuskel', en: 'Serratus anterior', latin: 'Musculus serratus anterior' },

  // Shoulders (deltoid and rotator cuff)
  deltoid: { group: 'shoulders', view: 'both', de: 'Deltamuskel', en: 'Deltoid', latin: 'Musculus deltoideus' },
  deltoid_anterior: { group: 'shoulders', view: 'front', parent: 'deltoid', de: 'Vorderer Deltamuskel (Schlüsselbeinteil)', en: 'Anterior deltoid (clavicular part)', latin: 'Pars clavicularis musculi deltoidei' },
  deltoid_lateral: { group: 'shoulders', view: 'both', parent: 'deltoid', de: 'Seitlicher Deltamuskel (Schulterhöhenteil)', en: 'Lateral deltoid (acromial part)', latin: 'Pars acromialis musculi deltoidei' },
  deltoid_posterior: { group: 'shoulders', view: 'back', parent: 'deltoid', de: 'Hinterer Deltamuskel (Schulterblattgräten-Teil)', en: 'Posterior deltoid (spinal part)', latin: 'Pars spinalis musculi deltoidei' },
  supraspinatus: { group: 'shoulders', view: 'deep', de: 'Obergrätenmuskel', en: 'Supraspinatus', latin: 'Musculus supraspinatus' },
  infraspinatus: { group: 'shoulders', view: 'back', de: 'Untergrätenmuskel', en: 'Infraspinatus', latin: 'Musculus infraspinatus' },
  teres_minor: { group: 'shoulders', view: 'back', de: 'Kleiner Rundmuskel', en: 'Teres minor', latin: 'Musculus teres minor' },
  subscapularis: { group: 'shoulders', view: 'deep', de: 'Unterschulterblattmuskel', en: 'Subscapularis', latin: 'Musculus subscapularis' },

  // Upper arm
  biceps_brachii: { group: 'arms', view: 'front', de: 'Bizeps', en: 'Biceps brachii', latin: 'Musculus biceps brachii' },
  biceps_brachii_long: { group: 'arms', view: 'front', parent: 'biceps_brachii', de: 'Bizeps, langer Kopf', en: 'Biceps brachii, long head', latin: 'Caput longum musculi bicipitis brachii' },
  biceps_brachii_short: { group: 'arms', view: 'front', parent: 'biceps_brachii', de: 'Bizeps, kurzer Kopf', en: 'Biceps brachii, short head', latin: 'Caput breve musculi bicipitis brachii' },
  brachialis: { group: 'arms', view: 'front', de: 'Oberarmmuskel', en: 'Brachialis', latin: 'Musculus brachialis' },
  coracobrachialis: { group: 'arms', view: 'deep', de: 'Hakenarmmuskel', en: 'Coracobrachialis', latin: 'Musculus coracobrachialis' },
  triceps_brachii: { group: 'arms', view: 'back', de: 'Trizeps', en: 'Triceps brachii', latin: 'Musculus triceps brachii' },
  triceps_brachii_long: { group: 'arms', view: 'back', parent: 'triceps_brachii', de: 'Trizeps, langer Kopf', en: 'Triceps brachii, long head', latin: 'Caput longum musculi tricipitis brachii' },
  triceps_brachii_lateral: { group: 'arms', view: 'back', parent: 'triceps_brachii', de: 'Trizeps, seitlicher Kopf', en: 'Triceps brachii, lateral head', latin: 'Caput laterale musculi tricipitis brachii' },
  triceps_brachii_medial: { group: 'arms', view: 'deep', parent: 'triceps_brachii', de: 'Trizeps, mittlerer Kopf', en: 'Triceps brachii, medial head', latin: 'Caput mediale musculi tricipitis brachii' },
  anconeus: { group: 'arms', view: 'back', de: 'Knorrenmuskel', en: 'Anconeus', latin: 'Musculus anconeus' },

  // Forearm
  brachioradialis: { group: 'arms', view: 'both', de: 'Oberarmspeichenmuskel', en: 'Brachioradialis', latin: 'Musculus brachioradialis' },
  pronator_teres: { group: 'arms', view: 'front', de: 'Runder Einwärtsdreher', en: 'Pronator teres', latin: 'Musculus pronator teres' },
  supinator: { group: 'arms', view: 'deep', de: 'Auswärtsdreher', en: 'Supinator', latin: 'Musculus supinator' },
  flexor_carpi_radialis: { group: 'arms', view: 'front', de: 'Speichenseitiger Handbeuger', en: 'Flexor carpi radialis', latin: 'Musculus flexor carpi radialis' },
  palmaris_longus: { group: 'arms', view: 'front', de: 'Langer Hohlhandmuskel', en: 'Palmaris longus', latin: 'Musculus palmaris longus' },
  flexor_carpi_ulnaris: { group: 'arms', view: 'front', de: 'Ellenseitiger Handbeuger', en: 'Flexor carpi ulnaris', latin: 'Musculus flexor carpi ulnaris' },
  flexor_digitorum_superficialis: { group: 'arms', view: 'front', de: 'Oberflächlicher Fingerbeuger', en: 'Flexor digitorum superficialis', latin: 'Musculus flexor digitorum superficialis' },
  flexor_digitorum_profundus: { group: 'arms', view: 'deep', de: 'Tiefer Fingerbeuger', en: 'Flexor digitorum profundus', latin: 'Musculus flexor digitorum profundus' },
  extensor_carpi_radialis_longus: { group: 'arms', view: 'back', de: 'Langer speichenseitiger Handstrecker', en: 'Extensor carpi radialis longus', latin: 'Musculus extensor carpi radialis longus' },
  extensor_carpi_radialis_brevis: { group: 'arms', view: 'back', de: 'Kurzer speichenseitiger Handstrecker', en: 'Extensor carpi radialis brevis', latin: 'Musculus extensor carpi radialis brevis' },
  extensor_digitorum: { group: 'arms', view: 'back', de: 'Fingerstrecker', en: 'Extensor digitorum', latin: 'Musculus extensor digitorum' },
  extensor_carpi_ulnaris: { group: 'arms', view: 'back', de: 'Ellenseitiger Handstrecker', en: 'Extensor carpi ulnaris', latin: 'Musculus extensor carpi ulnaris' },

  // Back
  trapezius: { group: 'back', view: 'both', de: 'Trapezmuskel', en: 'Trapezius', latin: 'Musculus trapezius' },
  trapezius_descending: { group: 'back', view: 'both', parent: 'trapezius', de: 'Trapezmuskel, absteigender Teil', en: 'Trapezius, descending part', latin: 'Pars descendens musculi trapezii' },
  trapezius_transverse: { group: 'back', view: 'back', parent: 'trapezius', de: 'Trapezmuskel, querverlaufender Teil', en: 'Trapezius, transverse part', latin: 'Pars transversa musculi trapezii' },
  trapezius_ascending: { group: 'back', view: 'back', parent: 'trapezius', de: 'Trapezmuskel, aufsteigender Teil', en: 'Trapezius, ascending part', latin: 'Pars ascendens musculi trapezii' },
  latissimus_dorsi: { group: 'back', view: 'back', de: 'Breiter Rückenmuskel', en: 'Latissimus dorsi', latin: 'Musculus latissimus dorsi' },
  teres_major: { group: 'back', view: 'back', de: 'Großer Rundmuskel', en: 'Teres major', latin: 'Musculus teres major' },
  rhomboid_major: { group: 'back', view: 'deep', de: 'Großer Rautenmuskel', en: 'Rhomboid major', latin: 'Musculus rhomboideus major' },
  rhomboid_minor: { group: 'back', view: 'deep', de: 'Kleiner Rautenmuskel', en: 'Rhomboid minor', latin: 'Musculus rhomboideus minor' },
  levator_scapulae: { group: 'back', view: 'deep', de: 'Schulterblattheber', en: 'Levator scapulae', latin: 'Musculus levator scapulae' },
  erector_spinae: { group: 'back', view: 'back', de: 'Rückenstrecker', en: 'Erector spinae', latin: 'Musculus erector spinae' },
  iliocostalis: { group: 'back', view: 'back', parent: 'erector_spinae', de: 'Darmbein-Rippen-Muskel', en: 'Iliocostalis', latin: 'Musculus iliocostalis' },
  longissimus: { group: 'back', view: 'back', parent: 'erector_spinae', de: 'Längster Rückenmuskel', en: 'Longissimus', latin: 'Musculus longissimus' },
  spinalis: { group: 'back', view: 'back', parent: 'erector_spinae', de: 'Dornmuskel', en: 'Spinalis', latin: 'Musculus spinalis' },
  multifidus: { group: 'back', view: 'deep', de: 'Vielgespaltener Muskel', en: 'Multifidus', latin: 'Musculi multifidi' },
  quadratus_lumborum: { group: 'back', view: 'deep', de: 'Quadratischer Lendenmuskel', en: 'Quadratus lumborum', latin: 'Musculus quadratus lumborum' },

  // Neck (the app has no neck group; neck muscles count as back)
  sternocleidomastoid: { group: 'back', view: 'front', de: 'Kopfwender', en: 'Sternocleidomastoid', latin: 'Musculus sternocleidomastoideus' },
  sternocleidomastoid_sternal: { group: 'back', view: 'front', parent: 'sternocleidomastoid', de: 'Kopfwender, Brustbeinkopf', en: 'Sternocleidomastoid, sternal head', latin: 'Caput sternale musculi sternocleidomastoidei' },
  sternocleidomastoid_clavicular: { group: 'back', view: 'front', parent: 'sternocleidomastoid', de: 'Kopfwender, Schlüsselbeinkopf', en: 'Sternocleidomastoid, clavicular head', latin: 'Caput claviculare musculi sternocleidomastoidei' },
  splenius_capitis: { group: 'back', view: 'back', de: 'Riemenmuskel des Kopfes', en: 'Splenius capitis', latin: 'Musculus splenius capitis' },
  splenius_cervicis: { group: 'back', view: 'deep', de: 'Riemenmuskel des Halses', en: 'Splenius cervicis', latin: 'Musculus splenius cervicis' },

  // Abdomen
  rectus_abdominis: { group: 'abs', view: 'front', de: 'Gerader Bauchmuskel', en: 'Rectus abdominis', latin: 'Musculus rectus abdominis' },
  external_oblique: { group: 'abs', view: 'front', de: 'Äußerer schräger Bauchmuskel', en: 'External oblique', latin: 'Musculus obliquus externus abdominis' },
  internal_oblique: { group: 'abs', view: 'deep', de: 'Innerer schräger Bauchmuskel', en: 'Internal oblique', latin: 'Musculus obliquus internus abdominis' },
  transversus_abdominis: { group: 'abs', view: 'deep', de: 'Querer Bauchmuskel', en: 'Transversus abdominis', latin: 'Musculus transversus abdominis' },

  // Hip
  gluteus_maximus: { group: 'legs', view: 'back', de: 'Großer Gesäßmuskel', en: 'Gluteus maximus', latin: 'Musculus gluteus maximus' },
  gluteus_medius: { group: 'legs', view: 'back', de: 'Mittlerer Gesäßmuskel', en: 'Gluteus medius', latin: 'Musculus gluteus medius' },
  gluteus_minimus: { group: 'legs', view: 'deep', de: 'Kleiner Gesäßmuskel', en: 'Gluteus minimus', latin: 'Musculus gluteus minimus' },
  tensor_fasciae_latae: { group: 'legs', view: 'front', de: 'Schenkelbindenspanner', en: 'Tensor fasciae latae', latin: 'Musculus tensor fasciae latae' },
  piriformis: { group: 'legs', view: 'deep', de: 'Birnenförmiger Muskel', en: 'Piriformis', latin: 'Musculus piriformis' },
  iliopsoas: { group: 'legs', view: 'deep', de: 'Lenden-Darmbein-Muskel (Hüftbeuger)', en: 'Iliopsoas (hip flexor)', latin: 'Musculus iliopsoas' },
  psoas_major: { group: 'legs', view: 'deep', parent: 'iliopsoas', de: 'Großer Lendenmuskel', en: 'Psoas major', latin: 'Musculus psoas major' },
  iliacus: { group: 'legs', view: 'deep', parent: 'iliopsoas', de: 'Darmbeinmuskel', en: 'Iliacus', latin: 'Musculus iliacus' },

  // Thigh
  quadriceps_femoris: { group: 'legs', view: 'front', de: 'Vierköpfiger Oberschenkelmuskel', en: 'Quadriceps femoris', latin: 'Musculus quadriceps femoris' },
  rectus_femoris: { group: 'legs', view: 'front', parent: 'quadriceps_femoris', de: 'Gerader Oberschenkelmuskel', en: 'Rectus femoris', latin: 'Musculus rectus femoris' },
  vastus_lateralis: { group: 'legs', view: 'front', parent: 'quadriceps_femoris', de: 'Äußerer Oberschenkelmuskel', en: 'Vastus lateralis', latin: 'Musculus vastus lateralis' },
  vastus_medialis: { group: 'legs', view: 'front', parent: 'quadriceps_femoris', de: 'Innerer Oberschenkelmuskel', en: 'Vastus medialis', latin: 'Musculus vastus medialis' },
  vastus_intermedius: { group: 'legs', view: 'deep', parent: 'quadriceps_femoris', de: 'Mittlerer Oberschenkelmuskel', en: 'Vastus intermedius', latin: 'Musculus vastus intermedius' },
  sartorius: { group: 'legs', view: 'front', de: 'Schneidermuskel', en: 'Sartorius', latin: 'Musculus sartorius' },
  biceps_femoris: { group: 'legs', view: 'back', de: 'Zweiköpfiger Oberschenkelmuskel', en: 'Biceps femoris', latin: 'Musculus biceps femoris' },
  biceps_femoris_long: { group: 'legs', view: 'back', parent: 'biceps_femoris', de: 'Zweiköpfiger Oberschenkelmuskel, langer Kopf', en: 'Biceps femoris, long head', latin: 'Caput longum musculi bicipitis femoris' },
  biceps_femoris_short: { group: 'legs', view: 'deep', parent: 'biceps_femoris', de: 'Zweiköpfiger Oberschenkelmuskel, kurzer Kopf', en: 'Biceps femoris, short head', latin: 'Caput breve musculi bicipitis femoris' },
  semitendinosus: { group: 'legs', view: 'back', de: 'Halbsehnenmuskel', en: 'Semitendinosus', latin: 'Musculus semitendinosus' },
  semimembranosus: { group: 'legs', view: 'back', de: 'Plattsehnenmuskel', en: 'Semimembranosus', latin: 'Musculus semimembranosus' },
  adductor_magnus: { group: 'legs', view: 'both', de: 'Großer Schenkelanzieher', en: 'Adductor magnus', latin: 'Musculus adductor magnus' },
  adductor_longus: { group: 'legs', view: 'front', de: 'Langer Schenkelanzieher', en: 'Adductor longus', latin: 'Musculus adductor longus' },
  adductor_brevis: { group: 'legs', view: 'deep', de: 'Kurzer Schenkelanzieher', en: 'Adductor brevis', latin: 'Musculus adductor brevis' },
  gracilis: { group: 'legs', view: 'both', de: 'Schlanker Muskel', en: 'Gracilis', latin: 'Musculus gracilis' },
  pectineus: { group: 'legs', view: 'front', de: 'Kammmuskel', en: 'Pectineus', latin: 'Musculus pectineus' },

  // Lower leg
  triceps_surae: { group: 'legs', view: 'back', de: 'Dreiköpfiger Wadenmuskel', en: 'Triceps surae', latin: 'Musculus triceps surae' },
  gastrocnemius: { group: 'legs', view: 'back', parent: 'triceps_surae', de: 'Zwillingswadenmuskel', en: 'Gastrocnemius', latin: 'Musculus gastrocnemius' },
  gastrocnemius_medial: { group: 'legs', view: 'back', parent: 'gastrocnemius', de: 'Zwillingswadenmuskel, innerer Kopf', en: 'Gastrocnemius, medial head', latin: 'Caput mediale musculi gastrocnemii' },
  gastrocnemius_lateral: { group: 'legs', view: 'back', parent: 'gastrocnemius', de: 'Zwillingswadenmuskel, äußerer Kopf', en: 'Gastrocnemius, lateral head', latin: 'Caput laterale musculi gastrocnemii' },
  soleus: { group: 'legs', view: 'both', parent: 'triceps_surae', de: 'Schollenmuskel', en: 'Soleus', latin: 'Musculus soleus' },
  tibialis_anterior: { group: 'legs', view: 'front', de: 'Vorderer Schienbeinmuskel', en: 'Tibialis anterior', latin: 'Musculus tibialis anterior' },
  extensor_digitorum_longus: { group: 'legs', view: 'front', de: 'Langer Zehenstrecker', en: 'Extensor digitorum longus', latin: 'Musculus extensor digitorum longus' },
  fibularis_longus: { group: 'legs', view: 'both', de: 'Langer Wadenbeinmuskel', en: 'Fibularis (peroneus) longus', latin: 'Musculus fibularis longus' },
  fibularis_brevis: { group: 'legs', view: 'deep', de: 'Kurzer Wadenbeinmuskel', en: 'Fibularis (peroneus) brevis', latin: 'Musculus fibularis brevis' },
};

// IDs of the earlier 39-entry model that are no longer entries, because they named
// groups of several muscles rather than one muscle. Each maps to the muscles it meant.
// All other old IDs are still entries of MUSCLES (some now as wholes with parts).
export const LEGACY_MUSCLE_IDS = {
  rhomboids: ['rhomboid_major', 'rhomboid_minor'],
  adductors: ['adductor_magnus', 'adductor_longus', 'adductor_brevis', 'gracilis', 'pectineus'],
  forearm_flexors: [
    'flexor_carpi_radialis', 'palmaris_longus', 'flexor_carpi_ulnaris',
    'flexor_digitorum_superficialis', 'flexor_digitorum_profundus',
  ],
  forearm_extensors: [
    'extensor_carpi_radialis_longus', 'extensor_carpi_radialis_brevis',
    'extensor_digitorum', 'extensor_carpi_ulnaris',
  ],
};

const CHILDREN = {};
for (const [id, muscle] of Object.entries(MUSCLES)) {
  if (muscle.parent) (CHILDREN[muscle.parent] ??= []).push(id);
}

// The finest muscles (heads/parts, or whole muscles without parts) an ID stands for.
// Accepts current IDs, wholes and legacy IDs; unknown IDs give an empty list.
export function resolveMuscleId(id) {
  if (LEGACY_MUSCLE_IDS[id]) return LEGACY_MUSCLE_IDS[id].flatMap(resolveMuscleId);
  if (!MUSCLES[id]) return [];
  if (!CHILDREN[id]) return [id];
  return CHILDREN[id].flatMap(resolveMuscleId);
}
