import clsx from "clsx";
import React from "react";

import "./label.scss";

export type LabelProps = React.ComponentProps<"label"> & {
  /** Whether the text should be presented bold (default). */
  bold?: boolean;
};

/**
 * Label component
 * @param bold
 * @param className
 * @param children
 * @param props
 * @constructor
 */
export const Label: React.FC<LabelProps> = ({
  bold = true,
  className,
  children,
  ...props
}) => (
  <label
    className={clsx(
      "mykn-label",
      {
        "mykn-label--bold": bold,
      },
      className,
    )}
    {...props}
  >
    {children}
  </label>
);
