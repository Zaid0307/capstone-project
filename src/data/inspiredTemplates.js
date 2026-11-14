// Plan templates inspired by well-known anime training routines. Fan ideas, not
// official: only the training idea is taken over (no names of real people, no
// pictures, no logos). Every routine is scaled to something a normal person can
// do safely: rest days, a ramp-up and clear limits. Same shape as planTemplates.json.

const reps = (sets, min, max = min, restSeconds = 60, rirTarget = 2) => ({
  sets,
  dose: { unit: 'repetitions', min, max },
  restSeconds,
  rirTarget,
});
const seconds = (sets, value, restSeconds = 60) => ({
  sets,
  dose: { unit: 'seconds', value },
  restSeconds,
  rirTarget: null,
});
const entry = (exerciseId, dose) => ({ exerciseId, ...dose });

const REST = {
  type: 'rest',
  name: { de: 'Pause', en: 'Rest' },
  note: { de: 'Regeneration, leichte Alltagsbewegung optional.', en: 'Recovery; light everyday movement is optional.' },
  entries: [],
};

const WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Training days by weekday, every other day a rest day.
function week(days) {
  return WEEK.map(day => (days[day] ? { day, type: 'workout', note: null, ...days[day] } : { day, ...REST }));
}

const SAFETY_BODYWEIGHT = {
  caution: {
    de: 'Fan-Plan, nicht offiziell. Langsam steigern, saubere Technik vor Wiederholungszahl. Bei Schmerzen in Rücken, Schulter oder Knie abbrechen. Die Originalroutine „jeden Tag“ ist ohne Ruhetage für die meisten zu viel.',
    en: 'Fan plan, not official. Increase slowly, clean technique before rep counts. Stop if your back, shoulders or knees hurt. The original “every day” routine without rest days is too much for most people.',
  },
  medicalClearance: true,
};

const PROGRESSION_RAMP = {
  instruction: {
    de: 'Jede Woche pro Übung 1 Satz oder 2–5 Wiederholungen mehr, solange alle Sätze sauber gelingen. Die Laufzeit pro Woche um höchstens 10 % steigern.',
    en: 'Each week add 1 set or 2–5 reps per exercise as long as every set stays clean. Increase the running time by at most 10 % per week.',
  },
  repsInReserve: { de: 'ca. 2, die letzten Wiederholungen bleiben sauber', en: 'about 2; the last reps stay clean' },
  recovery: {
    de: 'Mindestens ein Ruhetag zwischen harten Einheiten; Schlaf und Essen zählen mit.',
    en: 'At least one rest day between hard sessions; sleep and food count too.',
  },
};

