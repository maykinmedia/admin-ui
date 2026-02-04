import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Body, P } from "../typography";
import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "Building Blocks/Card",
  component: Card,
  decorators: [PAGE_DECORATOR],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CardComponent: Story = {
  args: {
    children: (
      <Body>
        <P>The quick brown fox jumps over the lazy dog.</P>
      </Body>
    ),
  },
};

export const CardWithTitle: Story = {
  args: {
    title: "Card title",
    children: (
      <Body>
        <P>The quick brown fox jumps over the lazy dog.</P>
      </Body>
    ),
  },
};

export const CardWithActions: Story = {
  args: {
    title: "Card title",
    actions: [
      {
        componentType: "button",
        children: "Click me",
        onClick: () => alert("Button clicked."),
      },
    ],
    children: (
      <Body>
        <P>The quick brown fox jumps over the lazy dog.</P>
      </Body>
    ),
  },
};

export const CardWithBorder: Story = {
  args: {
    border: true,
    title: "Card with border",
    children: (
      <Body>
        <P>The quick brown fox jumps over the lazy dog.</P>
      </Body>
    ),
  },
};
