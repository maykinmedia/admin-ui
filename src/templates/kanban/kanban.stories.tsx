import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Badge, Outline } from "../../components";
import {
  CustomPreview as CustomPreviewComponentStory,
  Draggable as DraggableComponentStory,
  KanbanComponent as KanbanComponentStory,
  WithToolbar as WithToolbarComponentStory,
} from "../../components/data/kanban/kanban.stories";
import { KanbanTemplate as KanbanTemplateComponent } from "./kanban";

const meta: Meta<typeof KanbanTemplateComponent> = {
  title: "Templates/Kanban",
  component: KanbanTemplateComponent,
  // @ts-expect-error - Fix missing onClick on type
  argTypes: { onClick: { action: "onClick" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const KanbanTemplate: Story = {
  args: {
    kanbanProps: KanbanComponentStory.args,
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "Kanban template", href: "#" },
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
  ...KanbanTemplate,
  args: {
    ...KanbanTemplate.args,
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

export const CustomPreview: Story = {
  ...KanbanTemplate,
  args: {
    ...KanbanTemplate.args,
    kanbanProps: CustomPreviewComponentStory.args,
  },
};

export const Draggable: Story = {
  ...KanbanTemplate,
  args: {
    ...KanbanTemplate.args,
    kanbanProps: DraggableComponentStory.args,
  },
};

export const WithToolbar: Story = {
  ...KanbanTemplate,
  args: {
    ...KanbanTemplate.args,
    kanbanProps: WithToolbarComponentStory.args,
  },
};
