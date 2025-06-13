import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { FORM_TEST_DECORATOR } from "../../../../.storybook/decorators";
import { RadioGroup } from "./radiogroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Form/Radio",
  component: RadioGroup,
};
export default meta;
type Story = StoryObj<typeof meta>;

const FORM_TEST_ARG_TYPES = {
  onChange: { action: "onChange" },
};

export const RadioGroupComponent: Story = {
  args: {
    name: "school_year",
    options: [
      { label: "Freshman", selected: true },
      { label: "Sophomore" },
      { label: "Junior" },
      { label: "Senior" },
      { label: "Graduate" },
    ],
  },
  argTypes: FORM_TEST_ARG_TYPES,
  decorators: [FORM_TEST_DECORATOR],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pre = await canvas.findByRole("log");
    const inputs = canvas.getAllByRole("radio");
    let data;

    await inputs.reduce(
      (promises, input) =>
        promises.then(() => userEvent.click(input, { delay: 10 })),
      Promise.resolve(),
    );

    data = JSON.parse(pre?.textContent || "{}");

    await expect(data.school_year).toEqual("Graduate");

    await inputs
      .filter((_, i) => i % 2 !== 0)
      .reduce(
        (promises, input) =>
          promises.then(() => userEvent.click(input, { delay: 10 })),
        Promise.resolve(),
      );

    data = JSON.parse(pre?.textContent || "{}");
    await expect(data.school_year).toEqual("Senior");
  },
};
