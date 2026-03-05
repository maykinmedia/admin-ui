import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { FORM_TEST_DECORATOR } from "../../../../.storybook/decorators";
import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "Form/Toggle",
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const ToggleComponent: Story = {
  args: {
    children: "Toggle me!",
    name: "input",
    value: "true",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const pre = await canvas.findByRole("log");
    const input = canvas.getByLabelText(args.children as string);
    let data;

    // On
    await userEvent.click(input);
    data = JSON.parse(pre?.textContent || "{}");
    await expect(data.input).toBe(args.value || "true");

    // Off
    await userEvent.click(input);
    data = JSON.parse(pre?.textContent || "{}");
    await expect(data.input).toBeUndefined();

    // On
    await userEvent.click(input);
    data = JSON.parse(pre?.textContent || "{}");
    await expect(data.input).toBe(args.value || "true");
  },
};
