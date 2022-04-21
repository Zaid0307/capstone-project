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

  const { shoulders, arms, legs, abs, chest, back, images } = UseMuscles();
  const navigate = useNavigate();

  function createCard(newCard) {
    setData([...data, newCard]);
    navigate('/Workoutplans');
  }

  function handleDelete(perId) {
    const deleteData = data.filter(dData => dData.id !== perId);
    const mapDay = data.map(mDays => mDays.days);
    const deleteDays = mapDay.filter(dDay => dDay.id !== perId);
    const mapMuscles = mapDay.map(mMuscle => mMuscle.muscles);
    const deleteMuscles = mapMuscles.filter(dMuscle => dMuscle.id !== perId);
    const mapExercises = mapMuscles.map(mExercises => mExercises.exercises);
    const deleteExercises = mapExercises.filter(
      dExercises => dExercises.id !== perId
    );

    setData(deleteData, deleteDays, deleteMuscles, deleteExercises);
  }

  return (
    <GridWrap>
      <Routes>
        <Route path="/" element={<Form onAddWorkoutPlan={createCard} />} />
        <Route
          path="/test"
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
          element={<WorkoutplansPage data={data} handleDelete={handleDelete} />}
        />
      </Routes>
      <Navigation />
    </GridWrap>
  );
}

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;
