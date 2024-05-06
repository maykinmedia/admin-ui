import type { Meta, StoryObj } from "@storybook/react";

import { A } from "./a";

const meta: Meta<typeof A> = {
  title: "Typography/A",
  component: A,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AComponent: Story = {
  args: {
    children: "Click me!",
    href: "https://www.example.com",
    target: "_blank",
  },
};
