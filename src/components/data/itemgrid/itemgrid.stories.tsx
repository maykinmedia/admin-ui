import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { generateHexColor } from "../../../../.storybook/utils";
import { AttributeData, FieldSet } from "../../../lib";
import { Page } from "../../layout";
import { ItemGrid, ItemGridProps } from "./itemgrid";

const meta: Meta<typeof ItemGrid> = {
  title: "Data/Itemgrid",
  component: ItemGrid,
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

export const ItemGridComponent: Story = {
  // @ts-expect-error - Fix never
  args: {
    title: "The quick brown fox jumps over the lazy dog.",
    fieldsets: [
      ["Even", { fields: ["title"], title: "title" }],
      ["Odd", { fields: ["title"], title: "title" }],
    ],
  },
  render: (args: ItemGridProps) => {
    const abortController = new AbortController();
    const [objectList, setObjectList] = useState<AttributeData[]>([]);
    // Process sorting and pagination locally in place for demonstration purposes.

    useEffect(() => {
      const limit = "groupBy" in args ? 200 : 11;
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
              };
            }),
          );
        });
    }, [args]);

    const even = objectList.filter((o, index) => index % 2 === 0);
    const odd = objectList.filter((o, index) => index % 2 !== 0);

    return "groupBy" in args ? (
      <ItemGrid
        {...args}
        objectList={objectList}
        objectLists={undefined}
        fieldset={args.fieldset as FieldSet}
        fieldsets={undefined}
        groupBy={args.groupBy as string}
      />
    ) : (
      <ItemGrid {...args} objectLists={[even, odd]} />
    );
  },
};

export const WithCustomPreview: Story = {
  ...ItemGridComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(ItemGridComponent.args as ItemGridProps),
    renderPreview: (attributeData: AttributeData<string>) => (
      <img
        alt={attributeData.title}
        src={attributeData.thumbnailUrl}
        width="100%"
        height="100%"
        style={{ objectFit: "cover" }}
      />
    ),
  },
};

export const GroupBy: Story = {
  ...ItemGridComponent,
  // @ts-expect-error - Fix never
  args: {
    fieldset: [`{group}`, { fields: ["title"], title: "title" }],
    groupBy: "alphaIndex",
  },
};
