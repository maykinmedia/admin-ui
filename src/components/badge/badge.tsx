import clsx from "clsx";
import React from "react";

import "./badge.scss";

export type BadgeProps = React.PropsWithChildren<{
  level?: "info" | "success" | "warning" | "danger";

  /** Whehtehr to use a rounded presentation. */
  rounded?: boolean;
}>;

/**
 * Badge component
 * @param children
 * @param level
 * @param props
 * @constructor
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  level,
  rounded,
  ...props
}) => (
  <span
    className={clsx("mykn-badge", {
      [`mykn-badge--level-${level}`]: level,
      "mykn-badge--rounded": rounded,
    })}
    {...props}
  >
    {children}
  </span>
);
