import type { Meta, StoryObj } from "@storybook/react";

import { Login } from "./login";

const meta = {
  title: "Templates/Login",
  component: Login,
  argTypes: { onSubmit: { action: "onSubmit" } },
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginTemplate: Story = {
  args: {
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
    labelSubmit: "Log in",
    nonFieldErrors: ["Gebruikersnaam of wachtwoord onjuist"],
  },
};
