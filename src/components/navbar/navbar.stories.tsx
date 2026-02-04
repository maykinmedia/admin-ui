import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Outline } from "../icon";
import { Navbar } from "./navbar";

const meta: Meta<typeof Navbar> = {
  title: "Building Blocks/Navbar",
  component: Navbar,
  decorators: [PAGE_DECORATOR],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NavbarComponent: Story = {
  args: {
    items: [
      {
        componentType: "button",
        children: <Outline.HomeIcon />,
        title: "Home",
      },
      "spacer",
      {
        componentType: "button",
        children: <Outline.CogIcon />,
        title: "Instellingen",
      },
      {
        componentType: "button",
        children: <Outline.ArrowRightOnRectangleIcon />,
        title: "Uitloggen",
      },
    ],
  },
};
