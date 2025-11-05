import { deprecated } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import { A } from "../typography";
import "./badge.scss";

export type BadgeProps = (
  | React.ComponentProps<"span">
  | React.ComponentProps<"a">
) & {
  /** Whether to use a rounded presentation. */
  rounded?: boolean;

  /** Optional link target. If provided, Badge renders as <a>. */
  href?: string;

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
  href,
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

  const className = clsx("mykn-badge", {
    [`mykn-badge--variant-${variant}`]: variant,
    "mykn-badge--rounded": rounded,
  });

  if (href) {
    return (
      <A
        className={className}
        href={href}
        {...(props as React.ComponentProps<"a">)}
      >
        {children}
      </A>
    );
  }

  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
};
