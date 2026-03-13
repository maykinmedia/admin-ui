import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { Decorator, Preview } from "@storybook/react-vite";
import React from "react";

import "../src/index.scss";
import { allModes } from "./modes";

export const THEMES = {
  "Blue suede shoes": "blue-suede-shoes",
  "Purple rain": "purple-rain",
  "Paint it black (dark mode)": "paint-it-black",
  system: "",
} as const;

export type ThemeMap = typeof THEMES;
export type ThemeName = keyof ThemeMap;
export type ThemeId = ThemeMap[ThemeName];

const preview: Preview = {
  parameters: {
    chromatic: {
      modes: {
        "light desktop": allModes["light desktop"],
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
      themes: THEMES,
      defaultTheme: "Blue suede shoes",
    }),
    (Story, { globals }: { globals: { theme?: ThemeName | "" } }) => {
      const nodeId = "theme-tokens";
      const current = document.getElementById(nodeId);
      current?.parentNode?.removeChild(current);

      if (globals.theme && globals.theme !== "system") {
        const themeId = THEMES[globals.theme];

        const href = `/static/${themeId}.css`;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.append(link);
      }
      return <Story />;
    },
  ] satisfies Decorator[],

  tags: ["autodocs"],
};

export default preview;
