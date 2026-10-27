import { fn } from 'storybook/test';
import DayExercisesForm from './DayExercisesForm';

export default {
  title: 'planForm/DayExercisesForm',
  component: DayExercisesForm,
  args: {
    day: 'monday',
    onAddEntry: fn(),
    onUpdateEntry: fn(),
    onRemoveEntry: fn(),
  },
};

export const Empty = {
  args: { entries: [] },
};

export const WithExercises = {
  args: {
    entries: [
      {
        id: 'e1',
        exerciseId: 'barbell_bench_press',
        exercise: 'Barbell bench press',
        muscle: 'chest',
        sets: 4,
        dose: { unit: 'repetitions', min: 6, max: 8 },
        weight: 60,
        restSeconds: 120,
      },
      {
        id: 'e2',
        exerciseId: 'plank',
        exercise: 'Plank',
        muscle: 'abs',
        sets: 3,
        dose: { unit: 'seconds', value: 45 },
        weight: null,
        restSeconds: 60,
      },
    ],
  },
};
