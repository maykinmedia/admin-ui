import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { A } from "../a";
import { H1 } from "../h1";
import { H2 } from "../h2";
import { H3 } from "../h3";
import { Hr } from "../hr";
import { Li } from "../li";
import { Ol } from "../ol";
import { P } from "../p";
import { Ul } from "../ul";
import { Body } from "./body";

const meta: Meta<typeof Body> = {
  title: "Typography/Body",
  component: Body,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BodyComponent: Story = {
  args: {
    children: (
      <>
        <H1>Lorem ipsum dolor sit ament</H1>
        <Hr />
        <P>
          <A href="https://www.lipsum.com/feed/html" target="_blank">
            Lorem ipsum
          </A>{" "}
          dolor sit amet, consectetur adipiscing elit. Nullam non faucibus
          lorem, nec egestas ante. Donec in erat nec ligula pulvinar dictum in
          at nunc. Ut placerat, metus nec condimentum tincidunt, mauris lectus
          bibendum est, id sagittis leo orci tincidunt ligula. Suspendisse ut
          nunc at diam commodo placerat.
        </P>

        <H2>Lorem ipsum dolor sit ament</H2>
        <P>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non
          faucibus lorem, nec egestas ante. Donec in erat nec ligula pulvinar
          dictum in at nunc. Ut placerat, metus nec condimentum tincidunt,
          mauris lectus bibendum est, id sagittis leo orci tincidunt ligula.
          Suspendisse ut nunc at diam commodo placerat. Sed a ligula nec felis
          ornare feugiat. Praesent eu mauris in nunc pellentesque congue. Proin
          vulputate non augue ac fermentum. Etiam placerat commodo maximus.
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Praesent lobortis ultrices enim, ut dignissim
          felis molestie ut. Sed urna quam, venenatis eu orci eget, iaculis
          vehicula eros. Nam eget ornare nulla. Quisque aliquam ultrices elit et
          viverra.
        </P>

        <H3>Lorem ipsum dolor sit ament</H3>
        <P>Lorem ipsum dolor sit amet.</P>

        <Ul>
          <Li>
            <A href="https://www.lipsum.com/feed/html" target="_blank">
              Lorem ipsum dolor sit amet.
            </A>
          </Li>
          <Li>Consectetur adipiscing elit.</Li>
          <Li>Nullam non faucibus lorem, nec egestas ante.</Li>
        </Ul>

        <Ol>
          <Li>
            <A href="https://www.lipsum.com/feed/html" target="_blank">
              Lorem ipsum dolor sit amet.
            </A>
          </Li>
          <Li>Consectetur adipiscing elit.</Li>
          <Li>Nullam non faucibus lorem, nec egestas ante.</Li>
        </Ol>

        <P muted size="xs">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non
          faucibus lorem, nec egestas ante. Donec in erat nec ligula pulvinar
          dictum in at nunc. Ut placerat, metus nec condimentum tincidunt,
          mauris lectus bibendum est, id sagittis leo orci tincidunt ligula.
          Suspendisse ut nunc at diam commodo placerat.
        </P>
      </>
    ),
  },
};
