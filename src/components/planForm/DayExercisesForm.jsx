import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import ExerciseListItem from './ExerciseListItem';
import { ErrorText, FormCard, FormTitle, Input, Label } from './formStyles';
import Button from '../ui/Button';
import ScreenReaderOnly from '../ui/ScreenReaderOnly';
import { EXERCISES, exerciseGroups } from '../../data/exerciseLibrary';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import { colors } from '../../styles/colors';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  dayLabel,
  defaultMuscleOf,
  entryName,
  findLibraryExercise,
} from '../../utils/workoutPlan';

// Exercise categories that are usually measured in time instead of repetitions.
const TIMED_CATEGORIES = ['isometric', 'stretch', 'yoga', 'cardio', 'boxing'];

const EMPTY_VALUES = {
  muscle: '',
  exercise: '',
  exerciseId: null,
  doseUnit: 'repetitions',
  repsMin: '',
  repsMax: '',
  seconds: '',
  sets: '',
  weight: '',
  rest: '',
};

const toNumber = value => (value === '' ? null : Number(String(value).replace(',', '.')));

function valuesToEntry(values) {
  const repsMin = toNumber(values.repsMin);
  const dose =
    values.doseUnit === 'seconds'
      ? { unit: 'seconds', value: toNumber(values.seconds) }
      : { unit: 'repetitions', min: repsMin, max: toNumber(values.repsMax) ?? repsMin };
  return {
    exerciseId: values.exerciseId,
    exercise: values.exercise.trim(),
    muscle: values.muscle,
    sets: toNumber(values.sets),
    dose,
    weight: toNumber(values.weight),
    restSeconds: toNumber(values.rest),
  };
}

function entryToValues(entry, language) {
  const { dose } = entry;
  const asText = value => (value === null || value === undefined ? '' : String(value));
  return {
    ...EMPTY_VALUES,
    muscle: entry.muscle,
    exercise: entryName(entry, language),
    exerciseId: entry.exerciseId,
    doseUnit: dose.unit,
    repsMin: dose.unit === 'repetitions' ? asText(dose.min) : '',
    repsMax: dose.unit === 'repetitions' && dose.max !== dose.min ? asText(dose.max) : '',
    seconds: dose.unit === 'seconds' ? asText(dose.value) : '',
    sets: asText(entry.sets),
    weight: asText(entry.weight),
    rest: asText(entry.restSeconds),
  };
}

