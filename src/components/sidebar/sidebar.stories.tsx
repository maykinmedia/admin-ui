import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Badge } from "../badge";
import { Outline } from "../icon";
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
            componentType: "button",
            children: (
              <>
                Lorem ipsum<Badge variant="success">Verwerkt</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
            active: true,
          },
          {
            componentType: "button",
            children: (
              <>
                Dolor<Badge variant="warning">In behandeling</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            componentType: "button",
            children: (
              <>
                Sit<Badge variant="danger">Actie vereist</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            componentType: "button",
            children: (
              <>
                Amet<Badge variant="warning">In behandeling</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            componentType: "accordion",
            children: (
              <>
                <Outline.AcademicCapIcon />
                Consectetur
              </>
            ),
            items: [
              {
                componentType: "button",
                children: "Adipiscing elit",
              },
              {
                componentType: "button",
                children: "Elit sed do",
              },
            ],
          },
        ]}
      ></Toolbar>
    ),
  },
};
