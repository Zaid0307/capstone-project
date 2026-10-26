import PlanDetailsForm from './PlanDetailsForm';

export default {
  title: 'planForm/PlanDetailsForm',
  component: PlanDetailsForm,
};

const Template = args => <PlanDetailsForm {...args} />;

export const Create = Template.bind({});
Create.args = {};

export const Edit = Template.bind({});
Edit.args = {
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
};
