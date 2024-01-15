import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import React from "react";

import { Button, ButtonLink } from "../button";
import { Outline } from "../icon";
import { Navbar } from "./navbar";

const meta = {
  title: "Controls/Navbar",
  component: Navbar,
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

export const NavbarOnMobile: Story = {
  ...NavbarComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Click opens, escape closes.
    await userEvent.click(button, { delay: 10 });
    await expect(canvas.getByRole("dialog")).toBeVisible();
    userEvent.keyboard("{Escape}", { delay: 10 });
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.click(button, { delay: 10 });
    await expect(canvas.getByRole("dialog")).toBeVisible();

    // Tab focuses items.
    await userEvent.tab({ delay: 10 });
    await userEvent.tab({ delay: 10 });
    await userEvent.tab({ delay: 10 });

    expect(canvas.getByRole("dialog")).toContainElement(
      document.activeElement as HTMLElement,
    );
  },
};
