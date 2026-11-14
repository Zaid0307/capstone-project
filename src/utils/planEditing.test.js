import {
  addDay,
  addEntry,
  addSet,
  copyPlan,
  duplicateDay,
  duplicateEntry,
  hasUniformSets,
  moveDay,
  moveEntry,
  moveEntryToDay,
  removeDayFromPlan,
  removeEntry,
  removeSet,
  setDoseUnit,
  setScheduleType,
  setSetCount,
  updateDay,
  updateAllSets,
  updateEntry,
  updateSet,
} from './planEditing';
import { createEmptyPlan, createEntry } from './workoutPlan';

function planWithDays() {
  let plan = createEmptyPlan();
  const first = addDay(plan, { name: 'A', weekday: 'monday' });
  const second = addDay(first.plan, { name: 'B', weekday: 'thursday' });
  plan = second.plan;
  const squat = createEntry({ exerciseId: 'barbell_squat' });
  const bench = createEntry({ exerciseId: 'barbell_bench_press' });
  plan = addEntry(addEntry(plan, first.day.id, squat), first.day.id, bench);
  return { plan, a: first.day.id, b: second.day.id, squat: squat.id, bench: bench.id };
}

const entryIds = (plan, dayId) => plan.days.find(day => day.id === dayId).entries.map(entry => entry.id);
const entry = (plan, dayId, entryId) =>
  plan.days.find(day => day.id === dayId).entries.find(item => item.id === entryId);

describe('plan editing', () => {
  it('never changes the plan it is given', () => {
    const { plan, a, squat } = planWithDays();
    const before = JSON.stringify(plan);
    removeEntry(plan, a, squat);
    updateSet(plan, a, squat, 0, { weight: 100 });
    moveDay(plan, a, 1);
    expect(JSON.stringify(plan)).toBe(before);
  });

  describe('days', () => {
    it('adds, renames, moves and removes days', () => {
      const { plan, a, b } = planWithDays();
      expect(updateDay(plan, a, { name: 'Upper' }).days[0].name).toBe('Upper');
      expect(moveDay(plan, a, 1).days.map(day => day.id)).toEqual([b, a]);
      expect(moveDay(plan, a, -1).days.map(day => day.id)).toEqual([a, b]);
      expect(removeDayFromPlan(plan, a).days.map(day => day.id)).toEqual([b]);
    });

    it('duplicates a day right after it, with new ids and no weekday', () => {
      const { plan, a, b } = planWithDays();
      const result = duplicateDay(plan, a, 'A (copy)');

      expect(result.plan.days.map(day => day.id)).toEqual([a, result.day.id, b]);
      expect(result.day).toMatchObject({ name: 'A (copy)', weekday: null });
      expect(result.day.entries.map(item => item.exerciseId)).toEqual(['barbell_squat', 'barbell_bench_press']);
      expect(entryIds(result.plan, result.day.id)).not.toEqual(entryIds(plan, a));
    });

    it('switches the schedule and keeps the weekdays', () => {
      const { plan } = planWithDays();
      const rotation = setScheduleType(plan, 'rotation');
      expect(rotation.schedule.type).toBe('rotation');
      expect(rotation.days[0].weekday).toBe('monday');
    });
  });

  describe('exercises', () => {
    it('moves exercises up and down and ignores moves past the ends', () => {
      const { plan, a, squat, bench } = planWithDays();
      expect(entryIds(moveEntry(plan, a, bench, -1), a)).toEqual([bench, squat]);
      expect(entryIds(moveEntry(plan, a, bench, 1), a)).toEqual([squat, bench]);
    });

    it('duplicates, changes and removes exercises', () => {
      const { plan, a, squat, bench } = planWithDays();
      const duplicated = duplicateEntry(plan, a, squat);
      const ids = entryIds(duplicated, a);
      expect(ids).toHaveLength(3);
      expect(ids[0]).toBe(squat);
      expect(ids[2]).toBe(bench);
      expect(entry(duplicated, a, ids[1]).exerciseId).toBe('barbell_squat');

      expect(entry(updateEntry(plan, a, squat, { restSeconds: 180 }), a, squat).restSeconds).toBe(180);
      expect(entryIds(removeEntry(plan, a, squat), a)).toEqual([bench]);
    });

    it('moves an exercise to another day', () => {
      const { plan, a, b, squat, bench } = planWithDays();
      const moved = moveEntryToDay(plan, a, squat, b);
      expect(entryIds(moved, a)).toEqual([bench]);
      expect(entryIds(moved, b)).toEqual([squat]);
    });
  });

  describe('sets', () => {
    it('adds a set like the last one, changes and removes sets', () => {
      const { plan, a, squat } = planWithDays();
      const changed = updateSet(plan, a, squat, 2, { weight: 100, dose: { unit: 'repetitions', min: 5, max: 5 } });
      const added = addSet(changed, a, squat);
      expect(entry(added, a, squat).sets[3]).toEqual(entry(changed, a, squat).sets[2]);
      expect(entry(removeSet(added, a, squat, 0), a, squat).sets).toHaveLength(3);
    });

    it('changes the number of sets and keeps the values', () => {
      const { plan, a, squat } = planWithDays();
      const heavy = updateAllSets(plan, a, squat, { weight: 100 });
      expect(entry(setSetCount(heavy, a, squat, 5), a, squat).sets.map(set => set.weight)).toEqual([100, 100, 100, 100, 100]);
      expect(entry(setSetCount(heavy, a, squat, 1), a, squat).sets).toHaveLength(1);
      expect(entry(setSetCount(heavy, a, squat, 0), a, squat).sets).toHaveLength(1);
    });

    it('knows whether all sets are the same', () => {
      const { plan, a, squat } = planWithDays();
      expect(hasUniformSets(entry(plan, a, squat))).toBe(true);
      expect(hasUniformSets(entry(updateSet(plan, a, squat, 1, { weight: 50 }), a, squat))).toBe(false);
    });

    it('switches all sets between repetitions and time', () => {
      const { plan, a, squat } = planWithDays();
      const timed = setDoseUnit(plan, a, squat, 'seconds');
      expect(entry(timed, a, squat).sets.map(set => set.dose)).toEqual([1, 2, 3].map(() => ({ unit: 'seconds', value: 30 })));
      expect(entry(setDoseUnit(timed, a, squat, 'repetitions'), a, squat).sets[0].dose).toEqual({
        unit: 'repetitions',
        min: 8,
        max: 12,
      });
    });
  });

  it('copies a whole plan with new ids', () => {
    const { plan, a } = planWithDays();
    const copy = copyPlan(plan, 'Copy');
    expect(copy.id).not.toBe(plan.id);
    expect(copy.nameOfWorkout).toBe('Copy');
    expect(copy.days[0].id).not.toBe(a);
    expect(copy.days[0].entries[0].id).not.toBe(plan.days[0].entries[0].id);
    expect(copy.days[0].entries[0].exerciseId).toBe('barbell_squat');
  });
});
