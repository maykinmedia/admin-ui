import type { Meta, StoryObj } from "@storybook/react";

import { OL } from "./ol";

const meta = {
  title: "Typography/OL",
  component: OL,
} satisfies Meta<typeof OL>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OLComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "s",
  },
};
