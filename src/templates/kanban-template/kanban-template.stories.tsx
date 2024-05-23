import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Badge, Outline } from "../../components";
import { KanbanTemplate } from "./kanban-template";

const meta: Meta<typeof KanbanTemplate> = {
  title: "Templates/Kanban",
  component: KanbanTemplate,
  argTypes: { onClick: { action: "onClick" } },
};

const generateComponentList = (count: number) => {
  const randomLorenIpsum = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in.",
  ];
  return Array.from({ length: count }, (_, i) => (
    <div key={i} style={{ display: "flex", flexDirection: "column" }}>
      <span>20 days</span>
      <span>{randomLorenIpsum[i % randomLorenIpsum.length]}</span>
      <span>Some more data</span>
    </div>
  ));
};

// Define the component list
const componentList = [
  { title: "Todo", items: generateComponentList(10) },
  { title: "In Progress", items: generateComponentList(10) },
  { title: "In Review", items: generateComponentList(10) },
  { title: "Done", items: generateComponentList(10) },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const kanbanTemplate: Story = {
  args: {
    kanbanProps: {
      title: "The quick brown fox jumps over the lazy dog.",
      componentList,
    },
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "Kanban template", href: "#" },
    ],
    primaryNavigationItems: [
      { children: <Outline.HomeIcon />, title: "Home" },
      "spacer",
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ],
  },
  render: (args) => {
    return (
      <KanbanTemplate
        {...args}
        kanbanProps={{
          ...args.kanbanProps,
          onComponentListChange: (componentList) => {
            console.log("Component list changed", componentList);
          },
        }}
      />
    );
  },
};

export const WithSidebar: Story = {
  ...kanbanTemplate,
  args: {
    ...kanbanTemplate.args,
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

export const WithCustomPreview: Story = {
  ...WithSecondaryNavigation,
  args: {
    ...WithSecondaryNavigation.args,
    kanbanProps: {
      ...WithSecondaryNavigation.args.kanbanProps,
      renderPreview: (attributeData) => (
        <img alt={attributeData.title} src={attributeData.thumbnailUrl} />
      ),
    },
  },
};

export const Draggable: Story = {
  ...WithSecondaryNavigation,
  args: {
    ...WithSecondaryNavigation.args,
    kanbanProps: {
      ...WithSecondaryNavigation.args.kanbanProps,
      draggable: true,
    },
  },
};
