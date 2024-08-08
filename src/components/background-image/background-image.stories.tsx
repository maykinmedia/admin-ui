import type { Meta, StoryObj } from "@storybook/react";

import { BackgroundImage } from "./background-image";

const meta = {
  title: "Uncategorized/Background-image",
  component: BackgroundImage,
} satisfies Meta<typeof BackgroundImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BackgroundImageComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
