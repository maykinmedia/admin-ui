import clsx from "clsx";
import React from "react";

import "./p.scss";

export type PProps = React.PropsWithChildren<{
  /** Whether the text should be presented in a lighter color. */
  muted?: boolean;

  /** The size of the text. */
  size?: "s" | "xs";
}>;

/**
 * Ul component
 * @param children
 * @param muted
 * @param size
 * @param props
 * @constructor
 */
export const P: React.FC<PProps> = ({
  children,
  muted,
  size = "s",
  ...props
}) => (
  <p
    className={clsx("mykn-p", `mykn-p--size-${size}`, {
      ["mykn-p--muted"]: muted,
    })}
    {...props}
  >
    {children}
  </p>
);
