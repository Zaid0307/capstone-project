import CreateForm from '../Components/CreateForm';
import { useState } from 'react';
import DayForm from '../Components/DayForm';
import styled from 'styled-components';

export default function Form({ onAddWorkoutPlan }) {
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [toggleForm, setToggleForm] = useState(false);

  console.log(workoutPlan);
  return (
    <>
      <PageBox>
        {!toggleForm ? (
          <CreateForm onSubmit={handleCreateForm} />
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
      </PageBox>
    </>
  );

  function handleCreateForm(newWorkoutPlan) {
    setWorkoutPlan(newWorkoutPlan);
    setToggleForm(true);
  }

  function createDayExercises(updatedDay) {
    // updatedDay = {day: 'tuesday', exercise: 'ringbell', weight: '50', repetitions: '100', sets: '50' }

    const daysAndExercises = workoutPlan.days.map(day => {
      if (day.day === updatedDay.day) {
        return updatedDay;
      }
      return day;
    });
    console.log(daysAndExercises);
    setWorkoutPlan({ ...workoutPlan, days: daysAndExercises });
  }
  // const data = {
  //   nameOfWorkout: 'foobar',
  //   description: 'foobarbaz',
  //   days: [{day: 'tuesday', exercise: 'ringbell', weight: '50', repetitions: '100', sets: '50' }]
  // }
}

const StyledCenterBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 5px;
`;

const PageBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  padding: 5px;
  margin: 5px;
`;
