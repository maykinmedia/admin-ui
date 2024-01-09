import React from "react";

import "./test.css";

export type TestProps = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * Test component
 * @param children
 * @param props
 * @constructor
 */
export const Test: React.FC<TestProps> = ({ children, ...props }) => (
  <div className="test" {...props}>
    {children}
  </div>
);
