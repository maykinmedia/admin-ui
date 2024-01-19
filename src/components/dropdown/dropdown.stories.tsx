import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import React from "react";

import { Button, ButtonLink } from "../button";
import { Outline } from "../icon";
import { Page } from "../page";
import { Toolbar } from "../toolbar";
import { Dropdown } from "./dropdown";

const meta = {
  title: "Controls/Dropdown",
  component: Dropdown,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText("Click me!");

    // Click opens, escape closes.
    await userEvent.click(button, { delay: 10 });
    await expect(canvas.getByRole("dialog")).toBeVisible();
    userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.click(button, { delay: 10 });
    await expect(canvas.getByRole("dialog")).toBeVisible();

    // Tab focuses items.
    await userEvent.tab({ delay: 10 });
    await userEvent.tab({ delay: 10 });
    await userEvent.tab({ delay: 10 });

    expect(canvas.getAllByRole("dialog").findLast((v) => v)).toContainElement(
      document.activeElement as HTMLElement,
    );
  },
} satisfies Meta<typeof Dropdown>;

const DEFAULT_CHILDREN = (
  <Toolbar direction="vertical">
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

    <Button variant="transparent">
      <Outline.ArrowRightStartOnRectangleIcon />
      Uitloggen
    </Button>
  </Toolbar>
);

export default meta;
type Story = StoryObj<typeof meta>;

export const DropdownComponent: Story = {
  args: {
    label: (
      <>
        Click me!
        <Outline.EllipsisVerticalIcon />
      </>
    ),
    children: DEFAULT_CHILDREN,
  },
};

export const DropdownOnMobile: Story = {
  ...DropdownComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const ActivateOnHover: Story = {
  args: {
    activateOnHover: true,
    label: (
      <>
        Hover me!
        <Outline.EllipsisVerticalIcon />
      </>
    ),
    children: DEFAULT_CHILDREN,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText("Hover me!");

    // Click opens, escape closes.
    await userEvent.hover(button, { delay: 10 });
    await expect(canvas.getByRole("dialog")).toBeVisible();
    userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.hover(button, { delay: 10 });
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

export const ActivateOnFocus: Story = {
  ...ActivateOnHover,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click opens, escape closes.
    await userEvent.tab({ delay: 10 });
    await expect(canvas.getByRole("dialog")).toBeVisible();
    userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.tab({ shift: true, delay: 10 });
    await userEvent.tab({ delay: 10 });
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

export const DropdownVariant: Story = {
  args: {
    label: (
      <>
        Click me!
        <Outline.EllipsisVerticalIcon />
      </>
    ),
    variant: "transparent",
    children: DEFAULT_CHILDREN,
  },
};

export const HorizontalDropdown: Story = {
  args: {
    label: (
      <>
        Click me!
        <Outline.EllipsisHorizontalIcon />
      </>
    ),
    children: (
      <Toolbar direction="horizontal">
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

        <Button variant="transparent">
          <Outline.ArrowRightStartOnRectangleIcon />
          Uitloggen
        </Button>
      </Toolbar>
    ),
  },
};

export const DropdownInToolbar: Story = {
  args: {
    label: (
      <>
        Click me!
        <Outline.EllipsisVerticalIcon />
      </>
    ),
    children: DEFAULT_CHILDREN,
  },
  render: (args) => (
    <Toolbar align="end">
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

      <Button variant="transparent">
        <Outline.ArrowRightStartOnRectangleIcon />
        Uitloggen
      </Button>
      <Dropdown {...args} />
    </Toolbar>
  ),
};

export const NestedDropdown: Story = {
  args: {
    label: (
      <>
        Click me!
        <Outline.EllipsisVerticalIcon />
      </>
    ),
    variant: "primary",
    children: (
      <Toolbar direction="vertical">
        <Button variant="transparent">
          <Outline.PencilIcon />
          Zaaktypen
        </Button>

        <Button variant="transparent">
          <Outline.ClipboardDocumentIcon />
          Documenttypen
        </Button>

        <Dropdown
          activateOnHover={true}
          label={
            <>
              <Outline.EllipsisVerticalIcon />
              Hover me!
            </>
          }
          placement="right"
          variant="transparent"
        >
          <Toolbar direction="vertical">
            <ButtonLink
              href="https://www.example.com"
              target="_blank"
              variant="transparent"
            >
              <Outline.UserIcon />
              Admin
            </ButtonLink>

            <Button variant="transparent">
              <Outline.ArrowRightStartOnRectangleIcon />
              Uitloggen
            </Button>
          </Toolbar>
        </Dropdown>
      </Toolbar>
    ),
  },
};
