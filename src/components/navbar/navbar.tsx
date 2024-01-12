import React, { useEffect, useState } from "react";

import { Dropdown } from "../dropdown";
import { Outline } from "../icon";
import { Toolbar, ToolbarProps } from "../toolbar";
import "./navbar.scss";

export type NavbarProps = ToolbarProps;

/**
 * Shows a toolbar or dropdown based on mobile/desktop.
 * @param children
 * @param props
 * @constructor
 */
export const Navbar: React.FC<NavbarProps> = ({ children, ...props }) => {
  const [isMobile, setIsMobile] = useState(
    window?.matchMedia("(max-width: 767px)").matches,
  );

  /**
   * Updates `isMobile` on resize.
   */
  useEffect(() => {
    const onResize = () =>
      setIsMobile(window?.matchMedia("(max-width: 767px)").matches);

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  /**
   * Renders the toolbar.
   */
  const renderToolbar = () => (
    <Toolbar
      align="end"
      variant={isMobile ? "normal" : "transparent"}
      {...props}
    >
      {children}
    </Toolbar>
  );

  return (
    <div className="mykn-navbar">
      {isMobile ? (
        <Dropdown
          label={<Outline.Bars2Icon />}
          variant="transparent"
          aria-label="Menu openen/sluiten"
        >
          {renderToolbar()}
        </Dropdown>
      ) : (
        renderToolbar()
      )}
    </div>
  );
};
