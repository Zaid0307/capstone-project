import { PLAN_TEMPLATES, templateById, templateToPlan } from './planTemplates';
import { EXERCISES } from './exerciseLibrary';
import {
  PLAN_SCHEMA_VERSION,
  WEEKDAYS,
  buildWorkoutPlan,
  groupEntriesByMuscle,
  splitWorkoutPlan,
} from '../utils/workoutPlan';

const exerciseIds = new Set(EXERCISES.map(exercise => exercise.id));
const bilingual = text => Boolean(text?.de?.trim() && text?.en?.trim());

describe('plan templates', () => {
  it('contains the 23 own templates and no athlete-inspired ones', () => {
    expect(PLAN_TEMPLATES).toHaveLength(23);
    expect(new Set(PLAN_TEMPLATES.map(template => template.id)).size).toBe(23);
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
    expect(plan.days.map(day => day.day)).toEqual(['monday', 'wednesday', 'friday']);
    expect(plan.days[0].name).toBe('Ganzkörper A');
    expect(plan.days[0].entries[0]).toMatchObject({
      exerciseId: 'goblet_squat',
      exercise: 'Goblet Squat',
      muscle: 'legs',
      sets: 3,
      dose: { unit: 'repetitions', min: 8, max: 12 },
      weight: null,
      restSeconds: 120,
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

  it('puts exercises without a muscle group under other', () => {
    const plan = templateToPlan(templateById('boxing_technical_3'), 'en');
    const entries = plan.days.flatMap(day => day.entries);
    const jab = entries.find(entry => entry.exerciseId === 'heavy_bag_jab');

    expect(jab.muscle).toBe('other');
    const groups = groupEntriesByMuscle(entries).map(group => group.name);
    expect(groups[groups.length - 1]).toBe('other');
  });

  it('keeps day names, hints and targets when the copy is edited and saved', () => {
    const plan = templateToPlan(template, 'de');
    const { details, entriesByDay } = splitWorkoutPlan(plan);
    const saved = buildWorkoutPlan(details, entriesByDay);

    expect(saved.days[0].name).toBe('Ganzkörper A');
    expect(saved.hints).toEqual(plan.hints);
    expect(saved.template).toEqual(plan.template);
    expect(saved.days[0].entries[0].rirTarget).toBe(2);
  });
});
