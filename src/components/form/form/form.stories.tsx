import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { Formik } from "formik";
import * as React from "react";

import { validateForm } from "../../../lib";
import { Form } from "./form";

const meta: Meta<typeof Form> = {
  title: "Form/Form",
  component: Form,
  parameters: {
    chromatic: {
      delay: 300,
      diffThreshold: 0.9,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const getParameterFromPre = (pre: HTMLElement, parameter: string) => {
  const text = pre.textContent || "";
  try {
    const parsedText = JSON.parse(text);
    const value = parsedText[parameter];
    return value;
  } catch (error) {
    console.error("Error parsing JSON", error);
  }
};
const getLogFromCanvas = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  return await canvas.findByRole("log");
};

const expectLogToBe = async (
  canvasElement: HTMLElement,
  parameter: string,
  value: unknown,
) => {
  await waitFor(
    async () => {
      const pre = await getLogFromCanvas(canvasElement);
      return expect(getParameterFromPre(pre, parameter)).toEqual(value);
    },
    { timeout: 3000 },
  );
};

const playFormComponent = async ({
  canvasElement,
  typedResults = false,
  formik = false,
}: {
  canvasElement: HTMLElement;
  typedResults?: boolean;
  formik?: boolean;
}) => {
  const canvas = within(canvasElement);
  const firstName = canvas.getByLabelText("First name");
  const lastName = canvas.getByLabelText("Last name");
  const age = canvas.getByLabelText("Age");
  const schoolYear = canvas.getByLabelText("Select school year");
  const address = canvas.getByLabelText("Address");
  const address_addition = canvas.getByLabelText("Address (addition)");
  const dateOfBirth = canvas.getByLabelText("Date of birth");
  const english = canvas.getByLabelText("English");
  const math = canvas.getByLabelText("Math");
  const yes = canvas.getByLabelText("Yes");
  const no = canvas.getByLabelText("No");
  const acceptTos = canvas.getByLabelText(
    "I have read and accept the terms and conditions",
  );

  await userEvent.clear(firstName);
  await userEvent.type(firstName, "John", { delay: 10 });
  await expect(firstName).toHaveValue("John");
  await expectLogToBe(
    canvasElement,
    "first_name",
    typedResults ? "John" : "John",
  );

  await userEvent.clear(lastName);
  await userEvent.type(lastName, "Doe", { delay: 10 });
  await expect(lastName).toHaveValue("Doe");
  await expectLogToBe(canvasElement, "last_name", typedResults ? "Doe" : "Doe");

  await userEvent.clear(age);
  await userEvent.type(age, "33", { delay: 10 });
  await expect(age).toHaveValue(33);
  await expectLogToBe(canvasElement, "age", typedResults ? 33 : "33");

  await userEvent.click(schoolYear, { delay: 10 });
  const junior = await canvas.findByText("Junior");
  await userEvent.click(junior, { delay: 10 });
  await expect(schoolYear).toHaveTextContent("Junior");
  await expectLogToBe(
    canvasElement,
    "school_year",
    typedResults ? "Junior" : "Junior",
  );

  await userEvent.clear(address);
  await userEvent.type(address, "Keizersgracht 117", { delay: 10 });
  await expect(address).toHaveValue("Keizersgracht 117");

  await userEvent.clear(address_addition);
  await userEvent.type(address_addition, "2", { delay: 10 });
  await expect(address_addition).toHaveValue(2);
  await expectLogToBe(
    canvasElement,
    "address",
    typedResults ? ["Keizersgracht 117", 2] : ["Keizersgracht 117", "2"],
  );

  await userEvent.clear(dateOfBirth);
  await userEvent.type(dateOfBirth, "2023-09-15", { delay: 10 });
  await userEvent.type(dateOfBirth, "{enter}");
  await expect(dateOfBirth).toHaveValue("09/15/2023");
  await expectLogToBe(
    canvasElement,
    "date_of_birth",
    typedResults ? "2023-09-15" : "2023-09-15",
  );

  await userEvent.click(schoolYear);
  const senior = await canvas.findByText("Senior");
  await userEvent.click(senior);
  await expect(schoolYear).toHaveTextContent("Senior");
  await expectLogToBe(canvasElement, "school_year", "Senior");

  await userEvent.click(english);
  await expect(english).toBeChecked();
  await userEvent.click(math);
  await expect(math).toBeChecked();
  await expectLogToBe(canvasElement, "courses", ["english", "math"]);

  await userEvent.click(yes);
  await expect(yes).toBeChecked();
  await expectLogToBe(canvasElement, "subscribe_newsletter", "yes");
  await userEvent.click(no);
  await expect(no).toBeChecked();
  await expectLogToBe(canvasElement, "subscribe_newsletter", "no");

  await userEvent.click(acceptTos);
  await expect(acceptTos).toBeChecked();
  if (formik) {
    await expectLogToBe(canvasElement, "accept_tos", ["on"]);
  } else {
    await expectLogToBe(
      canvasElement,
      "accept_tos",
      typedResults ? true : "on",
    );
  }
};

export const FormComponent: Story = {
  args: {
    debug: true,
    fields: [
      { label: "First name", name: "first_name", required: true },
      { label: "Last name", name: "last_name", required: true },
      { label: "Age", name: "age", type: "number", required: true },
      { label: "Address", name: "address", required: true },
      {
        label: "Address (addition)",
        name: "address",
        type: "number",
        required: true,
      },
      { label: "Date of birth", name: "date_of_birth", type: "date" },
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
      {
        label: "Receive newsletter",
        name: "subscribe_newsletter",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      {
        label: "I have read and accept the terms and conditions",
        name: "accept_tos",
        type: "checkbox",
        required: true,
      },
    ],
    validate: validateForm,
    validateOnChange: true,
  },
  play: playFormComponent,
};

export const TypedResults: Story = {
  ...FormComponent,
  args: {
    ...FormComponent.args,
    useTypedResults: true,
  },
  play: async ({ canvasElement }) => {
    await playFormComponent({ canvasElement, typedResults: true });
  },
};

export const UsageWithFormik: Story = {
  ...FormComponent,
  args: {
    debug: true,
    fields: [
      { label: "First name", name: "first_name", required: true },
      { label: "Last name", name: "last_name", required: true },
      { label: "Age", name: "age", type: "number", required: true },
      { label: "Address", name: "address[0]", required: true },
      {
        label: "Address (addition)",
        name: "address[1]",
        type: "number",
        required: true,
      },
      { label: "Date of birth", name: "date_of_birth", type: "date" },
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
      {
        label: "Receive newsletter",
        name: "subscribe_newsletter",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      {
        label: "I have read and accept the terms and conditions",
        name: "accept_tos",
        type: "checkbox",
        required: true,
      },
    ],
    validate: validateForm,
    validateOnChange: true,
  },
  play: async ({ canvasElement }) => {
    await playFormComponent({
      canvasElement,
      typedResults: true,
      formik: true,
    });
  },
  render: (args) => {
    return (
      <Formik
        initialValues={{}}
        onSubmit={(data) => console.log(data)}
        validate={(values) =>
          args.validate && args.validate(values, args.fields || [])
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
