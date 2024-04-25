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
  | DropdownProps
  | "spacer";

export type ToolbarProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement> & {
    /** Aligns the contents based on the current direction. */
    align?: "start" | "center" | "end" | "space-between";

    /** The position of `children` compared to `items`. */
    childrenPosition?: "before" | "after";

    /** Whether the toolbar shows items horizontally or vertically, mobile devices always use vertical. */
    direction?: "horizontal" | "vertical";

    /** Whether the direction is responsive. */
    directionResponsive?: boolean;

    /** When set to true, gap between items is removed. */
    compact?: boolean;

    /** Whether to stretch this component. */
    justify?: "h" | "v";

    /** Whether to apply padding to the toolbar. */
    pad?: "v" | "h" | boolean;

    /** When set to true, padding is applied to A components to match Button component's height. */
    padA?: boolean;

    /** Can be set to `fit-content` to apply auto sizing based on content width. */
    size?: "fit-content";

    /** When set tot true, toolbar will be positioned using display: sticky. */
    sticky?: false | "top";

    /** The variant (style) of the toolbar. */
    variant?: "normal" | "primary" | "transparent";

    /** The items shown inside the toolbar, alternatively, can opt to use children instead. */
    items?: ToolbarItem[];
  }
>;

/**
 * A flexible and customizable toolbar component for arranging and aligning
 * various interactive elements such as `A`, `Button`, `ButtonLink` and `Dropdown`.
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  childrenPosition = "after",
  align = "start",
  compact = false,
  direction = "horizontal",
  directionResponsive = true,
  justify = "h",
  pad = "v",
  padA = false,
  size = "",
  sticky = false,
  variant = "normal",
  items = [],
  ...props
}) => {
  const isItemAProps = (item: ToolbarItem): item is AProps =>
    Object.hasOwn(Object(item), "textDecoration");

  const isItemButtonLinkProps = (item: ToolbarItem): item is ButtonLinkProps =>
    Object.hasOwn(Object(item), "href");

  const isItemDropdownProps = (item: ToolbarItem): item is DropdownProps =>
    Object.hasOwn(Object(item), "items"); // Mandatory on Dropdown if passed to toolbar items.

  const isItemButtonProps = (item: ToolbarItem): item is ButtonProps =>
    !Object.hasOwn(Object(item), "href");

  /**
   * Returns the React.FC for the item based on its shape.
   * @param item
   */
  const getItemComponent = (item: ToolbarItem): React.FC => {
    if (item === "spacer") {
      return ToolbarSpacer;
    }

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
    const props = typeof item === "string" ? {} : item;
    const Component = getItemComponent(item);
    return <Component key={index} {...props}></Component>;
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
          [`mykn-toolbar--size-${size}`]: size,
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

export type ToolbarSpacerProps = React.ComponentProps<"div">;

/**
 * Toolbar "spacer" separates items in a toolbar.
 */
export const ToolbarSpacer = (props: ToolbarSpacerProps) => (
  <div className="mykn-toolbar__spacer" {...props}></div>
);
