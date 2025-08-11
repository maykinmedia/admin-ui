import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { FIXTURE_PRODUCT } from "../../../../.storybook/fixtures/products";
import { AttributeList } from "./attributelist";

const meta: Meta<typeof AttributeList<typeof FIXTURE_PRODUCT>> = {
  title: "Data/AttributeList",
  component: AttributeList<typeof FIXTURE_PRODUCT>,
  args: {
    onBlur: fn(),
    // onEdit: fn(),
    // onChange: fn(),
  },
  argTypes: {
    editable: {
      control: "boolean",
      description:
        "Whether the value are editable (defaults to field.editable)",
    },
    editing: {
      control: "boolean",
      description: "Whether the values are currently being edited.",
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
    titleSpan: 3,
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
    titleSpan: 3,
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
    titleSpan: 3,
  },
};

export const Editable: Story = {
  args: {
    editable: true,
    editing: true,
    object: FIXTURE_PRODUCT,
  },
  play: async ({ args, canvasElement }) => {
    const spinbuttons = within(canvasElement).getAllByRole("spinbutton");
    const textboxes = within(canvasElement).getAllByRole("textbox");
    const checkboxes = within(canvasElement).getAllByRole("checkbox");
    const controls = [...spinbuttons, ...textboxes, ...checkboxes];

    await userEvent.click(spinbuttons[0]);
    for (let i = 0; i < controls.length; i++) {
      await userEvent.tab({ delay: 100 });
    }

    expect(args.onBlur).toHaveBeenCalledTimes(9);
  },
};
