import clsx from "clsx";
import React, { useContext } from "react";

import { ConfigContext } from "../../../contexts";
import "./column.scss";

export type ColumnProps = React.PropsWithChildren<{
  /** The number of columns to span. */
  span: number;

  /** If set, the column to start on. */
  start?: number;

  /** If set, flex children in direction. */
  direction?: "column" | "row";

  /** If set, add spacing between children (only if direction is set). */
  gap?: boolean;

  /** If set, show the Outline of the column. */
  debug?: boolean;

  /** The number of columns to span on mobile. */
  mobileSpan?: number;

  /** Gets passed as props. */
  [index: string]: unknown;
}>;

/**
 * Column component, constraints items on a horizontal axis.
 */
export const Column: React.FC<ColumnProps> = ({
  children,
  debug,
  direction,
  gap = false,
  mobileSpan = 6,
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
        "mykn-column--gap": direction && gap,
        [`mykn-column--direction-${direction}`]: direction,
        [`mykn-column--start-${start}`]: start,
        [`mykn-column--mobile-span-${mobileSpan}`]: mobileSpan,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
