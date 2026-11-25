import { nanoid } from 'nanoid';
import {
  HOME_EQUIPMENT,
  MAX_SUPERSET_SIZE,
  createDay,
  createEntry,
  createSet,
  dayWeekdays,
  supersetLabels,
  withWeekdays,
} from './workoutPlan';

// Changes to a plan of plan model 4. Every function returns a new plan and
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

// Where the plan is trained. A gym has everything; home and mixed plans keep
// their equipment list or start with typical home equipment.
export function setPlanPlace(plan, place) {
  const equipment = place === 'gym' ? null : plan.setup?.equipment ?? [...HOME_EQUIPMENT];
  return { ...plan, setup: { ...plan.setup, place, equipment } };
}

// Switches one piece of equipment of a home or mixed plan on or off.
export function togglePlanEquipment(plan, item) {
  const current = plan.setup?.equipment ?? [];
  const equipment = current.includes(item) ? current.filter(other => other !== item) : [...current, item];
  return { ...plan, setup: { place: 'home', ...plan.setup, equipment } };
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

// Switches one weekday of a day on or off (a day can be trained on several weekdays).
export function toggleDayWeekday(plan, dayId, weekday) {
  return mapDay(plan, dayId, day => {
    const weekdays = dayWeekdays(day);
    return withWeekdays(day, weekdays.includes(weekday) ? weekdays.filter(item => item !== weekday) : [...weekdays, weekday]);
  });
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
    weekdays: [],
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
    // The copy is a single exercise, not a further member of a superset.
    const { groupId: _groupId, ...copy } = copyEntry(day.entries[index]);
    entries.splice(index + 1, 0, copy);
    return { ...day, entries };
  });
}

export function moveEntry(plan, dayId, entryId, offset) {
  return mapDay(plan, dayId, day => {
    const index = day.entries.findIndex(entry => entry.id === entryId);
    return { ...day, entries: move(day.entries, index, offset) };
  });
}

// Moves an entry to another position of its day (drag and drop); the entries in
// between shift by one. Unknown entries and positions outside the day change nothing.
export function moveEntryTo(plan, dayId, entryId, toIndex) {
  return mapDay(plan, dayId, day => {
    const fromIndex = day.entries.findIndex(entry => entry.id === entryId);
    if (fromIndex < 0 || toIndex < 0 || toIndex >= day.entries.length || toIndex === fromIndex) return day;
    const entries = [...day.entries];
    const [entry] = entries.splice(fromIndex, 1);
    entries.splice(toIndex, 0, entry);
    return { ...day, entries };
  });
}

// Supersets ---------------------------------------------------------------------

const withoutGroup = ({ groupId: _groupId, ...entry }) => entry;

// Couples an entry with the next one into a superset (or adds the next one to the
// entry's superset). The entries before the last go straight on (0 s rest); the
// last one keeps the rest for the whole round. At most MAX_SUPERSET_SIZE entries.
export function linkWithNext(plan, dayId, entryId) {
  return mapDay(plan, dayId, day => {
    const index = day.entries.findIndex(entry => entry.id === entryId);
    const next = day.entries[index + 1];
    if (index < 0 || !next) return day;
    const labels = supersetLabels(day.entries);
    const size = (labels[index]?.size ?? 1) + (labels[index + 1]?.size ?? 1);
    if (size > MAX_SUPERSET_SIZE) return day;
    const groupId = day.entries[index].groupId ?? next.groupId ?? nanoid();
    const oldGroups = [day.entries[index].groupId, next.groupId].filter(Boolean);
    const entries = day.entries.map(entry =>
      entry.id === entryId || entry.id === next.id || oldGroups.includes(entry.groupId) ? { ...entry, groupId } : entry
    );
    const members = entries.filter(entry => entry.groupId === groupId);
    const last = members[members.length - 1];
    const rest = members.map(entry => entry.restSeconds).filter(value => value).pop() ?? last.restSeconds;
    return {
      ...day,
      entries: entries.map(entry =>
        entry.groupId !== groupId ? entry : { ...entry, restSeconds: entry.id === last.id ? rest : 0 }
      ),
    };
  });
}

// Splits the superset of an entry into single exercises; each gets the rest the
// superset had.
export function unlinkSuperset(plan, dayId, entryId) {
  return mapDay(plan, dayId, day => {
    const groupId = day.entries.find(entry => entry.id === entryId)?.groupId;
    if (!groupId) return day;
    const members = day.entries.filter(entry => entry.groupId === groupId);
    const rest = members[members.length - 1].restSeconds;
    return {
      ...day,
      entries: day.entries.map(entry =>
        entry.groupId === groupId ? { ...withoutGroup(entry), restSeconds: entry.restSeconds || rest } : entry
      ),
    };
  });
}

// Moves an entry to the end of another day.
export function moveEntryToDay(plan, fromDayId, entryId, toDayId) {
  if (fromDayId === toDayId) return plan;
  const entry = plan.days
    .find(day => day.id === fromDayId)
    ?.entries.find(item => item.id === entryId);
  if (!entry) return plan;
  return addEntry(removeEntry(plan, fromDayId, entryId), toDayId, withoutGroup(entry));
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
