import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Badge, Outline } from "../../components";
import { generateComponentList } from "../../components/data/kanban/kanban.stories";
import { KanbanTemplate } from "./kanban-template";

const meta: Meta<typeof KanbanTemplate> = {
  title: "Templates/Kanban",
  component: KanbanTemplate,
  argTypes: { onClick: { action: "onClick" } },
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
          onComponentListChange: action("onComponentListChange"),
          onComponentChange: action("onComponentChange"),
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
