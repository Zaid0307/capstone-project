import DayForm from './DayForm';

export default {
  title: 'components/DayForm',
  component: DayForm,
  argTypes: {},
};

const Template = args => <DayForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
