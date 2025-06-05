import { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Card } from "../card";
import { Tab, Tabs } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Controls/Tabs",
  component: Tabs,
  decorators: [PAGE_DECORATOR],
};

export default meta;

export const TabsComponent: StoryObj<typeof meta> = {
  render: (args) => (
    <Tabs {...args}>
      <Tab label="Structuur">Content for tab one</Tab>
      <Tab label="Basis">Tab 2 content</Tab>
      <Tab label="Statussen">Tab 3 content</Tab>
      <Tab label="Documenten">Tab 4 content</Tab>
      <Tab label="Rollen">Tab 5 content</Tab>
      <Tab label="Eigenschappen">Tab 6 content</Tab>
    </Tabs>
  ),
};

export const ExplicitId: StoryObj<typeof meta> = {
  render: (args) => (
    <Tabs {...args}>
      <Tab id="structuur" label="Structuur">
        Content for tab one
      </Tab>
      <Tab id="informatie" label="Basis informatie">
        Tab 2 content
      </Tab>
      <Tab id="statussen" label="Statussen">
        Tab 3 content
      </Tab>
      <Tab id="documenten" label="Documenten">
        Tab 4 content
      </Tab>
      <Tab id="rollen" label="Rollen">
        Tab 5 content
      </Tab>
      <Tab id="eigenschappen" label="Eigenschappen">
        Tab 6 content
      </Tab>
    </Tabs>
  ),
};

export const TabsComponentInCard: StoryObj<typeof meta> = {
  decorators: [
    (Story) => (
      <Card>
        <Story />
      </Card>
    ),
  ],
  render: (args) => (
    <Tabs {...args}>
      <Tab label="Structuur">Content for tab one</Tab>
      <Tab label="Basis">Tab 2 content</Tab>
      <Tab label="Statussen">Tab 3 content</Tab>
      <Tab label="Documenten">Tab 4 content</Tab>
      <Tab label="Rollen">Tab 5 content</Tab>
      <Tab label="Eigenschappen">Tab 6 content</Tab>
    </Tabs>
  ),
};
