import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";

const meta = {
  title: "Form/Label",
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
