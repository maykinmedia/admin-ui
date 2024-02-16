import React from "react";

import "./label.scss";

export type LabelProps = React.ComponentProps<"label">;

/**
 * Label component
 * @param children
 * @param props
 * @constructor
 */
export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
  <label className="mykn-label" {...props}>
    {children}
  </label>
);
