import React from "react";

import "./body.scss";

export type BodyProps = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * Provides styling (e.g. margins) for a group of (typographic) components.
 * Can be used in various components to provide padding.
 * @param children
 * @param props
 * @constructor
 */
export const Body: React.FC<BodyProps> = ({ children, ...props }) => (
  <div className="mykn-body" {...props}>
    {children}
  </div>
);
