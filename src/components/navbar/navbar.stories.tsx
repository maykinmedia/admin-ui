import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import * as React from "react";

import { allModes } from "../../../.storybook/modes";
import { Button, ButtonLink } from "../button";
import { Outline } from "../icon";
import { Page } from "../layout";
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
  parameters: {
    chromatic: {
      modes: {
        "light desktop": allModes["light desktop"],
        "dark desktop": allModes["dark desktop"],
      },
    },
  },
};

export const NavbarOnMobile: Story = {
  ...NavbarComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: {
      modes: {
        "light mobile": allModes["light mobile"],
        "dark mobile": allModes["dark mobile"],
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Hamburger menu not supported on desktop.
    if (window?.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Click opens, escape closes.
    await userEvent.click(button, { delay: 10 });
    await expect(canvas.getByRole("dialog")).toBeVisible();
    await userEvent.keyboard("{Escape}", { delay: 10 });
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
