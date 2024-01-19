import clsx from "clsx";
import React from "react";

import { PProps } from "../p";
import "./ol.scss";

export type OlProps = PProps;

/**
 * Ol component
 * @param children
 * @param size
 * @param props
 * @constructor
 */
export const Ol: React.FC<OlProps> = ({ children, size = "s", ...props }) => (
  <ol className={clsx("mykn-ol", `mykn-ol--size-${size}`)} {...props}>
    {children}
  </ol>
);
