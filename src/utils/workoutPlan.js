import { nanoid } from 'nanoid';
import { MUSCLE_GROUP_NAMES } from '../data/muscleGroups';
import { exerciseLibrary, preloadExerciseLibrary } from '../data/exerciseLibraryLoader';
import LEGACY_EXERCISE_NAMES from '../data/legacyExerciseNames.json';
import { MUSCLES, resolveMuscleId } from '../data/muscles';

// Plan model 4 (docs/konzept-plaene-training-auswertung.md, section 7.1):
//
// plan  { id, schemaVersion, nameOfWorkout, description, schedule, days, template?, hints? }
// day   { id, name, weekdays, weekday | null, note?, entries } – entries in training order
//   weekdays: the weekdays the day is trained on, in week order (e.g. full body
//   on Monday and Thursday). weekday mirrors weekdays[0] for the parts of the app
//   that still read one weekday (today, diary, calendar, analysis); set both with
//   withWeekdays.
// entry { id, exerciseId | null, exercise, muscle, note?, restSeconds | null, perSide?, groupId?, sets }
//   perSide: done for one arm, leg or side at a time (logged left and right)
//   groupId: entries next to each other with the same groupId form a superset (2–3
//   exercises back to back); only the last one has a rest, the others have 0 s.
//   Older plans have no groupId and work as before.
// schedule { type: 'weekdays' | 'rotation', daysPerWeek?, startDate?, endDate? } – daysPerWeek: trainings per
//   week of a rotation plan; dates as 'YYYY-MM-DD'
// setup? { place: 'gym' | 'home' | 'mixed', equipment: string[] | null } – where the
//   plan is trained and which equipment is there (ids of data/equipment.js); null
//   means a full gym. Plans without setup show every exercise.
// archived?: true for plans no longer in use. Several plans can be active at the same time.
// set   { type: 'working' | 'warmup', dose, weight | null, rirTarget | null }
// dose  { unit: 'repetitions', min, max } | { unit: 'seconds', value }
//
// Version 3 had one weekday per day.
// Version 2 had one dose and a set count per entry and every day was a weekday.
// Version 1 (older app versions) nested exercises under muscles, all as text.
export const PLAN_SCHEMA_VERSION = 4;

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// 'weekdays': every day has a fixed weekday. 'rotation': days follow each other
// in their order, on whatever days the user trains.
export const SCHEDULE_TYPES = ['weekdays', 'rotation'];

export const SET_TYPES = ['working', 'warmup'];

// Exercise categories that are usually measured in time instead of repetitions.
const TIMED_CATEGORIES = ['isometric', 'stretch', 'yoga', 'cardio', 'boxing'];

// Plans saved by older versions use 'Arms', 'Stomach', … as muscle names.
const LEGACY_MUSCLE_NAMES = { stomach: 'abs' };

export function normalizeMuscle(name = '') {
  const lowerCaseName = name.toLowerCase();
  return LEGACY_MUSCLE_NAMES[lowerCaseName] ?? lowerCaseName;
}

// Muscle groups an entry of a plan can belong to: the six groups plus 'other'
// for exercises without a muscle group, such as cardio and boxing.
export const PLAN_MUSCLES = [...MUSCLE_GROUP_NAMES, 'other'];

export function muscleLabel(name, t) {
  const muscle = normalizeMuscle(name);
  return PLAN_MUSCLES.includes(muscle) ? t(`muscle.${muscle}`) : name;
}

export function dayLabel(weekday, t) {
  return WEEKDAYS.includes(weekday) ? t(`day.${weekday}`) : weekday;
}

// Weekdays of a day in week order; also reads days saved with one weekday only.
export function dayWeekdays(day) {
  const weekdays = day.weekdays ?? (day.weekday ? [day.weekday] : []);
  return WEEKDAYS.filter(weekday => weekdays.includes(weekday));
}

