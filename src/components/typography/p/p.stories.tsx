import type { Meta, StoryObj } from "@storybook/react";

import { P } from "./p";

const meta: Meta<typeof P> = {
  title: "Typography/P",
  component: P,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "s",
  },
};
