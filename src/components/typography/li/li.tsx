import clsx from "clsx";
import React from "react";

import { PProps } from "../p";
import "./li.scss";

export type LiProps = PProps;

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
