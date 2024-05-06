import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Toolbar } from "../toolbar";
import { Button, ButtonLink } from "./button";

const meta: Meta<typeof Button> = {
  title: "Controls/Button",
  component: Button,
  render: ({ ...args }) => (
    <Toolbar>
      <Button {...args} variant="primary">
        Primary Button
      </Button>
      <Button {...args} variant="transparent">
        Tranparent Button
      </Button>
      <Button {...args} variant="outline">
        Outline Button
      </Button>
    </Toolbar>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  args: {},
};

export const ActiveButtons: Story = {
  args: {
    active: true,
  },
};

export const BoldButtons: Story = {
  args: {
    bold: true,
  },
};

export const JustifiedButtons: Story = {
  args: {
    justify: true,
  },
};

export const MutedButtons: Story = {
  args: {
    muted: true,
  },
};

export const PadlessButtons: Story = {
  args: {
    pad: false,
  },
};

export const HorizontallyPaddedButtons: Story = {
  args: {
    pad: "h",
  },
};

export const VerticallyPaddedButtons: Story = {
  args: {
    pad: "v",
  },
};

export const SmallerButtonText: Story = {
  args: {
    size: "xs",
  },
};

export const SquareButtons: Story = {
  args: {
    square: true,
  },
  render: ({ ...args }) => (
    <Toolbar>
      <Button {...args} variant="primary">
        1
      </Button>
      <Button {...args} variant="transparent">
        2
      </Button>
      <Button {...args} variant="outline">
        3
      </Button>
    </Toolbar>
  ),
};

export const ButtonLinkComponent: StoryObj<typeof ButtonLink> = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    href: "https://www.example.com",
    target: "_blank",
  },
  render: ({ ...args }) => (
    <Toolbar>
      <ButtonLink {...args} variant="primary">
        Primary ButtonLink
      </ButtonLink>
      <ButtonLink {...args} variant="transparent">
        Tranparent ButtonLink
      </ButtonLink>
      <ButtonLink {...args} variant="outline">
        Outline ButtonLink
      </ButtonLink>
    </Toolbar>
  ),
};
