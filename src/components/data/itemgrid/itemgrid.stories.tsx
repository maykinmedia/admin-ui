import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../../.storybook/decorators";
import {
  FIXTURE_TODOS,
  FIXTURE_TODOS_STATUS_DONE,
  FIXTURE_TODOS_STATUS_IN_PROGRESS,
  FIXTURE_TODOS_STATUS_IN_REVIEW,
  FIXTURE_TODOS_STATUS_TODO,
} from "../../../../.storybook/fixtures/todos";
import { ItemGrid, ItemGridProps } from "./itemgrid";

const meta: Meta<typeof ItemGrid> = {
  title: "Data/Itemgrid",
  component: ItemGrid,
  decorators: [PAGE_DECORATOR],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ItemGridComponent: Story = {
  // @ts-expect-error - never
  args: {
    title: "The quick brown fox jumps over the lazy dog.",
    fieldsets: [
      ["Todo", { fields: ["title"], title: "title" }],
      ["In Progress", { fields: ["title"], title: "title" }],
      ["In Review", { fields: ["title"], title: "title" }],
      ["Done", { fields: ["title"], title: "title" }],
    ],
    objectLists: [
      FIXTURE_TODOS_STATUS_TODO,
      FIXTURE_TODOS_STATUS_IN_PROGRESS,
      FIXTURE_TODOS_STATUS_IN_REVIEW,
      FIXTURE_TODOS_STATUS_DONE,
    ],
  },
};

export const CustomPreview: Story = {
  ...ItemGridComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(ItemGridComponent.args as ItemGridProps),
    renderPreview: (data: Record<string, string>) => (
      <img
        alt={data.title}
        src="/static/maykin_logo.png"
        height="24"
        style={{ objectFit: "contain" }}
      />
    ),
  },
};

export const GroupBy: Story = {
  ...ItemGridComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(ItemGridComponent.args as ItemGridProps),
    title: "The quick brown fox jumps over the lazy dog.",
    fieldset: [`{group}`, { fields: ["title"], title: "title" }],
    objectList: FIXTURE_TODOS,
    groupBy: "status",
  },
};
