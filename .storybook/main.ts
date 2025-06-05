import type { StorybookConfig } from "@storybook/react-webpack5";
import * as path from "path";

const config: StorybookConfig = {
  stories: [
    "../docs/**/*.mdx",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  staticDirs: [{ from: "./static", to: "/static" }],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-themes",
    "@storybook/addon-webpack5-compiler-swc",
    "@chromatic-com/storybook",
    "@storybook/addon-docs"
  ],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {},
    },
  },
  docs: {},
  webpackFinal: async (config) => {
    config?.module?.rules?.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            api: "modern",
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });

    // Add any other webpack config modifications here

    return config;
  },
};
export default config;
