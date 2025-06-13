import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Container } from "../container";
import { Grid } from "../grid";
import { Column } from "./column";

const meta: Meta<typeof Column> = {
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnComponent: Story = {
  args: {
    debug: true,
    span: 1,
  },
};
