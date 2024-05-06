import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { A } from "../a";
import { Li } from "../li";
import { Ul } from "./ul";

const meta: Meta<typeof Ul> = {
  title: "Typography/Ul",
  component: Ul,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UlComponent: Story = {
  args: {
    children: (
      <>
        <Li>
          <A href="https://www.lipsum.com/feed/html">
            Lorem ipsum dolor sit amet.
          </A>
          <Ul>
            <Li>Lorem ipsum dolor siet amet.</Li>
          </Ul>
        </Li>
        <Li>Consectetur adipiscing elit.</Li>
        <Li>Nullam non faucibus lorem, nec egestas ante.</Li>
      </>
    ),
  },
};
