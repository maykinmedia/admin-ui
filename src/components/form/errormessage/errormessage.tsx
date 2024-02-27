import React from "react";

import "./errormessage.scss";

export type ErrorMessageProps = React.ComponentProps<"div">;

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
  <div className="mykn-errormessage" role={"alert"} {...props}>
    {children}
  </div>
);
