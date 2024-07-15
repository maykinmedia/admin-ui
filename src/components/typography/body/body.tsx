import clsx from "clsx";
import React from "react";

import "./body.scss";

export type BodyProps = React.PropsWithChildren<{
  /** Additional class names. */
  className?: string;

  /** Whether to stretch the body's width. */
  stretch?: boolean;
}>;

/**
 * Provides styling (e.g. margins) for a group of (typographic) components.
 * Can be used in various components to provide padding.
 */
export const Body: React.FC<BodyProps> = ({
  children,
  className,
  stretch = false,
  ...props
}) => (
  <div
    className={clsx("mykn-body", { "mykn-body--stretch": stretch }, className)}
    {...props}
  >
    {children}
  </div>
);
