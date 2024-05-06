import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "Form/Label",
  component: Label,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
