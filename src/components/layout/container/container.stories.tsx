import type { Meta, StoryObj } from "@storybook/react";

import { Container } from "./container";

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainerComponent: Story = {
  args: {
    "data-testid": "Container",
    debug: true,
  },
};
