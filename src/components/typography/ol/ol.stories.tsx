import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { A } from "../a";
import { LI } from "../li";
import { OL } from "./ol";

const meta = {
  title: "Typography/OL",
  component: OL,
} satisfies Meta<typeof OL>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OLComponent: Story = {
  args: {
    children: (
      <>
        <LI>
          <A href="https://www.lipsum.com/feed/html">
            Lorem ipsum dolor sit amet.
          </A>
          <OL>
            <LI>Lorem ipsum dolor siet amet.</LI>
          </OL>
        </LI>
        <LI>Consectetur adipiscing elit.</LI>
        <LI>Nullam non faucibus lorem, nec egestas ante.</LI>
      </>
    ),
  },
};