// Sets the weekdays of a day and keeps the mirrored first weekday in step.
export function withWeekdays(day, weekdays) {
  const sorted = WEEKDAYS.filter(weekday => weekdays.includes(weekday));
  return { ...day, weekdays: sorted, weekday: sorted[0] ?? null };
}

// Title of a day: its weekdays on weekday plans ("Monday, Thursday"), else its name.
export function dayTitle(day, schedule, t) {
  const weekdays = dayWeekdays(day);
  if (schedule?.type !== 'rotation' && weekdays.length) return weekdays.map(weekday => dayLabel(weekday, t)).join(', ');
  return day.name || t('planEditor.unnamedDay');
}

// Supersets ---------------------------------------------------------------------

export const MAX_SUPERSET_SIZE = 3;
const SUPERSET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Superset label of each entry of a day, in the same order: e.g. 'A1', 'A2' for
// the first superset, null for single exercises. Only entries next to each other
// with the same groupId count as one superset.
export function supersetLabels(entries) {
  const labels = entries.map(() => null);
  let letter = 0;
  let start = 0;
  while (start < entries.length) {
    const groupId = entries[start].groupId;
    let end = start + 1;
    while (groupId && end < entries.length && entries[end].groupId === groupId) end += 1;
    if (end - start > 1) {
      const name = SUPERSET_LETTERS[letter] ?? String(letter + 1);
      for (let index = start; index < end; index += 1) {
        labels[index] = { label: `${name}${index - start + 1}`, group: name, position: index - start, size: end - start };
      }
      letter += 1;
    }
    start = end;
  }
  return labels;
}

// Place and equipment of a plan --------------------------------------------------

export const PLACES = ['gym', 'home', 'mixed'];

// Typical equipment at home, the start of the list for a home or mixed plan.
export const HOME_EQUIPMENT = [
  'dumbbells',
  'kettlebell',
  'resistance_band',
  'resistance_tube',
  'miniband',
  'pullup_bar',
  'jump_rope',
];

// Found everywhere, so they never hide an exercise: floor, wall, chair, a step,
// something to anchor a band (e.g. a door).
export const ALWAYS_AVAILABLE_EQUIPMENT = ['mat', 'wall', 'chair', 'step', 'pad', 'anchor'];

// The equipment the plan has, or null when everything is there (gym, no setup).
export function planEquipment(plan) {
  const setup = plan?.setup;
  if (!setup || setup.place === 'gym' || !Array.isArray(setup.equipment)) return null;
  return setup.equipment;
}

// Whether an exercise can be done with the equipment (null: everything is there).
export function exerciseFitsEquipment(exercise, equipment) {
  if (!equipment) return true;
  return (exercise.equipment ?? []).every(
    item => ALWAYS_AVAILABLE_EQUIPMENT.includes(item) || equipment.includes(item)
  );
}

// Plans in use: not archived. Several can be active at once (e.g. gym and home).
export const isPlanActive = plan => !plan.archived && plan.isActive !== false;

// Days in training order: by their first weekday on weekday plans, else as stored.
export function orderedDays(plan) {
  if (plan.schedule?.type === 'rotation') return plan.days;
  const position = day => {
    const [first] = dayWeekdays(day);
    return first ? WEEKDAYS.indexOf(first) : WEEKDAYS.length;
  };
  return [...plan.days].sort((a, b) => position(a) - position(b));
}

// The exercise catalog is loaded on demand (data/exerciseLibraryLoader.js). The
// helpers below read it when it is there; before, they fall back to what the
// plan stores (free text, perSide, muscle group). Pages that need exact catalog
// data wait for it (lazyWithExerciseLibrary).

// Finds an exercise of the first app versions by its German or English name or
// alias, ignoring case: { id } or null. A small table (legacyExerciseNames.json,
// written by scripts/import_exercise_catalog.py) instead of the whole catalog,
// because plan migration runs at the app start.
export function findLibraryExercise(name) {
  const wanted = name.trim().toLowerCase();
  const id = wanted ? LEGACY_EXERCISE_NAMES[wanted] : null;
  return id ? { id } : null;
}

