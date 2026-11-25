import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import TodayPage from './pages/TodayPage';
import useWorkoutPlans from './hooks/useWorkoutPlans';
import useWorkoutLog from './hooks/useWorkoutLog';
import SaveError from './components/ui/SaveError';
import { UndoProvider } from './components/ui/UndoProvider';
import { legacyRedirects, routes } from './routes';
import { useTranslation } from './i18n/LanguageContext';
import { useIsGuest } from './auth/useAccess';
import { lazyWithExerciseLibrary } from './data/exerciseLibraryLoader';

// "Today" loads with the app; every other page is loaded
// when it is first opened, so the first visit downloads less.
const ExercisesPage = lazyWithExerciseLibrary(() => import('./pages/ExercisesPage'));
const WorkoutPlansPage = lazy(() => import('./pages/WorkoutPlansPage'));
const CreatePlanPage = lazyWithExerciseLibrary(() => import('./pages/CreatePlanPage'));
const EditPlanPage = lazyWithExerciseLibrary(() => import('./pages/EditPlanPage'));
const DiaryPage = lazyWithExerciseLibrary(() => import('./pages/DiaryPage'));
const WorkoutPage = lazyWithExerciseLibrary(() => import('./pages/WorkoutPage'));
const WorkoutSummaryPage = lazyWithExerciseLibrary(() => import('./pages/WorkoutSummaryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CalendarPage = lazyWithExerciseLibrary(() => import('./pages/CalendarPage'));
const AnalysisPage = lazyWithExerciseLibrary(() => import('./pages/AnalysisPage'));
const ExerciseAnalysisPage = lazyWithExerciseLibrary(() => import('./pages/ExerciseAnalysisPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const PlanViewPage = lazyWithExerciseLibrary(() => import('./pages/PlanViewPage'));
const ImportSharedPlanPage = lazyWithExerciseLibrary(() => import('./pages/ImportSharedPlanPage'));

function PageLoading() {
  const { t } = useTranslation();
  return <p role="status">{t('account.loading')}</p>;
}

export default function App() {
  const { plans, error: planError, retry: retryPlans, addPlan, updatePlan, deletePlan } = useWorkoutPlans();
  const {
    workouts,
    error: workoutError,
    retry: retryWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  } = useWorkoutLog();
  const navigate = useNavigate();
  const isGuest = useIsGuest();
  // Without an account only plans and exercises are available.
  const home = isGuest ? routes.plans : routes.today;
  const forAccounts = element => (isGuest ? <Navigate to={routes.account} replace /> : element);

  // A finished plan is used in the training diary right away (with an account).
  function handleCreatePlan(plan) {
    addPlan(plan);
    navigate(isGuest ? routes.plans : routes.diaryForPlan(plan.id));
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
      {(planError || workoutError) && (
        <SaveError
          error={planError ?? workoutError}
          onRetry={() => Promise.all([planError && retryPlans(), workoutError && retryWorkouts()])}
        />
      )}
      <Suspense fallback={<PageLoading />}>
      <Routes>
      <Route path={routes.landing} element={<Navigate to={home} replace />} />
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
      <Route path={routes.sharedPlan(':code')} element={<ImportSharedPlanPage onImport={handleCreatePlan} />} />
      <Route path={routes.planView(':planId')} element={<PlanViewPage plans={plans} />} />
      <Route
        path={routes.today}
        element={forAccounts(
          <TodayPage plans={plans} workouts={workouts} onAddWorkout={addWorkout} onDeleteWorkout={deleteWorkout} />
        )}
      />
      <Route path={routes.settings} element={<SettingsPage />} />
      <Route path={routes.account} element={<AccountPage />} />
      <Route path={routes.privacy} element={<PrivacyPage />} />
      <Route path={routes.help} element={<HelpPage />} />
      <Route
        path={routes.calendar}
        element={forAccounts(
          <CalendarPage
            plans={plans}
            workouts={workouts}
            onAddWorkout={addWorkout}
            onUpdateWorkout={updateWorkout}
            onDeleteWorkout={deleteWorkout}
          />
        )}
      />
      <Route path={routes.analysis} element={forAccounts(<AnalysisPage plans={plans} workouts={workouts} />)} />
      <Route
        path="/analysis/exercise/:exerciseKey"
        element={forAccounts(<ExerciseAnalysisPage plans={plans} workouts={workouts} />)}
      />
      <Route
        path={routes.diary}
        element={forAccounts(
          <DiaryPage
            plans={plans}
            workouts={workouts}
            onAddWorkout={addWorkout}
            onDeleteWorkout={deleteWorkout}
          />
        )}
      />
      <Route
        path={routes.workout(':workoutId')}
        element={forAccounts(<WorkoutPage workouts={workouts} onUpdateWorkout={updateWorkout} />)}
      />
      <Route
        path={routes.workoutSummary(':workoutId')}
        element={forAccounts(
          <WorkoutSummaryPage workouts={workouts} onAddWorkout={addWorkout} onDeleteWorkout={deleteWorkout} />
        )}
      />
      {Object.entries(legacyRedirects).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
      </Suspense>
    </UndoProvider>
  );
}
