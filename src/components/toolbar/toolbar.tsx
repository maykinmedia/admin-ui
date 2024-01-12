import clsx from "clsx";
import React from "react";

import "./toolbar.scss";

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
  ...props
}) => (
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
    {children}
  </nav>
);
