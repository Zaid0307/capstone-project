import CreateForm from './CreateForm';

export default {
  title: 'components/CreateForm',
  component: CreateForm,
  argTypes: {
    onSubmit: 'handleSubmit',
  },
};

const Template = args => <CreateForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
