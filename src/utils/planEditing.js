import { nanoid } from 'nanoid';
import { createDay, createEntry, createSet } from './workoutPlan';

// Changes to a plan of plan model 3. Every function returns a new plan and
// leaves the given one untouched, so the editor can keep plans in React state.

function move(list, index, offset) {
  const target = index + offset;
  if (index < 0 || target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

const mapDay = (plan, dayId, change) => ({
  ...plan,
  days: plan.days.map(day => (day.id === dayId ? change(day) : day)),
});

const mapEntry = (plan, dayId, entryId, change) =>
  mapDay(plan, dayId, day => ({
    ...day,
    entries: day.entries.map(entry => (entry.id === entryId ? change(entry) : entry)),
  }));

const copyEntry = entry => ({
  ...entry,
  id: nanoid(),
  sets: entry.sets.map(set => ({ ...set, dose: { ...set.dose } })),
});

export function updatePlanDetails(plan, changes) {
  return { ...plan, ...changes };
}

// Switching to "rotation" keeps the weekdays, so switching back loses nothing.
export function setScheduleType(plan, type) {
  return { ...plan, schedule: { ...plan.schedule, type } };
}

export function setArchived(plan, archived) {
  return { ...plan, archived };
}

// Start and end date of a plan ('YYYY-MM-DD' or null).
export function setPlanDates(plan, { startDate, endDate }) {
  const schedule = { ...plan.schedule };
  if (startDate !== undefined) schedule.startDate = startDate || null;
  if (endDate !== undefined) schedule.endDate = endDate || null;
  return { ...plan, schedule };
}

// Trainings per week of a rotation plan (1–7).
export function setDaysPerWeek(plan, daysPerWeek) {
  return { ...plan, schedule: { ...plan.schedule, daysPerWeek: Math.max(1, Math.min(7, daysPerWeek)) } };
}

export function addDay(plan, dayValues) {
  const day = createDay(dayValues);
  return { plan: { ...plan, days: [...plan.days, day] }, day };
}

export function updateDay(plan, dayId, changes) {
  return mapDay(plan, dayId, day => ({ ...day, ...changes }));
}

export function duplicateDay(plan, dayId, name) {
  const index = plan.days.findIndex(day => day.id === dayId);
  if (index < 0) return { plan, day: null };
  const original = plan.days[index];
  const day = {
    ...original,
    id: nanoid(),
    name,
    weekday: null,
    entries: original.entries.map(copyEntry),
  };
  const days = [...plan.days];
  days.splice(index + 1, 0, day);
  return { plan: { ...plan, days }, day };
}

export function removeDayFromPlan(plan, dayId) {
  return { ...plan, days: plan.days.filter(day => day.id !== dayId) };
}

// Puts a day back at its old position, e.g. when a removal is undone.
export function insertDay(plan, day, index) {
  const days = [...plan.days];
  days.splice(Math.min(index, days.length), 0, day);
  return { ...plan, days };
}

export function moveDay(plan, dayId, offset) {
  const index = plan.days.findIndex(day => day.id === dayId);
  return { ...plan, days: move(plan.days, index, offset) };
}

export function addEntry(plan, dayId, entry) {
  return mapDay(plan, dayId, day => ({ ...day, entries: [...day.entries, entry] }));
}

// Puts an entry back at its old position, e.g. when a removal is undone.
export function insertEntry(plan, dayId, entry, index) {
  return mapDay(plan, dayId, day => {
    const entries = [...day.entries];
    entries.splice(Math.min(index, entries.length), 0, entry);
    return { ...day, entries };
  });
}

// Swaps the exercise of an entry, e.g. for a variant with other equipment. Sets,
// rest, note and position stay; the targets switch between repetitions and time
// only when the new exercise is measured differently.
export function replaceEntryExercise(plan, dayId, entryId, exerciseId) {
  const fresh = createEntry({ exerciseId });
  const freshUnit = fresh.sets[0].dose.unit;
  return mapEntry(plan, dayId, entryId, entry => ({
    ...entry,
    exerciseId,
    exercise: '',
    muscle: fresh.muscle,
    perSide: fresh.perSide,
    sets: entry.sets.map(set =>
      set.dose.unit === freshUnit ? set : { ...set, dose: { ...fresh.sets[0].dose } }
    ),
  }));
}

export function updateEntry(plan, dayId, entryId, changes) {
  return mapEntry(plan, dayId, entryId, entry => ({ ...entry, ...changes }));
}

export function removeEntry(plan, dayId, entryId) {
  return mapDay(plan, dayId, day => ({
    ...day,
    entries: day.entries.filter(entry => entry.id !== entryId),
  }));
}

export function duplicateEntry(plan, dayId, entryId) {
  return mapDay(plan, dayId, day => {
    const index = day.entries.findIndex(entry => entry.id === entryId);
    if (index < 0) return day;
    const entries = [...day.entries];
    entries.splice(index + 1, 0, copyEntry(day.entries[index]));
    return { ...day, entries };
  });
}

export function moveEntry(plan, dayId, entryId, offset) {
  return mapDay(plan, dayId, day => {
    const index = day.entries.findIndex(entry => entry.id === entryId);
    return { ...day, entries: move(day.entries, index, offset) };
  });
}

// Moves an entry to the end of another day.
export function moveEntryToDay(plan, fromDayId, entryId, toDayId) {
  if (fromDayId === toDayId) return plan;
  const entry = plan.days
    .find(day => day.id === fromDayId)
    ?.entries.find(item => item.id === entryId);
  if (!entry) return plan;
  return addEntry(removeEntry(plan, fromDayId, entryId), toDayId, entry);
}

// Sets of one entry -------------------------------------------------------------

export function addSet(plan, dayId, entryId) {
  return mapEntry(plan, dayId, entryId, entry => {
    const last = entry.sets[entry.sets.length - 1];
    const set = last
      ? { ...last, type: 'working', dose: { ...last.dose } }
      : createSet({ unit: 'repetitions', min: 8, max: 12 });
    return { ...entry, sets: [...entry.sets, set] };
  });
}

export function updateSet(plan, dayId, entryId, index, changes) {
  return mapEntry(plan, dayId, entryId, entry => ({
    ...entry,
    sets: entry.sets.map((set, position) => (position === index ? { ...set, ...changes } : set)),
  }));
}

export function removeSet(plan, dayId, entryId, index) {
  return mapEntry(plan, dayId, entryId, entry => ({
    ...entry,
    sets: entry.sets.filter((_, position) => position !== index),
  }));
}

// Sets the number of sets: new sets copy the last one, extra sets are removed from the end.
export function setSetCount(plan, dayId, entryId, count) {
  const wanted = Math.max(1, Math.min(20, Math.round(count) || 1));
  return mapEntry(plan, dayId, entryId, entry => {
    if (wanted <= entry.sets.length) return { ...entry, sets: entry.sets.slice(0, wanted) };
    const last = entry.sets[entry.sets.length - 1];
    const extra = Array.from({ length: wanted - entry.sets.length }, () => ({
      ...last,
      type: 'working',
      dose: { ...last.dose },
    }));
    return { ...entry, sets: [...entry.sets, ...extra] };
  });
}

// The same change for every set of an entry, e.g. one weight for all sets.
export function updateAllSets(plan, dayId, entryId, changes) {
  return mapEntry(plan, dayId, entryId, entry => ({
    ...entry,
    sets: entry.sets.map(set => ({ ...set, ...changes })),
  }));
}

// True when all sets have the same type, target and weight, so they can be
// edited together in one row.
export function hasUniformSets(entry) {
  const [first, ...rest] = entry.sets;
  const key = set => JSON.stringify([set.type, set.dose, set.weight, set.rirTarget]);
  return Boolean(first) && rest.every(set => key(set) === key(first));
}

// Repetitions or time for all sets of an entry at once.
export function setDoseUnit(plan, dayId, entryId, unit) {
  return mapEntry(plan, dayId, entryId, entry => ({
    ...entry,
    sets: entry.sets.map(set => {
      if (set.dose.unit === unit) return set;
      const dose =
        unit === 'seconds' ? { unit, value: 30 } : { unit, min: 8, max: 12 };
      return { ...set, dose };
    }),
  }));
}

// Copies plan data (all days and entries get new ids), e.g. for "Duplicate plan".
export function copyPlan(plan, name) {
  return {
    ...plan,
    id: nanoid(),
    nameOfWorkout: name,
    days: plan.days.map(day => ({ ...day, id: nanoid(), entries: day.entries.map(copyEntry) })),
  };
}
