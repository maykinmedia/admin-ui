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
import { Toolbar } from "../../toolbar";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
  decorators: [PAGE_DECORATOR],
  render: ({ name = "select", ...args }) => (
    <Toolbar variant="transparent">
      <Select name={name} variant="normal" {...args} />
      <Select name={name + "-accent"} variant="accent" {...args} />
      <Select name={name + "-transparent"} variant="transparent" {...args} />
    </Toolbar>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Assert `select`s native value.
 * @param select
 */
async function assertNativeValue(select: HTMLSelectElement, value: string) {
  await expect(select.value).toBe(value);
}

/**
 * Assert `select`s serialized form value.
 * @param select
 */
async function assertFormValue(
  select: HTMLSelectElement,
  value: string | string[] | undefined,
) {
  const pre = await within(document.body).findByRole("log");
  const data = JSON.parse(pre?.textContent || "{}");
  await expect(data[select.name]).toEqual(value);
}

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
    const selects = canvas.getAllByRole("combobox");

    for (const select of selects) {
      const nativeSelect =
        select.querySelector<HTMLSelectElement>("select[hidden]");
      const spy = fn();
      select.addEventListener("change", spy);

      await userEvent.click(select, { delay: 10 });
      const junior = await within(select).findByText("Junior");
      await userEvent.click(junior, { delay: 10 });

      // Test that event listener on the (custom) select gets called.
      await waitFor(expect(spy).toHaveBeenCalled);
      // Test that the native select value attributes has the correct value.
      await waitFor(() => assertNativeValue(nativeSelect!, "JR"));
      // Test that the FormData serialization returns the correct value.
      await waitFor(() => assertFormValue(nativeSelect!, "JR"));

      const clear = within(select).getByLabelText("Clear value");
      await userEvent.click(clear, { delay: 10 });

      // Test that event listener on the (custom) select gets called.
      await waitFor(expect(spy).toHaveBeenCalled);
      // Test that the native select value attributes has the correct value.
      await waitFor(() => assertNativeValue(nativeSelect!, ""));
      // Test that the FormData serialization returns the correct value.
      await waitFor(() => assertFormValue(nativeSelect!, undefined));

      await userEvent.click(select, { delay: 10 });
      const junior2 = await within(select).findByText("Junior");
      await userEvent.click(junior2, { delay: 10 });
    }
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selects = canvas.getAllByRole("combobox");

    for (const select of selects) {
      const nativeSelect =
        select.querySelector<HTMLSelectElement>("select[hidden]");
      assertNativeValue(nativeSelect!, "JR");
    }
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selects = canvas.getAllByRole("combobox");

    for (const select of selects) {
      const nativeSelect =
        select.querySelector<HTMLSelectElement>("select[hidden]");
      assertNativeValue(nativeSelect!, "Junior");
    }
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selects = canvas.getAllByRole("combobox");

    for (const select of selects) {
      const nativeSelect =
        select.querySelector<HTMLSelectElement>("select[hidden]");
      const clear = within(select).getByLabelText("Clear value");

      const spy = fn();
      select.addEventListener("change", spy);

      await userEvent.click(select, { delay: 10 });
      await userEvent.click(await within(select).findByText("Football"));
      await userEvent.click(await within(select).findByText("Tennis"));
      await userEvent.click(await within(select).findByText("Running"));
      await userEvent.click(await within(select).findByText("Cycling"));

      // Test that event listener on the (custom) select gets called.
      await waitFor(expect(spy).toHaveBeenCalled);
      // Test that the native select value attributes has the correct value.
      await waitFor(() => assertNativeValue(nativeSelect!, "football"));
      // Test that the FormData serialization returns the correct value.
      await waitFor(() =>
        assertFormValue(nativeSelect!, [
          "football",
          "tennis",
          "running",
          "cycling",
        ]),
      );

      await userEvent.click(clear, { delay: 10 });

      // Test that event listener on the (custom) select gets called.
      await waitFor(expect(spy).toHaveBeenCalled);
      // Test that the native select value attributes has the correct value.
      await waitFor(() => assertNativeValue(nativeSelect!, ""));
      // Test that the FormData serialization returns the correct value.
      await waitFor(() => assertFormValue(nativeSelect!, undefined));

      await userEvent.click(select, { delay: 10 });
      await userEvent.click(await within(select).findByText("Football"));
      await userEvent.click(await within(select).findByText("Tennis"));
      await userEvent.click(await within(select).findByText("Running"));
      await userEvent.click(await within(select).findByText("Cycling"));

      // Close dropdown.
      await userEvent.click(canvasElement);
    }
  },
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
            <Button type="submit">Verzenden</Button>
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
