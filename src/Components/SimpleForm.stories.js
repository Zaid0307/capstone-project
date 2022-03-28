import SimpleForm from "./SimpleForm.js";

export default {
  title: "components/SimpleForm",
  component: SimpleForm,
};

const Template = (args) => <SimpleForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
