import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ExercisesPage from './pages/ExercisesPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import CreatePlanPage from './pages/CreatePlanPage';
import EditPlanPage from './pages/EditPlanPage';
import DiaryPage from './pages/DiaryPage';
import WorkoutPage from './pages/WorkoutPage';
import WorkoutSummaryPage from './pages/WorkoutSummaryPage';
import TodayPage from './pages/TodayPage';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import AnalysisPage from './pages/AnalysisPage';
import ExerciseAnalysisPage from './pages/ExerciseAnalysisPage';
import AccountPage from './pages/AccountPage';
import PrivacyPage from './pages/PrivacyPage';
import useWorkoutPlans from './hooks/useWorkoutPlans';
import useWorkoutLog from './hooks/useWorkoutLog';
import SaveError from './components/ui/SaveError';
import { UndoProvider } from './components/ui/UndoProvider';
import { legacyRedirects, routes } from './routes';

export default function App() {
  const { plans, error: planError, addPlan, updatePlan, deletePlan } = useWorkoutPlans();
  const {
    workouts,
    error: workoutError,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  } = useWorkoutLog();
  const navigate = useNavigate();

  // A finished plan is used in the training diary right away.
  function handleCreatePlan(plan) {
    addPlan(plan);
    navigate(routes.diaryForPlan(plan.id));
  }

  function handleUpdatePlan(plan) {
    updatePlan(plan);
    navigate(routes.plans);
  }

  const showPlans = () => navigate(routes.plans);

  // Undoing a deleted plan adds it again; undoing a deleted day restores the plan as it was.
  function handleRestorePlan(plan, how) {
    if (how === 'add') addPlan(plan);
    else updatePlan(plan);
  }

  return (
    <UndoProvider>
      {(planError || workoutError) && <SaveError />}
      <Routes>
      <Route path={routes.landing} element={<LandingPage />} />
      <Route
        path={routes.exercises}
        element={<ExercisesPage />}
      />
      <Route
        path={routes.muscleGroup(':muscle')}
        element={<ExercisesPage />}
      />
      <Route
        path={routes.plans}
        element={
          <WorkoutPlansPage
            plans={plans}
            workouts={workouts}
            onDuplicatePlan={addPlan}
            onDeletePlan={deletePlan}
            onRestorePlan={handleRestorePlan}
            onUpdatePlan={updatePlan}
          />
        }
      />
      <Route
        path={routes.newPlan}
        element={<CreatePlanPage plans={plans} onSave={handleCreatePlan} onCancel={showPlans} />}
      />
      <Route
        path={routes.editPlan(':planId')}
        element={
          <EditPlanPage plans={plans} onSave={handleUpdatePlan} onCancel={showPlans} />
        }
      />
      <Route
        path={routes.today}
        element={
          <TodayPage plans={plans} workouts={workouts} onAddWorkout={addWorkout} onDeleteWorkout={deleteWorkout} />
        }
      />
      <Route path={routes.settings} element={<SettingsPage />} />
      <Route path={routes.account} element={<AccountPage />} />
      <Route path={routes.privacy} element={<PrivacyPage />} />
      <Route
        path={routes.calendar}
        element={
          <CalendarPage
            plans={plans}
            workouts={workouts}
            onAddWorkout={addWorkout}
            onUpdateWorkout={updateWorkout}
            onDeleteWorkout={deleteWorkout}
          />
        }
      />
      <Route path={routes.analysis} element={<AnalysisPage plans={plans} workouts={workouts} />} />
      <Route
        path="/analysis/exercise/:exerciseKey"
        element={<ExerciseAnalysisPage plans={plans} workouts={workouts} />}
      />
      <Route
        path={routes.diary}
        element={
          <DiaryPage
            plans={plans}
            workouts={workouts}
            onAddWorkout={addWorkout}
            onDeleteWorkout={deleteWorkout}
          />
        }
      />
      <Route
        path={routes.workout(':workoutId')}
        element={<WorkoutPage workouts={workouts} onUpdateWorkout={updateWorkout} />}
      />
      <Route
        path={routes.workoutSummary(':workoutId')}
        element={
          <WorkoutSummaryPage workouts={workouts} onAddWorkout={addWorkout} onDeleteWorkout={deleteWorkout} />
        }
      />
      {Object.entries(legacyRedirects).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="*" element={<Navigate to={routes.landing} replace />} />
      </Routes>
    </UndoProvider>
  );
}
