import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Page } from "../../layout";
import { Errors } from "./errors";

const meta: Meta<typeof Errors> = {
  title: "Building Blocks/ErrorsArray",
  component: Errors,
  decorators: [
    (Story) => (
      <Page pad={true}>
        <Story />
      </Page>
    ),
  ],
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
