import { useTranslation } from '../../i18n/LanguageContext';
import { Chip, ChipRow } from './styles';

// Plan filter: "All plans" plus one toggle chip per plan (several can be chosen).
// choices: [[id, name]]
export default function PlanChips({ choices, selected, onChange }) {
  const { t } = useTranslation();
  const toggle = id =>
    onChange(selected.includes(id) ? selected.filter(other => other !== id) : [...selected, id]);
  return (
    <ChipRow role="group" aria-label={t('analysis.filter.plans')}>
      <Chip aria-pressed={selected.length === 0} onClick={() => onChange([])}>
        {t('analysis.filter.allPlans')}
      </Chip>
      {choices.map(([id, name]) => (
        <Chip key={id} aria-pressed={selected.includes(id)} onClick={() => toggle(id)}>
          {name}
        </Chip>
      ))}
    </ChipRow>
  );
}

// Plans to filter by: saved plans, plans of older workouts (also deleted ones) and
// free training when there is any.
export function planChoices(plans, workouts, t) {
  const choices = new Map(plans.map(plan => [plan.id, plan.nameOfWorkout || t('analysis.unnamedPlan')]));
  for (const workout of workouts) {
    if (workout.plan && !choices.has(workout.plan.planId)) choices.set(workout.plan.planId, workout.plan.planName);
  }
  if (workouts.some(workout => !workout.plan)) choices.set('free', t('calendar.freeWorkout'));
  return [...choices];
}
