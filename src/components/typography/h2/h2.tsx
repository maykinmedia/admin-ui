import React from "react";

import "./h1.scss";

export type H1Props = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * H1 component
 * @param children
 * @param props
 * @constructor
 */
export const H1: React.FC<H1Props> = ({ children, ...props }) => (
  <h1 className="mykn-h1" {...props}>
    {children}
  </h1>
);
