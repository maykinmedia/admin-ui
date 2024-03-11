import clsx from "clsx";
import React, { useContext } from "react";

import { ConfigContext } from "../../../contexts";
import "./breakout.scss";

export type BreakoutProps = React.PropsWithChildren & {
  /** If set, show the Outline of the breakout. */
  debug?: boolean;
};

/**
 * Breakout component, allows to "break out" of the padding set by <Page/>.
 * @param children
 * @param debug
 * @param props
 * @constructor
 */
export const Breakout: React.FC<BreakoutProps> = ({
  children,
  debug = false,
  ...props
}) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;

  return (
    <div
      className={clsx("mykn-breakout", {
        "mykn-breakout--debug": _debug,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
