// Ready-made plan templates: 23 own ones (from the graphics package, imported with
// scripts/import_plan_templates.py) and fan plans inspired by anime routines.
// A template is never changed: the user copies it into an own plan and edits the copy.
// planTemplates.json was corrected after the expert review of 14.11.2026 (version 1.1.0,
// docs/review/kritik-fitness-2026-11-14.md); a new import must keep these corrections.
import { nanoid } from 'nanoid';
import templates from './planTemplates.json';
import { INSPIRED_TEMPLATES } from './inspiredTemplates';
import { EXERCISES, isPerSideExercise } from './exerciseLibrary';
import { PLAN_SCHEMA_VERSION, createSet, defaultMuscleOf } from '../utils/workoutPlan';

export const OWN_TEMPLATES = templates;
export const PLAN_TEMPLATES = [...templates, ...INSPIRED_TEMPLATES];

// Categories for the template choice, in this order.
export const TEMPLATE_CATEGORIES = ['gym', 'home', 'boxing', 'mobility', 'women', 'anime'];

export function templateCategory(template) {
  if (template.category) return template.category;
  if (template.goals?.includes('boxing')) return 'boxing';
  if (['pilates', 'mobility'].includes(template.goals?.[0])) return 'mobility';
  if (template.audience === 'women_interest') return 'women';
  return template.setting === 'home' ? 'home' : 'gym';
}

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
    schedule: { type: 'weekdays' },
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
        name: localized(day.name, language),
        weekday: day.day,
        ...(day.note ? { note: localized(day.note, language) } : {}),
        entries: day.entries.map(entry => ({
          id: nanoid(),
          exerciseId: entry.exerciseId,
          exercise: exerciseName(entry.exerciseId, language),
          muscle: defaultMuscleOf(entry.exerciseId) || 'other',
          restSeconds: entry.restSeconds ?? null,
          perSide: isPerSideExercise(entry.exerciseId),
          sets: Array.from({ length: entry.sets }, () =>
            createSet(entry.dose, { rirTarget: entry.rirTarget ?? null })
          ),
        })),
      })),
  };
}
