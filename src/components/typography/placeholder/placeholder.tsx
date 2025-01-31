import clsx from "clsx";
import React from "react";

import "./placeholder.scss";

export type PlaceholderProps = React.ComponentProps<"hr">;

/**
 * Placeholder component, indicates that content is loading.
 */
export const Placeholder: React.FC<PlaceholderProps> = ({ ...props }) => (
  <hr className={clsx("mykn-placeholder")} aria-hidden={true} {...props} />
);
