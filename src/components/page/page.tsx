import clsx from "clsx";
import React from "react";

import "./page.scss";

export type PageProps = React.PropsWithChildren<{
  /** Vertical alignment of page content. */
  valign?: "start" | "middle";
}>;

/**
 * Provides the base theme for a page.
 * @param children
 * @param valign
 * @param props
 * @constructor
 */
export const Page: React.FC<PageProps> = ({ children, valign, ...props }) => (
  <div
    className={clsx("mykn-page", {
      [`mykn-page--valign-${valign}`]: valign,
    })}
    {...props}
  >
    {children}
  </div>
);
