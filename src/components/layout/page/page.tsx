import clsx from "clsx";
import React from "react";

import "./page.scss";

export type PageProps = React.PropsWithChildren<{
  /**
   * Sets the "container-type" CSS attribute. Setting this to "normal" might fix
   * problems regarding sizing of children.
   */
  containerType?: "inline-size" | "size" | "normal";

  /** Whether to use `height 100%;` (over `min-height: 100%;`). */
  fullHeight?: boolean;

  /** Vertical alignment of page content. */
  valign?: "start" | "middle";

  /** Whether to apply padding to the page. */
  pad?: boolean | "h" | "v";
}>;

/**
 * Provides the base theme for a page.
 */
export const Page: React.FC<PageProps> = ({
  children,
  containerType = "inline-size",
  fullHeight = true,
  pad = false,
  valign,
  ...props
}) => (
  <div
    className={clsx("mykn-page", {
      "mykn-page--full-height": fullHeight,
      [`mykn-page--container-type-${containerType}`]: containerType,
      [`mykn-page--valign-${valign}`]: valign,
      "mykn-page--pad-h": pad === true || pad === "h",
      "mykn-page--pad-v": pad === true || pad === "v",
    })}
    {...props}
  >
    {children}
  </div>
);
