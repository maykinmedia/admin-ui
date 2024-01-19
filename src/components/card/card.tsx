import React from "react";

import "./card.scss";

export type CardProps = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * Card component
 * @param children
 * @param props
 * @constructor
 */
export const Card: React.FC<CardProps> = ({ children, ...props }) => (
  <div className="mykn-card" {...props}>
    {children}
  </div>
);
