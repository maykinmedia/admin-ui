import type { Meta, StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/test";

import { Logo } from "./logo";

const meta = {
  title: "Brand/Logo",
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LogoComponent: Story = {
  args: {
    href: "/?path=/story/components-logo--logo-component",
    hrefLabel: "Navigate to logo component page.",
    label: "Maykin logo",
  },
};

export const LogoAnimatesOnHoverAndClick: Story = {
  args: {
    href: "#",
    hrefLabel: "Navigate to logo component page.",
    label: "Maykin logo",
  },
  play: async () => {
    await userEvent.tab({ delay: 10 });
  },
};
