import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { A } from "../a";
import { Li } from "../li";
import { Ol } from "./ol";

const meta = {
  title: "Typography/Ol",
  component: Ol,
} satisfies Meta<typeof Ol>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OlComponent: Story = {
  args: {
    children: (
      <>
        <Li>
          <A href="https://www.lipsum.com/feed/html">
            Lorem ipsum dolor sit amet.
          </A>
          <Ol>
            <Li>Lorem ipsum dolor siet amet.</Li>
          </Ol>
        </Li>
        <Li>Consectetur adipiscing elit.</Li>
        <Li>Nullam non faucibus lorem, nec egestas ante.</Li>
      </>
    ),
  },
};
