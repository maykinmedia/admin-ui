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

export const generateComponentList = (count: number) => {
  const randomLorenIpsum = [
    "This is a card",
    "The card has the purpose to show some data",
    "The data can either be super duper long, or also very short and concise",
    "This is just the title",
  ];

  const randomDays = ["20 days", "30 days", "40 days", "50 days", "60 days"];

  const randomData = [
    "Some random test",
    "Some more test data to differentiate",
    "And slightly more so that we can see the difference",
  ];

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  return Array.from({ length: count }, (_, i) => ({
    id: i.toString(),
    content: (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>{randomDays[getRandomInt(randomDays.length)]}</span>
        <span>{randomLorenIpsum[getRandomInt(randomLorenIpsum.length)]}</span>
        <span>{randomData[getRandomInt(randomData.length)]}</span>
      </div>
    ),
  }));
};

// Define the component list
const componentList = [
  { title: "Todo", id: "1", items: generateComponentList(10) },
  { title: "In Progress", id: "2", items: generateComponentList(10) },
  { title: "In Review", id: "3", items: generateComponentList(10) },
  { title: "Done", id: "4", items: generateComponentList(10) },
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
