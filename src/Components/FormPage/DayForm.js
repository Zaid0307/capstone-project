import ScreenReaderOnly from '../Styles/ScreenReaderOnly';
import SpaceBetween from '../Styles/SpaceBetween';
import Center from '../Styles/Center';
import styled from 'styled-components';
import { useState } from 'react';
import ListedExercise from './ListedExercise';
import { nanoid } from 'nanoid';
import { useTranslation } from '../../i18n/LanguageContext';
import { MUSCLE_GROUP_NAMES } from '../../api/wger';
import { dayLabel } from '../../utils/workoutPlan';

const EMPTY_EXERCISE = {
  exercise: '',
  weight: '',
  repetitions: '',
  sets: '',
  muscle: '',
};

export default function DayForm({
  day,
  exercises = [],
  onAddExercise,
  onRemoveExercise,
}) {
  const { t } = useTranslation();
  const [exercise, setExercise] = useState(EMPTY_EXERCISE);
  const formLabelId = `formSpan${day}`;

  function handleSubmit(event) {
    event.preventDefault();
    if (!exercise.muscle || !exercise.exercise.trim()) {
      return;
    }
    onAddExercise({
      ...exercise,
      exercise: exercise.exercise.trim(),
      id: nanoid(),
    });
    setExercise({ ...EMPTY_EXERCISE, muscle: exercise.muscle });
  }

  function handleOnChange(event) {
    const { name, value } = event.target;
    setExercise({ ...exercise, [name]: value });
  }

  return (
    <FormBox>
      <ScreenReaderOnly id={formLabelId}>
        {t('dayForm.formLabel', { day: dayLabel(day, t) })}
      </ScreenReaderOnly>
      <form
        autoComplete="off"
        aria-labelledby={formLabelId}
        onSubmit={handleSubmit}
      >
        <StyledCenterBox>{dayLabel(day, t).toUpperCase()}</StyledCenterBox>
        <SpaceBetween>
          <Lable htmlFor={`muscle${day}`}>{t('dayForm.muscle')}</Lable>
          <select
            id={`muscle${day}`}
            name="muscle"
            required
            onChange={handleOnChange}
            value={exercise.muscle}
          >
            <option value="" disabled>
              {t('dayForm.chooseMuscle')}
            </option>
            {MUSCLE_GROUP_NAMES.map(muscle => (
              <option key={muscle} value={muscle}>
                {t(`muscle.${muscle}`)}
              </option>
            ))}
          </select>
        </SpaceBetween>
        <SpaceBetween>
          <Lable htmlFor={`exercise${day}`}>{t('dayForm.exercise')}</Lable>
          <StyledInput
            id={`exercise${day}`}
            name="exercise"
            required
            maxLength={50}
            type="text"
            placeholder={t('dayForm.exercisePlaceholder')}
            value={exercise.exercise}
            onChange={handleOnChange}
          />
        </SpaceBetween>
        <SpaceBetween>
          <Lable htmlFor={`weight${day}`}>{t('dayForm.weight')}</Lable>
          <StyledInput
            id={`weight${day}`}
            name="weight"
            required
            min="0"
            step="any"
            type="number"
            inputMode="decimal"
            placeholder={t('dayForm.weightPlaceholder')}
            value={exercise.weight}
            onChange={handleOnChange}
          />
        </SpaceBetween>
        <SpaceBetween>
          <Lable htmlFor={`repetitions${day}`}>
            {t('dayForm.repetitions')}
          </Lable>
          <StyledInput
            id={`repetitions${day}`}
            name="repetitions"
            required
            type="number"
            inputMode="numeric"
            min="1"
            placeholder="12"
            value={exercise.repetitions}
            onChange={handleOnChange}
          />
        </SpaceBetween>
        <SpaceBetween>
          <Lable htmlFor={`sets${day}`}>{t('dayForm.sets')}</Lable>
          <StyledInput
            id={`sets${day}`}
            name="sets"
            required
            type="number"
            inputMode="numeric"
            min="1"
            placeholder="3"
            value={exercise.sets}
            onChange={handleOnChange}
          />
        </SpaceBetween>
        <Center>
          <OnClickButton type="submit">{t('dayForm.add')}</OnClickButton>
        </Center>
      </form>

      {exercises.length === 0 ? (
        <EmptyText>{t('dayForm.noExercises')}</EmptyText>
      ) : (
        <ul aria-label={dayLabel(day, t)}>
          {exercises.map(listedExercise => (
            <li key={listedExercise.id}>
              <ListedExercise
                newCards={listedExercise}
                onRemove={() => onRemoveExercise(listedExercise.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </FormBox>
  );
}

const EmptyText = styled.p`
  text-align: center;
  color: #496b73;
  margin: 5px 0;
`;

const FormBox = styled.section`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 0 15px 15px 15px;
  padding: 5px;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
  ul {
    list-style: none;
  }
`;

const StyledInput = styled.input`
  box-sizing: border-box;
  border: none;
  border-bottom: 0.5px solid #5e888c;
  font-size: 1rem;
  padding-left: 0.25rem;
  padding-top: 0.25rem;
  background-color: transparent;
  width: 220px;
  max-width: 60vw;
  &:focus {
    border-color: #496b73;
    outline: none;
  }
`;

const OnClickButton = styled.button`
  display: inline-flex;
  border: none;
  outline: none;
  border-radius: 5px;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 500;
  padding: 5px;
  margin: 5px 0px;
  background-color: #283a45;
  color: #d5dee8;
  &:hover {
    background-color: #496b73;
    color: #b5dff5;
  }
`;

const Lable = styled.label`
  color: #496b73;
`;

const StyledCenterBox = styled.div`
  display: flex;
  background-color: #5e888c;
  color: #283a45;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  padding: 5px;
  border-radius: 5px;
`;
