import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Badge } from "../badge";
import { Page } from "../layout";
import { Toolbar } from "../toolbar";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Building Blocks/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
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
