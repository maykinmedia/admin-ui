import React from "react";

import "./errormessage.scss";

export type ErrorMessageProps = React.ComponentProps<"span">;

/**
 * ErrorMessage component
 * @param children
 * @param props
 * @constructor
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  children,
  ...props
}) => (
  <span className="mykn-errormessage" role={"alert"} {...props}>
    {children}
  </span>
);
