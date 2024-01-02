import type { Meta, StoryObj } from "@storybook/react";

import { Test } from "./test";

const meta = {
  title: "Test/Test",
  component: Test,
} satisfies Meta<typeof Test>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FooComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