// Also resolves ids of exercises that were merged into another one.
export function libraryExercise(exerciseId) {
  return exerciseId ? exerciseLibrary()?.exerciseById(exerciseId) ?? null : null;
}

export function defaultMuscleOf(exerciseId) {
  const exercise = libraryExercise(exerciseId);
  return exercise ? exerciseLibrary().exerciseGroups(exercise)[0] ?? '' : '';
}

// The plan model is part of the app start; the catalog follows in the background.
preloadExerciseLibrary();

const isPerSideExercise = exerciseId => Boolean(exerciseId && exerciseLibrary()?.isPerSideExercise(exerciseId));

// The name to show: the library name in the current language, else the free text.
export function entryName(entry, language) {
  const exercise = entry.exerciseId && libraryExercise(entry.exerciseId);
  return exercise ? exercise.name[language] ?? exercise.name.en : entry.exercise;
}

export function formatDose(dose) {
  if (dose.unit === 'seconds') return `${dose.value} s`;
  return dose.min === dose.max ? `${dose.min}` : `${dose.min}–${dose.max}`;
}

const sameDose = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Short summary of an entry's sets, e.g. "3 × 8–12 · 60 kg" or "1 + 3 × 8–12".
export function summarizeSets(sets, language = 'en') {
  const working = sets.filter(set => set.type === 'working');
  const warmups = sets.length - working.length;
  const shown = working.length ? working : sets;
  const doses = shown.every(set => sameDose(set.dose, shown[0].dose))
    ? formatDose(shown[0].dose)
    : shown.map(set => formatDose(set.dose)).join(' / ');
  const weights = [...new Set(shown.map(set => set.weight).filter(weight => weight !== null))];
  const weight = weights.length
    ? ` · ${weights.map(value => value.toLocaleString(language)).join(' / ')} kg`
    : '';
  const count = warmups && working.length ? `${warmups} + ${working.length}` : `${shown.length}`;
  return `${count} × ${doses}${weight}`;
}

// Older entries have no perSide field; then the library decides.
export const entryIsPerSide = entry => entry.perSide ?? isPerSideExercise(entry.exerciseId);

export function defaultDoseFor(exerciseId) {
  const exercise = libraryExercise(exerciseId);
  return exercise && TIMED_CATEGORIES.includes(exercise.category)
    ? { unit: 'seconds', value: 30 }
    : { unit: 'repetitions', min: 8, max: 12 };
}

export function createSet(dose, { type = 'working', weight = null, rirTarget = null } = {}) {
  return { type, dose: { ...dose }, weight, rirTarget };
}

// A new entry with sensible starting values: 3 sets, 8–12 repetitions (30 s for
// timed exercises), 90 s rest. Library exercises take their muscle group from the library.
export function createEntry({ exerciseId = null, exercise = '', muscle } = {}) {
  const dose = defaultDoseFor(exerciseId);
  return {
    id: nanoid(),
    exerciseId,
    exercise,
    muscle: muscle ?? (defaultMuscleOf(exerciseId) || 'other'),
    restSeconds: 90,
    perSide: isPerSideExercise(exerciseId),
    sets: [createSet(dose), createSet(dose), createSet(dose)],
  };
}

export function createDay({ name = '', weekday = null, weekdays = weekday ? [weekday] : [] } = {}) {
  return withWeekdays({ id: nanoid(), name, entries: [] }, weekdays);
}

const DAY_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Suggested name of a rotation day by its position: "Day A", "Day B", …
export function defaultDayName(index, t) {
  return t('planEditor.day.defaultName', { letter: DAY_LETTERS[index] ?? index + 1 });
}

// Suggested name of a new plan: "My plan 1", or the next free number.
export function suggestPlanName(plans, t) {
  const names = new Set(plans.map(plan => plan.nameOfWorkout?.trim()));
  let number = 1;
  while (names.has(t('planEditor.suggestedName', { number }))) number += 1;
  return t('planEditor.suggestedName', { number });
}

