import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Typography/Badge",
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeComponent: Story = {
  args: {},
  render: (args) => (
    <>
      <Badge level="info" {...args}>
        Information level badge
      </Badge>
      <br />
      <br />
      <Badge level="success" {...args}>
        Success level badge
      </Badge>
      <br />
      <br />
      <Badge level="warning" {...args}>
        Warning level badge
      </Badge>
      <br />
      <br />
      <Badge level="danger" {...args}>
        Danger level badge
      </Badge>
    </>
  ),
};
