import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ErrorMessage } from "./errormessage";

const meta: Meta<typeof ErrorMessage> = {
  title: "Form/ErrorMessage",
  component: ErrorMessage,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorMessageComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
