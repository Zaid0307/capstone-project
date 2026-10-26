import Navigation from './Navigation';

export default {
  title: 'navigation/Navigation',
  component: Navigation,
};

const Template = args => <Navigation {...args} />;

export const Default = Template.bind({});
Default.args = {};
