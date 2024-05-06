import type { Meta } from "@storybook/react";
import * as React from "react";

import { Column } from "./column";
import { Container } from "./container";
import { Grid } from "./grid";

const meta: Meta<typeof Column> = {
  title: "Layout/Reference",
  render: (args) => (
    <Container debug={args.debug}>
      <Grid debug={args.debug}>
        <Column span={12} debug={args.debug}></Column>

        <Column span={6} debug={args.debug}></Column>
        <Column span={6} debug={args.debug}></Column>

        <Column span={4} debug={args.debug}></Column>
        <Column span={4} debug={args.debug}></Column>
        <Column span={4} debug={args.debug}></Column>

        <Column span={3} debug={args.debug}></Column>
        <Column span={3} debug={args.debug}></Column>
        <Column span={3} debug={args.debug}></Column>
        <Column span={3} debug={args.debug}></Column>

        <Column span={2} debug={args.debug}></Column>
        <Column span={2} debug={args.debug}></Column>
        <Column span={2} debug={args.debug}></Column>
        <Column span={2} debug={args.debug}></Column>
        <Column span={2} debug={args.debug}></Column>
        <Column span={2} debug={args.debug}></Column>

        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
        <Column span={1} debug={args.debug}></Column>
      </Grid>
    </Container>
  ),
  parameters: {
    chromatic: {
      diffThreshold: 0.9,
    },
  },
};

export default meta;

export const ReferenceLayoutDesktop = {
  args: {
    debug: true,
  },
};

export const ReferenceLayoutMobile = {
  args: {
    debug: true,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const SampleLayout = {
  args: {
    debug: true,
  },
  render: (args: { debug: boolean }) => (
    <Container debug={args.debug}>
      <Grid debug={args.debug}>
        <Column span={12} debug={args.debug} data-testid="Header"></Column>

        <Column
          span={10}
          debug={args.debug}
          data-testid="Main content"
        ></Column>

        <Column span={2} debug={args.debug} data-testid="Sidebar"></Column>

        <Column span={12} debug={args.debug} data-testid="Footer"></Column>
      </Grid>
    </Container>
  ),
};
