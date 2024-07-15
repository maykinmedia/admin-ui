import clsx from "clsx";
import React from "react";

import "./p.scss";

export type PProps = React.ComponentProps<"p"> & {
  /** Whether the text should be presented bold. */
  bold?: boolean;

  /** Whether the text should be presented in a lighter color. */
  muted?: boolean;

  /** The size of the text. */
  size?: "s" | "xs";

  /** "word-break" CSS value. */
  wordBreak?: React.CSSProperties["wordBreak"];
};

/**
 * Ul component
 * @param bold
 * @param children
 * @param muted
 * @param size
 * @param wordBreak
 * @param props
 * @constructor
 */
export const P: React.FC<PProps> = ({
  bold = false,
  children,
  muted = false,
  size = "s",
  wordBreak,
  ...props
}) => (
  <p
    className={clsx("mykn-p", `mykn-p--size-${size}`, {
      ["mykn-p--bold"]: bold,
      ["mykn-p--muted"]: muted,
      [`mykn-p--word-break-${wordBreak}`]: wordBreak,
    })}
    {...props}
  >
    {children}
  </p>
);
