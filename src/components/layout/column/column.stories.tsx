import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Container } from "../container";
import { Grid } from "../grid";
import { Column } from "./column";

const meta = {
  title: "Layout/Column",
  component: Column,
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <Container debug={args.debug}>
      <Grid debug={args.debug}>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
        <Column {...args}></Column>
      </Grid>
    </Container>
  ),
} satisfies Meta<typeof Column>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    debug: true,
    span: 1,
  },
};
