import React from "react";

import { Toolbar, ToolbarProps } from "../toolbar";
import "./navbar.scss";

export type NavbarProps = ToolbarProps;

/**
 * Shows a toolbar tailored for navigation.
 */
export const Navbar: React.FC<NavbarProps> = ({ children, ...props }) => {
  return (
    <Toolbar
      direction="vertical"
      justify="v"
      pad
      padSize="xs"
      variant="primary"
      sticky="top"
      {...props}
    >
      {children}
    </Toolbar>
  );
};
