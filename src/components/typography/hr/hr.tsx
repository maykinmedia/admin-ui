import clsx from "clsx";
import React from "react";

import "./hr.scss";

export type HrProps = React.ComponentProps<"hr"> & {
  /** The size of the margin. */
  size?: "l" | "xxl";
};

/**
 * Hr component
 * @param size
 * @param props
 * @constructor
 */
export const Hr: React.FC<HrProps> = ({ size = "l", ...props }) => (
  <hr className={clsx("mykn-hr", `mykn-hr--size-${size}`)} {...props} />
);
