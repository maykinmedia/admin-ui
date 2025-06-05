import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Container } from "./container";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainerComponent: Story = {
  args: {
    "data-testid": "Container",
    debug: true,
  },
};
