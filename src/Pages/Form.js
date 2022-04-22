import CreateForm from '../Components/FormPage/CreateForm';
import { useState } from 'react';
import DayForm from '../Components/FormPage/DayForm';
import styled from 'styled-components';
import Center from '../Components/Styles/Center';
import Navigation from '../Components/Nav/Navigation';
export default function Form({ onAddWorkoutPlan }) {
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [toggleForm, setToggleForm] = useState(false);

  function handleCreateForm(newWorkoutPlan) {
    setWorkoutPlan(newWorkoutPlan);
    setToggleForm(true);
  }

  function createDayExercises(updatedDay) {
    const daysAndExercises = workoutPlan.days.map(day => {
      if (day.day === updatedDay.day) {
        return updatedDay;
      }
      return day;
    });

    setWorkoutPlan({ ...workoutPlan, days: daysAndExercises });
  }

  return (
    <GridWrap>
      <Background>
        {!toggleForm ? (
          <CenterComponent>
            <CreateForm onSubmit={handleCreateForm} />
          </CenterComponent>
        ) : (
          <>
            <StyledCenterBox>
              <StyledH2>{workoutPlan.nameOfWorkout}</StyledH2>
            </StyledCenterBox>
            {workoutPlan.days.map(day => {
              return (
                <DayForm
                  key={day.day}
                  onSubmit={createDayExercises}
                  day={day.day}
                />
              );
            })}
            <Center>
              <OnClickButton onClick={() => onAddWorkoutPlan(workoutPlan)}>
                Save all changes
              </OnClickButton>
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
