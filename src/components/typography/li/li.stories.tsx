import type { Meta, StoryObj } from "@storybook/react";

import { LI } from "./li";

const meta = {
  title: "Typography/LI",
  component: LI,
} satisfies Meta<typeof LI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LIComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "s",
  },
};
