import type { Meta, StoryObj } from "@storybook/react";

import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { CheckboxGroup } from "./checkboxgroup";

const meta = {
  title: "Form/CheckboxGroup",
  component: CheckboxGroup,
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const CheckboxGroupComponent: Story = {
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
