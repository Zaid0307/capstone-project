import { BALANCE_PAIRS, DETAIL_MUSCLES, analyzePlan, weeklySetsFor, weeklySetsPerMuscle } from './planAnalysis';
import { LEGACY_MUSCLE_IDS, MUSCLES } from '../data/muscles';
import { MUSCLE_GROUP_NAMES } from '../data/muscleGroups';
import { createEntry, createSet, weeklySetsByMuscle } from './workoutPlan';
import { plannedGroupSets } from './analysis/series';
import { EXERCISES } from '../data/exerciseLibrary';

const planOf = (...exerciseIds) => ({
  days: [{ entries: exerciseIds.map(exerciseId => createEntry({ exerciseId })) }],
});

const hintTypes = analysis => analysis.hints.map(hint => `${hint.type}:${hint.group ?? hint.pair}`);
const byId = id => EXERCISES.find(exercise => exercise.id === id);

describe('weeklySetsPerMuscle', () => {
  it('counts primary muscles fully and secondary muscles half', () => {
    const squat = byId('barbell_squat');
    const totals = weeklySetsPerMuscle(planOf('barbell_squat'));
    for (const id of squat.muscles.primary) expect(totals[id]).toBe(3);
    for (const id of squat.muscles.secondary.filter(item => !squat.muscles.primary.includes(item))) {
      expect(totals[id]).toBe(1.5);
    }
  });

  it('ignores warm-up sets and own exercises', () => {
    const plan = planOf('barbell_squat');
    plan.days[0].entries[0].sets[0] = createSet({ unit: 'repetitions', min: 10, max: 10 }, { type: 'warmup' });
    plan.days[0].entries.push(createEntry({ exercise: 'Own', muscle: 'legs' }));
    const [primary] = byId('barbell_squat').muscles.primary;
    expect(weeklySetsPerMuscle(plan)[primary]).toBe(2);
  });
});

describe('muscle load only from strength work', () => {
  it('does not count stretching, mobility, Pilates, boxing or cardio as sets', () => {
    const plan = planOf('wall_pec_stretch', 'cat_cow', 'pilates_hundred', 'heavy_bag_jab', 'jump_rope');
    expect(weeklySetsPerMuscle(plan)).toEqual({});
    const analysis = analyzePlan(plan);
    expect(analysis.groups).toEqual([]);
    expect(analysis.hints).toEqual([]);
  });

  it('still counts strength and isometric exercises next to them', () => {
    const totals = weeklySetsPerMuscle(planOf('wall_pec_stretch', 'push_up', 'plank'));
    expect(totals.pectoralis_major_sternocostal).toBe(3);
    expect(totals.rectus_abdominis).toBeGreaterThan(0);
  });
});

describe('analyzePlan', () => {
  it('gives no hints for an empty plan', () => {
    expect(analyzePlan({ days: [] }).hints).toEqual([]);
  });

  it('names muscle groups that are missing or get few sets', () => {
    const types = hintTypes(analyzePlan(planOf('barbell_bench_press')));
    expect(types).toContain('groupLow:chest');
    expect(types).toContain('groupMissing:back');
    expect(types).toContain('groupMissing:legs');
  });

  it('names an imbalance between pushing and pulling', () => {
    const plan = planOf('barbell_bench_press', 'barbell_bench_press', 'dumbbell_bench_press');
    expect(hintTypes(analyzePlan(plan))).toContain('imbalance:pushPull');
  });

  it('names single muscles of a trained group that get no sets', () => {
    const analysis = analyzePlan(planOf('barbell_bench_press'));
    const untrained = analysis.hints.find(hint => hint.type === 'musclesUntrained' && hint.group === 'chest');
    expect(untrained).toBeDefined();
    for (const id of untrained.muscles) {
      expect(analysis.muscles.find(muscle => muscle.id === id).sets).toBe(0);
    }
  });

  it('lists every detail muscle with its sets', () => {
    const analysis = analyzePlan(planOf('barbell_squat'));
    expect(analysis.muscles.map(muscle => muscle.id)).toEqual(DETAIL_MUSCLES);
    expect(analysis.muscles.some(muscle => muscle.sets > 0)).toBe(true);
  });
});

