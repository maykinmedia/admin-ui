import clsx from "clsx";
import React from "react";

import "./grid.scss";

export type GridProps = React.PropsWithChildren<{
  /** If set, show the Outline of the grid. */
  debug?: boolean;

  /** Gets passed as props. */
  [index: string]: unknown;
}>;

/**
 * Grid component, must be placed within a Container component.
 * @param children
 * @param debug
 * @param props
 * @constructor
 */
export const Grid: React.FC<GridProps> = ({ children, debug, ...props }) => (
  <div className={clsx("mykn-grid", { "mykn-grid--debug": debug })} {...props}>
    {children}
  </div>
);
