import clsx from "clsx";
import React from "react";

import "./column.scss";

export type ColumnProps = React.PropsWithChildren<{
  span: number;

  /** If set, show the outline of the column. */
  debug?: boolean;

  /** Gets passed as props. */
  [index: string]: unknown;
}>;

/**
 * Column component, must be placed within a Grid component.
 * @param children
 * @param debug
 * @param span
 * @param props
 * @constructor
 */
export const Column: React.FC<ColumnProps> = ({
  children,
  debug,
  span,
  ...props
}) => {
  return (
    <div
      className={clsx("mykn-column", `mykn-column--span-${span}`, {
        "mykn-column--debug": debug,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
