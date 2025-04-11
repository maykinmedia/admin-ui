import clsx from "clsx";
import React, { useContext } from "react";

import { ConfigContext } from "../../../contexts";
import "./grid.scss";

export type GridProps = React.PropsWithChildren<{
  /** If set, use this amount of columns. */
  cols?: number;

  /** If set, show the Outline of the grid. */
  debug?: boolean;

  /** Whether to use gutters (gaps between columns). */
  gutter?: boolean | "h" | "v";

  /** Whether to stretch the grid (vertically). */
  stretch?: boolean;

  /** Vertical alignment of content. */
  valign?: "start" | "middle";

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
  stretch,
  gutter = true,
  valign,
  ...props
}) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;

  return (
    <div
      className={clsx("mykn-grid", {
        "mykn-grid--debug": _debug,
        "mykn-grid--stretch": stretch,
        [`mykn-grid--cols-${cols}`]: cols,
        [`mykn-grid--gutter-${gutter}`]: gutter,
        [`mykn-grid--valign-${valign}`]: valign,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
