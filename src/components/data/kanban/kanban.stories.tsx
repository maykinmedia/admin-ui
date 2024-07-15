import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { generateHexColor } from "../../../../.storybook/utils";
import { AttributeData } from "../../../lib";
import { Page } from "../../layout";
import { Kanban, KanbanProps } from "./kanban";

const meta: Meta<typeof Kanban> = {
  title: "Data/Kanban",
  component: Kanban,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const KanbanComponent: Story = {
  // @ts-expect-error - Fix never
  args: {
    title: "The quick brown fox jumps over the lazy dog.",
    fieldsets: [
      ["Todo", { fields: ["title"], title: "title" }],
      ["In Progress", { fields: ["title"], title: "title" }],
      ["In Review", { fields: ["title"], title: "title" }],
      ["Done", { fields: ["title"], title: "title" }],
    ],
  } as KanbanProps,
  render: (args: KanbanProps) => {
    const abortController = new AbortController();
    const [objectList, setObjectList] = useState<AttributeData[]>([]);

    useEffect(() => {
      const limit = 11;
      fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}`, {
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
                onClick: (e: Event) => {
                  e.preventDefault();
                  alert(d.id);
                },
              };
            }),
          );
        });
    }, [args]);

    const even = objectList.filter((o, index) => index % 2 === 0);
    const odd = objectList.filter((o, index) => index % 2 !== 0);

    return "groupBy" in args ? (
      // @ts-expect-error - Fix never
      <Kanban objectList={objectList} {...(args as KanbanProps)} />
    ) : (
      // @ts-expect-error - Fix never
      <Kanban objectLists={[even, odd, [], []]} {...(args as KanbanProps)} />
    );
  },
};

export const AdditionalFields: Story = {
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
    fieldsets: [
      ["Todo", { fields: ["title", "id", "albumId"], title: "title" }],
      ["In Progress", { fields: ["title", "id", "albumId"], title: "title" }],
      ["In Review", { fields: ["title", "id", "albumId"], title: "title" }],
      ["Done", { fields: ["title", "id", "albumId"], title: "title" }],
    ],
  },
};

export const WithCustomPreview: Story = {
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
    renderPreview: (attributeData: AttributeData<string>) => (
      <img
        alt={attributeData.title}
        src={attributeData.thumbnailUrl}
        width="24"
        height="24"
        style={{ objectFit: "cover" }}
      />
    ),
  },
};

export const GroupBy: Story = {
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
    fieldset: [`{group}`, { fields: ["title"], title: "title" }],
    groupBy: "alphaIndex",
    renderPreview: false,
  },
};

export const Draggable: Story = {
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
    draggable: true,
  },
};
