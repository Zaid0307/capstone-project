// Ready-made plan templates: 23 own ones (from the graphics package, imported with
// scripts/import_plan_templates.py) and fan plans inspired by anime routines.
// A template is never changed: the user copies it into an own plan and edits the copy.
// planTemplates.json was corrected after the expert review of 14.11.2026 (version 1.1.0,
// docs/review/kritik-fitness-2026-11-14.md); a new import must keep these corrections.
// Version 1.2.0 added warm-up sets before the first heavy barbell lift of a day
// (entry.warmupSets) and progression and RIR texts per plan type.
import { nanoid } from 'nanoid';
import templates from './planTemplates.json';
import { INSPIRED_TEMPLATES } from './inspiredTemplates';
import { EXERCISES, isPerSideExercise } from './exerciseLibrary';
import {
  ALWAYS_AVAILABLE_EQUIPMENT,
  HOME_EQUIPMENT,
  PLAN_SCHEMA_VERSION,
  createSet,
  defaultMuscleOf,
} from '../utils/workoutPlan';
import { translate } from '../i18n/translations';

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

// Filters of the template choice besides the categories, each with 'all' first.
// A level filter also finds templates for a range of levels that includes it.
const LEVELS_FOR = {
  beginner: ['beginner', 'beginner_intermediate', 'all_levels'],
  intermediate: ['beginner_intermediate', 'intermediate', 'all_levels'],
  advanced: ['advanced', 'all_levels'],
};
const DAYS_FOR = {
  upTo3: count => count <= 3,
  four: count => count === 4,
  fivePlus: count => count >= 5,
};
export const TEMPLATE_FILTERS = {
  level: ['all', ...Object.keys(LEVELS_FOR)],
  setting: ['all', 'gym', 'home', 'mixed'],
  days: ['all', ...Object.keys(DAYS_FOR)],
};
export const NO_TEMPLATE_FILTERS = { level: 'all', setting: 'all', days: 'all' };

export function matchesTemplateFilters(template, { level = 'all', setting = 'all', days = 'all' } = {}) {
  return (
    (level === 'all' || LEVELS_FOR[level].includes(template.level)) &&
    (setting === 'all' || template.setting === setting) &&
    (days === 'all' || DAYS_FOR[days](template.weeklyTrainingDays))
  );
}

export function templateById(templateId) {
  return PLAN_TEMPLATES.find(template => template.id === templateId) ?? null;
}

const localized = (text, language) => (text ? text[language] ?? text.en : '');

function exerciseName(exerciseId, language) {
  const exercise = EXERCISES.find(item => item.id === exerciseId);
  return exercise ? exercise.name[language] ?? exercise.name.en : exerciseId;
}

// Optional warm-up sets of a template entry: [{ reps, percent }], percent of the
// working weight. They become 'warmup' sets before the working sets; the
// percentages go into the entry note because a plan set has no relative load.
function warmupSetsOf(entry) {
  return (entry.warmupSets ?? []).map(warmup =>
    createSet({ unit: 'repetitions', min: warmup.reps, max: warmup.reps }, { type: 'warmup' })
  );
}

function warmupNote(entry, language) {
  if (!entry.warmupSets?.length) return null;
  const sets = entry.warmupSets
    .map(warmup => translate(language, 'planTemplates.warmupSet', warmup))
    .join(', ');
  return translate(language, 'planTemplates.warmupNote', { sets });
}

function entryNote(entry, language) {
  const notes = [localized(entry.note, language), warmupNote(entry, language)].filter(Boolean);
  return notes.length ? { note: notes.join(' ') } : {};
}

// Place and equipment of the copy: a gym has everything; at home the typical home
// equipment plus what the template's exercises need (e.g. the heavy bag).
function setupOf(template) {
  if (template.setting === 'gym') return { place: 'gym', equipment: null };
  const needed = template.days.flatMap(day =>
    day.entries.flatMap(entry => EXERCISES.find(item => item.id === entry.exerciseId)?.equipment ?? [])
  );
  const equipment = [...new Set([...HOME_EQUIPMENT, ...needed])].filter(
    item => !ALWAYS_AVAILABLE_EQUIPMENT.includes(item)
  );
  return { place: template.setting === 'mixed' ? 'mixed' : 'home', equipment };
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
    setup: setupOf(template),
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
        weekdays: [day.day],
        weekday: day.day,
        ...(day.note ? { note: localized(day.note, language) } : {}),
        entries: day.entries.map(entry => ({
          id: nanoid(),
          exerciseId: entry.exerciseId,
          exercise: exerciseName(entry.exerciseId, language),
          muscle: defaultMuscleOf(entry.exerciseId) || 'other',
          ...entryNote(entry, language),
          restSeconds: entry.restSeconds ?? null,
          perSide: isPerSideExercise(entry.exerciseId),
          sets: [
            ...warmupSetsOf(entry),
            ...Array.from({ length: entry.sets }, () =>
              createSet(entry.dose, { rirTarget: entry.rirTarget ?? null })
            ),
          ],
        })),
      })),
  };
}
