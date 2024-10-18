import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import { FORM_TEST_DECORATOR } from "../../../../.storybook/decorators";
import { DateRangeInput } from "./daterangeinput";

const meta = {
  title: "Form/DateRangeInput",
  component: DateRangeInput,
  argTypes: {
    onChange: {
      action: "onChange",
    },
  },
} satisfies Meta<typeof DateRangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateRangeInputComponent: Story = {
  args: {
    name: "daterange",
    value: "1988-08-02/2023-09-15",
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

    const dayStart = await canvas.getAllByRole("textbox")[0];
    const monthStart = await canvas.getAllByRole("textbox")[1];
    const yearStart = await canvas.getAllByRole("textbox")[2];

    await userEvent.type(dayStart, "02", { delay: 60 });
    await userEvent.type(monthStart, "08", { delay: 60 });
    await userEvent.type(yearStart, "1988", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    const dayEnd = await canvas.getAllByRole("textbox")[3];
    const monthEnd = await canvas.getAllByRole("textbox")[4];
    const yearEnd = await canvas.getAllByRole("textbox")[5];

    await userEvent.type(dayEnd, "15", { delay: 60 });
    await userEvent.type(monthEnd, "09", { delay: 60 });
    await userEvent.type(yearEnd, "2023", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    await expect(JSON.parse(log.textContent || "{}").date).toBe(
      "1988-08-02/2023-09-15",
    );
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

    const inputStart = await canvas.getAllByRole("textbox")[0];
    await userEvent.type(inputStart, "02081988", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    const inputEnd = await canvas.getAllByRole("textbox")[3];
    await userEvent.type(inputEnd, "15092023", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    await expect(JSON.parse(log.textContent || "{}").date).toBe(
      "1988-08-02/2023-09-15",
    );
  },
};

export const NormalizeStartEnd: Story = {
  args: {
    name: "date",
    format: "DDMMYYYY",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole("log");

    const inputStart = await canvas.getAllByRole("textbox")[0];
    await userEvent.type(inputStart, "15092023", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    const inputEnd = await canvas.getAllByRole("textbox")[3];
    await userEvent.type(inputEnd, "02081988", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    await expect(JSON.parse(log.textContent || "{}").date).toBe(
      "1988-08-02/2023-09-15",
    );
  },
};

export const ClearSections: Story = {
  args: {
    name: "date",
    format: "DDMMYYYY",
    value: "1988-08-02/2023-09-15",
  },
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole("log");

    const dayEnd = await canvas.getAllByRole("textbox")[3];
    const yearEnd = await canvas.getAllByRole("textbox")[5];

    await userEvent.click(yearEnd);
    await userEvent.keyboard("{Backspace}", { delay: 60 });
    await userEvent.keyboard("{Backspace}", { delay: 60 });
    await userEvent.keyboard("{Backspace}", { delay: 60 });

    await expect(document.activeElement).toBe(dayEnd);

    const dayStart = await canvas.getAllByRole("textbox")[0];
    const yearStart = await canvas.getAllByRole("textbox")[2];

    await userEvent.click(yearStart);
    await userEvent.keyboard("{Backspace}", { delay: 60 });
    await userEvent.keyboard("{Backspace}", { delay: 60 });
    await userEvent.keyboard("{Backspace}", { delay: 60 });

    await expect(document.activeElement).toBe(dayStart);

    await userEvent.click(yearEnd);
    await userEvent.tab({ delay: 60 });
    await expect(JSON.parse(log.textContent || "{}").date).toBe("");
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

    const inputStart = await canvas.getAllByRole("textbox")[0];
    await userEvent.type(inputStart, "19880802", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    const inputEnd = await canvas.getAllByRole("textbox")[3];
    await userEvent.type(inputEnd, "20230915", { delay: 60 });
    await userEvent.tab({ delay: 60 });

    await expect(JSON.parse(log.textContent || "{}").date).toBe(
      "1988-08-02/2023-09-15",
    );
  },
};