// Adds, edits and removes the exercises of one training day.
export default function DayExercisesForm({
  day,
  entries = [],
  onAddEntry,
  onUpdateEntry,
  onRemoveEntry,
}) {
  const { t, language } = useTranslation();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [editingId, setEditingId] = useState(null);
  const [showRangeError, setShowRangeError] = useState(false);
  const label = dayLabel(day, t);
  const formLabelId = `dayExercises-${day}`;
  const fieldId = name => `${name}-${day}`;

  // Suggestions for the exercise field, limited to the chosen muscle group.
  const suggestions = useMemo(
    () =>
      EXERCISES.filter(
        exercise => !values.muscle || exerciseGroups(exercise).includes(values.muscle)
      )
        .map(exercise => exercise.name[language] ?? exercise.name.en)
        .sort((a, b) => a.localeCompare(b, language)),
    [values.muscle, language]
  );

  function resetForm() {
    setEditingId(null);
    setShowRangeError(false);
    // Keep the muscle and the measure, the next exercise is often similar.
    setValues({ ...EMPTY_VALUES, muscle: values.muscle, doseUnit: values.doseUnit });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (name === 'repsMin' || name === 'repsMax') setShowRangeError(false);
  }

  function handleExerciseChange(event) {
    const text = event.target.value;
    const match = findLibraryExercise(text);
    const next = { ...values, exercise: text, exerciseId: match?.id ?? null };
    if (match && values.exerciseId !== match.id) {
      next.muscle = values.muscle || defaultMuscleOf(match.id);
      next.doseUnit = TIMED_CATEGORIES.includes(match.category) ? 'seconds' : 'repetitions';
    }
    setValues(next);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!values.muscle || !values.exercise.trim()) {
      return;
    }
    const entry = valuesToEntry(values);
    if (entry.dose.unit === 'repetitions' && entry.dose.max < entry.dose.min) {
      setShowRangeError(true);
      return;
    }
    if (editingId) {
      onUpdateEntry({ ...entry, id: editingId });
    } else {
      onAddEntry({ ...entry, id: nanoid() });
    }
    resetForm();
  }

  function handleEdit(entry) {
    setEditingId(entry.id);
    setShowRangeError(false);
    setValues(entryToValues(entry, language));
  }

  function handleRemove(entryId) {
    if (entryId === editingId) {
      resetForm();
    }
    onRemoveEntry(entryId);
  }

  const numberField = (name, props = {}) => (
    <Row key={name}>
      <Label htmlFor={fieldId(name)}>{t(`dayExercises.${name}`)}</Label>
      <FieldInput
        id={fieldId(name)}
        name={name}
        type="number"
        value={values[name]}
        onChange={handleChange}
        {...props}
      />
    </Row>
  );

  return (
    <FormCard>
      <ScreenReaderOnly id={formLabelId}>
        {t('dayExercises.formLabel', { day: label })}
      </ScreenReaderOnly>
      <form autoComplete="off" aria-labelledby={formLabelId} onSubmit={handleSubmit}>
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
          <Label htmlFor={fieldId('exercise')}>{t('dayExercises.exercise')}</Label>
          <FieldInput
            id={fieldId('exercise')}
            name="exercise"
            type="text"
            required
            maxLength={50}
            list={fieldId('exerciseOptions')}
            placeholder={t('dayExercises.exercisePlaceholder')}
            value={values.exercise}
            onChange={handleExerciseChange}
          />
          <datalist id={fieldId('exerciseOptions')}>
            {suggestions.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </Row>
        <Row>
          <Label htmlFor={fieldId('doseUnit')}>{t('dayExercises.doseType')}</Label>
          <select
            id={fieldId('doseUnit')}
            name="doseUnit"
            value={values.doseUnit}
            onChange={handleChange}
          >
            <option value="repetitions">{t('dayExercises.doseRepetitions')}</option>
            <option value="seconds">{t('dayExercises.doseSeconds')}</option>
          </select>
        </Row>
        {values.doseUnit === 'repetitions' ? (
          <>
            {numberField('repsMin', { required: true, min: '1', inputMode: 'numeric', placeholder: '8' })}
            {numberField('repsMax', { min: '1', inputMode: 'numeric', placeholder: '12' })}
            {showRangeError && (
              <ErrorText role="alert">{t('dayExercises.errorRepsRange')}</ErrorText>
            )}
          </>
        ) : (
          numberField('seconds', { required: true, min: '1', inputMode: 'numeric', placeholder: '30' })
        )}
        {numberField('sets', { required: true, min: '1', inputMode: 'numeric', placeholder: '3' })}
        {numberField('weight', {
          min: '0',
          step: 'any',
          inputMode: 'decimal',
          placeholder: t('dayExercises.weightPlaceholder'),
        })}
        {numberField('rest', { min: '0', inputMode: 'numeric', placeholder: '90' })}
        <ButtonRow>
          <Button type="submit">
            {t(editingId ? 'dayExercises.update' : 'dayExercises.add')}
          </Button>
          {editingId && <Button onClick={resetForm}>{t('dayExercises.cancelEdit')}</Button>}
        </ButtonRow>
      </form>

      {entries.length === 0 ? (
        <EmptyText>{t('dayExercises.empty')}</EmptyText>
      ) : (
        <ExerciseList aria-label={label}>
          {entries.map(entry => (
            <ExerciseListItem
              key={entry.id}
              entry={entry}
              isEditing={entry.id === editingId}
              onEdit={() => handleEdit(entry)}
              onRemove={() => handleRemove(entry.id)}
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
  /* Let labels and fields shrink, so long labels never widen the page. */
  & > * {
    min-width: 0;
  }
  select {
    max-width: 60%;
  }
`;

const FieldInput = styled(Input)`
  flex: 0 1 220px;
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
