import clsx from "clsx";
import React from "react";

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
}) => (
  <div
    className={clsx("mykn-container", { "mykn-container--debug": debug })}
    {...props}
  >
    {children}
  </div>
);
