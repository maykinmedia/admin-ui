import clsx from "clsx";
import React from "react";

import "./p.scss";

export type PProps = React.PropsWithChildren<{
  /** The size of the text. */
  size?: "s" | "xs";
}>;

/**
 * P component
 * @param children
 * @param size
 * @param props
 * @constructor
 */
export const P: React.FC<PProps> = ({ children, size = "s", ...props }) => (
  <p className={clsx("mykn-p", `mykn-p--size-${size}`)} {...props}>
    {children}
  </p>
);