// The start of an empty plan: a name, rotation three times a week and "Day A",
// so the first step is choosing exercises, not filling in a form.
export function createStarterPlan({ name, dayName }) {
  return {
    ...createEmptyPlan(),
    nameOfWorkout: name,
    schedule: { type: 'rotation', daysPerWeek: 3 },
    days: [createDay({ name: dayName })],
  };
}

export function createEmptyPlan() {
  return {
    id: nanoid(),
    schemaVersion: PLAN_SCHEMA_VERSION,
    nameOfWorkout: '',
    description: '',
    schedule: { type: 'weekdays' },
    days: [],
  };
}

function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

// Version 1 entry (all text) → version 2 entry.
function entryFromVersion1(exercise, muscleName) {
  const repetitions = toNumber(exercise.repetitions) ?? 1;
  const match = findLibraryExercise(exercise.exercise ?? '');
  return {
    id: exercise.id ?? nanoid(),
    exerciseId: match?.id ?? null,
    exercise: exercise.exercise ?? '',
    muscle: normalizeMuscle(exercise.muscle ?? muscleName),
    sets: toNumber(exercise.sets) ?? 1,
    dose: { unit: 'repetitions', min: repetitions, max: repetitions },
    weight: toNumber(exercise.weight),
    restSeconds: null,
  };
}

// Version 2 entry → version 3 entry: the one dose becomes one target per set.
function entryFromVersion2({ sets, dose, weight, rirTarget, ...entry }) {
  const count = Math.max(1, sets ?? 1);
  return {
    ...entry,
    restSeconds: entry.restSeconds ?? null,
    sets: Array.from({ length: count }, () =>
      createSet(dose, { weight: weight ?? null, rirTarget: rirTarget ?? null })
    ),
  };
}

// Version 3 → 4: the one weekday of a day becomes a list of weekdays.
function planFromVersion3(plan) {
  return {
    ...plan,
    schemaVersion: PLAN_SCHEMA_VERSION,
    days: (plan.days ?? []).map(day => withWeekdays(day, dayWeekdays(day))),
  };
}

// Brings a plan saved by any app version into the current shape.
export function migratePlan(plan) {
  if (plan.schemaVersion === PLAN_SCHEMA_VERSION) return plan;
  if (plan.schemaVersion === 3) return planFromVersion3(plan);
  const isVersion2 = plan.schemaVersion === 2;
  const { days = [], ...rest } = plan;
  return {
    ...rest,
    id: plan.id ?? nanoid(),
    schemaVersion: PLAN_SCHEMA_VERSION,
    nameOfWorkout: plan.nameOfWorkout ?? '',
    description: plan.description ?? '',
    schedule: { type: 'weekdays' },
    days: days.map(day => {
      const entries = isVersion2
        ? day.entries ?? []
        : (day.muscles ?? []).flatMap(muscle =>
            (muscle.exercises ?? []).map(exercise => entryFromVersion1(exercise, muscle.name))
          );
      return withWeekdays(
        {
          id: day.id ?? nanoid(),
          name: day.name ?? '',
          ...(day.note ? { note: day.note } : {}),
          entries: entries.map(entryFromVersion2),
        },
        WEEKDAYS.includes(day.day) ? [day.day] : []
      );
    }),
  };
}

// How often a training day happens per week. Weekday plans: once per weekday
// of the day (at least once). Rotation plans: trainings per week spread over the
// days, e.g. days A and B at three trainings a week count 1.5 times each.
export function weeklyDayFactor(plan, day) {
  if (day?.weeklyFactor !== undefined) return day.weeklyFactor;
  if (plan.schedule?.type !== 'rotation') return day ? Math.max(1, dayWeekdays(day).length) : 1;
  const perWeek = plan.schedule?.daysPerWeek;
  const dayCount = plan.days?.length ?? 0;
  if (!perWeek || dayCount === 0) return 1;
  return perWeek / dayCount;
}

