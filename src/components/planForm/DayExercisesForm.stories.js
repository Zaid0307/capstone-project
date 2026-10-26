import DayExercisesForm from './DayExercisesForm';

export default {
  title: 'planForm/DayExercisesForm',
  component: DayExercisesForm,
};

const Template = args => <DayExercisesForm {...args} />;

export const Empty = Template.bind({});
Empty.args = { day: 'monday', exercises: [] };

export const WithExercises = Template.bind({});
WithExercises.args = {
  day: 'monday',
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
};
