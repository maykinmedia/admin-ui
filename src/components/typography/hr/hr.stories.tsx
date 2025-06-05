import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Hr } from "./hr";

const meta: Meta<typeof Hr> = {
  title: "Typography/Hr",
  component: Hr,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HrComponent: Story = {};
