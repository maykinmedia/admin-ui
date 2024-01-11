import React from "react";

import "./h2.scss";

export type H2Props = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * H2 component
 * @param children
 * @param props
 * @constructor
 */
export const H2: React.FC<H2Props> = ({ children, ...props }) => (
  <h2 className="mykn-h2" {...props}>
    {children}
  </h2>
);
