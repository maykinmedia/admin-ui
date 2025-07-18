import type { Meta, StoryObj } from "@storybook/react-vite";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Breadcrumbs } from "./breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Controls/Breadcrumbs",
  component: Breadcrumbs,
  decorators: [PAGE_DECORATOR],
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
