import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Page } from "../../page";
import { Column } from "../column";
import { Breakout } from "./breakout";

const meta = {
  title: "Layout/Breakout",
  component: Breakout,
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <Page debug={args.debug} data-testid="Page">
      <Column span={12}>The quick brown fox jumps over the lazy dog.</Column>
      <Breakout debug={args.debug}>
        The quick brown fox jumps over the lazy dog.
      </Breakout>
    </Page>
  ),
} satisfies Meta<typeof Breakout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BreakoutComponent: Story = {
  args: {
    debug: true,
  },
};
