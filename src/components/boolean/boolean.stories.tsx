import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Body, H1, H2, H3, P } from "../typography";
import { Boolean } from "./boolean";

const meta = {
  title: "Icon/Boolean",
  component: Boolean,
} satisfies Meta<typeof Boolean>;

export default meta;
type Story = StoryObj<typeof meta>;

export const True: Story = {
  args: {
    value: true,
    labelTrue: "This value is true",
    labelFalse: "This value is false",
  },
};

export const False: Story = {
  args: {
    value: false,
    labelTrue: "This value is true",
    labelFalse: "This value is false",
  },
};

export const ExplicitFalse: Story = {
  args: {
    explicit: true,
    value: false,
    labelTrue: "This value is true",
    labelFalse: "This value is false",
  },
};

export const BooleanInText: Story = {
  args: {
    value: true,
    labelTrue: "This value is true",
    labelFalse: "This value is false",
  },
  render: (args) => (
    <Body>
      <H1>
        The quick brown fox jumps over the lazy dog <Boolean {...args} />
      </H1>
      <H2>
        The quick brown fox jumps over the lazy dog <Boolean {...args} />
      </H2>
      <H3>
        The quick brown fox jumps over the lazy dog <Boolean {...args} />
      </H3>
      <P size="s">
        The quick brown fox jumps over the lazy dog{" "}
        <Boolean {...args} value={false} explicit />
      </P>
      <P size="xs">
        The quick brown fox jumps over the lazy dog <Boolean {...args} />
      </P>
    </Body>
  ),
};
