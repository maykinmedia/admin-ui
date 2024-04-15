import clsx from "clsx";
import React from "react";

import "./ul.scss";

export type UlProps = React.ComponentProps<"ul"> & {
  /** The size of the text. */
  size?: "s" | "xs";
};

/**
 * Ul component
 * @param children
 * @param size
 * @param props
 * @constructor
 */
export const Ul: React.FC<UlProps> = ({ children, size = "s", ...props }) => (
  <ul className={clsx("mykn-ul", `mykn-ul--size-${size}`)} {...props}>
    {children}
  </ul>
);