describe('group bars and group hints use effective sets', () => {
  const groupSets = analysis => Object.fromEntries(analysis.groups.map(item => [item.muscle, item.sets]));

  it('counts bench press 1 for the chest and 0.5 for the arms', () => {
    const groups = groupSets(analyzePlan(planOf('barbell_bench_press')));
    expect(groups.chest).toBe(3);
    expect(groups.arms).toBe(1.5);
    expect(groups.shoulders).toBe(1.5);
  });

  it('bases the group hints on effective sets', () => {
    // Four bench press entries: 12 sets for the chest, 6 for the arms.
    const analysis = analyzePlan(planOf('barbell_bench_press', 'barbell_bench_press', 'barbell_bench_press', 'barbell_bench_press'));
    const arms = analysis.hints.find(hint => hint.group === 'arms');
    expect(arms).toMatchObject({ type: 'groupLow', sets: 6 });
    expect(analysis.hints.some(hint => hint.group === 'chest' && hint.type.startsWith('group'))).toBe(false);
  });

  it('counts own exercises fully for their chosen group', () => {
    const plan = { days: [{ entries: [createEntry({ exercise: 'Own row', muscle: 'back' })] }] };
    expect(groupSets(analyzePlan(plan))).toEqual({ back: 3 });
  });

  it('matches the planned sets on the dashboard', () => {
    const plan = { id: 'p', schedule: { type: 'weekdays' }, ...planOf('barbell_squat', 'barbell_bench_press', 'cable_lat_pulldown') };
    const planned = plannedGroupSets([plan]);
    for (const { muscle, sets } of weeklySetsByMuscle(plan)) expect(planned[muscle]).toBe(sets);
  });
});

describe('counting a muscle with heads', () => {
  it('counts a set once with its highest share, not once per head', () => {
    // Bench press: all three triceps heads are secondary muscles.
    const plan = planOf('barbell_bench_press');
    expect(weeklySetsFor(plan, ['triceps_brachii'])).toBe(1.5);
    expect(weeklySetsFor(plan, ['pectoralis_major'])).toBe(3);
  });

  it('spreads rotation plans over their trainings per week', () => {
    const plan = { ...planOf('barbell_squat'), schedule: { type: 'rotation', daysPerWeek: 3 } };
    plan.days.push({ entries: [] });
    // Two days at three trainings a week: each day counts 1.5 times.
    const [primary] = EXERCISES.find(exercise => exercise.id === 'barbell_squat').muscles.primary;
    expect(weeklySetsPerMuscle(plan)[primary]).toBe(4.5);
  });

  it('leaves deep muscles out of the hints', () => {
    const analysis = analyzePlan(planOf('barbell_bench_press'));
    const listed = analysis.hints.filter(hint => hint.type === 'musclesUntrained').flatMap(hint => hint.muscles);
    expect(listed).not.toContain('pectoralis_minor');
  });
});

describe('whole body coverage', () => {
  it('refers only to known muscles in every balance pair', () => {
    for (const pair of BALANCE_PAIRS) {
      for (const id of pair.sides.flat()) {
        expect(Boolean(MUSCLES[id] || LEGACY_MUSCLE_IDS[id]), `${pair.id}: ${id}`).toBe(true);
      }
    }
  });

  it('shows every muscle of every group, deep ones included and marked', () => {
    const analysis = analyzePlan(planOf('barbell_squat'));
    for (const group of MUSCLE_GROUP_NAMES) {
      expect(analysis.muscles.some(muscle => muscle.group === group)).toBe(true);
    }
    expect(analysis.muscles.find(muscle => muscle.id === 'subscapularis').isDeep).toBe(true);
    expect(analysis.muscles.find(muscle => muscle.id === 'rectus_abdominis').isDeep).toBe(false);
  });

  it('balances pairs from neck to lower leg', () => {
    expect(BALANCE_PAIRS.map(pair => pair.id)).toEqual(
      expect.arrayContaining(['neckFrontBack', 'rotatorCuff', 'forearm', 'hipFlexExtend', 'hipAbductAdduct', 'lowerLeg'])
    );
  });
});
