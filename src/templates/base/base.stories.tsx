import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { P } from "../../components";
import { Base } from "./base";
import { BodyBase } from "./bodyBase";
import { CardBase } from "./cardBase";

const meta: Meta<typeof Base> = {
  title: "Templates/Base",
  component: Base,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseTemplate: Story = {
  args: {
    children: <P>The quick brown fox jumps over the lazy dog.</P>,
  },
};

export const CardBaseTemplate: Story = {
  args: {
    children: <P>The quick brown fox jumps over the lazy dog.</P>,
  },
  render: (args) => <CardBase {...args} />,
};

export const BodyBaseTemplate: Story = {
  args: {
    children: <P>The quick brown fox jumps over the lazy dog.</P>,
  },
  render: (args) => <BodyBase {...args} />,
};
