import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { Badge, Outline } from "../../components";
import { AttributeData } from "../../lib";
import { KanbanTemplate } from "./kanban";

const meta: Meta<typeof KanbanTemplate> = {
  title: "Templates/Kanban",
  component: KanbanTemplate,
  argTypes: { onClick: { action: "onClick" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const kanbanTemplate: Story = {
  args: {
    kanbanProps: {
      title: "The quick brown fox jumps over the lazy dog.",
      fieldsets: [
        ["Todo", { fields: ["title"], title: "title" }],
        ["In Progress", { fields: ["title"], title: "title" }],
        ["In Review", { fields: ["title"], title: "title" }],
        ["Done", { fields: ["title"], title: "title" }],
      ],
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
    const abortController = new AbortController();
    const [objectList, setObjectList] = useState<AttributeData[]>([]);
    // Process sorting and pagination locally in place for demonstration purposes.

    useEffect(() => {
      fetch(`https://jsonplaceholder.typicode.com/photos?_limit=10`, {
        signal: abortController.signal,
      })
        .then((response) => response.json())
        .then((data: AttributeData[]) => {
          setObjectList(
            data.map((d) => ({
              ...d,
              alphaIndex: String(d.title[0]).toUpperCase(),
            })),
          );
        });
    }, [args]);

    const even = objectList.filter((o, index) => index % 2 === 0);
    const odd = objectList.filter((o, index) => index % 2 !== 0);

    return "groupBy" in args ? (
      <KanbanTemplate
        {...args}
        kanbanProps={{
          ...args.kanbanProps,
          onObjectChange: () => console.log("foo"),
          objectList: objectList,
        }}
      />
    ) : (
      <KanbanTemplate
        {...args}
        kanbanProps={{
          ...args.kanbanProps,
          onObjectChange: () => console.log("foo"),
          objectLists: [even, odd, [], []],
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
