import { deprecated } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import "./hr.scss";

export type HrProps = React.ComponentProps<"hr"> & {
  /**
   * The size of the vertical margin.
   *
   * Valid values:
   * - "xs" — spacing token `--spacing-xs-v`
   * - "s"  — spacing token `--spacing-s-v`
   * - "m"  — spacing token `--spacing-m-v`
   *
   * Deprecated values:
   * - "l" — use `undefined` instead. Will be removed in version 3.0.0.
   * - "xxl" — use "m" instead. Will be removed in version 3.0.0.
   */
  size?: "xs" | "s" | "m" | "l" | "xxl";
};

/**
 * Hr component
 * @param size
 * @param props
 * @constructor
 */
export const Hr: React.FC<HrProps> = ({ size, ...props }) => {
  let finalSize: "xs" | "s" | "m" | undefined;

  if (size === "l") {
    deprecated(true, `"Hr" size "l"`, `Use "undefined" instead.`);
    finalSize = "s";
  } else if (size === "xxl") {
    deprecated(true, `"Hr" size "xxl"`, `Use "m" instead.`);
    finalSize = "m";
  } else {
    finalSize = size;
  }

  return (
    <hr className={clsx("mykn-hr", `mykn-hr--size-${finalSize}`)} {...props} />
  );
};
