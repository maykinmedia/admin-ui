import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import React from "react";

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
    items: [
      {
        as: "button",
        variant: "transparent",
        children: (
          <>
            <Outline.PencilIcon /> Zaaktypen
          </>
        ),
      },
      {
        as: "button",
        variant: "transparent",
        children: (
          <>
            <Outline.ClipboardDocumentIcon /> Documenttypen
          </>
        ),
      },
      {
        as: "button",
        variant: "transparent",
        children: (
          <>
            <Outline.UserIcon /> Admin
          </>
        ),
      },
      {
        as: "button",
        variant: "primary",
        children: (
          <>
            <Outline.ArrowRightStartOnRectangleIcon /> Uitloggen
          </>
        ),
      },
    ],
  },
};

export const NavbarOnMobile: Story = {
  ...NavbarComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: {
      viewports: ["mobile1"],
    },
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
