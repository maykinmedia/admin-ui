import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Container, Grid } from "../layout";
import { Column } from "../layout/column";
import { Logo } from "../logo";
import { Page } from "./page";

const meta = {
  title: "Building Blocks/Page",
  component: Page,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};

export const SamplePage: Story = {
  args: {
    children: (
      <Container>
        <Grid>
          <Column span={12}>
            <Logo
              href="/?path=/story/building-blocks-page--sample-page"
              hrefLabel="Navigate to story page"
              label="Maykin"
            />
          </Column>
        </Grid>
      </Container>
    ),
  },
};
