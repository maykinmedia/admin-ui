import clsx from "clsx";
import React from "react";

import "./h3.scss";

export type H3Props = React.ComponentProps<"h3">;

/**
 * H3 component
 * @param children
 * @param props
 * @constructor
 */
export const H3: React.FC<H3Props> = ({ children, className, ...props }) => (
  <h3 className={clsx("mykn-h3", className)} {...props}>
    {children}
  </h3>
);
