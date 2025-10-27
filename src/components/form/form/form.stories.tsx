import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import * as React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { validateForm, validateRequired } from "../../../lib";
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
    return parsedText.valuesState[parameter];
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
  const schoolYear = canvas.getByLabelText("Select school year", {
    exact: false,
  });
  const favouriteSport = canvas.getByLabelText("Favourite sport");
  const address = canvas.getByLabelText("Address");
  const address_addition = canvas.getByLabelText("Address (addition)");
  const dateOfBirth = canvas.getByLabelText("Date of birth", { exact: false });
  const dateOfBirthFields = await within(
    dateOfBirth.parentElement as HTMLElement, // FIXME: Improve
  ).findAllByRole("textbox");
  const english = canvas.getByLabelText("English");
  const math = canvas.getByLabelText("Math");

  const years = canvas.getByLabelText("Years");
  const months = canvas.getByLabelText("Months");
  const days = canvas.getByLabelText("Days");

  const yes = canvas.getByLabelText("Yes");
  const no = canvas.getByLabelText("No");
  const comments = canvas.getByLabelText("Comments");
  const acceptTos = canvas.getByLabelText(
    "I have read and accept the terms and conditions",
  );

  await userEvent.clear(firstName);
  await userEvent.type(firstName, "John", { delay: 10 });
  await expect(firstName).toHaveValue("John");
  await expectLogToBe(canvasElement, "first_name", "John");

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

  await userEvent.type(dateOfBirthFields[0], "15", { delay: 60 });
  await userEvent.type(dateOfBirthFields[1], "09", { delay: 60 });
  await userEvent.type(dateOfBirthFields[2], "2023", { delay: 60 });
  await userEvent.tab();
  await expect(dateOfBirth).toHaveValue("15");
  await expectLogToBe(
    canvasElement,
    "date_of_birth",
    typedResults && !formik ? "2023-09-15T00:00:00.000Z" : "2023-09-15",
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

  await userEvent.type(years, "1", { delay: 10 });
  await userEvent.type(months, "2", { delay: 10 });
  await userEvent.type(days, "3", { delay: 10 });
  await userEvent.tab();

  await expectLogToBe(canvasElement, "duration", "P1Y2M3D");

  await userEvent.click(favouriteSport, { delay: 100 });
  const football = await canvas.findByText("Football");
  const tennis = await canvas.findByText("Tennis");
  await userEvent.click(football, { delay: 10 });
  await userEvent.click(tennis, { delay: 10 });
  await expect(favouriteSport).toHaveTextContent("FootballTennis");
  await expectLogToBe(
    canvasElement,
    "favourite_sport",
    typedResults ? ["football", "tennis"] : ["football", "tennis"],
  );

  await userEvent.click(yes);
  await expect(yes).toBeChecked();
  await expectLogToBe(canvasElement, "subscribe_newsletter", "yes");
  await userEvent.click(no);
  await expect(no).toBeChecked();
  await expectLogToBe(canvasElement, "subscribe_newsletter", "no");

  await userEvent.clear(comments);
  await userEvent.type(comments, "Nothing to here please disperse", {
    delay: 10,
  });
  await expect(comments).toHaveValue("Nothing to here please disperse");
  await expectLogToBe(
    canvasElement,
    "comments",
    "Nothing to here please disperse",
  );

  await userEvent.click(acceptTos);
  await expect(acceptTos).toBeChecked();
  await expectLogToBe(canvasElement, "accept_tos", typedResults ? true : "on");
};

