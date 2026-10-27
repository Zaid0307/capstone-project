import { useState } from 'react';
import styled from 'styled-components';
import PlanDetailsForm from './PlanDetailsForm';
import DayExercisesForm from './DayExercisesForm';
import { ErrorText, StepText } from './formStyles';
import Button from '../ui/Button';
import PageTitle from '../ui/PageTitle';
import { space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  buildWorkoutPlan,
  dayLabel,
  getDaysWithoutExercises,
  splitWorkoutPlan,
} from '../../utils/workoutPlan';

// Creates a new plan, or edits initialPlan when it is given.
export default function PlanForm({ onSave, initialPlan }) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialPlan);
  const [initialValues] = useState(() =>
    initialPlan ? splitWorkoutPlan(initialPlan) : null
  );
  const [details, setDetails] = useState(initialValues?.details ?? null);
  const [entriesByDay, setEntriesByDay] = useState(
    initialValues?.entriesByDay ?? {}
  );
  const [isEditingDetails, setIsEditingDetails] = useState(!isEditing);
  const [showSaveError, setShowSaveError] = useState(false);

  const daysWithoutExercises = details
    ? getDaysWithoutExercises(details, entriesByDay)
    : [];

  function handleDetailsSubmit(newDetails) {
    // Merge, so plan data the details form does not know (e.g. template hints) is kept.
    setDetails(current => ({ ...current, ...newDetails }));
    setIsEditingDetails(false);
    setShowSaveError(false);
  }

  function updateDay(day, update) {
    setEntriesByDay({
      ...entriesByDay,
      [day]: update(entriesByDay[day] ?? []),
    });
  }

  function handleSave() {
    if (daysWithoutExercises.length > 0) {
      setShowSaveError(true);
      return;
    }
    onSave(buildWorkoutPlan(details, entriesByDay));
  }

  if (isEditingDetails) {
    return (
      <PlanDetailsForm
        onSubmit={handleDetailsSubmit}
        initialDetails={details}
        isEditing={isEditing}
      />
    );
  }

  return (
    <>
      <Header>
        <div>
          <StepText>{t('planForm.step', { step: 2 })}</StepText>
          <PageTitle>{details.nameOfWorkout}</PageTitle>
        </div>
        <Button $variant="secondary" onClick={() => setIsEditingDetails(true)}>
          {t('planForm.editDetails')}
        </Button>
      </Header>
      {details.days.map(({ day }) => (
        <DayExercisesForm
          key={day}
          day={day}
          entries={entriesByDay[day]}
          onAddEntry={entry => updateDay(day, entries => [...entries, entry])}
          onUpdateEntry={updated =>
            updateDay(day, entries =>
              entries.map(entry => (entry.id === updated.id ? updated : entry))
            )
          }
          onRemoveEntry={entryId =>
            updateDay(day, entries => entries.filter(entry => entry.id !== entryId))
          }
        />
      ))}
      <SaveArea>
        {showSaveError && daysWithoutExercises.length > 0 && (
          <ErrorText role="alert">
            {t('planForm.errorEmptyDays', {
              days: daysWithoutExercises.map(day => dayLabel(day, t)).join(', '),
            })}
          </ErrorText>
        )}
        <div>
          <Button onClick={handleSave}>
            {t(isEditing ? 'planForm.saveChanges' : 'planForm.save')}
          </Button>
        </div>
      </SaveArea>
    </>
  );
}

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${space.md};
`;

const SaveArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
`;
