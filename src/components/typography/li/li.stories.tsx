import type { Meta, StoryObj } from "@storybook/react-vite";

import { Li } from "./li";

const meta: Meta<typeof Li> = {
  title: "Typography/Li",
  component: Li,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LiComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "s",
  },
};
