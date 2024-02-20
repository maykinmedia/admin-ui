import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import { Formik } from "formik";
import * as React from "react";

import { formatMessage } from "../../../lib/i18n/formatmessage";
import { Form } from "./form";

const meta = {
  title: "Form/Form",
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormComponent: Story = {
  args: {
    debug: true,
    fields: [
      { label: "First name", name: "first_name" },
      { label: "Last name", name: "last_name" },
      {
        label: "Select school year",
        name: "school_year",
        options: [
          { label: "Freshman" },
          { label: "Sophomore" },
          { label: "Junior" },
          { label: "Senior" },
          { label: "Graduate" },
        ],
      },
      { label: "Address", name: "address" },
      { label: "Address (addition)", name: "address" },
    ],
    validate: (values, fields) => {
      const entries = Object.entries(values);
      const emtpyEntries = entries.filter(([, value]) => !value);
      const mappedEntries = emtpyEntries.map(([name]) => [
        name,
        formatMessage('Field "{name}" is required', {
          name: (
            fields?.find((f) => f.name === name)?.label || name
          ).toLowerCase(),
        }),
      ]);
      return Object.fromEntries(mappedEntries);
    },
    validateOnChange: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstName = canvas.getByLabelText("First name");
    const lastName = canvas.getByLabelText("Last name");
    const schoolYear = canvas.getByLabelText("Select school year");
    const address = canvas.getByLabelText("Address");
    const address_addition = canvas.getByLabelText("Address (addition)");

    await userEvent.clear(firstName);
    await userEvent.type(firstName, "John", { delay: 10 });

    await userEvent.clear(lastName);
    await userEvent.type(lastName, "Doe", { delay: 10 });

    await userEvent.click(schoolYear, { delay: 10 });
    const junior = await canvas.findByText("Junior");
    await userEvent.click(junior, { delay: 10 });

    await userEvent.clear(address);
    await userEvent.type(address, "Keizersgracht 117", { delay: 10 });

    await userEvent.clear(address_addition);
    await userEvent.type(address_addition, "2", { delay: 10 });
  },
};

export const usageWithFormik: Story = {
  ...FormComponent,
  args: {
    ...FormComponent.args,
    fields: [
      { label: "First name", name: "first_name" },
      { label: "Last name", name: "last_name" },
      {
        label: "Select school year",
        name: "school_year",
        options: [
          { label: "Freshman" },
          { label: "Sophomore" },
          { label: "Junior" },
          { label: "Senior" },
          { label: "Graduate" },
        ],
      },
      { label: "Address", name: "address[0]" },
      { label: "Address (addition)", name: "address[1]" },
    ],
  },
  render: (args) => {
    return (
      <Formik
        initialValues={{}}
        onSubmit={(data) => console.log(data)}
        validate={(values) =>
          args.validate && args.validate(values, args.fields)
        }
        validateOnChange={args.validateOnChange}
      >
        {({ errors, values, handleChange, handleSubmit }) => (
          <Form
            debug={args.debug}
            errors={errors}
            fields={args.fields}
            values={values}
            onChange={handleChange}
            onSubmit={(event) => handleSubmit(event)}
          ></Form>
        )}
      </Formik>
    );
  },
};
