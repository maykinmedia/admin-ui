import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Page } from "../layout";
import { Breadcrumbs } from "./breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Controls/Breadcrumbs",
  component: Breadcrumbs,
  decorators: [
    (Story) => (
      <Page pad={true}>
        <Story />
      </Page>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BreadcrumbsComponent: Story = {
  args: {
    items: [
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
