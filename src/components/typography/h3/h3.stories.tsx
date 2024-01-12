import type { Meta, StoryObj } from "@storybook/react";

import { H3 } from "./h3";

const meta = {
  title: "Typography/H3",
  component: H3,
} satisfies Meta<typeof H3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H3Component: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
