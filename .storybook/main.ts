import type { StorybookConfig } from "@storybook/react-vite";

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
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
  ],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
