import type { Meta, StoryObj } from "@storybook/react-vite";

import { Value, ValueProps } from "./value";

const meta: Meta<typeof Value> = {
  title: "Data/Value",
  component: Value,
  argTypes: {
    editable: {
      control: "boolean",
      description:
        "Whether the value should be editable (defaults to field.editable)",
    },
    field: {
      control: "object",
      description: "The form field to show when editing",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Boolean: Story = {
  args: {
    value: true,
  },
} as Story;

export const Number: Story = {
  args: {
    value: 2,
  },
} as Story;

export const String: Story = {
  args: {
    value: "Afvalpas vervangen",
  },
} as Story;

export const Link: Story = {
  args: {
    value: "https://www.example.com",
  } as ValueProps,
} as Story;

export const Null = {
  args: {
    value: null,
  },
} as Story;

export const Editable = {
  args: {
    editing: true,
    error: "Please enter valid value",
    value: "John Doe",
    field: {
      editable: true,
      name: "name",
      type: "string",
    },
    formControlProps: {
      forceShowError: true,
    },
  },
} as Story;
