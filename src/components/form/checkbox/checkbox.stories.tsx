import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import { FORM_TEST_DECORATOR } from "../.storybook/decorators";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Form/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const CheckboxComponent: Story = {
  args: {
    children: "Click me!",
    name: "input",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const pre = await canvas.findByRole("log");
    const input = canvas.getByLabelText(args.children);
    let data;

    // On
    await userEvent.click(input);
    data = JSON.parse(pre?.textContent || "{}");
    await expect(data.input).toBe(args.value || "on");

    // Off
    await userEvent.click(input);
    data = JSON.parse(pre?.textContent || "{}");
    await expect(data.input).toBeUndefined();

    // On
    await userEvent.click(input);
    data = JSON.parse(pre?.textContent || "{}");
    await expect(data.input).toBe(args.value || "on");
  },
};
