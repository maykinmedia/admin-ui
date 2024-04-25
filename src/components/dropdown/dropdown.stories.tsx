import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import * as React from "react";

import { Button, ButtonLink } from "../button";
import { Outline } from "../icon";
import { Page } from "../layout";
import { Toolbar } from "../toolbar";
import { Dropdown } from "./dropdown";

const meta = {
  title: "Controls/Dropdown",
  component: Dropdown,
  decorators: [
    (Story) => (
      <Page pad={true}>
        <Story />
      </Page>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    lastButtonText: "Uitloggen",
  },
  play: async ({ canvasElement, parameters }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText("Click me!");

    // Click opens, escape closes.
    await userEvent.click(button, { delay: 10 });
    await expect(await canvas.findByRole("dialog")).toBeVisible();
    userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.click(button, { delay: 10 });

    await waitFor(async () => {
      const _list = document.activeElement?.closest(
        '[role="dialog"]',
      ) as HTMLElement;
      const buttons = await within(_list).findAllByRole("button");
      const lastButton = buttons[buttons.length - 1];
      const lastButtonActive = document.activeElement === lastButton;

      if (!lastButtonActive) {
        await userEvent.tab({ delay: 10 });
        throw new Error("Last button not selected");
      }
    });

    if (parameters.lastButtonText) {
      await expect(document.activeElement?.textContent).toBe(
        parameters.lastButtonText,
      );
    }
  },
} satisfies Meta<typeof Dropdown>;

const DEFAULT_CHILDREN = (
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

    <Button variant="transparent">
      <Outline.ArrowRightStartOnRectangleIcon />
      Uitloggen
    </Button>
  </>
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
  play: async ({ canvasElement, parameters }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText("Hover me!");

    // Click opens, escape closes.
    await userEvent.hover(button, { delay: 10 });
    await waitFor(() => canvas.findByRole("dialog"), { timeout: 300 });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.hover(button, { delay: 10 });

    await waitFor(async () => {
      const _list = document.activeElement?.closest(
        '[role="dialog"]',
      ) as HTMLElement;
      const buttons = await within(_list).findAllByRole("button");
      const lastButton = buttons[buttons.length - 1];
      const lastButtonActive = document.activeElement === lastButton;

      if (!lastButtonActive) {
        await userEvent.tab({ delay: 10 });
        throw new Error("Last button not selected");
      }
    });

    if (parameters.lastButtonText) {
      await expect(document.activeElement?.textContent).toBe(
        parameters.lastButtonText,
      );
    }
  },
};

export const ActivateOnFocus: Story = {
  ...ActivateOnHover,
  play: async ({ canvasElement, parameters }) => {
    const canvas = within(canvasElement);
    const button = await canvas.getByText("Hover me!");

    // Click opens, escape closes.
    await userEvent.tab({ delay: 10 });
    button.focus();
    await waitFor(() => canvas.findByRole("dialog"), { timeout: 300 });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.tab({ shift: true, delay: 10 });
    await userEvent.tab({ delay: 10 });

    await waitFor(async () => {
      const _list = document.activeElement?.closest(
        '[role="dialog"]',
      ) as HTMLElement;
      const buttons = await within(_list).findAllByRole("button");
      const lastButton = buttons[buttons.length - 1];
      const lastButtonActive = document.activeElement === lastButton;

      if (!lastButtonActive) {
        await userEvent.tab({ delay: 10 });
        throw new Error("Last button not selected");
      }
    });

    if (parameters.lastButtonText) {
      await expect(document.activeElement?.textContent).toBe(
        parameters.lastButtonText,
      );
    }
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
    toolbarProps: {
      direction: "horizontal",
    },
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

        <Button variant="transparent">
          <Outline.ArrowRightStartOnRectangleIcon />
          Uitloggen
        </Button>
      </>
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
      <>
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
      </>
    ),
  },
};

export const DropdownWithItemsProp: Story = {
  args: {
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
            <Outline.PencilIcon />
            Zaaktypen
          </>
        ),
      },
      {
        variant: "transparent",
        children: (
          <>
            <Outline.ClipboardDocumentIcon />
            Documenttypen
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
            <Outline.ArrowRightStartOnRectangleIcon />
            Uitloggen
          </>
        ),
      },
    ],
  },
};
