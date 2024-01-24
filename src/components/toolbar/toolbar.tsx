import clsx from "clsx";
import React from "react";

import { Button, ButtonLink, ButtonProps } from "../button";
import "./toolbar.scss";

/**
 * We create a discriminated union type for the ToolbarItemProps
 * When we use `as` to Button, href is not allowed.
 * When we use `as` to ButtonLink, we also require AnchorHTMLAttributes.
 * When we use `as` to custom, we require children.
 */
type ToolbarItemProps =
  | (ButtonProps & { href?: never; as: "button" })
  | (ButtonProps &
      React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "buttonLink" })
  | React.PropsWithChildren<{ as: "custom" }>;

export type ToolbarProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement> & {
    /** Aligns the contents based on the current direction. */
    align?: "start" | "center" | "end";

    /** Whether the toolbar shows items horizontally or vertically, mobile devices always use vertical. */
    direction?: "horizontal" | "vertical";

    /** When set to true, padding is applied to A components to match Button component's height. */
    padA?: boolean;

    /** The variant (style) of the toolbar. */
    variant?: "normal" | "transparent";

    /** The items shown inside the toolbar, alternatively, can opt to use children instead. */
    items?: ToolbarItemProps[];
  }
>;

/**
 * A flexible and customizable toolbar component for arranging and aligning
 * various interactive elements such as `A`, `Button`, `ButtonLink` and `Dropdown`.
 * @param children
 * @param align
 * @param direction
 * @param padA
 * @param props
 * @constructor
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  align = "start",
  direction = "horizontal",
  padA = false,
  variant = "normal",
  items,
  ...props
}) => {
  const renderItem = (item: ToolbarItemProps) => {
    switch (item.as) {
      case "button":
        return <Button {...item}>{item.children}</Button>;
      case "buttonLink":
        return <ButtonLink {...item}>{item.children}</ButtonLink>;
      case "custom":
        return item.children;
      default:
        return null;
    }
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
        },
      )}
      role="toolbar"
      {...props}
    >
      {items
        ? items.map((item, index) => (
            <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
          ))
        : children}
    </nav>
  );
};
