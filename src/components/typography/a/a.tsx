import clsx from "clsx";
import React from "react";

import "./a.scss";

export type AProps = React.ComponentProps<"a"> & {
  /**
   * This sets aria-current on the <a>, (visually) indicating that this element represents the current item within a
   * container or set of related elements.
   */
  active?: boolean;

  /** Whether the text should be presented in a lighter color. */
  muted?: boolean;

  /** The size of the text. */
  size?: "s" | "xs";

  /** The text decoration. */
  textDecoration?: "underline" | "none";
};

/**
 * Anchor (<a>) component
 * @param active
 * @param children
 * @param muted
 * @param size
 * @param textDecoration
 * @param props
 */
export const A: React.FC<AProps> = ({
  active,
  children,
  muted,
  size = "s",
  textDecoration = "underline",
  ...props
}) => (
  <a
    className={clsx(
      "mykn-a",
      `mykn-a--text-decoration-${textDecoration}`,
      `mykn-a--size-${size}`,
      {
        "mykn-a--muted": muted,
      },
    )}
    aria-current={active}
    {...props}
  >
    {children}
  </a>
);
