import clsx from "clsx";
import React, {useContext} from "react";

import "./column.scss";
import {ConfigContext} from "../../../contexts";

export type ColumnProps = React.PropsWithChildren<{
  /** The number of columns to span. */
  span: number;

  /** If set, the column to start on. */
  start?: number;

  /** If set, show the Outline of the column. */
  debug?: boolean;

  /** Gets passed as props. */
  [index: string]: unknown;
}>;

/**
 * Column component, must be placed within a Grid component.
 * @param children
 * @param debug
 * @param span
 * @param start
 * @param props
 * @constructor
 */
export const Column: React.FC<ColumnProps> = ({
  children,
  debug,
  span,
  start,
  ...props
}) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;

  return (
    <div
      className={clsx("mykn-column", `mykn-column--span-${span}`, {
        "mykn-column--debug": _debug,
        [`mykn-column--start-${start}`]: start,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
