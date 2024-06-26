import clsx from "clsx";
import React, { useContext } from "react";

import { ConfigContext } from "../../../contexts";
import "./grid.scss";

export type GridProps = React.PropsWithChildren<{
  /** If set, use this amount of columns. */
  cols?: number;

  gutter?: boolean | "h" | "v";

  /** If set, show the Outline of the grid. */
  debug?: boolean;

  /** Gets passed as props. */
  [index: string]: unknown;
}>;

/**
 * Grid component, must be placed within a Container component.
 */
export const Grid: React.FC<GridProps> = ({
  children,
  cols,
  debug,
  gutter = true,
  ...props
}) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;

  return (
    <div
      className={clsx("mykn-grid", {
        "mykn-grid--debug": _debug,
        [`mykn-grid--cols-${cols}`]: cols,
        [`mykn-grid--gutter-${gutter}`]: gutter,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
