import clsx from "clsx";
import React from "react";

import { isFormControl } from "../../lib";
import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../button";
import { Dropdown, DropdownProps } from "../dropdown";
import { FormControl, FormControlProps } from "../form/formcontrol";
import { A, AProps } from "../typography";
import "./toolbar.scss";

export type ToolbarItem =
  | AProps
  | ButtonProps
  | ButtonLinkProps
  | DropdownProps
  | FormControlProps
  | "spacer"
  | React.ReactNode;

export type ToolbarProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement>
> & {
  /** Aligns the contents based on the current direction. */
  align?: "start" | "center" | "end" | "space-between";

  /** The position of `children` compared to `items`. */
  childrenPosition?: "before" | "after";

  /** Can be used to extend the className. */
  className?: string;

  /** Whether the toolbar shows items horizontally or vertically, mobile devices always use vertical. */
  direction?: "h" | "v" | "horizontal" | "vertical"; // TODO: deprecate horizontal and vertical

  /** Whether the direction is responsive. */
  directionResponsive?: boolean;

  /** When set to true, gap between items is removed. */
  compact?: boolean;

  /** Whether to stretch this component. */
  justify?: "h" | "v" | boolean;

  /** Whether to apply padding to the toolbar. */
  pad?: "v" | "h" | boolean;

  /** The size of the padding. */
  padSize?: "s" | "xs";

  /** When set to true, padding is applied to A components to match Button component's height. */
  padA?: boolean;

  /** Can be set to `fit-content` to apply auto sizing based on content width. */
  size?: "fit-content";

  /** When set tot true, toolbar will be positioned using display: sticky. */
  sticky?: false | "top" | "bottom";

  /** The variant (style) of the toolbar. */
  variant?: "normal" | "primary" | "accent" | "alt" | "transparent";

  /** The items shown inside the toolbar, alternatively, can opt to use children instead. */
  items?: ToolbarItem[];

  /**
   * Allows default props of items to be partially overridden based on the component type, this improves the styling
   * of certain components when rendered in a Toolbar.
   */
  overrideItemProps?: boolean;
};

/**
 * A flexible and customizable toolbar component for arranging and aligning
 * various interactive elements such as `A`, `Button`, `ButtonLink` and `Dropdown`.
 */
export function Toolbar({
  children,
  childrenPosition = "after",
  className,
  align = "start",
  compact = false,
  direction: _direction = "h",
  directionResponsive = true,
  justify = "h",
  pad = "v",
  padA = false,
  padSize = "s",
  size = undefined,
  sticky = false,
  variant = "normal",
  items = [],
  overrideItemProps = true,
  ...props
}: ToolbarProps) {
  // TODO: Deprecate "horizontal" and "vertical" (use "h" and "v" instead).
  const direction =
    _direction.toLowerCase() === "h"
      ? "horizontal"
      : _direction.toLowerCase() === "v"
        ? "vertical"
        : (_direction as "horizontal" | "vertical");

  type ToolbarItemProps =
    | React.ComponentProps<typeof A>
    | React.ComponentProps<typeof ButtonLink>
    | React.ComponentProps<typeof Dropdown>
    | React.ComponentProps<typeof Button>
    | React.ComponentProps<typeof FormControl>;

  /**
   * Returns the React.FC and default props to apply to it for the item based on
   * its shape.
   * @param item
   */
  const getItemComponent = (
    item: ToolbarItem,
  ): [React.ComponentType, Partial<ToolbarItemProps>] => {
    if (item === "spacer") {
      return [ToolbarSpacer, {}];
    }

    if (React.isValidElement(item)) {
      return [() => item, {}];
    }

    if (isA(item)) {
      return [
        A,
        overrideItemProps
          ? {
              size: direction === "horizontal" ? "xs" : undefined,
            }
          : {},
      ];
    }

    if (isButton(item)) {
      return [
        Button,
        overrideItemProps
          ? {
              size: direction === "horizontal" ? "xs" : undefined,
              variant: variant === "primary" ? "primary" : "transparent",
            }
          : {},
      ];
    }

    if (isButtonLink(item)) {
      return [
        ButtonLink,
        overrideItemProps
          ? {
              size: direction === "horizontal" ? "xs" : undefined,
              variant: variant === "primary" ? "primary" : "transparent",
            }
          : {},
      ];
    }

    if (isDropdown(item)) {
      return [
        Dropdown as React.FC,
        overrideItemProps
          ? {
              size: direction === "horizontal" ? "xs" : undefined,
              variant: variant === "primary" ? "primary" : "transparent",
            }
          : {},
      ];
    }

    if (isFormControl(item)) {
      return [
        FormControl,
        overrideItemProps
          ? {
              size: direction === "horizontal" ? "xs" : undefined,
              variant: "transparent",
            }
          : {},
      ];
    }

    throw new Error("Unknown toolbar item type!");
  };

  const isA = (item: unknown): item is AProps =>
    Object.hasOwn(Object(item), "textDecoration");

  const isButton = (item: unknown): item is ButtonProps =>
    !Object.hasOwn(Object(item), "href") &&
    Object.hasOwn(Object(item), "children"); // Does button always have children?

  const isButtonLink = (item: unknown): item is ButtonLinkProps =>
    Object.hasOwn(Object(item), "href");

  const isDropdown = (item: unknown): item is DropdownProps =>
    Object.hasOwn(Object(item), "items"); // Mandatory on Dropdown if passed to toolbar items.

  /**
   * Renders an item (in items).
   * @param item
   * @param index
   */
  const renderItem = (item: ToolbarItem, index: number) => {
    const props = React.isValidElement(item)
      ? {}
      : (item as Exclude<ToolbarItem, React.ReactNode>);
    const [Component, defaultProps] = getItemComponent(item);
    return (
      <Component
        key={index}
        {...defaultProps}
        {...(props as object)}
      ></Component>
    );
  };

  return (
    <nav
      className={clsx(
        "mykn-toolbar",
        `mykn-toolbar--align-${align}`,
        `mykn-toolbar--direction-${direction}`,
        `mykn-toolbar--variant-${variant}`,
        {
          "mykn-toolbar--compact": compact,
          "mykn-toolbar--direction-responsive": directionResponsive,
          "mykn-toolbar--justify-h": justify === "h",
          "mykn-toolbar--justify-v": justify === "v",
          "mykn-toolbar--pad-h": pad === true || pad === "h",
          "mykn-toolbar--pad-v": pad === true || pad === "v",
          "mykn-toolbar--pad-a": padA,
          [`mykn-toolbar--pad-size-${padSize}`]: padSize,
          [`mykn-toolbar--size-${size}`]: size,
          [`mykn-toolbar--sticky-${sticky}`]: sticky,
        },
        className,
      )}
      role="toolbar"
      {...props}
    >
      {childrenPosition === "before" && children}
      {items.filter((v) => v).map(renderItem)}
      {childrenPosition === "after" && children}
    </nav>
  );
}

/**
 * Toolbar "spacer" separates items in a toolbar.
 */
export const ToolbarSpacer = () => <div className="mykn-toolbar__spacer"></div>;
