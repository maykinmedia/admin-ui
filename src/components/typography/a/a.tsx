import React, { AnchorHTMLAttributes } from "react";

import "./a.scss";

export type AProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /**
   * This sets aria-current on the <a>, (visually) indicating that this element represents the current item within a
   * container or set of related elements.
   */
  active?: boolean;
};

/**
 * Anchor (<a>) component
 * @param active
 * @param children
 * @param props
 * @constructor
 */
export const A: React.FC<AProps> = ({ active, children, ...props }) => (
  <a className="mykn-a" aria-current={active} {...props}>
    {children}
  </a>
);
