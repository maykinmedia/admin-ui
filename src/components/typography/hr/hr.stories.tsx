import type { Meta, StoryObj } from "@storybook/react-vite";

import { Hr } from "./hr";

const meta: Meta<typeof Hr> = {
  title: "Typography/Hr",
  component: Hr,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HrComponent: Story = {};
