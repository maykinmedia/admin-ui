import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Badge, Outline, P } from "../../components";
import { BodyBase } from "../../templates";
import { NavigationContext } from "./navigation";

const meta = {
  title: "Contexts/NavigationContext",
  // @ts-expect-error - not a component but a context
  component: NavigationContext,
} satisfies Meta<typeof NavigationContext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Navigation: Story = {
  render: () => (
    <NavigationContext.Provider
      value={{
        primaryNavigationItems: [
          { children: <Outline.HomeIcon />, title: "Home" },
          { children: <Outline.CogIcon />, title: "Instellingen" },
          {
            children: <Outline.ArrowRightOnRectangleIcon />,
            title: "Uitloggen",
          },
        ],
        breadcrumbItems: [
          { label: "Home", href: "/" },
          { label: "Contexts", href: "#" },
          { label: "Navigation context", href: "#" },
        ],
        sidebarItems: [
          {
            active: true,
            align: "space-between",
            children: (
              <>
                Lorem ipsum<Badge level="success">Verwerkt</Badge>
              </>
            ),
            justify: true,
            variant: "transparent",
          },
          {
            align: "space-between",
            children: (
              <>
                Dolor<Badge level="warning">In behandeling</Badge>
              </>
            ),
            justify: true,
            variant: "transparent",
          },
          {
            align: "space-between",
            children: (
              <>
                Sit<Badge level="danger">Actie vereist</Badge>
              </>
            ),
            justify: true,
            variant: "transparent",
          },
          {
            align: "space-between",
            children: (
              <>
                Amet<Badge level="warning">In behandeling</Badge>
              </>
            ),
            justify: true,
            variant: "transparent",
          },
        ],
      }}
    >
      <BodyBase>
        <P>The quick brown fox jumps over the lazy dog.</P>
      </BodyBase>
    </NavigationContext.Provider>
  ),
};
