import clsx from "clsx";
import React from "react";

import { PProps } from "../p";
import "./ul.scss";

export type ULProps = PProps;

/**
 * UL component
 * @param children
 * @param size
 * @param props
 * @constructor
 */
export const UL: React.FC<ULProps> = ({ children, size = "s", ...props }) => (
  <ul className={clsx("mykn-ul", `mykn-ul--size-${size}`)} {...props}>
    {children}
  </ul>
);