export const FormComponent: Story = {
  args: {
    debug: true,
    fields: [
      { label: "First name", name: "first_name", required: true },
      { label: "Last name", name: "last_name", required: true },
      { label: "Age", name: "age", type: "number", required: true },
      { label: "Address", name: "address", required: true, inputSize: 50 },

      {
        label: "Address (addition)",
        name: "address",
        type: "number",
        required: true,
        inputSize: 10,
      },

      {
        label: "Date of birth",
        name: "date_of_birth",
        type: "date",
        required: true,
      },

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
        label: "Termijn",
        name: "duration",
        type: "duration",
        required: true,
      },
      {
        options: [
          { label: "Football", value: "football" },
          { label: "Basketball", value: "basketball" },
          { label: "Tennis", value: "tennis" },
          { label: "Swimming", value: "swimming" },
          { label: "Running", value: "running" },
          { label: "Cycling", value: "cycling" },
        ],
        name: "favourite_sport",
        placeholder: "Select favourite sport",
        label: "Favourite sport",
        multiple: true,
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
        label: "Comments",
        name: "comments",
        rows: 5,
        cols: 50,
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
    secondaryActions: [{ type: "reset", value: "Reset" }],
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

export const SecondaryActions: Story = {
  ...FormComponent,
  args: {
    ...FormComponent.args,
    secondaryActions: [
      { children: "Clear form", type: "reset", variant: "secondary" },
    ],
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
        label: "Termijn",
        name: "duration",
        type: "duration",
        required: true,
      },
      {
        options: [
          { label: "Football", value: "football" },
          { label: "Basketball", value: "basketball" },
          { label: "Tennis", value: "tennis" },
          { label: "Swimming", value: "swimming" },
          { label: "Running", value: "running" },
          { label: "Cycling", value: "cycling" },
        ],
        name: "favourite_sport",
        placeholder: "Select favourite sport",
        label: "Favourite sport",
        multiple: true,
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
        label: "Comments",
        name: "comments",
        rows: 5,
        cols: 50,
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
        initialValues={{ accept_tos: false }}
        onSubmit={(data) => console.log(data)}
        validate={(values) => {
          return args.validate?.(
            values,
            args.fields || [],
            args.validators || [validateRequired],
          );
        }}
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

export const FormAllDisabled: Story = {
  // Every single `field` needs to have the `disabled` tag
  ...FormComponent,
  args: {
    ...FormComponent.args,
    fields: FormComponent.args?.fields?.map((field) => ({
      ...field,
      disabled: true,
    })),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstName = canvas.getByLabelText("First name");
    const lastName = canvas.getByLabelText("Last name");
    const age = canvas.getByLabelText("Age");
    const schoolYear = canvas.getByLabelText("Select school year", {
      exact: false,
    });
    const address = canvas.getByLabelText("Address");
    const address_addition = canvas.getByLabelText("Address (addition)");
    const dateOfBirth = canvas.getByLabelText("Date of birth", {
      exact: false,
    });
    const dateOfBirthFields = await within(
      dateOfBirth.parentElement as HTMLElement, // FIXME: Improve
    ).findAllByRole("textbox");
    const english = canvas.getByLabelText("English");
    const math = canvas.getByLabelText("Math");
    const yes = canvas.getByLabelText("Yes");
    const no = canvas.getByLabelText("No");
    const acceptTos = canvas.getByLabelText(
      "I have read and accept the terms and conditions",
    );

    //   We check that every single one of these has a disabled (or aria-disabled) tag
    await expect(firstName).toHaveAttribute("disabled");
    await expect(lastName).toHaveAttribute("disabled");
    await expect(age).toHaveAttribute("disabled");
    await expect(schoolYear).toHaveAttribute("disabled");
    await expect(address).toHaveAttribute("disabled");
    await expect(address_addition).toHaveAttribute("disabled");
    await expect(dateOfBirth).toHaveAttribute("disabled");
    await expect(dateOfBirthFields[0]).toHaveAttribute("disabled");
    await expect(dateOfBirthFields[1]).toHaveAttribute("disabled");
    await expect(dateOfBirthFields[2]).toHaveAttribute("disabled");
    await expect(english).toHaveAttribute("disabled");
    await expect(math).toHaveAttribute("disabled");
    await expect(yes).toHaveAttribute("disabled");
    await expect(no).toHaveAttribute("disabled");
    await expect(acceptTos).toHaveAttribute("disabled");

    // Aditionally, we want to check if all of these are indeed non-interactive, checking if we can either
    // 1. Type in it
    // 2. Select a value (if it's a select)
    // 3. Click a checkbox/radio (if checkbox/radio)

    await userEvent.type(firstName, "John", { delay: 10 });
    await expect(firstName).toHaveValue("");
    await userEvent.type(lastName, "Doe", { delay: 10 });
    await expect(lastName).toHaveValue("");
    await userEvent.type(age, "33", { delay: 10 });
    await expect(age).toHaveValue(null);
    await expect(schoolYear).toHaveStyle("pointer-events: none");
    await userEvent.type(address, "Keizersgracht 117", { delay: 10 });
    await expect(address).toHaveValue("");
    await userEvent.type(address_addition, "2", { delay: 10 });
    await expect(address_addition).toHaveValue(null);
    await userEvent.type(dateOfBirth, "15092023", { delay: 60 });
    await userEvent.type(dateOfBirth, "{enter}");
    await expect(dateOfBirth).toHaveValue("");
    await expect(english).toHaveStyle("pointer-events: none");
    await expect(math).toHaveStyle("pointer-events: none");
    await expect(yes).toHaveStyle("pointer-events: none");
    await expect(no).toHaveStyle("pointer-events: none");
    await expect(acceptTos).toHaveStyle("pointer-events: none");
  },
  render: (args) => {
    return (
      <Formik
        initialValues={{}}
        onSubmit={(data) => console.log(data)}
        validate={(values) =>
          args.validate &&
          args.validate(values, args.fields || [], args.validators || [])
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
