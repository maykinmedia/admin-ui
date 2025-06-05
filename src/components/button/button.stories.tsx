import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { Toolbar } from "../toolbar";
import { Button, ButtonLink } from "./button";

const meta: Meta<typeof Button> = {
  title: "Controls/Button",
  component: Button,
  render: ({ ...args }) => (
    <>
      <Toolbar>
        <Button {...args} variant="primary">
          Primary Button
        </Button>
        <Button {...args} variant="secondary">
          Secondary Button
        </Button>
        <Button {...args} variant="outline">
          Outline Button
        </Button>
        <Button {...args} variant="transparent">
          Tranparent Button
        </Button>
      </Toolbar>

      <Toolbar>
        <Button {...args} variant="success">
          Success Button
        </Button>
        <Button {...args} variant="info">
          Info Button
        </Button>
        <Button {...args} variant="warning">
          Warning Button
        </Button>
        <Button {...args} variant="danger">
          Danger Button
        </Button>
      </Toolbar>
    </>
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

export const DisabledButtons: Story = {
  args: {
    disabled: true,
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
    <>
      <Toolbar>
        <Button {...args} variant="primary">
          1
        </Button>
        <Button {...args} variant="secondary">
          2
        </Button>
        <Button {...args} variant="outline">
          4
        </Button>
        <Button {...args} variant="transparent">
          3
        </Button>
      </Toolbar>
      <Toolbar>
        <Button {...args} variant="success">
          1
        </Button>
        <Button {...args} variant="info">
          2
        </Button>
        <Button {...args} variant="warning">
          4
        </Button>
        <Button {...args} variant="danger">
          3
        </Button>
      </Toolbar>
    </>
  ),
};

export const ButtonLinkComponent: StoryObj<typeof ButtonLink> = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    href: "https://www.example.com",
    target: "_blank",
  },
  render: ({ ...args }) => (
    <>
      <Toolbar>
        <ButtonLink {...args} variant="primary">
          Primary ButtonLink
        </ButtonLink>
        <ButtonLink {...args} variant="secondary">
          Secondary ButtonLink
        </ButtonLink>
        <ButtonLink {...args} variant="outline">
          Outline ButtonLink
        </ButtonLink>
        <ButtonLink {...args} variant="transparent">
          Tranparent ButtonLink
        </ButtonLink>
      </Toolbar>
      <Toolbar>
        <ButtonLink {...args} variant="success">
          Success ButtonLink
        </ButtonLink>
        <ButtonLink {...args} variant="info">
          Info ButtonLink
        </ButtonLink>
        <ButtonLink {...args} variant="warning">
          Warning ButtonLink
        </ButtonLink>
        <ButtonLink {...args} variant="danger">
          Danger ButtonLink
        </ButtonLink>
      </Toolbar>
    </>
  ),
};
