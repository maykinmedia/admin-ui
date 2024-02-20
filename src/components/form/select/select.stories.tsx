import { action } from "@storybook/addon-actions";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { Formik } from "formik";
import * as React from "react";

import { Button } from "../../button";
import { Page } from "../../page";
import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { Select } from "./select";

const meta = {
  title: "Form/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectComponent: Story = {
  args: {
    options: [
      { label: "Freshman", value: "FR" },
      { label: "Sophomore", value: "SO" },
      { label: "Junior", value: "JR" },
      { label: "Senior", value: "SR" },
      { label: "Graduate", value: "GR" },
    ],
    name: "school_year",
    placeholder: "Select school year",
  },
  argTypes: {
    onChange: { action: "onChange" },
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    const clear = canvas.getByLabelText("Clear value");

    const spy = fn();
    select.addEventListener("change", spy);

    await userEvent.click(select, { delay: 10 });
    const junior = await canvas.findByText("Junior");
    await userEvent.click(junior, { delay: 10 });

    // Test that event listener on the (custom) select gets called.
    await waitFor(testEventListener);

    async function testEventListener() {
      await expect(spy).toHaveBeenCalled();
    }

    // Test that the native select value attributes has the correct value.
    await waitFor(testNativeSelectValue);

    async function testNativeSelectValue() {
      const form = await canvas.findByRole("form");
      const nativeSelect =
        form.querySelector<HTMLSelectElement>("select[hidden]");
      await expect(nativeSelect?.value).toBe("JR");
    }

    // Test that the FormData serialization returns the correct value.
    await waitFor(testFormDataSerialization);

    async function testFormDataSerialization() {
      const pre = await canvas.findByRole("log");
      const data = JSON.parse(pre?.textContent || "{}");
      await expect(data.school_year).toBe("JR");
    }

    await userEvent.click(clear, { delay: 10 });
  },
};

export const TransparentSelect = {
  ...SelectComponent,
  args: { ...SelectComponent.args, variant: "transparent" },
  decorators: [
    ...(SelectComponent.decorators as StoryFn[]),
    (Story: StoryFn) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
};

export const UsageWithFormik: Story = {
  args: {
    options: [
      { label: "Freshman", value: "FR" },
      { label: "Sophomore", value: "SO" },
      { label: "Junior", value: "JR" },
      { label: "Senior", value: "SR" },
      { label: "Graduate", value: "GR" },
    ],
    name: "school_year",
    placeholder: "Select school year",
  },
  argTypes: {
    // @ts-expect-error - Using FormikProps here while SelectProps is expected.
    validate: { action: "validate" },
    onSubmit: { action: "onSubmit" },
  },
  render: (args) => {
    return (
      <Formik
        initialValues={{ school_year: null }}
        validate={action("validate")}
        onSubmit={action("onSubmit")}
      >
        {({ handleChange, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Select
              {...args}
              value={values.school_year}
              onChange={(e) => handleChange(e)}
            ></Select>
            <pre role="log">{JSON.stringify(values)}</pre>
            <Button type="submit">Verzenden</Button>;
          </form>
        )}
      </Formik>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    const clear = canvas.getByLabelText("Clear value");

    userEvent.click(select, { delay: 10 });
    const junior = await canvas.findByText("Junior");
    userEvent.click(junior, { delay: 10 });

    // Test that the FormData serialization returns the correct value.
    await waitFor(testFormikSerialization);

    async function testFormikSerialization() {
      const pre = await canvas.findByRole("log");
      const data = JSON.parse(pre?.textContent || "{}");
      await expect(data.school_year).toBe("JR");
    }

    await userEvent.click(clear, { delay: 10 });
  },
};

export const ValueBasedOnOptionValue: Story = {
  args: {
    options: [
      { label: "Freshman", value: "FR" },
      { label: "Sophomore", value: "SO" },
      { label: "Junior", value: "JR" },
      { label: "Senior", value: "SR" },
      { label: "Graduate", value: "GR" },
    ],
    name: "school_year",
    placeholder: "Select school year",
    value: "JR",
  },
};

export const ValueBasedOnOptionLabel: Story = {
  args: {
    options: [
      { label: "Freshman" },
      { label: "Sophomore" },
      { label: "Junior" },
      { label: "Senior" },
      { label: "Graduate" },
    ],
    name: "school_year",
    placeholder: "Select school year",
    value: "Junior",
  },
};
