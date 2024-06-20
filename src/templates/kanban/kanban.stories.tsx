import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { generateHexColor } from "../../../.storybook/utils";
import { Badge, KanbanProps, Outline } from "../../components";
import { AttributeData, FieldSet } from "../../lib";
import { KanbanTemplate, KanbanTemplateProps } from "./kanban";

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
    kanbanProps: {
      title: "The quick brown fox jumps over the lazy dog.",
      fieldsets: [
        ["Todo", { fields: ["title"], title: "title" }],
        ["In Progress", { fields: ["title"], title: "title" }],
        ["In Review", { fields: ["title"], title: "title" }],
        ["Done", { fields: ["title"], title: "title" }],
      ],
    } as KanbanProps,
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
  render: (args: KanbanTemplateProps) => {
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
            data.map((d) => {
              const url = `https://placehold.co/600x400/${generateHexColor(d.id as number)}/000`;
              return {
                ...d,
                alphaIndex: String(d.title?.toString()[0]).toUpperCase(),
                url: url,
                thumbnailUrl: url,
              };
            }),
          );
        });
    }, [args]);

    const even = objectList.filter((o, index) => index % 2 === 0);
    const odd = objectList.filter((o, index) => index % 2 !== 0);

    return "groupBy" in args.kanbanProps ? (
      <KanbanTemplate
        {...args}
        kanbanProps={{
          ...args.kanbanProps,
          fieldset: args.kanbanProps.fieldset as FieldSet,
          fieldsets: undefined,
          groupBy: args.kanbanProps.groupBy as string,
          objectList: objectList,
          objectLists: undefined,
        }}
      />
    ) : (
      <KanbanTemplate
        {...args}
        kanbanProps={{
          ...args.kanbanProps,
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
      ...(WithSecondaryNavigation.args!.kanbanProps as KanbanProps),
      renderPreview: (attributeData) => (
        <img
          alt={attributeData.title as string}
          src={attributeData.thumbnailUrl as string}
          width="24"
          height="24"
          style={{ objectFit: "cover" }}
        />
      ),
    },
  },
};

export const Draggable: Story = {
  ...WithSecondaryNavigation,
  args: {
    ...WithSecondaryNavigation.args,
    kanbanProps: {
      ...(WithSecondaryNavigation.args!.kanbanProps as KanbanProps),
      draggable: true,
    },
  },
};
