import clsx from "clsx";
import React from "react";

import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../button";
import { Dropdown, DropdownProps } from "../dropdown";
import "./toolbar.scss";

export type ToolbarItem = ButtonProps | ButtonLinkProps | DropdownProps;

export type ToolbarProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement> & {
    /** Aligns the contents based on the current direction. */
    align?: "start" | "center" | "end";

    /** Whether the toolbar shows items horizontally or vertically, mobile devices always use vertical. */
    direction?: "horizontal" | "vertical";

    /** When set to true, padding is applied to A components to match Button component's height. */
    padA?: boolean;

    /** When set to true, horizontal padding is applied to the toolbar. */
    padH?: boolean;

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
 * @param align
 * @param direction
 * @param padA
 * @param padH
 * @param variant
 * @param items
 * @param props
 * @constructor
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  align = "start",
  direction = "horizontal",
  padA = false,
  padH = false,
  variant = "normal",
  items = [],
  ...props
}) => {
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
          "mykn-toolbar--pad-a": padA,
          "mykn-toolbar--pad-h": padH,
        },
      )}
      role="toolbar"
      {...props}
    >
      {items.map(renderItem)}
      {children}
    </nav>
  );
};
