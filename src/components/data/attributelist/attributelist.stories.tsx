import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { FIXTURE_PRODUCT } from "../../../../.storybook/fixtures/products";
import { AttributeList } from "./attributelist";

const meta: Meta<typeof AttributeList<typeof FIXTURE_PRODUCT>> = {
  title: "Data/AttributeList",
  component: AttributeList<typeof FIXTURE_PRODUCT>,
  args: {
    onEdit: fn(),
  },
  argTypes: {
    editable: {
      control: "boolean",
      description: "Whether the value should be editable (requires field)",
    },
  },
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

export const WithTitleSpan12: Story = {
  args: {
    title: FIXTURE_PRODUCT.name,
    object: FIXTURE_PRODUCT,
    titleSpan: 12,
    colSpan: 3,
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

export const Editable: Story = {
  args: {
    editable: true,
    object: FIXTURE_PRODUCT,
  },
  play: async ({ args, canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole("button");
    for (const button of buttons) {
      await userEvent.click(button, { delay: 10 });

      await waitFor(() => {
        const canvas = within(canvasElement);
        return (
          canvas.queryByRole("spinbutton") ||
          canvas.queryByRole("textbox") ||
          canvas.queryByRole("checkbox")
        );
      });
    }
    await userEvent.tab({ delay: 10 });
    expect(args.onEdit).toHaveBeenCalledTimes(9);
  },
};
