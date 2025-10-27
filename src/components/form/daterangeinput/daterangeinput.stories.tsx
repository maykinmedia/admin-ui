import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

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
    await userEvent.tab();

    await waitFor(() =>
      expect(JSON.parse(log.textContent || "{}").date).toBe(
        "1988-08-02/2023-09-15",
      ),
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

    const inputs = await canvas.getAllByRole("textbox");
    await userEvent.type(inputs[0], "15", { delay: 60 });
    await userEvent.type(inputs[1], "09", { delay: 60 });
    await userEvent.type(inputs[2], "2023", { delay: 60 });

    await userEvent.type(inputs[3], "02", { delay: 60 });
    await userEvent.type(inputs[4], "08", { delay: 60 });
    await userEvent.type(inputs[5], "1988", { delay: 60 });
    await userEvent.tab();

    await waitFor(() =>
      expect(JSON.parse(log.textContent || "{}").date).toBe(
        "1988-08-02/2023-09-15",
      ),
    );
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
    await userEvent.type(inputs[0], "1988", { delay: 60 });
    await userEvent.type(inputs[1], "08", { delay: 60 });
    await userEvent.type(inputs[2], "02", { delay: 60 });

    await userEvent.type(inputs[3], "2023", { delay: 60 });
    await userEvent.type(inputs[4], "09", { delay: 60 });
    await userEvent.type(inputs[5], "15", { delay: 60 });
    await userEvent.tab();

    await waitFor(() =>
      expect(JSON.parse(log.textContent || "{}").date).toBe(
        "1988-08-02/2023-09-15",
      ),
    );
  },
};
