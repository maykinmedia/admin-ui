import clsx from "clsx";
import React from "react";

import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../button";
import { Dropdown, DropdownProps } from "../dropdown";
import { A, AProps } from "../typography";
import "./toolbar.scss";

export type ToolbarItem =
  | AProps
  | ButtonProps
  | ButtonLinkProps
  | DropdownProps;

export type ToolbarProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement> & {
    /** Aligns the contents based on the current direction. */
    align?: "start" | "center" | "end" | "space-between";

    /** The position of `children` compared to `items`. */
    childrenPosition?: "before" | "after";

    /** Whether the toolbar shows items horizontally or vertically, mobile devices always use vertical. */
    direction?: "horizontal" | "vertical";

    /** When set to true, gap between items is removed. */
    compact?: boolean;

    /** Whether to apply padding to the toolbar. */
    pad?: "v" | "h" | boolean;

    /** When set to true, padding is applied to A components to match Button component's height. */
    padA?: boolean;

    /** When set tot true, toolbar will be positioned using display: sticky. */
    sticky?: false | "top";

    /** The variant (style) of the toolbar. */
    variant?: "normal" | "transparent";

    /** The items shown inside the toolbar, alternatively, can opt to use children instead. */
    items?: ToolbarItem[];
  }
>;

/**
 * A flexible and customizable toolbar component for arranging and aligning
 * various interactive elements such as `A`, `Button`, `ButtonLink` and `Dropdown`.
 * @param children
 * @param childrenPosition
 * @param align
 * @param compact
 * @param direction
 * @param pad
 * @param padA
 * @param sticky
 * @param variant
 * @param items
 * @param props
 * @constructor
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  childrenPosition = "after",
  align = "start",
  compact = false,
  direction = "horizontal",
  pad = "v",
  padA = false,
  sticky = false,
  variant = "normal",
  items = [],
  ...props
}) => {
  const isItemAProps = (item: ToolbarItem): item is AProps =>
    Object.hasOwn(item, "textDecoration");

  const isItemButtonLinkProps = (item: ToolbarItem): item is ButtonLinkProps =>
    Object.hasOwn(item, "href");

  const isItemDropdownProps = (item: ToolbarItem): item is DropdownProps =>
    Object.hasOwn(item, "items"); // Mandatory on Dropdown if passed to toolbar items.

  const isItemButtonProps = (item: ToolbarItem): item is ButtonProps =>
    !Object.hasOwn(item, "href");

  /**
   * Returns the React.FC for the item based on it's shape.
   * @param item
   */
  const getItemComponent = (item: ToolbarItem): React.FC => {
    if (isItemAProps(item)) {
      return A;
    }

    if (isItemButtonLinkProps(item)) {
      return ButtonLink;
    }
    if (isItemDropdownProps(item)) {
      return Dropdown as React.FC;
    }
    if (isItemButtonProps(item)) {
      return Button;
    }
    return () => null;
  };

  /**
   * Renders an item (in items).
   * @param item
   * @param index
   */
  const renderItem = (item: ToolbarItem, index: number) => {
    const Component = getItemComponent(item);
    return <Component key={index} {...item}></Component>;
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
          "mykn-toolbar--pad-h": pad === true || pad === "h",
          "mykn-toolbar--pad-v": pad === true || pad === "v",
          "mykn-toolbar--pad-a": padA,
          [`mykn-toolbar--sticky-${sticky}`]: sticky,
        },
      )}
      role="toolbar"
      {...props}
    >
      {childrenPosition === "before" && children}
      {items.map(renderItem)}
      {childrenPosition === "after" && children}
    </nav>
  );
};
