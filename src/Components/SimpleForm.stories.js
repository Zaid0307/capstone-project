import SimpleForm from './SimpleForm.js';

export default {
  title: 'components/SimpleForm',
  component: SimpleForm,
  argTypes: {
    onSubmit: 'onSubmit',
  },
};

const Template = args => <SimpleForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
