import CreateForm from '../Components/FormPage/CreateForm';
import { useState } from 'react';
import DayForm from '../Components/FormPage/DayForm';
import styled from 'styled-components';
import Center from '../Components/Styles/Center';
import Navigation from '../Components/Nav/Navigation';
import { useTranslation } from '../i18n/LanguageContext';
import {
  buildWorkoutPlan,
  dayLabel,
  getDaysWithoutExercises,
} from '../utils/workoutPlan';

export default function Form({ onAddWorkoutPlan }) {
  const { t } = useTranslation();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [exercisesByDay, setExercisesByDay] = useState({});
  const [showSaveError, setShowSaveError] = useState(false);

  const daysWithoutExercises = workoutPlan
    ? getDaysWithoutExercises(workoutPlan, exercisesByDay)
    : [];

  function handleAddExercise(day, exercise) {
    setExercisesByDay({
      ...exercisesByDay,
      [day]: [...(exercisesByDay[day] ?? []), exercise],
    });
  }

  function handleRemoveExercise(day, exerciseId) {
    setExercisesByDay({
      ...exercisesByDay,
      [day]: exercisesByDay[day].filter(exercise => exercise.id !== exerciseId),
    });
  }

  function handleSave() {
    if (daysWithoutExercises.length > 0) {
      setShowSaveError(true);
      return;
    }
    onAddWorkoutPlan(buildWorkoutPlan(workoutPlan, exercisesByDay));
  }

  return (
    <GridWrap>
      <Background>
        {!workoutPlan ? (
          <CenterComponent>
            <CreateForm onSubmit={setWorkoutPlan} />
          </CenterComponent>
        ) : (
          <>
            <StyledCenterBox>
              <StyledH2>{workoutPlan.nameOfWorkout}</StyledH2>
            </StyledCenterBox>
            {workoutPlan.days.map(({ day }) => (
              <DayForm
                key={day}
                day={day}
                exercises={exercisesByDay[day]}
                onAddExercise={exercise => handleAddExercise(day, exercise)}
                onRemoveExercise={exerciseId =>
                  handleRemoveExercise(day, exerciseId)
                }
              />
            ))}
            {showSaveError && daysWithoutExercises.length > 0 && (
              <ErrorText role="alert">
                {t('form.errorEmptyDays', {
                  days: daysWithoutExercises
                    .map(day => dayLabel(day, t))
                    .join(', '),
                })}
              </ErrorText>
            )}
            <Center>
              <OnClickButton onClick={handleSave}>{t('form.save')}</OnClickButton>
            </Center>
          </>
        )}
      </Background>
      <Navigation />
    </GridWrap>
  );
}
const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;
const StyledCenterBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 5px;
`;

const Background = styled.div`
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
  height: 100%;
`;

const CenterComponent = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.p`
  margin: 0 15px;
  padding: 5px;
  border-radius: 5px;
  background-color: #d5dee8;
  color: #a12a2a;
  text-align: center;
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
  background-color: #d5dee8;
  color: #283a45;
  &:hover {
    background-color: #496b73;
    color: #b5dff5;
  }
`;
const StyledH2 = styled.h2`
  color: #283a45;
  background-color: #d5dee8;
  width: 100%;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  margin: 0 10px 0 10px;
`;
