import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";

import { IconInitials } from "./iconinitials";

const meta = {
  title: "Icon/Icon Initials",
  component: IconInitials,
} satisfies Meta<typeof IconInitials>;

export default meta;
type Story = StoryObj<typeof meta>;

const expectInitialsToBe = (canvasElement: HTMLElement, initials: string) => {
  const p = canvasElement.querySelector("span");
  expect(p).not.toBeNull();
  expect(p?.textContent).toBe(initials);
};

export const IconInitialsComponent: Story = {
  args: {
    name: "John Doe",
  },
  play: async ({ canvasElement }) => {
    expectInitialsToBe(canvasElement, "JD");
  },
};

export const IconInitialsComponentCustomSize: Story = {
  args: {
    name: "John Michael Smith",
    size: "lg",
  },
  play: async ({ canvasElement }) => {
    expectInitialsToBe(canvasElement, "JS");
  },
};

export const IconInitialsComponentOneLetter: Story = {
  args: {
    name: "John",
  },
  play: async ({ canvasElement }) => {
    expectInitialsToBe(canvasElement, "J");
  },
};
