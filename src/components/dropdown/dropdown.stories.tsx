import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import React from "react";

import { Outline } from "../icon";
import { Page } from "../page";
import { Toolbar } from "../toolbar";
import { Dropdown, DropdownProps } from "./dropdown";

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

const DEFAULT_ARGS = {
  toolbarProps: {
    direction: "vertical",
  },
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
      as: "buttonLink",
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
      as: "button",
      variant: "transparent",
      children: (
        <>
          <Outline.ArrowRightStartOnRectangleIcon /> Uitloggen
        </>
      ),
    },
  ],
} satisfies Omit<DropdownProps, "label">;

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
    ...DEFAULT_ARGS,
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
    ...DEFAULT_ARGS,
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
    ...DEFAULT_ARGS,
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
    toolbarProps: { direction: "horizontal" },
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
        as: "buttonLink",
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
        as: "button",
        variant: "transparent",
        children: (
          <>
            <Outline.ArrowRightStartOnRectangleIcon /> Uitloggen
          </>
        ),
      },
    ],
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
    ...DEFAULT_ARGS,
  },
  render: (args) => (
    <Toolbar
      align="end"
      items={[
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
          as: "buttonLink",
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
          as: "button",
          variant: "transparent",
          children: (
            <>
              <Outline.ArrowRightStartOnRectangleIcon /> Uitloggen
            </>
          ),
        },
        {
          as: "custom",
          children: <Dropdown {...args} />,
        },
      ]}
    />
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
    toolbarProps: { direction: "vertical" },
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
        as: "custom",
        children: (
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
            items={[
              {
                as: "buttonLink",
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
                as: "button",
                variant: "transparent",
                children: (
                  <>
                    <Outline.ArrowRightStartOnRectangleIcon /> Uitloggen
                  </>
                ),
              },
            ]}
          />
        ),
      },
    ],
  },
};
