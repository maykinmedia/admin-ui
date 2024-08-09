import type { Meta, StoryObj } from "@storybook/react";

import { Iconinitials } from "./iconinitials";

const meta = {
  title: "Icon/Icon Initials",
  component: Iconinitials,
} satisfies Meta<typeof Iconinitials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconInitialsComponent: Story = {
  args: {
    initials: "AB",
  },
};

export const IconInitialsComponentCustomSize: Story = {
  args: {
    initials: "AB",
    size: "3em",
  },
};
