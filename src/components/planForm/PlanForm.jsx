import { useState } from 'react';
import styled from 'styled-components';
import PlanDetailsForm from './PlanDetailsForm';
import DayExercisesForm from './DayExercisesForm';
import { ErrorText } from './formStyles';
import Button from '../ui/Button';
import Center from '../ui/Center';
import { colors } from '../../styles/colors';
import { radii } from '../../styles/tokens';
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
  const [exercisesByDay, setExercisesByDay] = useState(
    initialValues?.exercisesByDay ?? {}
  );
  const [isEditingDetails, setIsEditingDetails] = useState(!isEditing);
  const [showSaveError, setShowSaveError] = useState(false);

  const daysWithoutExercises = details
    ? getDaysWithoutExercises(details, exercisesByDay)
    : [];

  function handleDetailsSubmit(newDetails) {
    setDetails(newDetails);
    setIsEditingDetails(false);
    setShowSaveError(false);
  }

  function updateDay(day, update) {
    setExercisesByDay({
      ...exercisesByDay,
      [day]: update(exercisesByDay[day] ?? []),
    });
  }

  function handleSave() {
    if (daysWithoutExercises.length > 0) {
      setShowSaveError(true);
      return;
    }
    onSave(buildWorkoutPlan(details, exercisesByDay));
  }

  if (isEditingDetails) {
    return (
      <Centered>
        <PlanDetailsForm
          onSubmit={handleDetailsSubmit}
          initialDetails={details}
          isEditing={isEditing}
        />
      </Centered>
    );
  }

  return (
    <>
      <PlanName>{details.nameOfWorkout}</PlanName>
      <Center>
        <Button $variant="secondary" onClick={() => setIsEditingDetails(true)}>
          {t('planForm.editDetails')}
        </Button>
      </Center>
      {details.days.map(({ day }) => (
        <DayExercisesForm
          key={day}
          day={day}
          exercises={exercisesByDay[day]}
          onAddExercise={exercise =>
            updateDay(day, exercises => [...exercises, exercise])
          }
          onUpdateExercise={updated =>
            updateDay(day, exercises =>
              exercises.map(exercise =>
                exercise.id === updated.id ? updated : exercise
              )
            )
          }
          onRemoveExercise={exerciseId =>
            updateDay(day, exercises =>
              exercises.filter(exercise => exercise.id !== exerciseId)
            )
          }
        />
      ))}
      {showSaveError && daysWithoutExercises.length > 0 && (
        <SaveError role="alert">
          {t('planForm.errorEmptyDays', {
            days: daysWithoutExercises.map(day => dayLabel(day, t)).join(', '),
          })}
        </SaveError>
      )}
      <Center>
        <Button $variant="secondary" onClick={handleSave}>
          {t(isEditing ? 'planForm.saveChanges' : 'planForm.save')}
        </Button>
      </Center>
    </>
  );
}

const Centered = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;

const PlanName = styled.h2`
  display: flex;
  justify-content: center;
  margin: 5px 10px;
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  color: ${colors.text};
`;

const SaveError = styled(ErrorText)`
  margin: 0 15px;
  padding: 5px;
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  font-size: 1rem;
  text-align: center;
`;
