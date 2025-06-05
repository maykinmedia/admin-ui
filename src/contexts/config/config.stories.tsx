import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { LoginTemplate } from "../../templates";
import { ConfigContext, ConfigContextType } from "./config";

const Component: React.FC = (args: ConfigContextType) => (
  <ConfigContext.Provider value={args}>
    <LoginTemplate
      formProps={{
        fields: [
          {
            label: "Gebruikersnaam",
            name: "username",
          },
          {
            label: "Wachtwoord",
            name: "password",
          },
        ],
      }}
    />
  </ConfigContext.Provider>
);
const meta: Meta<typeof Component> = {
  title: "Contexts/ConfigContext",
  component: Component,
};

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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TemplatesContentOnly: Story = {
  args: {
    templatesContentOnly: true,
  },
};

export const DebugMode: Story = {
  args: {
    debug: true,
  },
};
