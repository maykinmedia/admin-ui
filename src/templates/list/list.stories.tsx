import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { FIXTURE_PRODUCTS } from "../../../.storybook/fixtures/products";
import { Badge, Outline } from "../../components";
import { ListTemplate as ListTemplateComponent } from "./list";

const meta: Meta<typeof ListTemplateComponent> = {
  title: "Templates/List",
  component: ListTemplateComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ListTemplate: Story = {
  args: {
    dataGridProps: {
      objectList: FIXTURE_PRODUCTS,
    },
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "List template", href: "#" },
    ],
    primaryNavigationItems: [
      {
        componentType: "button",
        children: <Outline.HomeIcon />,
        title: "Home",
      },
      "spacer",
      {
        componentType: "button",
        children: <Outline.CogIcon />,
        title: "Instellingen",
      },
      {
        componentType: "button",
        children: <Outline.ArrowRightOnRectangleIcon />,
        title: "Uitloggen",
      },
    ],
  },
};

export const WithSidebar: Story = {
  ...ListTemplate,
  args: {
    ...ListTemplate.args,
    sidebarItems: [
      {
        componentType: "button",
        active: true,
        align: "space-between",
        children: (
          <>
            Lorem ipsum<Badge variant="success">Verwerkt</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        componentType: "button",
        align: "space-between",
        children: (
          <>
            Dolor<Badge variant="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        componentType: "button",
        align: "space-between",
        children: (
          <>
            Sit<Badge variant="danger">Actie vereist</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        componentType: "button",
        align: "space-between",
        children: (
          <>
            Amet<Badge variant="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
    ],
  },
};

export const WithSecondaryNavigation: Story = {
  ...WithSidebar,
  args: {
    ...WithSidebar.args,
    secondaryNavigationItems: [
      <Badge key="badge">In bewerking</Badge>,
      "spacer",
      {
        componentType: "button",
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
        componentType: "button",
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
  },
};
