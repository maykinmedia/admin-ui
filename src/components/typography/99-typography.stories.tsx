import type { Meta } from "@storybook/react";
import * as React from "react";

import { H1 } from "./h1";
import { H2 } from "./h2";
import { H3 } from "./h3";
import { P } from "./p";

const meta: Meta = {
  title: "Typography/Reference",
  render: (args) => (
    <>
      <H1>{args.children}</H1>
      <H2>{args.children}</H2>
      <H3>{args.children}</H3>
      <P size="s">{args.children}</P>
      <P size="xs">{args.children}</P>
    </>
  ),
};

export default meta;

export const Sizes = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
