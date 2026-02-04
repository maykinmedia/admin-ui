import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { P } from "../../components";
import { BaseTemplate as BaseTemplateComponent } from "./base";
import { BodyBaseTemplate as BodyBaseTemplateComponent } from "./bodyBase";
import { CardBaseTemplate as CardBaseTemplateComponent } from "./cardBase";

const meta: Meta<typeof BaseTemplateComponent> = {
  title: "Templates/Base",
  component: BaseTemplateComponent,
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
  render: (args) => <CardBaseTemplateComponent {...args} />,
};

export const BodyBaseTemplate: Story = {
  args: {
    children: <P>The quick brown fox jumps over the lazy dog.</P>,
  },
  render: (args) => <BodyBaseTemplateComponent {...args} />,
};
