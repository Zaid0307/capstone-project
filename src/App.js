import { Routes, Route, useNavigate } from 'react-router-dom';
import WorkoutplansPage from './Pages/WorkoutplansPage';
import { useLocalStorage } from 'usehooks-ts';
import Form from './Pages/Form';
import ExerciseAndMuscleOverview from './Pages/ExerciseAndMuscleOverview';
import useExercises from './hooks/useExercises';
import LandingPage from './Components/LandingPage/LandingPage';
import { useTranslation } from './i18n/LanguageContext';
import { deleteDay, deletePlan } from './utils/workoutPlan';

export default function App() {
  const [data, setData] = useLocalStorage('data', []);
  const { language } = useTranslation();
  const exercises = useExercises(language);
  const navigate = useNavigate();

  function handleLandingpage() {
    navigate('/home');
  }

  function createCard(newCard) {
    setData([...data, newCard]);
    navigate('/Workoutplans');
  }

  function handleDeleteCard(planId) {
    setData(deletePlan(data, planId));
  }

  function handleDeleteDays(dayId, planId) {
    setData(deleteDay(data, planId, dayId));
  }

  return (
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
        element={<ExerciseAndMuscleOverview {...exercises} />}
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
