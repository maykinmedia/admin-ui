import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Login } from "../../templates";
import { ConfigContext, ConfigContextType } from "./config";

const meta: Meta<typeof ConfigContext> = {
  title: "Contexts/ConfigContext",
  // @ts-expect-error - not a component but a context
  component: ConfigContext,
};

export default meta;
type Story = StoryObj<typeof meta>;

const BASE_RENDER = (args: ConfigContextType) => (
  <ConfigContext.Provider value={args}>
    <Login
      fields={[
        {
          label: "Gebruikersnaam",
          name: "username",
        },
        {
          label: "Wachtwoord",
          name: "password",
        },
      ]}
    />
  </ConfigContext.Provider>
);

export const CustomLogo: Story = {
  args: {
    logo: (
      <img
        alt="Archief vernietings component logo"
        src="https://opengem.nl/documents/41/logo_TCNjZje.svg"
        width="100%"
      />
    ),
  },
  render: BASE_RENDER,
};

export const DebugMode: Story = {
  args: {
    debug: true,
  },
  render: BASE_RENDER,
};
