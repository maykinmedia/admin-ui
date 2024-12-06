import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import * as React from "react";

import { FIXTURE_PRODUCT } from "../../../../.storybook/fixtures/products";
import { ButtonLink } from "../../button";
import { Outline } from "../../icon";
import { AttributeTable } from "./attributetable";

const meta: Meta<typeof AttributeTable> = {
  title: "Data/AttributeTable",
  component: AttributeTable,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AttributeTableComponent: Story = {
  args: {
    object: FIXTURE_PRODUCT,
  },
};

export const AttributeTableComponentCompact: Story = {
  args: {
    object: FIXTURE_PRODUCT,
    compact: true,
  },
};

export const LabeledAttributeTableComponent: Story = {
  args: {
    labeledObject: {
      id: { label: "Identifier", value: FIXTURE_PRODUCT.id },
      name: { label: "Name", value: FIXTURE_PRODUCT.name },
      description: { label: "Description", value: FIXTURE_PRODUCT.description },
      url: { label: "Link", value: FIXTURE_PRODUCT.url },
      price: { label: "Price", value: FIXTURE_PRODUCT.price },
      stock: { label: "In stock", value: FIXTURE_PRODUCT.stock },
      category: { label: "Category", value: FIXTURE_PRODUCT.category },
      is_available: { label: "Available", value: FIXTURE_PRODUCT.isAvailable },
      release_date: {
        label: "Release date",
        value: FIXTURE_PRODUCT.releaseDate,
      },
    },
  },
};

export const LabeledAttributeTableComponentWithJSX: Story = {
  args: {
    labeledObject: {
      button: {
        label: "A button!",
        value: (
          <ButtonLink
            href="https://www.example.com"
            target="_blank"
            variant="transparent"
          >
            <Outline.AcademicCapIcon />
            Click me!
          </ButtonLink>
        ),
      },
      labelWithIcon: {
        label: (
          <>
            A label with icon <Outline.AcademicCapIcon />
          </>
        ),
        value: "Some value",
      },
    },
  },
};

export const Editable: Story = {
  args: {
    editable: true,
    fields: [
      {
        name: "first_name",
        type: "string",
      },
      {
        name: "last_name",
        type: "string",
      },
      {
        name: "school_year",
        type: "string",
        options: [
          { label: "Freshman" },
          { label: "Sophomore" },
          { label: "Junior" },
          { label: "Senior" },
          { label: "Graduate" },
        ],
      },
    ],
    object: {
      first_name: "",
      last_name: "",
      school_year: "",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editFirstName = canvas.getByLabelText('Edit "First name"');
    await userEvent.click(editFirstName, { delay: 10 });
    const firstName = canvas.getByLabelText("First name");
    await userEvent.type(firstName, "John", { delay: 10 });

    const editLastName = canvas.getByLabelText('Edit "Last name"');
    await userEvent.click(editLastName, { delay: 10 });
    const lastName = canvas.getByLabelText("Last name");
    await userEvent.type(lastName, "John", { delay: 10 });

    const editSchoolYear = canvas.getByLabelText('Edit "School year"');
    await userEvent.click(editSchoolYear, { delay: 10 });
    const schoolYear = canvas.getByLabelText("School year");
    await userEvent.click(schoolYear);
    const junior = canvas.getByText("Junior");
    await userEvent.click(junior);

    const submit = canvas.getByText("Submit");
    await userEvent.click(submit);
  },
};
