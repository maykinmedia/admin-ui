import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent } from "storybook/test";

import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "Brand/Logo",
  component: Logo,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LogoComponent: Story = {
  args: {
    href: "/?path=/story/brand-logo--logo-component",
  },
};

export const LogoAnimatesOnHoverAndClick: Story = {
  ...LogoComponent,
  play: async () => {
    await userEvent.tab({ delay: 10 });
  },
};
