import type { Meta, StoryObj } from "@storybook/react";

import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { DateInput } from "./dateinput";

const meta = {
  title: "Form/DateInput",
  component: DateInput,
  argTypes: {
    onChange: {
      action: "onChange",
    },
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateInputComponent: Story = {
  args: {
    name: "date",
    format: "DDMMYYYY",
    size: "xs",
  },
  decorators: [FORM_TEST_DECORATOR],
};
