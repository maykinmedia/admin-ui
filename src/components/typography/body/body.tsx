import clsx from "clsx";
import React from "react";

import "./body.scss";

export type BodyProps = React.PropsWithChildren<{
  /** Additional class names. */
  className?: string;
}>;

/**
 * Provides styling (e.g. margins) for a group of (typographic) components.
 * Can be used in various components to provide padding.
 */
export const Body: React.FC<BodyProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={clsx("mykn-body", className)} {...props}>
    {children}
  </div>
);
