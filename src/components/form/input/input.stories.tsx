import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { Formik } from "formik";
import * as React from "react";

import { Button } from "../../button";
import { Page } from "../../layout";
import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Form/Input",
  component: Input,
  play: async ({ canvasElement, args }) => {
    let input;
    let clearable = true;
    let testValue =
      args.value || args.placeholder?.replace("e.g. ", "") || "Hello world!";
    const canvas = within(canvasElement);

    switch (args.type) {
      case "checkbox":
        input = await canvas.getByRole("checkbox");
        clearable = false;
        testValue = args.value || "on";
        break;
      case "number":
        input = await canvas.getByRole("spinbutton");
        break;
      case "password":
        input = await canvas.getByPlaceholderText("Enter password");
        break;
      default:
        input = await canvas.getByRole("textbox");
        break;
    }

    const spy = fn();
    input.addEventListener("change", spy);

    await userEvent.click(input, { delay: 10 });
    await (clearable ? userEvent.clear(input) : userEvent.click(input));
    await userEvent.type(input, String(testValue));

    // Test that event listener on the (custom) select gets called.
    await waitFor(testEventListener);

    async function testEventListener() {
      await expect(spy).toHaveBeenCalled();
    }

    // Test that the FormData serialization returns the correct value.
    await waitFor(testFormDataSerialization, {
      timeout: String(testValue).length * 100,
    });

    async function testFormDataSerialization() {
      const pre = await canvas.findByRole("log");
      const data = JSON.parse(pre?.textContent || "{}");
      await expect(data.input).toBe(testValue);
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const InputComponent: Story = {
  args: {
    name: "input",
    placeholder: "e.g. John Doe",
    type: "text",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const InputTypeCheckbox: Story = {
  args: {
    name: "input",
    type: "checkbox",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const InputTypeColor: Story = {
  args: {
    name: "input",
    type: "color",
    value: "#00bfcb",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
  play: () => undefined,
};

// TODO: DateInput.
export const InputTypeDate: Story = {
  args: {
    name: "input",
    placeholder: "e.g. 15-09-2023",
    type: "date",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  play: () => undefined,
};

export const InputTypeEmail: Story = {
  args: {
    name: "input",
    placeholder: "e.g. johndoe@example.com",
    type: "email",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

// TODO: FileInput.
export const InputTypeFile: Story = {
  args: {
    name: "input",
    type: "file",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
  play: () => undefined,
};

export const InputTypeNumber: Story = {
  args: {
    name: "input",
    placeholder: "e.g. 3",
    type: "number",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const InputTypePassword: Story = {
  args: {
    name: "input",
    placeholder: "Enter password",
    type: "password",
    value: "p4$$w0rd",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const InputTypeTel: Story = {
  args: {
    name: "input",
    placeholder: "e.g. +31 (0)20 753 05 23",
    type: "tel",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const InputTypeUrl: Story = {
  args: {
    name: "input",
    type: "Url",
    placeholder: "e.g. https://www.maykinmedia.nl",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const InputWithCustomSize: Story = {
  args: {
    name: "input",
    placeholder: "e.g. 1015CJ",
    size: 6,
    type: "text",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const TransparentInput: Story = {
  args: {
    name: "input",
    placeholder: "e.g. John Doe",
    type: "text",
    variant: "transparent",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [
    FORM_TEST_DECORATOR,
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
};

export const UsageWithFormik: Story = {
  args: {
    name: "input",
    placeholder: "e.g. John Doe",
    type: "text",
  },
  argTypes: {
    validate: { action: "validate" },
    onSubmit: { action: "onSubmit" },
  },
  render: (args) => {
    return (
      <Formik
        initialValues={{ input: "" }}
        validate={action("validate")}
        onSubmit={action("onSubmit")}
      >
        {({ handleChange, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Input
              value={values.input}
              onChange={handleChange}
              {...args}
            ></Input>
            <pre role="log">{JSON.stringify(values)}</pre>
            <Button type="submit">Verzenden</Button>
          </form>
        )}
      </Formik>
    );
  },
  decorators: [(Story) => <Story />],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    userEvent.clear(input);
    userEvent.click(input, { delay: 10 });
    userEvent.type(input, "John Doe");

    // Test that the FormData serialization returns the correct value.
    await waitFor(testFormikSerialization);

    async function testFormikSerialization() {
      const pre = await canvas.findByRole("log");
      const data = JSON.parse(pre?.textContent || "{}");
      await expect(data.input).toBe("John Doe");
    }
  },
};
