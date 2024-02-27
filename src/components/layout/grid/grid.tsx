import clsx from "clsx";
import React, { useContext } from "react";

import { ConfigContext } from "../../../contexts";
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
export const Grid: React.FC<GridProps> = ({ children, debug, ...props }) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;

  return (
    <div
      className={clsx("mykn-grid", { "mykn-grid--debug": _debug })}
      {...props}
    >
      {children}
    </div>
  );
};
