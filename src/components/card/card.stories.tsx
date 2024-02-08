import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Page } from "../page";
import { Body, P } from "../typography";
import { Card } from "./card";

const meta = {
  title: "Building Blocks/Card",
  component: Card,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Card>;

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
