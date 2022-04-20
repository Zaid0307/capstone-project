import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './Components/Nav/Navigation';
import WorkoutplansPage from './Pages/WorkoutplansPage';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
import Form from './Pages/Form';
import ExerciseAndMuscleOverview from './Pages/ExerciseAndMuscleOverview';
import UseMuscles from './Components/Fetch/UseMuscles';

export default function App() {
  const [data, setData] = useLocalStorage('data', []);
  const { sholder, arms, legs, abs, chest, back, images } = UseMuscles();
  const navigate = useNavigate();
  return (
    <GridWrap>
      <Routes>
        <Route path="/" element={<Form onAddWorkoutPlan={createCard} />} />
        <Route
          path="/test"
          element={
            <ExerciseAndMuscleOverview
              sholder={sholder}
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
          element={<WorkoutplansPage data={data} />}
        />
      </Routes>
      <Navigation />
    </GridWrap>
  );

  function createCard(newCard) {
    setData([...data, newCard]);
    navigate('/Workoutplans');
  }
}

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;
