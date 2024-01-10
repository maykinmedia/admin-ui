import React from "react";

import "./page.scss";

export type PageProps = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * Provides the base theme for a page.
 * @param children
 * @param props
 * @constructor
 */
export const Page: React.FC<PageProps> = ({ children, ...props }) => (
  <div className="mykn-page" {...props}>
    {children}
  </div>
);
