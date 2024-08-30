import type { Meta, StoryObj } from "@storybook/react";

import { LoginTemplate } from "./login";

const meta: Meta<typeof LoginTemplate> = {
  title: "Templates/Login",
  component: LoginTemplate,
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

export const loginTemplateWithBackground: Story = {
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
    labelLogin: "Log in",
    backgroundImageUrl:
      "https://s3-alpha-sig.figma.com/img/18d5/48c4/f78435ff97a760d6c9433645c785f392?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MFKwLX5b6hitZ-uchYo3jmmQD4cpkCdj3czvBiQ93Fxw6BNpTpm4mrPkt6RqEfr6eE2gUQJ~qZjOOdrm2sRmwQmz1XXaLC41eDGcXrvr478IL39PjsrpRX4lsetP2lBGO0wtWu3nVl-9-ubqGqA1qY~2PmnOhAjZ7BiQ4IQRTfe6IT3BN3Ty7wfeIFP8tvyMrsTPE1vNgwBgfC8G~N0cCJ7uuxwv9T-54FFpDvDKQb~Dd2svIGIoUFfl8~E~AMUtPyVLFmUdeDXuK4yUyiwTWtncIPnA~GgeI~em0L~OYmqbh-otzZgWBTLngDZxzUhjyYIKkYGI3sNGYeW8oyGygQ__",
  },
};
