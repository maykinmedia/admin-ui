import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Container, Grid } from "../layout";
import { Column } from "../layout/column";
import { Logo } from "../logo";
import { Page } from "./page";

type PagePropsAndCustomArgs = React.ComponentProps<typeof Page> & {
  debug?: boolean;
};

const meta = {
  title: "Building Blocks/Page",
  component: Page,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<PagePropsAndCustomArgs>;

export default meta;
type Story = StoryObj<PagePropsAndCustomArgs>;

export const PageComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};

export const SamplePage: Story = {
  args: {
    debug: false,
  },
  render: ({ debug }) => (
    <Page>
      <Container debug={debug}>
        <Grid debug={debug}>
          <Column debug={debug} span={12}>
            <Logo
              href="/?path=/story/building-blocks-page--sample-page"
              hrefLabel="Navigate to story page"
              label="Maykin"
            />
          </Column>
        </Grid>
      </Container>
    </Page>
  ),
};
