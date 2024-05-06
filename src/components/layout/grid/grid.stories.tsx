import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Container } from "../container";
import { Grid } from "./grid";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <Container debug={args.debug}>
      <Grid {...args}></Grid>
    </Container>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GridComponent: Story = {
  args: {
    "data-testid": "Grid",
    debug: true,
  },
};
