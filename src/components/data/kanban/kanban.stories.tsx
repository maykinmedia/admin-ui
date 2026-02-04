import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../../.storybook/decorators";
import {
  FIXTURE_TODOS,
  FIXTURE_TODOS_STATUS_DONE,
  FIXTURE_TODOS_STATUS_IN_PROGRESS,
  FIXTURE_TODOS_STATUS_IN_REVIEW,
  FIXTURE_TODOS_STATUS_TODO,
} from "../../../../.storybook/fixtures/todos";
import { Kanban, KanbanProps } from "./kanban";

const meta: Meta<typeof Kanban> = {
  title: "Data/Kanban",
  component: Kanban,
  decorators: [PAGE_DECORATOR],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const KanbanComponent: Story = {
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

export const AdditionalFields: Story = {
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
    fieldsets: [
      ["Todo", { fields: ["title", "dueDate", "priority"], title: "title" }],
      [
        "In Progress",
        { fields: ["title", "dueDate", "priority"], title: "title" },
      ],
      [
        "In Review",
        { fields: ["title", "dueDate", "priority"], title: "title" },
      ],
      ["Done", { fields: ["title", "dueDate", "priority"], title: "title" }],
    ],
  },
};

export const CustomPreview: Story = {
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
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
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
    title: "The quick brown fox jumps over the lazy dog.",
    fieldset: [`{group}`, { fields: ["title"], title: "title" }],
    objectList: FIXTURE_TODOS,
    groupBy: "status",
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

export const WithToolbar: Story = {
  ...KanbanComponent,
  // @ts-expect-error - Fix never
  args: {
    ...(KanbanComponent.args as KanbanProps),
    toolbarProps: {
      items: [
        {
          componentType: "formControl",
          direction: "h",
          label: "Sorteren",
          required: true,
          showRequiredIndicator: false,
          options: [
            { label: "Nieuwste eerst", value: "-pk", selected: true },
            { label: "Oudste eerst", value: "pk", selected: true },
          ],
        },
        "spacer",
        {
          componentType: "button",
          children: "Item toevoegen",
          variant: "primary",
        },
      ],
    },
  },
};
