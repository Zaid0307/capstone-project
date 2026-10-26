import { fn } from 'storybook/test';
import DayExercisesForm from './DayExercisesForm';

export default {
  title: 'planForm/DayExercisesForm',
  component: DayExercisesForm,
  args: {
    day: 'monday',
    onAddExercise: fn(),
    onUpdateExercise: fn(),
    onRemoveExercise: fn(),
  },
};

export const Empty = {
  args: { exercises: [] },
};

export const WithExercises = {
  args: {
    exercises: [
      {
        id: 'e1',
        muscle: 'chest',
        exercise: 'Bench Press',
        weight: '60',
        repetitions: '8',
        sets: '4',
      },
    ],
  },
};