// Several plans as one week, e.g. a gym and a home plan that run at the same
// time: all their days, each with its own weekly factor (weeklyFactor), so the
// result can go into weeklySetsByMuscle and analyzePlan like a single plan.
export function combinePlans(plans) {
  return {
    schedule: { type: 'weekdays' },
    days: plans.flatMap(plan =>
      (plan.days ?? []).map(day => ({ ...day, weeklyFactor: weeklyDayFactor(plan, day) }))
    ),
  };
}

// Strength exercises and own exercises count for the muscle load, stretching,
// mobility, Pilates, boxing and cardio do not.
export function entryCountsForMuscleLoad(entry) {
  const category = entry.exerciseId ? libraryExercise(entry.exerciseId)?.category : null;
  const counts = exerciseLibrary()?.countsForMuscleLoad;
  // Without the catalog only own exercises are known; they count.
  return counts ? counts(category) : category === null || category === undefined;
}

// Share of one set per muscle group: 1 if a primary muscle of the group is
// trained, 0.5 if only secondary ones are, the highest share per group (never
// the sum). Same rule as muscleContributions in analysis/muscleLoad.js, kept
// here so the plan model does not depend on the analysis modules.
// Own exercises without library data count fully for their chosen group.
function groupSharesOf(entry) {
  const exercise = entry.exerciseId ? libraryExercise(entry.exerciseId) : null;
  const shares = {};
  const raise = (ids, share) => {
    for (const id of ids.flatMap(resolveMuscleId)) {
      const group = MUSCLES[id]?.group;
      if (group && (shares[group] ?? 0) < share) shares[group] = share;
    }
  };
  if (exercise) {
    raise(exercise.muscles?.secondary ?? [], 0.5);
    raise(exercise.muscles?.primary ?? [], 1);
  }
  if (Object.keys(shares).length > 0) return shares;
  const muscle = normalizeMuscle(entry.muscle ?? '');
  return { [PLAN_MUSCLES.includes(muscle) ? muscle : 'other']: 1 };
}

// Effective working sets per muscle group in one week (primary muscle 1,
// secondary muscle 0.5 per set), times how often the day happens per week.
export function weeklySetsByMuscle(plan) {
  const totals = {};
  for (const day of plan.days ?? []) {
    const factor = weeklyDayFactor(plan, day);
    for (const entry of day.entries ?? []) {
      const working = (entry.sets ?? []).filter(set => set.type === 'working').length;
      if (!working || !entryCountsForMuscleLoad(entry)) continue;
      for (const [muscle, share] of Object.entries(groupSharesOf(entry))) {
        totals[muscle] = (totals[muscle] ?? 0) + share * working * factor;
      }
    }
  }
  return PLAN_MUSCLES.filter(muscle => totals[muscle]).map(muscle => ({
    muscle,
    sets: totals[muscle],
  }));
}

const validDose = dose =>
  dose.unit === 'seconds'
    ? dose.value > 0
    : dose.min > 0 && dose.max >= dose.min;

// What is missing before the plan can be saved. Each problem names where it is.
export function planProblems(plan) {
  const problems = [];
  if (!plan.nameOfWorkout.trim()) problems.push({ type: 'name' });
  if (plan.days.length === 0) problems.push({ type: 'noDays' });
  for (const day of plan.days) {
    if (plan.schedule.type === 'weekdays' && dayWeekdays(day).length === 0) {
      problems.push({ type: 'noWeekday', dayId: day.id });
    }
    if (plan.schedule.type === 'rotation' && !day.name.trim()) {
      problems.push({ type: 'noDayName', dayId: day.id });
    }
    if (day.entries.length === 0) problems.push({ type: 'emptyDay', dayId: day.id });
    for (const entry of day.entries) {
      if (entry.sets.length === 0 || !entry.sets.every(set => validDose(set.dose))) {
        problems.push({ type: 'invalidSets', dayId: day.id, entryId: entry.id });
      }
    }
  }
  return problems;
}

export function removeDay(plan, dayId) {
  return { ...plan, days: plan.days.filter(day => day.id !== dayId) };
}
