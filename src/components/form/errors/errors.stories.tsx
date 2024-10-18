import type { Meta, StoryObj } from "@storybook/react";

import { PAGE_DECORATOR } from "../../../../.storybook/decorators";
import { Errors } from "./errors";

const meta: Meta<typeof Errors> = {
  title: "Building Blocks/ErrorsArray",
  component: Errors,
  decorators: [PAGE_DECORATOR],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorsComponent: Story = {
  args: {
    errors: "Oh no! Something went wrong!",
  },
};
