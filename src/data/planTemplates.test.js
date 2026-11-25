import {
  NO_TEMPLATE_FILTERS,
  OWN_TEMPLATES,
  PLAN_TEMPLATES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_FILTERS,
  matchesTemplateFilters,
  templateById,
  templateCategory,
  templateToPlan,
} from './planTemplates';
import { EXERCISES } from './exerciseLibrary';
import { PLAN_SCHEMA_VERSION, WEEKDAYS, migratePlan, planProblems } from '../utils/workoutPlan';

const exerciseIds = new Set(EXERCISES.map(exercise => exercise.id));
const bilingual = text => Boolean(text?.de?.trim() && text?.en?.trim());

describe('plan templates', () => {
  it('contains the 23 own templates and no athlete-inspired ones', () => {
    expect(OWN_TEMPLATES).toHaveLength(23);
    expect(new Set(PLAN_TEMPLATES.map(template => template.id)).size).toBe(PLAN_TEMPLATES.length);
    const names = JSON.stringify(PLAN_TEMPLATES.map(template => template.name));
    for (const athlete of ['Arnold', 'Ronnie', 'Yates', 'Cutler', 'Haney', 'Mentzer', 'Bailey']) {
      expect(names).not.toContain(athlete);
    }
  });

  it.each(PLAN_TEMPLATES.map(template => [template.id, template]))(
    '%s is complete in both languages and refers to known exercises',
    (id, template) => {
      expect(bilingual(template.name)).toBe(true);
      expect(bilingual(template.description)).toBe(true);
      expect(bilingual(template.progression.instruction)).toBe(true);
      expect(bilingual(template.safety.caution)).toBe(true);
      expect(template.days.map(day => day.day)).toEqual(WEEKDAYS);

      for (const day of template.days) {
        expect(bilingual(day.name)).toBe(true);
        if (day.note) expect(bilingual(day.note)).toBe(true);
        if (day.type === 'rest') expect(day.entries).toEqual([]);
        for (const entry of day.entries) {
          expect(exerciseIds.has(entry.exerciseId), entry.exerciseId).toBe(true);
          expect(entry.sets).toBeGreaterThanOrEqual(1);
          if (entry.dose.unit === 'seconds') {
            expect(entry.dose.value).toBeGreaterThan(0);
          } else {
            expect(entry.dose.min).toBeGreaterThan(0);
            expect(entry.dose.max).toBeGreaterThanOrEqual(entry.dose.min);
          }
        }
      }
    }
  );
});

