import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import * as React from "react";

import { Body, H1, H2, H3, P } from "../typography";
import { Bool } from "./bool";

const meta = {
  title: "Icon/Bool",
  component: Bool,
} satisfies Meta<typeof Bool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const True: Story = {
  args: {
    value: true,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const boolean = canvas.getByLabelText("Yes");
    expect(boolean).toBeVisible();
    expect(boolean.children).toHaveLength(1);
  },
};

export const False: Story = {
  args: {
    value: false,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const boolean = canvas.getByLabelText("No");
    expect(boolean).not.toBeVisible();
    expect(boolean.children).toHaveLength(1);
  },
};

export const ExplicitFalse: Story = {
  args: {
    explicit: true,
    value: false,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const boolean = canvas.getByLabelText("No");
    expect(boolean).toBeVisible();
    expect(boolean.children).toHaveLength(1);
  },
};

export const BooleanInText: Story = {
  args: {
    value: true,
  },
  render: (args) => (
    <Body>
      <H1>
        The quick brown fox jumps over the lazy dog <Bool {...args} />
      </H1>
      <H2>
        The quick brown fox jumps over the lazy dog <Bool {...args} />
      </H2>
      <H3>
        The quick brown fox jumps over the lazy dog <Bool {...args} />
      </H3>
      <P size="s">
        The quick brown fox jumps over the lazy dog{" "}
        <Bool {...args} value={false} explicit />
      </P>
      <P size="xs">
        The quick brown fox jumps over the lazy dog <Bool {...args} />
      </P>
    </Body>
  ),
};
