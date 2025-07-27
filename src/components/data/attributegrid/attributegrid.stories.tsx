import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { FIXTURE_PRODUCT } from "../../../../.storybook/fixtures/products";
import { AttributeGrid } from "./attributegrid";

const meta: Meta<typeof AttributeGrid<typeof FIXTURE_PRODUCT>> = {
  title: "Data/AttributeGrid",
  component: AttributeGrid<typeof FIXTURE_PRODUCT>,
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
    expect(args.onEdit).toHaveBeenCalledTimes(12);
  },
};
