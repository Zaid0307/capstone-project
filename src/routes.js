export const routes = {
  landing: '/',
  exercises: '/exercises',
  muscleGroup: muscle => `/exercises/${muscle}`,
  plans: '/plans',
  newPlan: '/plans/new',
  editPlan: planId => `/plans/${planId}/edit`,
};

// Paths used by older versions of the app.
export const legacyRedirects = {
  '/home': routes.exercises,
  '/Workoutplans': routes.plans,
  '/Create_Plan': routes.newPlan,
};
