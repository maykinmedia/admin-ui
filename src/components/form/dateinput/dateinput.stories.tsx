import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { DateInput } from "./dateinput";

const meta = {
  title: "Form/DateInput",
  component: DateInput,
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateInputComponent: Story = {
  args: {
    name: "date",
  },
  decorators: [FORM_TEST_DECORATOR],
};

export const SeparatedInputs: Story = {
  args: {
    name: "date",
    format: "DDMMYYYY",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole("log");

    const day = await canvas.getAllByRole("textbox")[0];
    const month = await canvas.getAllByRole("textbox")[1];
    const year = await canvas.getAllByRole("textbox")[2];

    await userEvent.type(day, "15", { delay: 60 });
    await userEvent.type(month, "09", { delay: 60 });
    await userEvent.type(year, "2023", { delay: 60 });

    await expect(JSON.parse(log.textContent || "{}").date).toBe("2023-09-15");
  },
};

export const ContinuousTyping: Story = {
  args: {
    name: "date",
    format: "DDMMYYYY",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole("log");

    const input = await canvas.getAllByRole("textbox")[0];

    await userEvent.type(input, "15092023", { delay: 60 });
    await expect(JSON.parse(log.textContent || "{}").date).toBe("2023-09-15");
  },
};

export const ClearSections: Story = {
  args: {
    name: "date",
    format: "DDMMYYYY",
    value: "2023-09-15",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const day = await canvas.getAllByRole("textbox")[0];
    const year = await canvas.getAllByRole("textbox")[2];
    const log = canvas.getByRole("log");

    await userEvent.click(year);
    await userEvent.keyboard("{Backspace}", { delay: 60 });
    await userEvent.keyboard("{Backspace}", { delay: 60 });
    await userEvent.keyboard("{Backspace}", { delay: 60 });

    await expect(document.activeElement).toBe(day);
    await userEvent.type(day, "02081988", { delay: 60 });
    await expect(JSON.parse(log.textContent || "{}").date).toBe("1988-08-02");
  },
};

export const IsoFormat: Story = {
  args: {
    name: "date",
    format: "YYYYMMDD",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole("log");

    const input = await canvas.getAllByRole("textbox")[0];

    await userEvent.type(input, "20230915", { delay: 60 });
    await expect(JSON.parse(log.textContent || "{}").date).toBe("2023-09-15");
  },
};
