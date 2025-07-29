import clsx from "clsx";
import React from "react";

import "./hr.scss";

export type HrProps = React.ComponentProps<"hr"> & {
  /**
   * The size of the vertical margin.
   */
  margin?: false | "xs" | "s" | "m";
};

/**
 * Hr component
 * @param margin
 * @param props
 */
export const Hr: React.FC<HrProps> = ({ margin = false, ...props }) => {
  return (
    <hr
      className={clsx("mykn-hr", {
        [`mykn-hr--margin-${margin}`]: margin,
      })}
      {...props}
    />
  );
};
