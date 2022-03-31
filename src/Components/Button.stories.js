import Button from './Button';

export default {
  title: 'components/Button',
  component: Button,
  argTypes: {},
};

const Template = args => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Click me',
};
