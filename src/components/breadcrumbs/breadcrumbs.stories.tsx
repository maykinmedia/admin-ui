import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Page } from "../page";
import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Controls/Breadcrumbs",
  component: Breadcrumbs,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BreadcrumbsComponent: Story = {
  args: {
    pathItems: [
      {
        label: "Home",
        path: "/",
      },
      {
        label: "Breadcrumbs",
        path: "/breadcrumbs",
      },
      {
        label: "Current page",
        path: "/breadcrumbs/current",
      },
    ],
  },
};