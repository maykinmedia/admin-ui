import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Outline } from "../icon";
import { Page } from "../layout";
import { Navbar } from "./navbar";

const meta: Meta<typeof Navbar> = {
  title: "Controls/Navbar",
  component: Navbar,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NavbarComponent: Story = {
  args: {
    items: [
      { children: <Outline.HomeIcon />, title: "Home" },
      "spacer",
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ],
  },
};
