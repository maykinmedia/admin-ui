import React, { AnchorHTMLAttributes } from "react";

import "./a.scss";

export type AProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Anchor (<a>) component
 * @param children
 * @param props
 * @constructor
 */
export const A: React.FC<AProps> = ({ children, ...props }) => (
  <a className="mykn-a" {...props}>
    {children}
  </a>
);
