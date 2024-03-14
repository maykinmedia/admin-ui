import type { Meta, StoryObj } from "@storybook/react";

import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Form/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const CheckboxComponent: Story = {
  args: {
    children: "Click me!",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};
