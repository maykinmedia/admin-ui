import clsx from "clsx";
import React from "react";

import "./p.scss";

export type PProps = React.PropsWithChildren<{
  /** Whether the text should be presented bold. */
  bold?: boolean;

  /** Whether the text should be presented in a lighter color. */
  muted?: boolean;

  /** The size of the text. */
  size?: "s" | "xs";
}>;

/**
 * Ul component
 * @param bold
 * @param children
 * @param muted
 * @param size
 * @param props
 * @constructor
 */
export const P: React.FC<PProps> = ({
  bold = false,
  children,
  muted = false,
  size = "s",
  ...props
}) => (
  <p
    className={clsx("mykn-p", `mykn-p--size-${size}`, {
      ["mykn-p--bold"]: bold,
      ["mykn-p--muted"]: muted,
    })}
    {...props}
  >
    {children}
  </p>
);
