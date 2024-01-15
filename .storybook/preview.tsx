import type { Preview } from "@storybook/react";
import * as React from "react";

import { Page } from "../src";

const preview: Preview = {
  decorators: [
    (Story, { parameters }) => {
      return parameters.ignoreGlobalDecorator ? (
        <Story />
      ) : (
        <Page>
          <Story />
        </Page>
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
};

export default preview;
