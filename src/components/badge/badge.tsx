import { deprecated } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import "./badge.scss";

export type BadgeProps = React.ComponentProps<"span"> & {
  /** Whether to use a rounded presentation. */
  rounded?: boolean;

  /** The variant (style). */
  variant?:
    | "secondary"
    | "primary"
    | "accent"
    | "outline"
    | "info"
    | "success"
    | "warning"
    | "danger";

  /** @deprecated REMOVE in 3.0 - Renamed to variant. */
  level?: "info" | "success" | "warning" | "danger";
};

/**
 * Badge component
 * @param children
 * @param level
 * @param rounded
 * @param variant
 * @param props
 * @constructor
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  level,
  rounded,
  variant = level,
  ...props
}) => {
  deprecated(
    Boolean(level),
    "level",
    `mykn.components.Badge: level prop is deprecated, use variant instead`,
  );

  return (
    <span
      className={clsx("mykn-badge", {
        [`mykn-badge--variant-${variant}`]: variant,
        "mykn-badge--rounded": rounded,
      })}
      {...props}
    >
      {children}
    </span>
  );
};
