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
import { Option } from "../choicefield";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
  decorators: [PAGE_DECORATOR],
  render: ({ name = "select", ...args }) => (
    <Toolbar variant="transparent">
      <Select name={name} variant="normal" {...args} />
      <Select name={name + "-primary"} variant="primary" {...args} />
      <Select name={name + "secondary"} variant="secondary" {...args} />
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
  value: string | string[],
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
      await waitFor(() => assertFormValue(nativeSelect!, ""));
      await userEvent.click(clear, { delay: 10 });

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
      const clear = within(select).getByLabelText("Clear value");
      await userEvent.click(clear, { delay: 10 });

      // Test that event listener on the (custom) select gets called.
      await waitFor(expect(spy).toHaveBeenCalled);
      // Test that the native select value attributes has the correct value.
      await waitFor(() => assertNativeValue(nativeSelect!, ""));
      // Test that the FormData serialization returns the correct value.
      await waitFor(() => assertFormValue(nativeSelect!, []));

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
    const clear = canvas.getByLabelText("Clear value");

    await userEvent.click(clear, { delay: 10 });
  },
};

const ALL_COUNTRIES: Option[] = [
  { label: "Netherlands", value: "NL" },
  { label: "Germany", value: "DE" },
  { label: "Belgium", value: "BE" },
  { label: "France", value: "FR" },
  { label: "España", value: "ES" },
  { label: "Côte d’Ivoire", value: "CI" },
  { label: "Åland Islands", value: "AX" },
  { label: "Curaçao", value: "CW" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Switzerland", value: "CH" },
  { label: "Sweden", value: "SE" },
  { label: "Norway", value: "NO" },
  { label: "Denmark", value: "DK" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Czechia", value: "CZ" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Türkiye", value: "TR" },
  { label: "Greece", value: "GR" },
  { label: "Iceland", value: "IS" },
  { label: "Ireland", value: "IE" },
  { label: "Italy", value: "IT" },
  { label: "Austria", value: "AT" },
  { label: "Romania", value: "RO" },
  { label: "Bulgaria", value: "BG" },
  { label: "Hungary", value: "HU" },
  { label: "Lithuania", value: "LT" },
  { label: "Latvia", value: "LV" },
  { label: "Estonia", value: "EE" },
];

const getSelectOptionsAsync = async (inputValue) => {
  await new Promise((r) => setTimeout(r, 600));
  const normalize = (s: string) => s.toLowerCase();
  const q = normalize(inputValue ?? "");
  const filtered = ALL_COUNTRIES.filter((o) => {
    const label = normalize(String(o.label ?? ""));
    const val = normalize(String(o.value ?? ""));
    return label.includes(q) || val.includes(q);
  });
  return filtered.slice(0, 10);
};

export const AsyncOptions: Story = {
  args: {
    searchDebounceMs: 50,
    name: "country",
    placeholder: "Select country",
    fetchOnMount: false,
    options: getSelectOptionsAsync,
  },
  decorators: [FORM_TEST_DECORATOR],
  render: ({ name = "select", ...args }) => (
    <Select name={name} variant="normal" {...args} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    const nativeSelect =
      select.querySelector<HTMLSelectElement>("select[hidden]")!;

    await userEvent.click(select);
    const searchbox = within(select).getByRole("textbox");

    await userEvent.type(searchbox, "lan");
    await expect(
      await within(select).findByRole("status", { name: "Loading options..." }),
    ).toBeInTheDocument();

    const netherlands = await within(select).findByText("Netherlands");
    await userEvent.click(netherlands);

    await waitFor(() => assertNativeValue(nativeSelect, "NL"));
    await waitFor(() => assertFormValue(nativeSelect, "NL"));

    await userEvent.click(select);
    await userEvent.click(within(select).getByLabelText("Clear search"));

    const clear = within(select).getByLabelText("Clear value");
    await userEvent.click(clear);
    await waitFor(() => assertNativeValue(nativeSelect, ""));
    await waitFor(() => assertFormValue(nativeSelect, ""));
  },
};

export const AsyncOptionsMultiple: Story = {
  args: {
    searchDebounceMs: 50,
    name: "countries",
    placeholder: "Select countries",
    multiple: true,
    fetchOnMount: false,
    options: getSelectOptionsAsync,
  },
  decorators: [FORM_TEST_DECORATOR],
  render: ({ name = "select", ...args }) => (
    <Select name={name} variant="normal" {...args} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    const nativeSelect =
      select.querySelector<HTMLSelectElement>("select[hidden]")!;

    await userEvent.click(select);
    const searchbox = within(select).getByRole("textbox");

    await userEvent.type(searchbox, "lan", { delay: 200 });
    await expect(
      await within(select).findByRole("status", { name: "Loading options..." }),
    ).toBeInTheDocument();

    const netherlands = await within(select).findByText("Netherlands");
    const switzerland = await within(select).findByText("Switzerland");
    const iceland = await within(select).findByText("Iceland");

    await userEvent.click(netherlands);
    await userEvent.click(switzerland);
    await userEvent.click(iceland);

    await waitFor(() => assertNativeValue(nativeSelect, "NL"));
    await waitFor(() => assertFormValue(nativeSelect, ["NL", "CH", "IS"]));

    await userEvent.click(within(select).getByLabelText("Clear search"));

    const clear = within(select).getByLabelText("Clear value");
    await userEvent.click(clear);
    await waitFor(() => assertNativeValue(nativeSelect, ""));
    await waitFor(() => assertFormValue(nativeSelect, []));
  },
};

const getOptionsNoOptionsAsync = async (): Promise<Option[]> => {
  await new Promise((r) => setTimeout(r, 600));
  return [];
};

export const AsyncOptionsNoOptions: Story = {
  args: {
    name: "country",
    placeholder: "Select country",
    fetchOnMount: false,
    options: getOptionsNoOptionsAsync,
  },
  decorators: [FORM_TEST_DECORATOR],
  render: ({ name = "select", ...args }) => (
    <Select name={name} variant="normal" {...args} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");

    await userEvent.click(select);
    const searchbox = within(select).getByRole("textbox");

    await userEvent.type(searchbox, "zzzz");
    await expect(
      await within(select).findByRole("status", { name: "Loading options..." }),
    ).toBeInTheDocument();

    const empty = await within(select).findByText("No results");
    await expect(empty).toBeInTheDocument();

    await userEvent.click(within(select).getByLabelText("Clear search"));
  },
};
