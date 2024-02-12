import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button, ButtonLink } from "../button";
import { Outline } from "../icon";
import { Page } from "../page";
import { Navbar } from "./navbar";

const meta = {
  title: "Controls/Navbar",
  component: Navbar,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NavbarComponent: Story = {
  args: {
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
