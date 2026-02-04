import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Controls/Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Accordions: Story = {
  args: {
    children: "Open accordion",
    items: [
      {
        componentType: "button",
        children: "Button text",
      },
      {
        componentType: "button",
        children: "Button text",
      },
    ],
  },
};
