import CreateForm from '../Components/CreateForm';
import { useState } from 'react';
import DayForm from '../Components/DayForm';
import styled from 'styled-components';

export default function Form({ onAddWorkoutPlan }) {
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [toggleForm, setToggleForm] = useState(false);

  return (
    <Background>
      {!toggleForm ? (
        <CenterComponent>
          <CreateForm onSubmit={handleCreateForm} />
        </CenterComponent>
      ) : (
        <>
          <StyledCenterBox>
            <h2>{workoutPlan.nameOfWorkout}</h2>
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
          <button onClick={() => onAddWorkoutPlan(workoutPlan)}>
            Save all changes
          </button>
        </>
      )}
    </Background>
  );

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
}

const StyledCenterBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 5px;
`;

const Background = styled.div`
  background: radial-gradient(#07080d, #5e888c, #344b59);
  height: 100%;
`;

const CenterComponent = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
