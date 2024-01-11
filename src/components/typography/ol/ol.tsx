import clsx from "clsx";
import React from "react";

import { PProps } from "../p";
import "./ol.scss";

export type OLProps = PProps;

/**
 * OL component
 * @param children
 * @param size
 * @param props
 * @constructor
 */
export const OL: React.FC<OLProps> = ({ children, size = "s", ...props }) => (
  <ol className={clsx("mykn-ol", `mykn-ol--size-${size}`)} {...props}>
    {children}
  </ol>
);
