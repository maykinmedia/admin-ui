import type { Meta, StoryObj } from "@storybook/react-vite";

import { FIXTURE_PRODUCT } from "../../../../.storybook/fixtures/products";
import { AttributeList } from "./attributelist";

const meta: Meta<typeof AttributeList<typeof FIXTURE_PRODUCT>> = {
  title: "Data/AttributeList",
  component: AttributeList<typeof FIXTURE_PRODUCT>,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AttributeListComponent: Story = {
  args: {
    object: FIXTURE_PRODUCT,
  },
};

export const WithTitle: Story = {
  args: {
    title: FIXTURE_PRODUCT.name,
    object: FIXTURE_PRODUCT,
  },
};

export const SelectedFieldOnly: Story = {
  args: {
    title: FIXTURE_PRODUCT.name,
    object: FIXTURE_PRODUCT,
    fields: ["name", "description", "price", "isAvailable"],
  },
};

export const ColSpan: Story = {
  args: {
    title: FIXTURE_PRODUCT.name,
    object: FIXTURE_PRODUCT,
    fields: [
      "id",
      "name",
      "description",
      "price",
      "isAvailable",
      "stock",
      "category",
      "releaseDate",
      "url",
    ],
    colSpan: 3,
  },
};
