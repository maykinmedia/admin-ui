import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { FORM_TEST_DECORATOR } from "../../../../.storybook/decorators";
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
    await userEvent.tab();

    await expect(JSON.parse(log.textContent || "{}").date).toBe("2023-09-15");
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

    const inputs = await canvas.getAllByRole("textbox");

    await userEvent.type(inputs[0], "2023", { delay: 60 });
    await userEvent.type(inputs[1], "09", { delay: 60 });
    await userEvent.type(inputs[2], "15", { delay: 60 });
    await userEvent.tab();
    await expect(JSON.parse(log.textContent || "{}").date).toBe("2023-09-15");
  },
};
