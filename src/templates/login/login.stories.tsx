import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoginTemplate } from "./login";

const meta: Meta<typeof LoginTemplate<{ username: string; password: string }>> =
  {
    title: "Templates/Login",
    component: LoginTemplate<{ username: string; password: string }>,
  };

export default meta;
type Story = StoryObj<typeof meta>;

export const loginTemplate: Story = {
  args: {
    formProps: {
      autoComplete: "off",
      fields: [
        {
          label: "Gebruikersnaam",
          name: "username",
        },
        {
          label: "Wachtwoord",
          name: "Password",
        },
      ],
      nonFieldErrors: ["Gebruikersnaam of wachtwoord onjuist"],
    },
    labelLogin: "Log in",
  },
};

export const WithOIDC: Story = {
  args: {
    formProps: {
      autoComplete: "off",
      fields: [
        {
          label: "Gebruikersnaam",
          name: "username",
        },
        {
          label: "Wachtwoord",
          name: "Password",
        },
      ],
    },
    urlOidcLogin: "http://example.nl/oidc/authenticate/",
    labelOidcLogin: "OIDC Login!",
  },
};
