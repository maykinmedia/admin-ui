import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

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
        order: ['Manual', ['Introduction', 'Internationalization', 'Design tokens', 'Release Procedure']]
      },
    }
  },

  decorators: [
    withThemeByClassName({
      themes: {
        system: "view--system",
        light: "view--light",
        dark: "view--dark",
      },
      defaultTheme: "light",
    }) as any,
  ],

  tags: ["autodocs"]
};

export default preview;
