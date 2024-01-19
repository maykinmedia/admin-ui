import type { Meta, StoryObj } from "@storybook/react";

import { Li } from "./li";

const meta = {
  title: "Typography/Li",
  component: Li,
} satisfies Meta<typeof Li>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LiComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "s",
  },
};
