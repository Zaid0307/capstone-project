import SimpleForm from './SimpleForm.js';

export default {
  title: 'components/SimpleForm',
  component: SimpleForm,
  argTypes: {
    onSubmit: 'onSubmit',
    onCheck: 'onCheck',
    onChange: 'onChange',
  },
};

const Template = args => <SimpleForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'workOutName',
  placeholder: 'Name your Workout plan',
  id: 'nameOfWorkout',
};