describe('template quality (expert review 14.11.2026)', () => {
  const exercisesOf = template => template.days.flatMap(day => day.entries);

  it('gives every template its own description', () => {
    const descriptions = PLAN_TEMPLATES.map(template => template.description.de);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('has a real strength block in the strength plan', () => {
    const entries = exercisesOf(templateById('strength_hypertrophy_4'));
    expect(entries.some(entry => entry.exerciseId === 'conventional_deadlift')).toBe(true);
    expect(entries.filter(entry => entry.dose.unit === 'repetitions' && entry.dose.max <= 5).length).toBeGreaterThanOrEqual(3);
  });

  it('trains the abs in the split plans', () => {
    const core = ['cable_crunch', 'hanging_knee_raise', 'plank', 'dead_bug'];
    for (const id of ['hypertrophy_ppl_6', 'hypertrophy_5day_bodypart']) {
      expect(exercisesOf(templateById(id)).some(entry => core.includes(entry.exerciseId)), id).toBe(true);
    }
  });

  it('does not tell mobility and Pilates plans to add load', () => {
    for (const id of ['mobility_daily_light', 'women_pilates_beginner_3', 'women_mobility_stretch_4']) {
      expect(templateById(id).progression.instruction.de, id).toMatch(/Haltezeit/);
      expect(templateById(id).progression.repsInReserve.de, id).toMatch(/^Nicht relevant/);
    }
  });

  it('warms up before the first heavy barbell lift of a day', () => {
    const heavy = ['barbell_squat', 'barbell_bench_press', 'conventional_deadlift'];
    for (const id of ['strength_hypertrophy_4', 'anime_saiyan_strength', 'hypertrophy_upperlower_4']) {
      const warmedUp = exercisesOf(templateById(id)).filter(entry => entry.warmupSets?.length);
      expect(warmedUp.some(entry => heavy.includes(entry.exerciseId)), id).toBe(true);
    }
    for (const template of PLAN_TEMPLATES) {
      for (const day of template.days) {
        expect(day.entries.filter(entry => entry.warmupSets).length).toBeLessThanOrEqual(1);
        for (const warmup of day.entries.flatMap(entry => entry.warmupSets ?? [])) {
          expect(warmup.reps).toBeGreaterThan(0);
          expect(warmup.percent).toBeGreaterThan(0);
          expect(warmup.percent).toBeLessThan(100);
        }
      }
    }
  });

  it('has progression and RIR texts that fit the plan type', () => {
    const progression = id => templateById(id).progression;
    expect(progression('hypertrophy_fullbody_3').instruction.de).toMatch(/Doppelte Progression/);
    expect(progression('women_fullbody_strength_3').repsInReserve.de).toMatch(/^Grundübungen 2, Hilfsübungen 1–2/);
    expect(progression('home_band_3').instruction.de).toMatch(/stärkeres Band/);
    expect(progression('boxing_technical_3').instruction.de).toMatch(/Rundenzeit/);
    expect(progression('women_pilates_strength_5').instruction.de).toMatch(/Haltezeit/);
    for (const template of PLAN_TEMPLATES) {
      expect(bilingual(template.progression.repsInReserve), template.id).toBe(true);
    }
    // No two plan types share the old general text any more.
    expect(PLAN_TEMPLATES.some(template => template.progression.repsInReserve.de.startsWith('ca. 2-3'))).toBe(false);
  });
});

describe('template categories', () => {
  it('puts every template into one known category', () => {
    for (const template of PLAN_TEMPLATES) {
      expect(TEMPLATE_CATEGORIES).toContain(templateCategory(template));
    }
    expect(templateCategory(templateById('hypertrophy_fullbody_3'))).toBe('gym');
    expect(templateCategory(templateById('home_band_3'))).toBe('home');
    expect(templateCategory(templateById('boxing_technical_3'))).toBe('boxing');
    expect(templateCategory(templateById('mobility_daily_light'))).toBe('mobility');
    expect(templateCategory(templateById('women_strength_glutes_4'))).toBe('women');
  });

  it('has realistic anime-inspired plans with rest days and a safety note', () => {
    const anime = PLAN_TEMPLATES.filter(template => templateCategory(template) === 'anime');
    expect(anime.length).toBeGreaterThanOrEqual(5);
    for (const template of anime) {
      expect(template.name.de).toMatch(/inspiriert von/);
      expect(template.safety.caution.de).toMatch(/Fan-Plan, nicht offiziell/);
      const trainingDays = template.days.filter(day => day.type !== 'rest');
      expect(trainingDays.length).toBe(template.weeklyTrainingDays);
      expect(trainingDays.length).toBeLessThanOrEqual(5);
    }
  });
});

describe('template filters', () => {
  const ids = filters => PLAN_TEMPLATES.filter(item => matchesTemplateFilters(item, filters)).map(item => item.id);

  it('finds every template without filters', () => {
    expect(ids(NO_TEMPLATE_FILTERS)).toHaveLength(PLAN_TEMPLATES.length);
    expect(ids()).toHaveLength(PLAN_TEMPLATES.length);
  });

  it('filters by level, including templates for a range of levels', () => {
    const beginner = ids({ level: 'beginner' });
    expect(beginner).toContain('bodyweight_beginner_3');
    expect(beginner).toContain('hypertrophy_fullbody_3');
    expect(beginner).toContain('mobility_daily_light');
    expect(beginner).not.toContain('hypertrophy_ppl_6');
    expect(ids({ level: 'advanced' })).toContain('hypertrophy_ppl_6');
  });

  it('filters by place and days per week, combined', () => {
    for (const template of PLAN_TEMPLATES.filter(item => matchesTemplateFilters(item, { setting: 'home', days: 'upTo3' }))) {
      expect(template.setting).toBe('home');
      expect(template.weeklyTrainingDays).toBeLessThanOrEqual(3);
    }
    expect(ids({ setting: 'mixed' })).toContain('boxing_and_strength_4');
    expect(ids({ days: 'fivePlus' })).toEqual(
      expect.arrayContaining(['hypertrophy_ppl_6', 'hypertrophy_5day_bodypart', 'mobility_daily_light'])
    );
    expect(ids({ days: 'four' }).every(id => templateById(id).weeklyTrainingDays === 4)).toBe(true);
  });

  it('offers each filter with "all" first', () => {
    for (const values of Object.values(TEMPLATE_FILTERS)) expect(values[0]).toBe('all');
  });
});

describe('templateToPlan', () => {
  const template = templateById('hypertrophy_fullbody_3');

  it('copies a template into a new plan without rest days', () => {
    const plan = templateToPlan(template, 'de');

    expect(plan).toMatchObject({
      schemaVersion: PLAN_SCHEMA_VERSION,
      nameOfWorkout: 'Muskelaufbau Ganzkörper 3 Tage',
      template: { id: 'hypertrophy_fullbody_3' },
    });
    expect(plan.id).not.toBe(template.id);
    expect(plan.schedule).toEqual({ type: 'weekdays' });
    expect(plan.days.map(day => day.weekday)).toEqual(['monday', 'wednesday', 'friday']);
    expect(plan.days[0].name).toBe('Ganzkörper A');
    const [first] = plan.days[0].entries;
    expect(first).toMatchObject({
      exerciseId: 'goblet_squat',
      exercise: 'Goblet Squat mit Kurzhantel',
      muscle: 'legs',
      restSeconds: 120,
    });
    expect(first.sets).toHaveLength(3);
    expect(first.sets[0]).toEqual({
      type: 'working',
      dose: { unit: 'repetitions', min: 8, max: 12 },
      weight: null,
      rirTarget: 2,
    });
    expect(plan.hints.safety).toMatch(/Muskelversagen/);
    expect(plan.hints.medicalClearance).toBe(true);
  });

  it('gives every copy new ids and leaves the template unchanged', () => {
    const before = JSON.stringify(template);
    const first = templateToPlan(template, 'en');
    const second = templateToPlan(template, 'en');

    expect(first.id).not.toBe(second.id);
    expect(first.days[0].entries[0].id).not.toBe(second.days[0].entries[0].id);
    expect(first.nameOfWorkout).toBe('Muscle building full body, 3 days');
    expect(JSON.stringify(template)).toBe(before);
  });

  it('puts warm-up sets before the working sets of the first heavy lift', () => {
    const plan = templateToPlan(templateById('strength_hypertrophy_4'), 'de');
    const bench = plan.days[0].entries.find(entry => entry.exerciseId === 'barbell_bench_press');

    expect(bench.sets.map(set => set.type)).toEqual(['warmup', 'warmup', 'working', 'working', 'working', 'working']);
    expect(bench.sets[0]).toEqual({
      type: 'warmup',
      dose: { unit: 'repetitions', min: 8, max: 8 },
      weight: null,
      rirTarget: null,
    });
    expect(bench.sets[1].dose).toEqual({ unit: 'repetitions', min: 4, max: 4 });
    expect(bench.note).toBe(
      'Aufwärmen vor den Arbeitssätzen: 1 × 8 mit ca. 50 %, 1 × 4 mit ca. 75 % des Arbeitsgewichts.'
    );
  });

  it('adds no warm-up sets where the template has none', () => {
    const plan = templateToPlan(templateById('mobility_daily_light'), 'en');
    const sets = plan.days.flatMap(day => day.entries.flatMap(entry => entry.sets));
    expect(sets.every(set => set.type === 'working')).toBe(true);
    expect(plan.days.flatMap(day => day.entries).some(entry => entry.note)).toBe(false);
  });

  it('takes over the place and the equipment the exercises need', () => {
    expect(templateToPlan(templateById('hypertrophy_fullbody_3'), 'en').setup).toEqual({ place: 'gym', equipment: null });
    const boxing = templateToPlan(templateById('home_heavybag_band_4'), 'en').setup;
    expect(boxing.place).toBe('home');
    expect(boxing.equipment).toEqual(expect.arrayContaining(['heavy_bag', 'resistance_band', 'dumbbells']));
    expect(boxing.equipment).not.toContain('mat');
  });

  it('puts exercises without a muscle group under other', () => {
    const plan = templateToPlan(templateById('boxing_technical_3'), 'en');
    const shadowBoxing = plan.days.flatMap(day => day.entries).find(entry => entry.exerciseId === 'shadow_boxing');
    expect(shadowBoxing.muscle).toBe('other');
  });

  it.each(PLAN_TEMPLATES.map(item => [item.id, item]))(
    '%s becomes a plan that can be saved as it is',
    (id, item) => {
      const plan = templateToPlan(item, 'de');
      expect(planProblems(plan)).toEqual([]);
      expect(migratePlan(plan)).toBe(plan);
    }
  );
});
