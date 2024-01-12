import type { Meta, StoryObj } from "@storybook/react";

import { A } from "./a";

const meta = {
  title: "Typography/A",
  component: A,
} satisfies Meta<typeof A>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AComponent: Story = {
  args: {
    children: "Click me!",
    href: "https://www.example.com",
    target: "_blank",
  },
};
