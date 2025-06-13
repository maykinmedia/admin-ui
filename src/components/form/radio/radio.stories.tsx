import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { FORM_TEST_DECORATOR } from "../../../../.storybook/decorators";
import { Radio } from "./radio";

const meta: Meta<typeof Radio> = {
  title: "Form/Radio",
  component: Radio,
};

export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const RadioComponent: Story = {
  args: {
    children: "Click me!",
    name: "input",
    value: "on",
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const pre = await canvas.findByRole("log");
    const input = canvas.getByLabelText(args.children as string);

    // On
    await userEvent.click(input);
    const data = JSON.parse(pre?.textContent || "{}");
    await expect(data.input).toBe(args.value || "on");
  },
};
