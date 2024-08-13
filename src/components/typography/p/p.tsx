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

  /** The element or component to render as. */
  as?: React.ElementType;

  className?: string;
};

/**
 * P component
 * @param bold
 * @param children
 * @param muted
 * @param size
 * @param wordBreak
 * @param as
 * @param className
 * @param props
 * @constructor
 */
export const P: React.FC<PProps> = ({
  bold = false,
  children,
  muted = false,
  size = "s",
  wordBreak,
  as: Component = "p",
  className,
  ...props
}) => (
  <Component
    className={clsx(
      "mykn-p",
      `mykn-p--size-${size}`,
      {
        ["mykn-p--bold"]: bold,
        ["mykn-p--muted"]: muted,
        [`mykn-p--word-break-${wordBreak}`]: wordBreak,
      },
      className,
    )}
    {...props}
  >
    {children}
  </Component>
);
