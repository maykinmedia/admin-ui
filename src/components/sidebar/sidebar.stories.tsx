import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Badge } from "../badge";
import { Toolbar } from "../toolbar";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Building Blocks/Sidebar",
  component: Sidebar,
  decorators: [PAGE_DECORATOR],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SidebarComponent: Story = {
  args: {
    expanded: true,
    children: (
      <Toolbar
        align="space-between"
        direction="vertical"
        directionResponsive={false}
        pad={true}
        variant="transparent"
        items={[
          {
            children: (
              <>
                Lorem ipsum<Badge level="success">Verwerkt</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
            active: true,
          },
          {
            children: (
              <>
                Dolor<Badge level="warning">In behandeling</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            children: (
              <>
                Sit<Badge level="danger">Actie vereist</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            children: (
              <>
                Amet<Badge level="warning">In behandeling</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
        ]}
      ></Toolbar>
    ),
  },
};
