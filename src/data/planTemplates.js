// Ready-made plan templates (23, from the graphics package, imported with
// scripts/import_plan_templates.py). A template is never changed: the user
// copies it into an own plan and edits the copy.
import { nanoid } from 'nanoid';
import templates from './planTemplates.json';
import { EXERCISES } from './exerciseLibrary';
import { PLAN_SCHEMA_VERSION, defaultMuscleOf } from '../utils/workoutPlan';

export const PLAN_TEMPLATES = templates;

export function templateById(templateId) {
  return PLAN_TEMPLATES.find(template => template.id === templateId) ?? null;
}

const localized = (text, language) => (text ? text[language] ?? text.en : '');

function exerciseName(exerciseId, language) {
  const exercise = EXERCISES.find(item => item.id === exerciseId);
  return exercise ? exercise.name[language] ?? exercise.name.en : exerciseId;
}

// Copies a template into a new plan of the current plan model. Rest days are
// left out, safety and progression hints are kept with the plan.
export function templateToPlan(template, language) {
  return {
    id: nanoid(),
    schemaVersion: PLAN_SCHEMA_VERSION,
    nameOfWorkout: localized(template.name, language),
    description: localized(template.description, language),
    template: { id: template.id, version: template.version },
    hints: {
      progression: localized(template.progression.instruction, language),
      repsInReserve: localized(template.progression.repsInReserve, language),
      recovery: localized(template.progression.recovery, language),
      safety: localized(template.safety.caution, language),
      medicalClearance: template.safety.medicalClearance,
    },
    days: template.days
      .filter(day => day.type !== 'rest')
      .map(day => ({
        id: nanoid(),
        day: day.day,
        name: localized(day.name, language),
        note: localized(day.note, language),
        entries: day.entries.map(entry => ({
          id: nanoid(),
          exerciseId: entry.exerciseId,
          exercise: exerciseName(entry.exerciseId, language),
          muscle: defaultMuscleOf(entry.exerciseId) || 'other',
          sets: entry.sets,
          dose: { ...entry.dose },
          weight: null,
          restSeconds: entry.restSeconds,
          rirTarget: entry.rirTarget,
        })),
      })),
  };
}
