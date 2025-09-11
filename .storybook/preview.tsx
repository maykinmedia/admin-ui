import { withThemeByDataAttribute } from "@storybook/addon-themes";
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
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-mode",
      parentSelector: "html",
    }),
  ],

  tags: ["autodocs"],
};

export default preview;
