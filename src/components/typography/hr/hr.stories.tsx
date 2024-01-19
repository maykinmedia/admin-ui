import type { Meta, StoryObj } from "@storybook/react";

import { Hr } from "./hr";

const meta = {
  title: "Typography/Hr",
  component: Hr,
} satisfies Meta<typeof Hr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HrComponent: Story = {};
