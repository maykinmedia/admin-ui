import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button, ButtonLink } from "../button";
import { Body, H1, H2, H3, P } from "../typography";
import { Outline, Solid } from "./icon";

const meta = {
  title: "Icon/Icon",
  parameters: {
    docs: {
      description: {
        component: `Heroicons (https://heroicons.com/) are used for this project, wrappers are provided by the icon
        component which finalizes the styling. Please use the wrapped versions instead of importing Heroicons directly.

    import { Outline, Solid } from "maykin-ui/icon";
    <Outline.AcademicCapIcon label="Academic Cap"/>
    <Solid.AcademicCapIcon label="Academic Cap"/>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  args: {},
  render: () => {
    return (
      <>
        <h4>Outline</h4>
        {Object.entries(Outline).map(([name, Icon]) => (
          <Icon key={name} label={name} title={name} />
        ))}

        <h4>Solid</h4>
        {Object.entries(Solid).map(([name, Icon]) => (
          <Icon key={name} label={name} title={name} />
        ))}
      </>
    );
  },
};

export const IconsInButtons: Story = {
  args: {},
  render: () => {
    return (
      <>
        <Button>
          <Outline.AcademicCapIcon label="Academic Cap" />
          Click me!
        </Button>
        <Button variant="transparent">
          <Outline.AcademicCapIcon label="Academic Cap" />
          Click me!
        </Button>
        <ButtonLink href="https://www.example.com" target="_blank">
          <Outline.AcademicCapIcon label="Academic Cap" />
          Click me!
        </ButtonLink>
        <ButtonLink
          href="https://www.example.com"
          target="_blank"
          variant="transparent"
        >
          <Outline.AcademicCapIcon label="Academic Cap" />
          Click me!
        </ButtonLink>
      </>
    );
  },
};

export const IconsInTypographicComponents: Story = {
  args: {},
  render: () => {
    return (
      <Body>
        <H1>
          <Outline.AcademicCapIcon label="Academic Cap" />
          The quick brown fox jumps over the lazy dog.
        </H1>
        <H2>
          <Outline.AcademicCapIcon label="Academic Cap" />
          The quick brown fox jumps over the lazy dog.
        </H2>
        <H3>
          <Outline.AcademicCapIcon label="Academic Cap" />
          The quick brown fox jumps over the lazy dog.
        </H3>
        <P size="s">
          <Outline.AcademicCapIcon label="Academic Cap" />
          The quick brown fox jumps over the lazy dog.
        </P>
        <P size="xs">
          <Outline.AcademicCapIcon label="Academic Cap" />
          The quick brown fox jumps over the lazy dog.
        </P>
      </Body>
    );
  },
};
