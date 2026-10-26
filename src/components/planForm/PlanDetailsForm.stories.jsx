import { fn } from 'storybook/test';
import PlanDetailsForm from './PlanDetailsForm';

export default {
  title: 'planForm/PlanDetailsForm',
  component: PlanDetailsForm,
  args: { onSubmit: fn() },
};

export const Create = {};

export const Edit = {
  args: {
    isEditing: true,
    initialDetails: {
      id: 'plan',
      nameOfWorkout: 'Push',
      description: 'Chest, shoulders and triceps',
      days: [
        { id: 'monday', day: 'monday' },
        { id: 'thursday', day: 'thursday' },
      ],
    },
  },
};
