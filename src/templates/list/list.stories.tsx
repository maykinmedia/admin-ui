import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { Badge, DataGridProps, Outline } from "../../components";
import { FilterablePaginatedSelectableSortable } from "../../components/data/datagrid/datagrid.stories";
import { ListTemplate } from "./list";

const meta: Meta<typeof ListTemplate> = {
  title: "Templates/List",
  component: ListTemplate,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const listTemplate: Story = {
  args: {
    dataGridProps: FilterablePaginatedSelectableSortable.args as DataGridProps,
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "List template", href: "#" },
    ],
    primaryNavigationItems: [
      { children: <Outline.HomeIcon />, title: "Home" },
      "spacer",
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ],
  },
};

export const WithSidebar: Story = {
  ...listTemplate,
  args: {
    ...listTemplate.args,
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
  },
};
