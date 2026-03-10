import React from "react";

import "./helptext.scss";

export type HelpTextProps = React.ComponentProps<"div">;

/**
 * ErrorMessage component
 * @param children
 * @param props
 * @constructor
 */
export const HelpText: React.FC<HelpTextProps> = ({
  children,
  ...props
}) => (
  <div className="mykn-helptext" {...props}>
    {children}
  </div>
);
