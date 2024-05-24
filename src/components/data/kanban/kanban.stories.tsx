import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

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

const generateComponentList = (count: number) => {
  const randomLorenIpsum = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in.",
  ];
  return Array.from({ length: count }, (_, i) => (
    <div key={i} style={{ display: "flex", flexDirection: "column" }}>
      <span>20 days</span>
      <span>{randomLorenIpsum[i % randomLorenIpsum.length]}</span>
      <span>Some more data</span>
    </div>
  ));
};

// Define the component list
const componentList = [
  { title: "Todo", items: generateComponentList(10) },
  { title: "In Progress", items: generateComponentList(10) },
  { title: "In Review", items: generateComponentList(10) },
  { title: "Done", items: generateComponentList(10) },
];

export const KanbanComponent: Story = {
  args: {
    title: "The quick brown fox jumps over the lazy dog.",
    componentList,
  },
  render: (args) => {
    return <Kanban {...args} />;
  },
};