export const INSPIRED_TEMPLATES = [
  {
    id: 'anime_hero_100_start',
    version: '1.0.0',
    category: 'anime',
    name: { de: 'Hero-100 Einstieg (inspiriert von One Punch Man)', en: 'Hero 100 starter (inspired by One Punch Man)' },
    description: {
      de: 'Die bekannte 100er-Routine (Liegestütze, Sit-ups, Kniebeugen, Laufen) als realistischer Einstieg: 3 Tage pro Woche, in Sätze aufgeteilt, mit Steigerung bis zur vollen Routine.',
      en: 'The famous 100 routine (push-ups, sit-ups, squats, running) as a realistic start: 3 days a week, split into sets, ramping up to the full routine.',
    },
    goals: ['general_fitness', 'conditioning'],
    level: 'beginner',
    setting: 'home',
    audience: 'all',
    weeklyTrainingDays: 3,
    progression: PROGRESSION_RAMP,
    safety: SAFETY_BODYWEIGHT,
    days: week({
      monday: {
        name: { de: 'Hero-Routine', en: 'Hero routine' },
        note: {
          de: 'Laufen: Gehen und lockeres Laufen im Wechsel (z. B. 2 min laufen, 1 min gehen).',
          en: 'Running: alternate walking and easy running (e.g. 2 min running, 1 min walking).',
        },
        entries: [
          entry('push_up', reps(5, 6, 10, 60)),
          entry('sit_up', reps(5, 10, 15, 45)),
          entry('bodyweight_squat', reps(5, 15, 20, 60)),
          entry('band_row', reps(3, 12, 15, 60)),
          entry('easy_run', seconds(1, 900, 0)),
        ],
      },
      wednesday: {
        name: { de: 'Hero-Routine', en: 'Hero routine' },
        note: {
          de: 'Laufen: Gehen und lockeres Laufen im Wechsel (z. B. 2 min laufen, 1 min gehen).',
          en: 'Running: alternate walking and easy running (e.g. 2 min running, 1 min walking).',
        },
        entries: [
          entry('push_up', reps(5, 6, 10, 60)),
          entry('sit_up', reps(5, 10, 15, 45)),
          entry('bodyweight_squat', reps(5, 15, 20, 60)),
          entry('band_row', reps(3, 12, 15, 60)),
          entry('easy_run', seconds(1, 900, 0)),
        ],
      },
      friday: {
        name: { de: 'Hero-Routine', en: 'Hero routine' },
        note: {
          de: 'Laufen: Gehen und lockeres Laufen im Wechsel (z. B. 2 min laufen, 1 min gehen).',
          en: 'Running: alternate walking and easy running (e.g. 2 min running, 1 min walking).',
        },
        entries: [
          entry('push_up', reps(5, 6, 10, 60)),
          entry('sit_up', reps(5, 10, 15, 45)),
          entry('bodyweight_squat', reps(5, 15, 20, 60)),
          entry('band_row', reps(3, 12, 15, 60)),
          entry('easy_run', seconds(1, 900, 0)),
        ],
      },
    }),
  },
  {
    id: 'anime_hero_100_full',
    version: '1.0.0',
    category: 'anime',
    name: { de: 'Hero-100 komplett (inspiriert von One Punch Man)', en: 'Hero 100 full (inspired by One Punch Man)' },
    description: {
      de: 'Die volle Routine: 100 Liegestütze, 100 Sit-ups, 100 Kniebeugen, dazu Zugübungen als Ausgleich für Rücken und Schultern. 3 Tage pro Woche statt täglich; das Laufen wächst von 40 Minuten bis zu 10 km. Erst nach dem Einstiegsplan.',
      en: 'The full routine: 100 push-ups, 100 sit-ups, 100 squats, plus pulling work to balance back and shoulders. 3 days a week instead of daily; the run grows from 40 minutes to 10 km. Only after the starter plan.',
    },
    goals: ['general_fitness', 'conditioning'],
    level: 'advanced',
    setting: 'home',
    audience: 'all',
    weeklyTrainingDays: 3,
    progression: {
      ...PROGRESSION_RAMP,
      instruction: {
        de: 'Ziel ist die ganze Routine sauber in weniger Sätzen. Laufen pro Woche um höchstens 10 % verlängern, bis 10 km locker gehen. Wer alles sicher schafft, ersetzt Liegestütze durch enge Liegestütze oder Dips statt mehr Wiederholungen.',
        en: 'The goal is the whole routine done cleanly in fewer sets. Lengthen the run by at most 10 % a week until 10 km feel easy. Once everything is easy, swap push-ups for close-grip push-ups or dips instead of adding reps.',
      },
    },
    safety: SAFETY_BODYWEIGHT,
    days: week({
      monday: {
        name: { de: 'Hero-Routine', en: 'Hero routine' },
        entries: [
          entry('push_up', reps(10, 10, 10, 60, 3)),
          entry('assisted_pull_up', reps(5, 5, 10, 90)),
          entry('band_pull_apart', reps(3, 15, 20, 45)),
          entry('sit_up', reps(5, 20, 20, 45)),
          entry('bodyweight_squat', reps(5, 20, 20, 60)),
          entry('easy_run', seconds(1, 2400, 0)),
        ],
      },
      wednesday: {
        name: { de: 'Hero-Routine', en: 'Hero routine' },
        entries: [
          entry('push_up', reps(10, 10, 10, 60, 3)),
          entry('assisted_pull_up', reps(5, 5, 10, 90)),
          entry('band_pull_apart', reps(3, 15, 20, 45)),
          entry('sit_up', reps(5, 20, 20, 45)),
          entry('bodyweight_squat', reps(5, 20, 20, 60)),
          entry('easy_run', seconds(1, 2400, 0)),
        ],
      },
      friday: {
        name: { de: 'Hero-Routine', en: 'Hero routine' },
        entries: [
          entry('push_up', reps(10, 10, 10, 60, 3)),
          entry('assisted_pull_up', reps(5, 5, 10, 90)),
          entry('band_pull_apart', reps(3, 15, 20, 45)),
          entry('sit_up', reps(5, 20, 20, 45)),
          entry('bodyweight_squat', reps(5, 20, 20, 60)),
          entry('easy_run', seconds(1, 2400, 0)),
        ],
      },
    }),
  },
  {
    id: 'anime_boxer_roadwork',
    version: '1.0.0',
    category: 'anime',
    name: { de: 'Boxer-Roadwork (inspiriert von Hajime no Ippo)', en: 'Boxer roadwork (inspired by Hajime no Ippo)' },
    description: {
      de: 'Training wie ein junger Profiboxer: Laufen, Seilspringen, Schattenboxen und Sack, dazu Kraft für Rumpf, Rücken und Beine. 4 Tage pro Woche.',
      en: 'Train like a young pro boxer: running, rope, shadow boxing and the bag, plus strength for core, back and legs. 4 days a week.',
    },
    goals: ['boxing', 'conditioning'],
    level: 'intermediate',
    setting: 'mixed',
    audience: 'all',
    weeklyTrainingDays: 4,
    progression: PROGRESSION_RAMP,
    safety: {
      caution: {
        de: 'Fan-Plan, nicht offiziell. Hände bandagieren, Boxhandschuhe tragen, Technik vor Härte; keine maximalen Schläge. Kein Sparring ohne Trainer.',
        en: 'Fan plan, not official. Wrap your hands, wear boxing gloves, technique before power; no maximum punches. No sparring without a coach.',
      },
      medicalClearance: true,
    },
    days: week({
      monday: {
        name: { de: 'Roadwork + Rumpf', en: 'Roadwork + core' },
        entries: [
          entry('easy_run', seconds(1, 1800, 0)),
          entry('jump_rope', seconds(3, 120, 60)),
          entry('sit_up', reps(3, 15, 20, 45)),
          entry('side_plank', seconds(2, 30, 30)),
          entry('push_up', reps(3, 10, 15, 60)),
        ],
      },
      tuesday: {
        name: { de: 'Technik am Sack', en: 'Bag technique' },
        entries: [
          entry('shadow_boxing', seconds(3, 120, 60)),
          entry('heavy_bag_jab', seconds(3, 90, 60)),
          entry('heavy_bag_jab_cross', seconds(3, 90, 60)),
          entry('heavy_bag_hook', seconds(3, 60, 60)),
          entry('jump_rope', seconds(2, 120, 60)),
        ],
      },
      thursday: {
        name: { de: 'Kraft Beine und Rücken', en: 'Leg and back strength' },
        entries: [
          entry('goblet_squat', reps(3, 10, 12, 90)),
          entry('reverse_lunge', reps(3, 8, 10, 60)),
          entry('pull_up', reps(3, 4, 8, 120)),
          entry('one_arm_dumbbell_row', reps(3, 10, 12, 60)),
          entry('plank', seconds(3, 40, 45)),
        ],
      },
      saturday: {
        name: { de: 'Roadwork + Sack', en: 'Roadwork + bag' },
        entries: [
          entry('easy_run', seconds(1, 2400, 0)),
          entry('shadow_boxing', seconds(2, 120, 60)),
          entry('heavy_bag_jab_cross', seconds(4, 90, 60)),
          entry('reverse_lunge', reps(3, 8, 12, 60)),
          entry('hanging_knee_raise', reps(3, 8, 12, 60)),
        ],
      },
    }),
  },
  {
    id: 'anime_scout_regiment',
    version: '1.0.0',
    category: 'anime',
    name: { de: 'Aufklärungstrupp (inspiriert von Attack on Titan)', en: 'Scout regiment (inspired by Attack on Titan)' },
    description: {
      de: 'Für Rumpfspannung, Zugkraft und Ausdauer, wie sie das Manövertraining verlangt: Klimmzüge, hängendes Knieheben, Planks, einbeinige Beinübungen und Läufe. 3 Tage pro Woche.',
      en: 'For core tension, pulling strength and endurance as the manoeuvre training demands: pull-ups, hanging knee raises, planks, single-leg work and runs. 3 days a week.',
    },
    goals: ['general_fitness', 'strength'],
    level: 'intermediate',
    setting: 'mixed',
    audience: 'all',
    weeklyTrainingDays: 3,
    progression: PROGRESSION_RAMP,
    safety: {
      caution: {
        de: 'Fan-Plan, nicht offiziell. Wer noch keinen Klimmzug schafft, nimmt Klimmzüge mit Band. Schultern beim Hängen aktiv halten, nicht ins Gelenk fallen lassen.',
        en: 'Fan plan, not official. If you cannot do a pull-up yet, use band-assisted pull-ups. Keep your shoulders active when hanging; do not sag into the joint.',
      },
      medicalClearance: true,
    },
    days: week({
      monday: {
        name: { de: 'Zug und Rumpf', en: 'Pull and core' },
        entries: [
          entry('assisted_pull_up', reps(4, 5, 8, 120)),
          entry('band_row', reps(3, 12, 15, 60)),
          entry('hanging_knee_raise', reps(3, 8, 12, 60)),
          entry('side_plank', seconds(3, 30, 30)),
          entry('face_pull', reps(3, 12, 15, 60)),
        ],
      },
      wednesday: {
        name: { de: 'Beine und Gleichgewicht', en: 'Legs and balance' },
        entries: [
          entry('bulgarian_split_squat', reps(3, 8, 10, 90)),
          entry('step_up', reps(3, 10, 12, 60)),
          entry('glute_bridge', reps(3, 12, 15, 60)),
          entry('dead_bug', reps(3, 8, 10, 45)),
          entry('easy_run', seconds(1, 1200, 0)),
        ],
      },
      friday: {
        name: { de: 'Drücken und Ausdauer', en: 'Push and endurance' },
        entries: [
          entry('push_up', reps(4, 8, 15, 60)),
          entry('dumbbell_shoulder_press', reps(3, 8, 12, 90)),
          entry('goblet_squat', reps(3, 8, 12, 90)),
          entry('pull_up', reps(3, 3, 6, 120)),
          entry('plank', seconds(3, 45, 45)),
          entry('easy_run', seconds(1, 1500, 0)),
        ],
      },
    }),
  },
  {
    id: 'anime_saiyan_strength',
    version: '1.0.0',
    category: 'anime',
    name: { de: 'Saiyajin-Kraft (inspiriert von Dragon Ball)', en: 'Saiyan strength (inspired by Dragon Ball)' },
    description: {
      de: 'Schwer und einfach: Grundübungen mit der Langhantel im Ober-/Unterkörper-Wechsel, 4 Tage pro Woche. Für Kraft und Masse statt Gewichtswesten und Schwerkraftraum.',
      en: 'Heavy and simple: barbell basics in an upper/lower split, 4 days a week. For strength and size instead of weighted clothes and a gravity room.',
    },
    goals: ['strength', 'hypertrophy'],
    level: 'intermediate',
    setting: 'gym',
    audience: 'all',
    weeklyTrainingDays: 4,
    progression: {
      instruction: {
        de: 'Grundübungen im Bereich 4–6 Wiederholungen: sobald alle Sätze 6 sauber schaffen, 2,5 kg (Oberkörper) bzw. 5 kg (Beine, Kreuzheben) mehr.',
        en: 'Main lifts at 4–6 reps: once every set reaches 6 cleanly, add 2.5 kg (upper body) or 5 kg (legs, deadlift).',
      },
      repsInReserve: { de: 'ca. 2 bei Grundübungen, 1–2 bei Zusatzübungen', en: 'about 2 on main lifts, 1–2 on accessories' },
      recovery: {
        de: 'Mindestens 48 Stunden zwischen zwei schweren Einheiten derselben Muskeln.',
        en: 'At least 48 hours between two heavy sessions for the same muscles.',
      },
    },
    safety: {
      caution: {
        de: 'Fan-Plan, nicht offiziell. Schwere Kniebeugen und Bankdrücken nur im Rack mit Sicherungsablagen. Kein Training bis zum Versagen bei Grundübungen.',
        en: 'Fan plan, not official. Heavy squats and bench presses only in a rack with safety bars. No training to failure on the main lifts.',
      },
      medicalClearance: true,
    },
    days: week({
      monday: {
        name: { de: 'Oberkörper schwer', en: 'Upper heavy' },
        entries: [
          entry('barbell_bench_press', reps(4, 4, 6, 180)),
          entry('barbell_row', reps(4, 6, 8, 150)),
          entry('barbell_overhead_press', reps(3, 6, 8, 150)),
          entry('pull_up', reps(3, 6, 10, 120)),
          entry('dumbbell_lateral_raise', reps(2, 12, 20, 60, 1)),
          entry('triceps_pushdown', reps(2, 10, 12, 60, 1)),
          entry('barbell_curl', reps(2, 8, 12, 60, 1)),
        ],
      },
      tuesday: {
        name: { de: 'Unterkörper schwer', en: 'Lower heavy' },
        entries: [
          entry('barbell_squat', reps(4, 4, 6, 180)),
          entry('romanian_deadlift', reps(3, 6, 8, 150)),
          entry('bulgarian_split_squat', reps(3, 8, 10, 90)),
          entry('calf_raise', reps(3, 10, 15, 60, 1)),
          entry('hanging_knee_raise', reps(3, 10, 12, 60)),
        ],
      },
      thursday: {
        name: { de: 'Oberkörper Volumen', en: 'Upper volume' },
        entries: [
          entry('incline_dumbbell_press', reps(4, 8, 12, 120)),
          entry('cable_lat_pulldown', reps(3, 8, 12, 90)),
          entry('seated_cable_row', reps(3, 10, 12, 90)),
          entry('dumbbell_lateral_raise', reps(4, 12, 15, 60, 1)),
          entry('face_pull', reps(3, 12, 15, 60)),
          entry('hammer_curl', reps(2, 10, 12, 60, 1)),
        ],
      },
      friday: {
        name: { de: 'Unterkörper + Kreuzheben', en: 'Lower + deadlift' },
        entries: [
          entry('conventional_deadlift', reps(3, 3, 5, 180)),
          entry('leg_press', reps(3, 10, 12, 120)),
          entry('lying_leg_curl', reps(3, 10, 12, 90)),
          entry('hip_thrust', reps(3, 8, 12, 90)),
          entry('plank', seconds(3, 45, 45)),
        ],
      },
    }),
  },
];
