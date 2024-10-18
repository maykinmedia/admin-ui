import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Badge, Outline } from "../../components";
import {
  CustomPreview as CustomPreviewComponentStory,
  Draggable as DraggableComponentStory,
  KanbanComponent as KanbanComponentStory,
  WithToolbar as WithToolbarComponentStory,
} from "../../components/data/kanban/kanban.stories";
import { KanbanTemplate } from "./kanban";

const meta: Meta<typeof KanbanTemplate> = {
  title: "Templates/Kanban",
  component: KanbanTemplate,
  // @ts-expect-error - Fix missing onClick on type
  argTypes: { onClick: { action: "onClick" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const kanbanTemplate: Story = {
  args: {
    kanbanProps: KanbanComponentStory.args,
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

export const CustomPreview: Story = {
  ...kanbanTemplate,
  args: {
    ...kanbanTemplate.args,
    kanbanProps: CustomPreviewComponentStory.args,
  },
};

export const Draggable: Story = {
  ...kanbanTemplate,
  args: {
    ...kanbanTemplate.args,
    kanbanProps: DraggableComponentStory.args,
  },
};

export const WithToolbar: Story = {
  ...kanbanTemplate,
  args: {
    ...kanbanTemplate.args,
    kanbanProps: WithToolbarComponentStory.args,
  },
};
