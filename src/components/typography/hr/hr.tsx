import React from "react";

import "./hr.scss";

export type HrProps = React.HTMLAttributes<HTMLHRElement>;

/**
 * Hr component
 * @param props
 * @constructor
 */
export const Hr: React.FC<HrProps> = ({ ...props }) => (
  <hr className="mykn-hr" {...props} />
);
