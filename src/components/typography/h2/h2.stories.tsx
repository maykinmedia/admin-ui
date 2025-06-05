import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { H2 } from "./h2";

const meta: Meta<typeof H2> = {
  title: "Typography/H2",
  component: H2,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const H2Component: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
