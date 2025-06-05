import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { Page } from "./page";

type PagePropsAndCustomArgs = React.ComponentProps<typeof Page> & {
  debug?: boolean;
};

const meta: Meta<typeof PagePropsAndCustomArgs> = {
  title: "Layout/Page",
  component: Page,
  parameters: {
    ignoreGlobalDecorator: true,
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<PagePropsAndCustomArgs>;

export const PageComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
