import type { Meta, StoryObj } from "@storybook/react";

import { Test } from "./test";

const meta = {
  title: "Components/Test",
  component: Test,
} satisfies Meta<typeof Test>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TestComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
