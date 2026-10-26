import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ExercisesPage from './pages/ExercisesPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import CreatePlanPage from './pages/CreatePlanPage';
import EditPlanPage from './pages/EditPlanPage';
import useExercises from './hooks/useExercises';
import useWorkoutPlans from './hooks/useWorkoutPlans';
import { useTranslation } from './i18n/LanguageContext';
import { legacyRedirects, routes } from './routes';

export default function App() {
  const { language } = useTranslation();
  const exercises = useExercises(language);
  const { plans, addPlan, updatePlan, deletePlan, deleteDay } =
    useWorkoutPlans();
  const navigate = useNavigate();

  function handleCreatePlan(plan) {
    addPlan(plan);
    navigate(routes.plans);
  }

  function handleUpdatePlan(plan) {
    updatePlan(plan);
    navigate(routes.plans);
  }

  return (
    <Routes>
      <Route path={routes.landing} element={<LandingPage />} />
      <Route
        path={routes.exercises}
        element={<ExercisesPage {...exercises} />}
      />
      <Route
        path={routes.muscleGroup(':muscle')}
        element={<ExercisesPage {...exercises} />}
      />
      <Route
        path={routes.plans}
        element={
          <WorkoutPlansPage
            plans={plans}
            onDeletePlan={deletePlan}
            onDeleteDay={deleteDay}
          />
        }
      />
      <Route
        path={routes.newPlan}
        element={<CreatePlanPage onSave={handleCreatePlan} />}
      />
      <Route
        path={routes.editPlan(':planId')}
        element={<EditPlanPage plans={plans} onSave={handleUpdatePlan} />}
      />
      {Object.entries(legacyRedirects).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="*" element={<Navigate to={routes.landing} replace />} />
    </Routes>
  );
}
