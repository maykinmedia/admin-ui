import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button, ButtonLink } from "../button";
import { Outline } from "../icon";
import { A } from "../typography";
import { Toolbar } from "./toolbar";

const meta = {
  title: "Controls/Toolbar",
  component: Toolbar,
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToolbarComponent: Story = {
  args: {
    align: "end",
    children: (
      <>
        <Button variant="transparent">
          <Outline.PencilIcon />
          Zaaktypen
        </Button>

        <Button variant="transparent">
          <Outline.ClipboardDocumentIcon />
          Documenttypen
        </Button>

        <ButtonLink
          href="https://www.example.com"
          target="_blank"
          variant="transparent"
        >
          <Outline.UserIcon />
          Admin
        </ButtonLink>

        <Button variant="primary">
          <Outline.ArrowRightStartOnRectangleIcon />
          Uitloggen
        </Button>
      </>
    ),
  },
};

export const ToolbarOnMobile = {
  args: {
    align: "end",
    children: (
      <>
        <Button variant="transparent">
          <Outline.PencilIcon />
          Zaaktypen
        </Button>

        <Button variant="transparent">
          <Outline.ClipboardDocumentIcon />
          Documenttypen
        </Button>

        <ButtonLink
          href="https://www.example.com"
          target="_blank"
          variant="transparent"
        >
          <Outline.UserIcon />
          Admin
        </ButtonLink>

        <Button variant="primary">
          <Outline.ArrowRightStartOnRectangleIcon />
          Uitloggen
        </Button>
      </>
    ),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const VerticalToolbar: Story = {
  args: {
    direction: "vertical",
    children: (
      <>
        <Button variant="transparent">
          <Outline.PencilIcon />
          Zaaktypen
        </Button>

        <Button variant="transparent">
          <Outline.ClipboardDocumentIcon />
          Documenttypen
        </Button>

        <ButtonLink
          href="https://www.example.com"
          target="_blank"
          variant="transparent"
        >
          <Outline.UserIcon />
          Admin
        </ButtonLink>

        <Button variant="primary">
          <Outline.ArrowRightStartOnRectangleIcon />
          Uitloggen
        </Button>
      </>
    ),
  },
};

export const ToolbarWithLinks: Story = {
  args: {
    direction: "vertical",
    children: (
      <>
        <A href="https://www.example.com" target="_blank">
          Structuur
        </A>

        <A href="https://www.example.com" target="_blank">
          Basisinformatie
        </A>

        <A href="https://www.example.com" target="_blank">
          Statussen
        </A>

        <A href="https://www.example.com" target="_blank">
          Documenten
        </A>

        <A href="https://www.example.com" target="_blank">
          Rollen
        </A>

        <A href="https://www.example.com" target="_blank">
          Eigenshappen
        </A>

        <A href="https://www.example.com" target="_blank">
          Resultaten
        </A>

        <A href="https://www.example.com" target="_blank" active>
          Relaties
        </A>

        <A href="https://www.example.com" target="_blank">
          Objecten
        </A>
      </>
    ),
  },
};

export const MixedToolbar: Story = {
  args: {
    align: "center",
    direction: "vertical",
    padA: true,
    children: (
      <>
        <A href="https://www.example.com" target="_blank">
          <Outline.ArrowsRightLeftIcon />
          Relaties
        </A>

        <Button variant="transparent">
          <Outline.PencilIcon />
          Zaaktypen
        </Button>

        <ButtonLink
          href="https://www.example.com"
          target="_blank"
          variant="transparent"
        >
          <Outline.UserIcon />
          Admin
        </ButtonLink>
      </>
    ),
  },
};
