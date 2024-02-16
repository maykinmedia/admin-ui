import type { Meta, StoryObj } from "@storybook/react";

import { ErrorMessage } from "./errormessage";

const meta = {
  title: "Form/ErrorMessage",
  component: ErrorMessage,
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorMessageComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
