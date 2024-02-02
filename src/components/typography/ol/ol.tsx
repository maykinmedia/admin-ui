import clsx from "clsx";
import React from "react";

import { PProps } from "../p";
import "./ol.scss";

export type OlProps = React.HTMLAttributes<HTMLOListElement> & {
  /** Whether to show list items inline. */
  inline?: boolean;

  /** The list style. */
  listStyle?: "decimal" | "none";

  /** The size of the text. */
  size?: PProps["size"];
};

/**
 * Ol component
 * @param children
 * @param inline
 * @param listStyle
 * @param size
 * @param props
 * @constructor
 */
export const Ol: React.FC<OlProps> = ({
  children,
  inline = false,
  listStyle,
  size = "s",
  ...props
}) => (
  <ol
    className={clsx(
      "mykn-ol",
      `mykn-ol--size-${size}`,
      `mykn-ol--list-style-${listStyle}`,
      { "mykn-ol--inline": inline },
    )}
    {...props}
  >
    {children}
  </ol>
);
