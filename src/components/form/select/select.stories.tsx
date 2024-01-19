import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { Formik } from "formik";
import React, { useState } from "react";

import { Button } from "../../button";
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
      { label: "Junior", value: "JR", selected: true },
      { label: "Senior", value: "SR" },
      { label: "Graduate", value: "GR" },
    ],
    labelClear: "Clear value",
    name: "school_year",
    placeholder: "Select school year",
  },
  argTypes: {
    onChange: { action: "onChange" },
  },
  decorators: [
    (Story) => {
      // Solely here to force re-rendering story on change.
      const [count, setCount] = useState(0);

      const getData = () => {
        const form = document.forms[0];
        const formData = new FormData(form);

        // Convert FormData to JSON using Array.from and reduce
        return Array.from(formData.entries()).reduce<
          Record<string, FormDataEntryValue>
        >((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      };
      return (
        <form onChange={() => setCount(count + 1)} aria-label="form">
          <Story />
          <pre role="log">{JSON.stringify(getData())}</pre>
        </form>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    const clear = canvas.getByLabelText("Clear value");

    const spy = fn();
    select.addEventListener("change", spy);

    userEvent.click(select, { delay: 10 });
    const junior = await canvas.findByText("Junior");
    userEvent.click(junior, { delay: 10 });

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

export const UsageWithFormik: Story = {
  args: {
    options: [
      { label: "Freshman", value: "FR" },
      { label: "Sophomore", value: "SO" },
      { label: "Junior", value: "JR", selected: true },
      { label: "Senior", value: "SR" },
      { label: "Graduate", value: "GR" },
    ],
    labelClear: "Clear value",
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
              value={values.school_year}
              onChange={handleChange}
              {...args}
            ></Select>
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
