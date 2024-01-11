import type { Meta, StoryObj } from "@storybook/react";

import { UL } from "./ul";

const meta = {
  title: "Typography/UL",
  component: UL,
} satisfies Meta<typeof UL>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ULComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "s",
  },
};
