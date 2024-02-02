import clsx from "clsx";
import React from "react";

import "./li.scss";

export type LiProps = React.HTMLAttributes<HTMLLIElement> & {
  /** The size of the text. */
  size?: "s" | "xs";
};

/**
 * Li component
 * @param children
 * @param size
 * @param props
 * @constructor
 */
export const Li: React.FC<LiProps> = ({ children, size = "s", ...props }) => (
  <li className={clsx("mykn-li", `mykn-li--size-${size}`)} {...props}>
    {children}
  </li>
);
