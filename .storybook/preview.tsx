import {
  withThemeByClassName,
  withThemeByDataAttribute,
} from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-webpack5";

import "../src/index.scss";
import { allModes } from "./modes";

const preview: Preview = {
  parameters: {
    chromatic: {
      modes: {
        "light desktop": allModes["light desktop"],
        "light mobile": allModes["light mobile"],
        "dark desktop": allModes["dark desktop"],
        "dark mobile": allModes["dark mobile"],
      },
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/i,
        },
      },
      layout: "fullscreen",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "Manual",
          [
            "Introduction",
            "Internationalization",
            "Design tokens",
            "Release Procedure",
          ],
        ],
      },
    },
  },

  decorators: [
    withThemeByDataAttribute({
      attributeName: "data-mode",
      parentSelector: "html",
      themes: {
        light: "light",
        dark: "dark",
        system: "system",
      },
      defaultTheme: "light",
    }) as any,
  ],

  tags: ["autodocs"],
};

export default preview;
