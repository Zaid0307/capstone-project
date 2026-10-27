import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import ExerciseListItem from './ExerciseListItem';
import { ErrorText, Field, FormCard, FormTitle, Input, Label, Select } from './formStyles';
import Button from '../ui/Button';
import ScreenReaderOnly from '../ui/ScreenReaderOnly';
import { EXERCISES, exerciseGroups } from '../../data/exerciseLibrary';
import { colors, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  PLAN_MUSCLES,
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
      EXERCISES.filter(exercise => {
        const groups = exerciseGroups(exercise);
        if (!values.muscle) return true;
        return values.muscle === 'other' ? groups.length === 0 : groups.includes(values.muscle);
      })
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
      next.muscle = values.muscle || defaultMuscleOf(match.id) || 'other';
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
      // Keep fields the form does not edit, such as the target from a template.
      const original = entries.find(item => item.id === editingId);
      onUpdateEntry({ ...original, ...entry, id: editingId });
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

  const rangeErrorId = fieldId('repsRangeError');
  const numberField = (name, props = {}) => (
    <Field key={name}>
      <Label htmlFor={fieldId(name)}>{t(`dayExercises.${name}`)}</Label>
      <Input
        id={fieldId(name)}
        name={name}
        type="number"
        value={values[name]}
        onChange={handleChange}
        {...props}
      />
    </Field>
  );

  return (
    <FormCard>
      <ScreenReaderOnly id={formLabelId}>
        {t('dayExercises.formLabel', { day: label })}
      </ScreenReaderOnly>
      <FormTitle>{label}</FormTitle>
      <Form autoComplete="off" aria-labelledby={formLabelId} onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor={fieldId('muscle')}>{t('dayExercises.muscle')}</Label>
          <Select
            id={fieldId('muscle')}
            name="muscle"
            required
            value={values.muscle}
            onChange={handleChange}
          >
            <option value="" disabled>
              {t('dayExercises.chooseMuscle')}
            </option>
            {PLAN_MUSCLES.map(muscle => (
              <option key={muscle} value={muscle}>
                {t(`muscle.${muscle}`)}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor={fieldId('exercise')}>{t('dayExercises.exercise')}</Label>
          <Input
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
        </Field>
        <Field>
          <Label htmlFor={fieldId('doseUnit')}>{t('dayExercises.doseType')}</Label>
          <Select
            id={fieldId('doseUnit')}
            name="doseUnit"
            value={values.doseUnit}
            onChange={handleChange}
          >
            <option value="repetitions">{t('dayExercises.doseRepetitions')}</option>
            <option value="seconds">{t('dayExercises.doseSeconds')}</option>
          </Select>
        </Field>
        {values.doseUnit === 'repetitions' ? (
          <>
            <TwoColumns>
              {numberField('repsMin', { required: true, min: '1', inputMode: 'numeric', placeholder: '8' })}
              {numberField('repsMax', {
                min: '1',
                inputMode: 'numeric',
                placeholder: '12',
                'aria-invalid': showRangeError || undefined,
                'aria-describedby': showRangeError ? rangeErrorId : undefined,
              })}
            </TwoColumns>
            {showRangeError && (
              <ErrorText id={rangeErrorId} role="alert">
                {t('dayExercises.errorRepsRange')}
              </ErrorText>
            )}
          </>
        ) : (
          numberField('seconds', { required: true, min: '1', inputMode: 'numeric', placeholder: '30' })
        )}
        <TwoColumns>
          {numberField('sets', { required: true, min: '1', inputMode: 'numeric', placeholder: '3' })}
          {numberField('rest', { min: '0', inputMode: 'numeric', placeholder: '90' })}
        </TwoColumns>
        {numberField('weight', {
          min: '0',
          step: 'any',
          inputMode: 'decimal',
          placeholder: t('dayExercises.weightPlaceholder'),
        })}
        <ButtonRow>
          <Button type="submit">
            {t(editingId ? 'dayExercises.update' : 'dayExercises.add')}
          </Button>
          {editingId && (
            <Button $variant="secondary" onClick={resetForm}>
              {t('dayExercises.cancelEdit')}
            </Button>
          )}
        </ButtonRow>
      </Form>

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${space.lg};
`;

// Two fields side by side; below each other when space is short.
const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr));
  gap: ${space.lg};
  align-items: end;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const EmptyText = styled.p`
  color: ${colors.textMuted};
`;

const ExerciseList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.sm};
  list-style: none;
`;
