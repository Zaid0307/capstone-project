import { useState } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import ExerciseListItem from './ExerciseListItem';
import { FormCard, FormTitle, Input, Label } from './formStyles';
import Button from '../ui/Button';
import ScreenReaderOnly from '../ui/ScreenReaderOnly';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import { colors } from '../../styles/colors';
import { useTranslation } from '../../i18n/LanguageContext';
import { dayLabel } from '../../utils/workoutPlan';

const EMPTY_EXERCISE = {
  exercise: '',
  weight: '',
  repetitions: '',
  sets: '',
  muscle: '',
};

// Adds, edits and removes the exercises of one training day.
export default function DayExercisesForm({
  day,
  exercises = [],
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState(EMPTY_EXERCISE);
  const [editingId, setEditingId] = useState(null);
  const label = dayLabel(day, t);
  const formLabelId = `dayExercises-${day}`;
  const fieldId = name => `${name}-${day}`;

  function resetForm() {
    setEditingId(null);
    // Keep the muscle, the next exercise is often for the same one.
    setValues({ ...EMPTY_EXERCISE, muscle: values.muscle });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!values.muscle || !values.exercise.trim()) {
      return;
    }
    const exercise = { ...values, exercise: values.exercise.trim() };
    if (editingId) {
      onUpdateExercise({ ...exercise, id: editingId });
    } else {
      onAddExercise({ ...exercise, id: nanoid() });
    }
    resetForm();
  }

  function handleEdit({ id, ...exercise }) {
    setEditingId(id);
    setValues({ ...EMPTY_EXERCISE, ...exercise });
  }

  function handleRemove(exerciseId) {
    if (exerciseId === editingId) {
      resetForm();
    }
    onRemoveExercise(exerciseId);
  }

  const numberFields = [
    {
      name: 'weight',
      min: '0',
      step: 'any',
      inputMode: 'decimal',
      placeholder: t('dayExercises.weightPlaceholder'),
    },
    { name: 'repetitions', min: '1', inputMode: 'numeric', placeholder: '12' },
    { name: 'sets', min: '1', inputMode: 'numeric', placeholder: '3' },
  ];

  return (
    <FormCard>
      <ScreenReaderOnly id={formLabelId}>
        {t('dayExercises.formLabel', { day: label })}
      </ScreenReaderOnly>
      <form
        autoComplete="off"
        aria-labelledby={formLabelId}
        onSubmit={handleSubmit}
      >
        <FormTitle as="h3">{label.toUpperCase()}</FormTitle>
        <Row>
          <Label htmlFor={fieldId('muscle')}>{t('dayExercises.muscle')}</Label>
          <select
            id={fieldId('muscle')}
            name="muscle"
            required
            value={values.muscle}
            onChange={handleChange}
          >
            <option value="" disabled>
              {t('dayExercises.chooseMuscle')}
            </option>
            {MUSCLE_GROUP_NAMES.map(muscle => (
              <option key={muscle} value={muscle}>
                {t(`muscle.${muscle}`)}
              </option>
            ))}
          </select>
        </Row>
        <Row>
          <Label htmlFor={fieldId('exercise')}>
            {t('dayExercises.exercise')}
          </Label>
          <FieldInput
            id={fieldId('exercise')}
            name="exercise"
            type="text"
            required
            maxLength={50}
            placeholder={t('dayExercises.exercisePlaceholder')}
            value={values.exercise}
            onChange={handleChange}
          />
        </Row>
        {numberFields.map(({ name, ...props }) => (
          <Row key={name}>
            <Label htmlFor={fieldId(name)}>{t(`dayExercises.${name}`)}</Label>
            <FieldInput
              id={fieldId(name)}
              name={name}
              type="number"
              required
              value={values[name]}
              onChange={handleChange}
              {...props}
            />
          </Row>
        ))}
        <ButtonRow>
          <Button type="submit">
            {t(editingId ? 'dayExercises.update' : 'dayExercises.add')}
          </Button>
          {editingId && (
            <Button onClick={resetForm}>{t('dayExercises.cancelEdit')}</Button>
          )}
        </ButtonRow>
      </form>

      {exercises.length === 0 ? (
        <EmptyText>{t('dayExercises.empty')}</EmptyText>
      ) : (
        <ExerciseList aria-label={label}>
          {exercises.map(exercise => (
            <ExerciseListItem
              key={exercise.id}
              exercise={exercise}
              isEditing={exercise.id === editingId}
              onEdit={() => handleEdit(exercise)}
              onRemove={() => handleRemove(exercise.id)}
            />
          ))}
        </ExerciseList>
      )}
    </FormCard>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 5px;
`;

const FieldInput = styled(Input)`
  width: 220px;
  max-width: 60vw;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const EmptyText = styled.p`
  margin: 5px 0;
  color: ${colors.primary};
  text-align: center;
`;

const ExerciseList = styled.ul`
  list-style: none;
`;
