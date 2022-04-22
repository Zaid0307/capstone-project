import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './Components/Nav/Navigation';
import WorkoutplansPage from './Pages/WorkoutplansPage';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
import Form from './Pages/Form';
import ExerciseAndMuscleOverview from './Pages/ExerciseAndMuscleOverview';
import UseMuscles from './Components/Fetch/UseMuscles';
import LandingPage from './Components/LandingPage/LandingPage';
import { useState } from 'react';

export default function App() {
  const [data, setData] = useLocalStorage('data', []);
  const [toggle, setToggle] = useState(false);
  const { shoulders, arms, legs, abs, chest, back, images } = UseMuscles();
  const navigate = useNavigate();

  function handleLandingpage() {
    navigate('/Home');
  }

  function createCard(newCard) {
    setData([...data, newCard]);
    navigate('/Workoutplans');
  }

  function handleDeleteCard(perId) {
    const deleteData = data.filter(dData => dData.id !== perId);
    setData(deleteData);
  }

  function handleDeleteDays(perId, workoutId) {
    const days = data.map(newData => newData.days);
    const newDays = days[0].filter(dDays => dDays.id !== perId);
    const workoutToUpdate = data.find(workout => workout.id === workoutId);
    const workoutToUpdateIndex = data.findIndex(
      workout => workout.id === workoutId
    );
    const updatedWorkout = { ...workoutToUpdate, days: newDays };
    const newData = data.slice();
    newData[workoutToUpdateIndex] = updatedWorkout;

    setData(newData);
  }

  return (
    // <GridWrap>
    <Routes>
      <Route
        path="/"
        element={<LandingPage handleLandingpage={handleLandingpage} />}
      />
      <Route
        path="/Create_Plan"
        element={<Form onAddWorkoutPlan={createCard} />}
      />
      <Route
        path="/home"
        element={
          <ExerciseAndMuscleOverview
            shoulders={shoulders}
            images={images}
            arms={arms}
            legs={legs}
            abs={abs}
            chest={chest}
            back={back}
          />
        }
      />
      <Route
        path="/Workoutplans"
        element={
          <WorkoutplansPage
            data={data}
            handleDeleteCard={handleDeleteCard}
            handleDeleteDays={handleDeleteDays}
          />
        }
      />
    </Routes>
  );
}
{
  /* <Navigation />
</GridWrap> */
}

// const GridWrap = styled.div`
//   display: grid;
//   grid-template-rows: auto 48px;
//   height: 100vh;
// `;
