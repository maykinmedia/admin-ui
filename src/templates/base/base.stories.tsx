import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { P } from "../../components";
import { BaseTemplate } from "./base";
import { BodyBaseTemplate } from "./bodyBase";
import { CardBaseTemplate } from "./cardBase";

const meta: Meta<typeof BaseTemplate> = {
  title: "Templates/Base",
  component: BaseTemplate,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const baseTemplate: Story = {
  args: {
    children: <P>The quick brown fox jumps over the lazy dog.</P>,
  },
};

export const cardBaseTemplate: Story = {
  args: {
    children: <P>The quick brown fox jumps over the lazy dog.</P>,
  },
  render: (args) => <CardBaseTemplate {...args} />,
};

export const bodyBaseTemplate: Story = {
  args: {
    children: <P>The quick brown fox jumps over the lazy dog.</P>,
  },
  render: (args) => <BodyBaseTemplate {...args} />,
};
