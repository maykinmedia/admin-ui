import clsx from "clsx";
import React from "react";

import "./container.css";

export type ContainerProps = React.PropsWithChildren<{
  /** If set, show the outline of the container. */
  debug?: boolean;
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
  <div className={clsx("container", { "container--debug": debug })} {...props}>
    {children}
  </div>
);
