import type { Meta, StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/test";
import React from "react";

import { Button, ButtonLink } from "./button";

const meta = {
  title: "Controls/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};

export const TransparentButton: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    variant: "transparent",
  },
};

export const ButtonAnimatesOnHoverAndClick: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
  play: async () => {
    await userEvent.tab({ delay: 10 });
  },
};

export const ButtonLinkComponent: StoryObj<typeof ButtonLink> = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    href: "https://www.example.com",
    target: "_blank",
  },
  render: (args) => <ButtonLink {...args} />,
};

export const TransparentButtonLink: StoryObj<typeof ButtonLink> = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    href: "https://www.example.com",
    target: "_blank",
    variant: "transparent",
  },
  render: (args) => <ButtonLink {...args} />,
};

export const ButtonLinkAnimatesOnHoverAndClick: StoryObj<typeof ButtonLink> = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    href: "https://www.example.com",
    target: "_blank",
  },
  play: async () => {
    await userEvent.tab({ delay: 10 });
  },
  render: (args) => <ButtonLink {...args} />,
};
