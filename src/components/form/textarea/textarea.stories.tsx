import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import * as React from "react";
import { action } from "storybook/actions";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  FORM_TEST_DECORATOR,
  PAGE_DECORATOR,
} from "../../../../.storybook/decorators";
import { Button } from "../../button";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Form/Textarea",
  component: Textarea,
  play: async ({ canvasElement, args }) => {
    const testValue =
      args.children || args.placeholder?.replace("e.g. ", "") || "Hello world!";
    const canvas = within(canvasElement);

    const textarea = await canvas.getByRole("textbox");

    const spy = fn();
    textarea.addEventListener("change", spy);

    await userEvent.click(textarea, { delay: 10 });
    await userEvent.clear(textarea);
    await userEvent.type(textarea, String(testValue));

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
      await expect(data.textarea).toBe(testValue);
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const TextareaComponent: Story = {
  args: {
    name: "textarea",
    placeholder: "e.g. John Doe",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
};

export const Padding: Story = {
  args: {
    name: "textarea",
    placeholder: "e.g. John Doe",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  render: (args) => {
    return (
      <>
        <Textarea {...args} pad={true} value="Normal padding" />
        <br />
        <br />
        <Textarea {...args} pad="h" value="Horizontal padding" />
        <br />
        <br />
        <Textarea {...args} pad="v" value="Vertical padding" />
        <br />
        <br />
        <Textarea {...args} pad={false} value="No padding" />
      </>
    );
  },
  play: () => undefined,
};

export const Size: Story = {
  args: {
    name: "textarea",
    placeholder: "e.g. John Doe",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  render: (args) => {
    return (
      <>
        <Textarea {...args} size="xl" value="xl" />
        <br />
        <br />
        <Textarea {...args} size="s" value="s" />
        <br />
        <br />
        <Textarea {...args} size="xs" value="xs" />
        <br />
        <br />
        <Textarea {...args} size="xxs" value="xxs" />
      </>
    );
  },
  play: () => undefined,
};

export const TransparentTextarea: Story = {
  args: {
    name: "textarea",
    placeholder: "e.g. John Doe",
    variant: "transparent",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR, PAGE_DECORATOR],
};

export const UsageWithFormik: Story = {
  args: {
    name: "input",
    placeholder: "e.g. John Doe",
  },
  argTypes: {
    // @ts-expect-error - validate not on type.
    validate: { action: "validate" },
    onSubmit: { action: "onSubmit" },
  },
  // @ts-expect-error - remove actions.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ validate, onSubmit, ...args }) => {
    return (
      <Formik
        initialValues={{ input: "" }}
        validate={action("validate")}
        onSubmit={action("onSubmit")}
      >
        {({ handleChange, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Textarea onChange={handleChange} {...args} />
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

    await userEvent.clear(input);
    await userEvent.click(input, { delay: 10 });
    await userEvent.type(input, "John Doe");

    // Test that the FormData serialization returns the correct value.
    await waitFor(testFormikSerialization);

    async function testFormikSerialization() {
      const pre = await canvas.findByRole("log");
      const data = JSON.parse(pre?.textContent || "{}");
      await expect(data.input).toBe("John Doe");
    }
  },
};
