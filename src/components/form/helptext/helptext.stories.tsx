import type { Meta, StoryObj } from "@storybook/react-vite";

import { HelpText } from "./helptext";

const meta: Meta<typeof HelpText> = {
  title: "Form/HelpText",
  component: HelpText,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HelpTextComponent: Story = {
  args: {
    children: "Example: johndoe@example.com",
  },
};
