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
  console.log('data', data);
  const { shoulders, arms, legs, abs, chest, back, images } = UseMuscles();
  const navigate = useNavigate();

  function createCard(newCard) {
    setData([...data, newCard]);
    navigate('/Workoutplans');
  }

  function handleDeleteCard(perId) {
    const deleteData = data.filter(dData => dData.id !== perId);
    // const mapDay = data.map(mDays => mDays.days);
    // const deleteDays = mapDay.filter(dDay => dDay.id !== perId);
    // const mapMuscles = mapDay.map(mMuscle => mMuscle.muscles);
    // const deleteMuscles = mapMuscles.filter(dMuscle => dMuscle.id !== perId);
    // const mapExercises = mapMuscles.map(mExercises => mExercises.exercises);
    // const deleteExercises = mapExercises.filter(
    //   dExercises => dExercises.id !== perId
    // );
    // deleteDays, deleteMuscles, deleteExercises
    setData(deleteData);
  }

  function handleDeleteDays(perId, workoutId) {
    console.log('perId', perId);
    const days = data.map(newData => newData.days);
    const newDays = days.filter(dDays => dDays.id !== perId);
    const workoutToUpdate = data.find(workout => workout.id === workoutId);
    const updatedWorkout = { ...workoutToUpdate, days: newDays };
    console.log(newDays);
    console.log(updatedWorkout);
    // setData();
  }

  // function handleDeleteMusles(perId) {
  //   const mapDay = data.map(newData => newData.mucsles);
  //   const deleteMusles = mapDay.filter(deleteDays => deleteDays.id !== perId);

  //   setData(deleteMusles);
  // }

  return (
    <GridWrap>
      <Routes>
        <Route
          path="/Create_Plan"
          element={<Form onAddWorkoutPlan={createCard} />}
        />
        <Route
          path="/"
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
      <Navigation />
    </GridWrap>
  );
}

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;
