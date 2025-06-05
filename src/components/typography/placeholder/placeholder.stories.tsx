import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Placeholder } from "./placeholder";

const meta: Meta<typeof Placeholder> = {
  title: "Typography/Placeholder",
  component: Placeholder,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PlaceholderComponent: Story = {};
