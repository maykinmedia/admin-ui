import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Button } from "../button";
import { Outline } from "../icon";
import { Tooltip } from "./tooltip";

const meta = {
  title: "Controls/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TooltipComponent: Story = {
  args: {
    children: (
      <Button variant="transparent">
        <Outline.InformationCircleIcon>Hover me</Outline.InformationCircleIcon>
      </Button>
    ),
    content:
      "This tooltip works by hovering over any react element, and it can be placed in any direction.",
  },
};

export const TooltipTop: Story = {
  args: {
    ...TooltipComponent.args,
    placement: "top",
  },
  decorators: [
    (Story) => (
      <div style={{ paddingTop: "4rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const TooltipRight: Story = {
  args: {
    ...TooltipComponent.args,
    placement: "right",
  },
};

export const TooltipBottom: Story = {
  args: {
    ...TooltipComponent.args,
    placement: "bottom",
  },
};

export const TooltipLeft: Story = {
  args: {
    ...TooltipComponent.args,
    placement: "left",
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Story />
      </div>
    ),
  ],
};

export const TooltipBigText: Story = {
  args: {
    ...TooltipComponent.args,
    content: (
      <div>
        <p>
          This tooltip works by hovering over any react element, and it can be
          placed in any direction.
        </p>
        <p>
          This tooltip works by hovering over any react element, and it can be
          placed in any direction.
        </p>
        <p>
          This tooltip works by hovering over any react element, and it can be
          placed in any direction.
        </p>
      </div>
    ),
  },
};
