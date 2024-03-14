import type { Meta, StoryObj } from "@storybook/react";

import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { ChoiceField } from "./choicefield";

const meta = {
  title: "Form/Choicefield",
  component: ChoiceField,
} satisfies Meta<typeof ChoiceField>;

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const Select: Story = {
  args: {
    label: "Select school year",
    name: "school_year",
    options: [
      { label: "Freshman" },
      { label: "Sophomore" },
      { label: "Junior", selected: true },
      { label: "Senior" },
      { label: "Graduate" },
    ],
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const CheckboxGroup = {
  ...Select,
  args: { ...Select.args, type: "checkbox" },
};
