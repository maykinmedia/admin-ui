import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Outline } from "../icon";
import { Page } from "../layout";
import { Navbar } from "./navbar";

const meta = {
  title: "Controls/Navbar",
  component: Navbar,
  decorators: [
    (Story) => (
      <Page pad={true}>
        <Story />
      </Page>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NavbarComponent: Story = {
  args: {
    items: [
      { children: <Outline.HomeIcon />, title: "Home" },
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ],
  },
};
