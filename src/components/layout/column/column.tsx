import clsx from "clsx";
import React from "react";

import "./column.css";

export type ColumnProps = React.PropsWithChildren<{
  span: number;

  /** If set, show the outline of the column. */
  debug?: boolean;
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
      className={clsx("column", `column--span-${span}`, {
        "column--debug": debug,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
