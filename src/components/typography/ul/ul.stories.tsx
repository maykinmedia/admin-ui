import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { A } from "../a";
import { LI } from "../li";
import { UL } from "./ul";

const meta = {
  title: "Typography/UL",
  component: UL,
} satisfies Meta<typeof UL>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ULComponent: Story = {
  args: {
    children: (
      <>
        <LI>
          <A href="https://www.lipsum.com/feed/html">
            Lorem ipsum dolor sit amet.
          </A>
          <UL>
            <LI>Lorem ipsum dolor siet amet.</LI>
          </UL>
        </LI>
        <LI>Consectetur adipiscing elit.</LI>
        <LI>Nullam non faucibus lorem, nec egestas ante.</LI>
      </>
    ),
  },
};
