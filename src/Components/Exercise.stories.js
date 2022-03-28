import Exercise from "./Exercise.js";

export default {
  title: "components/Exercise",
  component: Exercise,
};

const Template = (args) => <Exercise {...args} />;

export const Default = Template.bind({});
Default.args = {};
