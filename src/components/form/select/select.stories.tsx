import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import * as React from "react";
import { action } from "storybook/actions";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  FORM_TEST_DECORATOR,
  PAGE_DECORATOR,
} from "../../../../.storybook/decorators";
import { Button } from "../../button";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
};

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

export const TransparentSelect: Story = {
  ...SelectComponent,
  args: { ...SelectComponent.args, variant: "transparent" },
  decorators: [...(SelectComponent.decorators as StoryFn[]), PAGE_DECORATOR],
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
    // @ts-expect-error - validate not on type.
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

export const Padding: Story = {
  args: {
    options: [
      { label: "Normal padding" },
      { label: "Horizontal padding" },
      { label: "Vertical padding" },
      { label: "No padding" },
    ],
    name: "school_year",
    placeholder: "Select school year",
    value: "Junior",
  },
  render: (args) => {
    return (
      <>
        <Select {...args} pad={true} value="Normal padding" />
        <br />
        <br />
        <Select {...args} pad="h" value="Horizontal padding" />
        <br />
        <br />
        <Select {...args} pad="v" value="Vertical padding" />
        <br />
        <br />
        <Select {...args} pad={false} value="No padding" />
      </>
    );
  },
};

export const SelectSingle: Story = {
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
  decorators: [FORM_TEST_DECORATOR],
};

export const SelectMultiple: Story = {
  args: {
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
    multiple: true,
  },
  decorators: [FORM_TEST_DECORATOR],
};
