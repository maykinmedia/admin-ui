import type { Meta, StoryObj } from "@storybook/react";

import { FormControl } from "./formcontrol";

const meta: Meta<typeof FormControl> = {
  title: "Form/Formcontrol",
  component: FormControl,
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const InputFormControl: Story = {
  args: {
    error: 'Field "school year" does not contain a valid e-mail address',
    label: "Enter your e-mail address",
    name: "e-mail",
    value: "johndoen#example.com",
  },
};

export const SelectFormControl: Story = {
  args: {
    error: 'Field "school year" is required',
    options: [
      { label: "Freshman" },
      { label: "Sophomore" },
      { label: "Junior" },
      { label: "Senior" },
      { label: "Graduate" },
    ],
    name: "school_year",
    label: "Select school year",
    value: "Junior",
  },
};
