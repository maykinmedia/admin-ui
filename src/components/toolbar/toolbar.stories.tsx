import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Button, ButtonLink } from "../button";
import { Outline } from "../icon";
import { A } from "../typography";
import { Toolbar } from "./toolbar";

const meta: Meta<typeof Toolbar> = {
  title: "Controls/Toolbar",
  component: Toolbar,
  decorators: [PAGE_DECORATOR],
};

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

export const TransparentToolbar: Story = {
  ...ToolbarComponent,
  args: {
    ...ToolbarComponent.args,
    variant: "transparent",
  },
};

export const VerticalToolbar: Story = {
  ...ToolbarComponent,
  args: {
    ...ToolbarComponent.args,
    direction: "vertical",
    variant: "transparent",
  },
};

export const ToolbarWithLinks: Story = {
  args: {
    direction: "vertical",
    variant: "transparent",
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
    align: "start",
    direction: "vertical",
    padA: true,
    variant: "transparent",
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

export const ToolbarWithItemsProp: Story = {
  args: {
    align: "start",
    items: [
      // Button
      {
        variant: "transparent",
        children: (
          <>
            <Outline.PencilIcon />
            Zaaktypen
          </>
        ),
      },

      // Button
      {
        variant: "transparent",
        children: (
          <>
            <Outline.ClipboardDocumentIcon />
            Documenttypen
          </>
        ),
      },

      // ButtonLink
      {
        variant: "transparent",
        children: (
          <>
            <Outline.UserIcon />
            Admin
          </>
        ),
        href: "https://www.example.com",
      },

      // Dropdown
      {
        label: (
          <>
            {" "}
            Click me!
            <Outline.EllipsisVerticalIcon />
          </>
        ),
        items: [
          {
            variant: "transparent",
            children: (
              <>
                <Outline.PencilIcon /> Zaaktypen
              </>
            ),
          },
          {
            variant: "transparent",
            children: (
              <>
                <Outline.ClipboardDocumentIcon /> Documenttypen
              </>
            ),
          },
          {
            href: "https://www.example.com",
            target: "_blank",
            variant: "transparent",
            children: (
              <>
                <Outline.UserIcon /> Admin
              </>
            ),
          },
          {
            variant: "transparent",
            children: (
              <>
                <Outline.ArrowRightStartOnRectangleIcon /> Uitloggen
              </>
            ),
          },
        ],
      },
    ],
  },
};
