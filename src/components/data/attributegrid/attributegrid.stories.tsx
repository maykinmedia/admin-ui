import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { FIXTURE_PRODUCT } from "../../../../.storybook/fixtures/products";
import { AttributeGrid } from "./attributegrid";

const meta: Meta<typeof AttributeGrid<typeof FIXTURE_PRODUCT>> = {
  title: "Data/AttributeGrid",
  component: AttributeGrid<typeof FIXTURE_PRODUCT>,
};

export default meta;
type Story = StoryObj<typeof meta & { image: React.ReactNode }>;

export const AttributeGridComponent: Story = {
  args: {
    fieldsets: [
      [
        "information",
        {
          fields: [
            "id",
            "name",
            "description",
            "category",
            "releaseDate",
            "url",
          ],
          span: 12,
          colSpan: 3,
        },
      ],
      [
        "availability",
        {
          fields: ["price", "isAvailable", "stock"],
          span: 12,
          colSpan: 3,
        },
      ],
      [
        "more",
        {
          fields: ["category", "releaseDate", "url"],
          span: 6,
          titleSpan: 6,
          colSpan: 6,
        },
      ],
    ],
    object: FIXTURE_PRODUCT,
  },
};
