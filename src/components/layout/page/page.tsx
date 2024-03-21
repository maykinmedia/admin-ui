import clsx from "clsx";
import React from "react";

import "./page.scss";

export type PageProps = React.PropsWithChildren<{
  /** Vertical alignment of page content. */
  valign?: "start" | "middle";

  /** Whether to apply padding to the page. */
  pad?: boolean | "h" | "v";
}>;

/**
 * Provides the base theme for a page.
 * @param children
 * @param pad
 * @param valign
 * @param props
 * @constructor
 */
export const Page: React.FC<PageProps> = ({
  children,
  pad = true,
  valign,
  ...props
}) => (
  <div
    className={clsx("mykn-page", {
      [`mykn-page--valign-${valign}`]: valign,
      "mykn-page--pad-h": pad === true || pad === "h",
      "mykn-page--pad-v": pad === true || pad === "v",
    })}
    {...props}
  >
    {children}
  </div>
);
