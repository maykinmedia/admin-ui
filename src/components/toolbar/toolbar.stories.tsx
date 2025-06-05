import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { ButtonLinkProps, ButtonProps } from "../button";
import { DropdownProps } from "../dropdown";
import { FormControlProps } from "../form";
import { IconInitials } from "../iconinitials";
import { Logo } from "../logo";
import { A, AProps, H3 } from "../typography";
import { Toolbar, ToolbarProps } from "./toolbar";

const meta: Meta<typeof Toolbar> = {
  title: "Building Blocks/Toolbar",
  component: Toolbar,
  decorators: [PAGE_DECORATOR],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ToolbarComponent: Story = {
  args: {
    align: "center",
    pad: true,
    items: [
      <Logo key="Logo" abbreviated />,
      "spacer",
      {
        children: "Anchor",
        href: "https://www.example.com",
        textDecoration: "underline",
      } as AProps,
      {
        children: "ButtonLink",
        href: "https://www.example.com",
      } as ButtonLinkProps,
      {
        children: "Button",
        onClick: () => alert("Button clicked."),
      } as ButtonProps,
      {
        label: "Dropdown",
        toolbarProps: { align: "center" },
        items: [
          <Logo key="logo" abbreviated />,
          "spacer",
          {
            children: "Anchor",
            href: "https://www.example.com",
            textDecoration: "underline",
          },
          {
            children: "ButtonLink",
            href: "https://www.example.com",
          },
          {
            children: "Button",
            onClick: () => alert("Button clicked."),
          },
          {
            placeholder: "FormControl",
          },
        ],
      } as DropdownProps,
      {
        placeholder: "FormControl",
      } as FormControlProps,
      <IconInitials key="IconInitials" name="Maykin Media" />,
    ],
  },
};

export const Compact: Story = {
  ...ToolbarComponent,
  args: {
    ...ToolbarComponent.args,
    compact: true,
  },
};

export const Variants: Story = {
  ...ToolbarComponent,
  args: {
    ...ToolbarComponent.args,
    items: ToolbarComponent.args?.items?.toSpliced(0, 1),
  },
  render: (args) => {
    const variants: ToolbarProps["variant"][] = [
      "normal",
      "primary",
      "accent",
      "alt",
      "transparent",
    ];
    return (
      <>
        {variants.map((variant) => {
          return (
            <Toolbar
              key={variant}
              {...{
                ...args,
                items: [
                  <H3 key="label">variant: {variant}</H3>,
                  ...(args.items || []),
                ],
              }}
              variant={variant}
            />
          );
        })}
      </>
    );
  },
};

export const Vertical: Story = {
  ...ToolbarComponent,
  args: {
    ...ToolbarComponent.args,
    direction: "vertical",
  },
};

export const SidebarStart: Story = {
  args: {
    align: "start",
    direction: "vertical",
    pad: true,
    variant: "transparent",
    items: [<Logo key="logo" abbreviated />],
    childrenPosition: "after",
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

export const SidebarEnd: Story = {
  ...SidebarStart,
  args: { ...SidebarStart.args, align: "end", justify: "h" },
};
