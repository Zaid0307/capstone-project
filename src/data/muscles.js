// The 39 muscles (or muscle groups) the app knows, with the app's muscle group
// each one belongs to. IDs match the graphics package (fitness-graphics-v0.7).
export const MUSCLES = {
  pectoralis_major: { group: 'chest', de: 'Großer Brustmuskel', en: 'Pectoralis major', latin: 'Musculus pectoralis major' },
  pectoralis_minor: { group: 'chest', de: 'Kleiner Brustmuskel', en: 'Pectoralis minor', latin: 'Musculus pectoralis minor' },
  serratus_anterior: { group: 'chest', de: 'Vorderer Sägemuskel', en: 'Serratus anterior', latin: 'Musculus serratus anterior' },

  deltoid_anterior: { group: 'shoulders', de: 'Vorderer Deltamuskel', en: 'Anterior deltoid', latin: 'Pars clavicularis musculi deltoidei' },
  deltoid_lateral: { group: 'shoulders', de: 'Seitlicher Deltamuskel', en: 'Lateral deltoid', latin: 'Pars acromialis musculi deltoidei' },
  deltoid_posterior: { group: 'shoulders', de: 'Hinterer Deltamuskel', en: 'Posterior deltoid', latin: 'Pars spinalis musculi deltoidei' },
  supraspinatus: { group: 'shoulders', de: 'Obergrätenmuskel', en: 'Supraspinatus', latin: 'Musculus supraspinatus' },
  infraspinatus: { group: 'shoulders', de: 'Untergrätenmuskel', en: 'Infraspinatus', latin: 'Musculus infraspinatus' },
  teres_minor: { group: 'shoulders', de: 'Kleiner Rundmuskel', en: 'Teres minor', latin: 'Musculus teres minor' },
  subscapularis: { group: 'shoulders', de: 'Unterschulterblattmuskel', en: 'Subscapularis', latin: 'Musculus subscapularis' },

  biceps_brachii: { group: 'arms', de: 'Bizeps', en: 'Biceps', latin: 'Musculus biceps brachii' },
  brachialis: { group: 'arms', de: 'Oberarmmuskel', en: 'Brachialis', latin: 'Musculus brachialis' },
  triceps_brachii: { group: 'arms', de: 'Trizeps', en: 'Triceps', latin: 'Musculus triceps brachii' },
  forearm_flexors: { group: 'arms', de: 'Unterarmbeuger', en: 'Forearm flexors', latin: 'Flexores antebrachii' },
  forearm_extensors: { group: 'arms', de: 'Unterarmstrecker', en: 'Forearm extensors', latin: 'Extensores antebrachii' },

  trapezius: { group: 'back', de: 'Trapezmuskel', en: 'Trapezius', latin: 'Musculus trapezius' },
  latissimus_dorsi: { group: 'back', de: 'Breiter Rückenmuskel', en: 'Latissimus dorsi', latin: 'Musculus latissimus dorsi' },
  rhomboids: { group: 'back', de: 'Rautenmuskeln', en: 'Rhomboids', latin: 'Musculi rhomboidei' },
  teres_major: { group: 'back', de: 'Großer Rundmuskel', en: 'Teres major', latin: 'Musculus teres major' },
  erector_spinae: { group: 'back', de: 'Rückenstrecker', en: 'Erector spinae', latin: 'Musculus erector spinae' },

  rectus_abdominis: { group: 'abs', de: 'Gerader Bauchmuskel', en: 'Rectus abdominis', latin: 'Musculus rectus abdominis' },
  external_oblique: { group: 'abs', de: 'Äußerer schräger Bauchmuskel', en: 'External oblique', latin: 'Musculus obliquus externus abdominis' },
  internal_oblique: { group: 'abs', de: 'Innerer schräger Bauchmuskel', en: 'Internal oblique', latin: 'Musculus obliquus internus abdominis' },
  transversus_abdominis: { group: 'abs', de: 'Querer Bauchmuskel', en: 'Transversus abdominis', latin: 'Musculus transversus abdominis' },

  gluteus_maximus: { group: 'legs', de: 'Großer Gesäßmuskel', en: 'Gluteus maximus', latin: 'Musculus gluteus maximus' },
  gluteus_medius: { group: 'legs', de: 'Mittlerer Gesäßmuskel', en: 'Gluteus medius', latin: 'Musculus gluteus medius' },
  gluteus_minimus: { group: 'legs', de: 'Kleiner Gesäßmuskel', en: 'Gluteus minimus', latin: 'Musculus gluteus minimus' },
  iliopsoas: { group: 'legs', de: 'Hüftbeuger', en: 'Hip flexors (iliopsoas)', latin: 'Musculus iliopsoas' },
  rectus_femoris: { group: 'legs', de: 'Gerader Oberschenkelmuskel', en: 'Rectus femoris', latin: 'Musculus rectus femoris' },
  vastus_lateralis: { group: 'legs', de: 'Äußerer Oberschenkelmuskel', en: 'Vastus lateralis', latin: 'Musculus vastus lateralis' },
  vastus_medialis: { group: 'legs', de: 'Innerer Oberschenkelmuskel', en: 'Vastus medialis', latin: 'Musculus vastus medialis' },
  vastus_intermedius: { group: 'legs', de: 'Mittlerer Oberschenkelmuskel', en: 'Vastus intermedius', latin: 'Musculus vastus intermedius' },
  biceps_femoris: { group: 'legs', de: 'Zweiköpfiger Oberschenkelmuskel', en: 'Biceps femoris', latin: 'Musculus biceps femoris' },
  semitendinosus: { group: 'legs', de: 'Halbsehnenmuskel', en: 'Semitendinosus', latin: 'Musculus semitendinosus' },
  semimembranosus: { group: 'legs', de: 'Plattsehnenmuskel', en: 'Semimembranosus', latin: 'Musculus semimembranosus' },
  adductors: { group: 'legs', de: 'Adduktoren', en: 'Adductors', latin: 'Musculi adductores' },
  gastrocnemius: { group: 'legs', de: 'Zwillingswadenmuskel', en: 'Gastrocnemius', latin: 'Musculus gastrocnemius' },
  soleus: { group: 'legs', de: 'Schollenmuskel', en: 'Soleus', latin: 'Musculus soleus' },
  tibialis_anterior: { group: 'legs', de: 'Vorderer Schienbeinmuskel', en: 'Tibialis anterior', latin: 'Musculus tibialis anterior' },
};
