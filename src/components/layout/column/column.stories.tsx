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
    <Container debug={args.debug} data-testid="Container">
      <Grid debug={args.debug} data-testid="Grid">
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
    debug: true,
    span: 1,
  },
};
