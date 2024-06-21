import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import * as React from "react";

import { Button } from "../button";
import { Outline } from "../icon";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Controls/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.hover(button);
  },
};

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

export const TooltipStack: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <div style={{ width: "auto" }}>
        <Tooltip {...TooltipComponent.args}>
          <Button variant="transparent">
            <Outline.InformationCircleIcon>
              Hover me
            </Outline.InformationCircleIcon>
          </Button>
        </Tooltip>
      </div>
      <div style={{ width: "auto" }}>
        <Tooltip {...TooltipComponent.args} placement="top">
          <Button variant="transparent">
            <Outline.InformationCircleIcon>
              Hover me (Top)
            </Outline.InformationCircleIcon>
          </Button>
        </Tooltip>
      </div>
      <div style={{ width: "auto" }}>
        <Tooltip {...TooltipComponent.args} placement="right">
          <Button variant="transparent">
            <Outline.InformationCircleIcon>
              Hover me (Right)
            </Outline.InformationCircleIcon>
          </Button>
        </Tooltip>
      </div>
      <div style={{ width: "auto" }}>
        <Tooltip {...TooltipComponent.args} placement="bottom">
          <Button variant="transparent">
            <Outline.InformationCircleIcon>
              Hover me (Bottom)
            </Outline.InformationCircleIcon>
          </Button>
        </Tooltip>
      </div>
      <div style={{ width: "auto" }}>
        <Tooltip {...TooltipComponent.args} placement="left">
          <Button variant="transparent">
            <Outline.InformationCircleIcon>
              Hover me (Left)
            </Outline.InformationCircleIcon>
          </Button>
        </Tooltip>
      </div>
      <div style={{ width: "auto" }}>
        <Tooltip
          {...TooltipComponent.args}
          content={
            <div>
              <p>
                This tooltip works by hovering over any react element, and it
                can be placed in any direction.
              </p>
              <p>
                This tooltip works by hovering over any react element, and it
                can be placed in any direction.
              </p>
              <p>
                This tooltip works by hovering over any react element, and it
                can be placed in any direction.
              </p>
            </div>
          }
        >
          <Button variant="transparent">
            <Outline.InformationCircleIcon>
              Hover me (Big Text)
            </Outline.InformationCircleIcon>
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
};
