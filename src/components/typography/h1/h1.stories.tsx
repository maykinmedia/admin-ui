import type { Meta, StoryObj } from "@storybook/react";

import { H1 } from "./h1";

const meta = {
  title: "Typography/H1",
  component: H1,
} satisfies Meta<typeof H1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1Component: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
