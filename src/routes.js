export const routes = {
  landing: '/',
  today: '/today',
  calendar: '/calendar',
  analysis: '/analysis',
  exerciseAnalysis: exerciseKey => `/analysis/exercise/${encodeURIComponent(exerciseKey)}`,
  settings: '/settings',
  account: '/account',
  privacy: '/privacy',
  exercises: '/exercises',
  muscleGroup: muscle => `/exercises/${muscle}`,
  plans: '/plans',
  newPlan: '/plans/new',
  editPlan: planId => `/plans/${planId}/edit`,
  diary: '/diary',
  diaryForPlan: planId => `/diary?plan=${encodeURIComponent(planId)}`,
  workout: workoutId => `/diary/${workoutId}`,
};

// Paths used by older versions of the app.
export const legacyRedirects = {
  '/home': routes.exercises,
  '/Workoutplans': routes.plans,
  '/Create_Plan': routes.newPlan,
};
