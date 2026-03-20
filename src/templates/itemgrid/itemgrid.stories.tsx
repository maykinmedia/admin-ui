import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Badge, Outline } from "../../components";
import { ItemGridTemplate as ItemGridTemplateComponent } from "./itemgrid";

const meta: Meta<typeof ItemGridTemplateComponent> = {
  title: "Templates/ItemGrid",
  component: ItemGridTemplateComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

const ITEM_GRID_ITEMS = [
  {
    icon: <Outline.DocumentIcon />,
    title: "projectplan_2026_v3.pdf",
    informationLines: ["PDF", "842 KB", "10-02-2026"],
  },
  {
    icon: <Outline.PhotoIcon />,
    title: "teamfoto_bedrijfsuitje.jpg",
    informationLines: ["JPG", "2.4 MB", "08-02-2026"],
    buttonProps: { as: "a" as const, href: "#" },
  },
  {
    icon: <Outline.VideoCameraIcon />,
    title: "product_demo_launch_event.mp4",
    informationLines: ["MP4", "84.1 MB", "01-02-2026"],
  },
  {
    icon: <Outline.TableCellsIcon />,
    title: "financieel_overzicht_q1.xlsx",
    informationLines: ["XLSX", "356 KB", "15-01-2026"],
  },
  {
    icon: <Outline.PresentationChartBarIcon />,
    title: "kwartaalpresentatie_sales.pptx",
    informationLines: ["PPTX", "4.8 MB", "12-01-2026"],
  },
];

export const ItemGridTemplate: Story = {
  args: {
    title: "Bestanden",
    itemGridProps: {
      items: ITEM_GRID_ITEMS,
    },
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "ItemGrid template", href: "#" },
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

export const WithPaginator: Story = {
  ...ItemGridTemplate,
  args: {
    ...ItemGridTemplate.args,
    paginatorProps: {
      count: 100,
      page: 1,
      pageSize: 5,
    },
  },
};

export const WithSidebar: Story = {
  ...ItemGridTemplate,
  args: {
    ...ItemGridTemplate.args,
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
