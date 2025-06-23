import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { FORM_TEST_DECORATOR } from "../../../../.storybook/decorators";
import { DatePicker } from "./datepicker";

const meta = {
  title: "Form/Datepicker",
  component: DatePicker,
  argTypes: {
    onChange: {
      action: "onChange",
    },
  },
  parameters: {
    chromatic: { diffThreshold: 0.2 },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Date

export const DatepickerComponent: Story = {
  args: {
    type: "datepicker",
    name: "date",
    value: "2023-09-15",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByRole("textbox");
    let latestEventListenerEvent: Event | null = null;
    const spy = fn(
      (customEvent: Event) => (latestEventListenerEvent = customEvent),
    );
    input.addEventListener("change", spy);

    // Test click date.
    await userEvent.click(input, { delay: 10 });
    const startDate = canvas.getByText("14");
    await userEvent.click(startDate, { delay: 10 });

    await waitFor(testFormDataSerialization.bind(this, "2023-09-14"));
    await waitFor(testEventListener.bind(this, "2023-09-14"));

    // Test clear date.
    await userEvent.tab();
    const clearButton = canvas.getByRole("button");
    await userEvent.click(clearButton, { delay: 10 });

    await waitFor(testFormDataSerialization.bind(this, ""));
    await waitFor(testEventListener.bind(this, ""));

    // Test type date.
    await userEvent.type(input, "2023-09-15", { delay: 10 });

    async function testFormDataSerialization(expectedDate: string) {
      const pre = await canvas.findByRole("log");
      const data = JSON.parse(pre?.textContent || "{}");
      await expect(data.date).toBe(expectedDate);
    }

    async function testEventListener(expectedDate: string) {
      await expect(spy).toHaveBeenCalled();
      const input = latestEventListenerEvent?.target as HTMLInputElement;
      await expect(input.value).toBe(expectedDate);
    }
  },
};

export const DatePickerWithoutValue: Story = {
  ...DatepickerComponent,
  args: {
    ...DatepickerComponent.args,
    type: "datepicker",
  },
};

export const DatePickerWithDateAsValue: Story = {
  ...DatepickerComponent,
  args: {
    ...DatepickerComponent.args,
    type: "datepicker",
    value: new Date("2023-09-15"),
  },
};

export const DatePickerWithNumberAsValue: Story = {
  ...DatepickerComponent,
  args: {
    ...DatepickerComponent.args,
    type: "datepicker",
    value: 1694736000000,
  },
};

// Date Range

export const DateRangePicker: Story = {
  args: {
    name: "daterange",
    type: "daterangepicker",
    value: "2023-09-14/2023-09-15",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByRole("textbox");
    let latestEventListenerEvent: Event | null = null;
    const spy = fn(
      (customEvent: Event) => (latestEventListenerEvent = customEvent),
    );
    input.addEventListener("change", spy);

    // Test click date.
    await userEvent.click(input, { delay: 10 });
    const startDate = canvas.getByText("14");
    const endDate = canvas.getByText("15");
    await userEvent.click(startDate, { delay: 10 });
    await userEvent.click(endDate, { delay: 10 });

    await waitFor(
      testFormDataSerialization.bind(this, "2023-09-14/2023-09-15"),
    );
    await waitFor(testEventListener.bind(this, "2023-09-14/2023-09-15"));

    // Test clear date.
    await userEvent.tab();
    const clearButton = canvas.getByRole("button");
    await userEvent.click(clearButton, { delay: 10 });

    await waitFor(testFormDataSerialization.bind(this, ""));
    await waitFor(testEventListener.bind(this, ""));

    async function testFormDataSerialization(expectedDate: string) {
      const pre = await canvas.findByRole("log");
      const data = JSON.parse(pre?.textContent || "{}");
      await expect(data.daterange).toBe(expectedDate);
    }

    async function testEventListener(expectedDate: string) {
      await expect(spy).toHaveBeenCalled();
      const input = latestEventListenerEvent?.target as HTMLInputElement;
      await expect(input.value).toBe(expectedDate);
    }
  },
};

export const DateRangePickerWithoutValue: Story = {
  ...DateRangePicker,
  args: {
    ...DateRangePicker.args,
    type: "daterangepicker",
  },
};

export const DateRangePickerWithDatesAsValue: Story = {
  ...DateRangePicker,
  args: {
    ...DateRangePicker.args,
    type: "daterangepicker",
    value: [new Date("2023-09-14"), new Date("2023-09-15")],
  },
};
