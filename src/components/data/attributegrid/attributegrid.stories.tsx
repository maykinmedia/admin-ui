import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { FIXTURE_PRODUCT } from "../../../../.storybook/fixtures/products";
import { AttributeGrid } from "./attributegrid";

const meta: Meta<typeof AttributeGrid<typeof FIXTURE_PRODUCT>> = {
  title: "Data/AttributeGrid",
  component: AttributeGrid<typeof FIXTURE_PRODUCT>,
  args: {
    onBlur: fn(),
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
            { name: "description", type: "text" },
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

export const AttributeGridWithTitleSpan12: Story = {
  args: {
    separator: true,
    fieldsets: [
      [
        "Information",
        {
          titleSpan: 12,
          fields: ["name", "description", "price"],
          span: 12,
          colSpan: 4,
        },
      ],
      [
        "Availability",
        {
          fields: ["isAvailable", "stock"],
          span: 12,
          colSpan: 4,
          titleSpan: 12,
        },
      ],
      [
        "More",
        {
          fields: ["category", "releaseDate", "url"],
          span: 12,
          colSpan: 4,
          titleSpan: 12,
        },
      ],
    ],
    object: FIXTURE_PRODUCT,
  },
};

export const Editable: Story = {
  ...AttributeGridComponent,
  args: {
    ...AttributeGridComponent.args,
    editable: true,
    editing: true,
    separator: true,
    formControlProps: {
      pad: true,
    },
    fieldsets: [
      [
        "Information",
        {
          span: 12,
          titleSpan: 12,
          fields: ["id"],
        },
      ],
      [
        "",
        {
          fields: ["name", "description", "category", "url", "releaseDate"],
          span: 12,
          colSpan: 6,
        },
      ],

      [
        "Availability",
        {
          fields: ["isAvailable", "stock"],
          span: 12,
          colSpan: 6,
        },
      ],
      [
        "More",
        {
          fields: ["price", "description"],
          span: 12,
          colSpan: 6,
          titleSpan: 12,
        },
      ],
    ],
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

    expect(args.onBlur).toHaveBeenCalledTimes(10);
  },
};
