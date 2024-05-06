import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { AttributeData } from "../../../lib";
import { Page } from "../../layout";
import { Kanban } from "./kanban";

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
  args: {
    title: "The quick brown fox jumps over the lazy dog.",
    fieldsets: [
      ["Todo", { fields: ["title"], title: "title" }],
      ["In Progress", { fields: ["title"], title: "title" }],
      ["In Review", { fields: ["title"], title: "title" }],
      ["Done", { fields: ["title"], title: "title" }],
    ],
  },
  render: (args) => {
    const abortController = new AbortController();
    const [objectList, setObjectList] = useState<AttributeData[]>([]);
    // Process sorting and pagination locally in place for demonstration purposes.

    useEffect(() => {
      const limit = 11;
      fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}`, {
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
      <Kanban objectList={objectList} {...args} />
    ) : (
      <Kanban objectLists={[even, odd, [], []]} {...args} />
    );
  },
};

export const WithCustomPreview = {
  ...KanbanComponent,
  args: {
    ...KanbanComponent.args,
    renderPreview: (attributeData) => (
      <img alt={attributeData.title} src={attributeData.thumbnailUrl} />
    ),
  },
};

export const GroupBy = {
  ...KanbanComponent,
  args: {
    fieldset: [`{group}`, { fields: ["title"], title: "title" }],
    groupBy: "alphaIndex",
  },
};
