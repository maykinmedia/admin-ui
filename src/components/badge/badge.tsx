import React from "react";

import "./badge.scss";

export type BadgeProps = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * Badge component
 * @param children
 * @param props
 * @constructor
 */
export const Badge: React.FC<BadgeProps> = ({ children, ...props }) => (
  <div className="mykn-badge" {...props}>
    {children}
  </div>
);
