import clsx from "clsx";
import React from "react";

import "./grid.css";

export type GridProps = React.PropsWithChildren<{
  /** If set, show the outline of the grid. */
  debug?: boolean;
}>;

/**
 * Grid component, must be placed within a Container component.
 * @param children
 * @param debug
 * @param props
 * @constructor
 */
export const Grid: React.FC<GridProps> = ({ children, debug, ...props }) => (
  <div className={clsx("grid", { "grid--debug": debug })} {...props}>
    {children}
  </div>
);
