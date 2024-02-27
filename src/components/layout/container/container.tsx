import clsx from "clsx";
import React, { useContext } from "react";

import { ConfigContext } from "../../../contexts";
import "./container.scss";

export type ContainerProps = React.PropsWithChildren<{
  /** If set, show the Outline of the container. */
  debug?: boolean;

  /** Gets passed as props. */
  [index: string]: unknown;
}>;

/**
 * Container component.
 * @param children
 * @param debug
 * @param props
 * @constructor
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  debug,
  ...props
}) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;

  return (
    <div
      className={clsx("mykn-container", { "mykn-container--debug": _debug })}
      {...props}
    >
      {children}
    </div>
  );
};
