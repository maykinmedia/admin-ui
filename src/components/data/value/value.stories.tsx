import type { Meta, StoryObj } from "@storybook/react";

import { Value } from "./value";

const meta: Meta<typeof Value> = {
  title: "Data/Value",
  component: Value,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Boolean: Story = {
  args: {
    value: true,
  },
};

export const Number: Story = {
  args: {
    value: 2,
  },
};

export const String: Story = {
  args: {
    value: "Afvalpas vervangen",
  },
};

export const Link: Story = {
  args: {
    value: "https://www.example.com",
  },
};

export const Null: Story = {
  args: {
    value: null,
  },
};
