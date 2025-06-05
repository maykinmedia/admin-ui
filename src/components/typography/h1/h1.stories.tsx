import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { H1 } from "./h1";

const meta: Meta<typeof H1> = {
  title: "Typography/H1",
  component: H1,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const H1Component: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
