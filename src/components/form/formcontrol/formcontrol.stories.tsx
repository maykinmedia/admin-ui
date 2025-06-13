import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormControl } from "./formcontrol";

const meta: Meta<typeof FormControl> = {
  title: "Form/Formcontrol",
  component: FormControl,
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const InputFormControl: Story = {
  args: {
    error: 'Field "e-mail" does not contain a valid e-mail address',
    forceShowError: true, // Make sure the Story shows error.
    label: "Enter your e-mail address",
    name: "e-mail",
    value: "johndoe@example.com",
  },
};

export const SelectFormControl: Story = {
  args: {
    error: 'Field "school year" is required',
    forceShowError: true, // Make sure the Story shows error.
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

export const Required: Story = {
  args: {
    error: "Dit veld is verplicht",
    forceShowError: true, // Make sure the Story shows error.
    label: "Enter your e-mail address",
    name: "e-mail",
    required: true,
  },
};
