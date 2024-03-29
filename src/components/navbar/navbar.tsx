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
    window?.matchMedia("(max-width: 767px)").matches ?? true,
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

  return (
    <div className="mykn-navbar">
      {isMobile ? (
        <Dropdown
          label={<Outline.Bars2Icon />}
          aria-label="Menu openen/sluiten"
          {...props}
          variant={"transparent"}
        >
          {children}
        </Dropdown>
      ) : (
        <Toolbar
          align="end"
          variant={isMobile ? "normal" : "transparent"}
          {...props}
        >
          {children}
        </Toolbar>
      )}
    </div>
  );
};
