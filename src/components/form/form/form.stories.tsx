import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import { Formik } from "formik";
import * as React from "react";

import { validateForm } from "../../../lib";
import { Form } from "./form";

const meta: Meta<typeof Form> = {
  title: "Form/Form",
  component: Form,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FormComponent: Story = {
  args: {
    debug: true,
    fields: [
      { label: "First name", name: "first_name", required: true },
      { label: "Last name", name: "last_name", required: true },
      { label: "Address", name: "address", required: true },
      { label: "Address (addition)", name: "address", required: true },
      {
        label: "Select school year",
        name: "school_year",
        required: true,
        options: [
          { label: "Freshman" },
          { label: "Sophomore" },
          { label: "Junior" },
          { label: "Senior" },
          { label: "Graduate" },
        ],
      },
      {
        label: "Select courses",
        name: "courses",
        type: "checkbox",
        required: true,
        options: [
          { label: "English", value: "english" },
          { label: "Math", value: "math" },
          { label: "Science", value: "science" },
        ],
      },
    ],
    validate: validateForm,
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

export const TypedResults: Story = {
  args: {
    debug: true,
    fields: [
      { label: "Name", name: "name" },
      { label: "Age", name: "age", type: "number" },
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
      {
        label: "Select courses",
        name: "courses",
        type: "checkbox",
        required: true,
        options: [
          { label: "English", value: "english" },
          { label: "Math", value: "math" },
          { label: "Science", value: "science" },
        ],
      },
      {
        label: "Receive newsletter",
        name: "subscribe_newsletter",
        type: "checkbox",
      },
    ],
    useTypedResults: true,
    validate: validateForm,
    validateOnChange: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText("Name");
    const age = canvas.getByLabelText("Age");
    const schoolYear = canvas.getByLabelText("Select school year");
    const english = canvas.getByLabelText("English");
    const math = canvas.getByLabelText("Math");
    const newsletter = canvas.getByLabelText("Receive newsletter");

    await userEvent.clear(name);
    await userEvent.type(name, "John", { delay: 10 });

    await userEvent.clear(age);
    await userEvent.type(age, "33", { delay: 10 });

    await userEvent.click(schoolYear, { delay: 10 });
    const junior = await canvas.findByText("Junior");
    await userEvent.click(junior, { delay: 10 });

    await userEvent.click(english, { delay: 10 });
    await userEvent.click(math, { delay: 10 });
    await userEvent.click(newsletter, { delay: 10 });
  },
};

export const UsageWithFormik: Story = {
  ...FormComponent,
  args: {
    ...FormComponent.args,
    fields: [
      { label: "First name", name: "first_name", required: true },
      { label: "Last name", name: "last_name", required: true },
      {
        label: "Select school year",
        name: "school_year",
        required: true,
        options: [
          { label: "Freshman" },
          { label: "Sophomore" },
          { label: "Junior" },
          { label: "Senior" },
          { label: "Graduate" },
        ],
      },
      { label: "Address", name: "address[0]", required: true },
      { label: "Address (addition)", name: "address[1]", required: true },
      {
        label: "Select courses",
        name: "courses",
        type: "checkbox",
        required: true,
        options: [
          { label: "English", value: "english" },
          { label: "Math", value: "math" },
          { label: "Science", value: "science" },
        ],
      },
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
