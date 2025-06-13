import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Badge, Outline, P } from "../../components";
import { BodyBaseTemplate } from "../../templates";
import { NavigationContext } from "./navigation";

const meta: Meta<typeof NavigationContext> = {
  title: "Contexts/NavigationContext",
  // @ts-expect-error - not a component but a context
  component: NavigationContext,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Navigation: Story = {
  render: () => (
    <NavigationContext.Provider
      value={{
        breadcrumbItems: [
          { label: "Home", href: "/" },
          { label: "Contexts", href: "#" },
          { label: "Navigation context", href: "#" },
        ],
        primaryNavigationItems: [
          { children: <Outline.HomeIcon />, title: "Home" },
          "spacer",
          { children: <Outline.CogIcon />, title: "Instellingen" },
          {
            children: <Outline.ArrowRightOnRectangleIcon />,
            title: "Uitloggen",
          },
        ],
        secondaryNavigationItems: [
          <Badge key="badge">In bewerking</Badge>,
          "spacer",
          {
            children: (
              <>
                <Outline.CloudArrowUpIcon />
                Tussentijds Opslaan
              </>
            ),
            pad: "h",
            variant: "transparent",
            wrap: false,
          },
          {
            children: (
              <>
                <Outline.CheckIcon />
                Opslaan en afsluiten
              </>
            ),
            pad: "h",
            variant: "primary",
            wrap: false,
          },
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
      <BodyBaseTemplate>
        <P>The quick brown fox jumps over the lazy dog.</P>
      </BodyBaseTemplate>
    </NavigationContext.Provider>
  ),
};
