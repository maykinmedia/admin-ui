import clsx from "clsx";
import React, { useContext, useEffect, useId, useState } from "react";

import { ConfigContext } from "../../contexts";
import { gettextFirst } from "../../lib";
import { Button } from "../button";
import { Card } from "../card";
import { Outline } from "../icon";
import { Logo, LogoProps } from "../logo";
import { Body } from "../typography";
import "./sidebar.scss";
import { TRANSLATIONS } from "./translations";

export type SidebarProps = React.PropsWithChildren<{
  /** Whether the sidebar should have a border. */
  border?: boolean;

  /** Whether this component is expanded. */
  expanded?: boolean;

  /** Whether this component can be expanded. */
  expandable?: boolean;

  /** An aria-label describing the collapse action. */
  labelCollapse?: string;

  /** An aria-label describing the expand action. */
  labelExpand?: string;

  /** Props to pass to (default) logo. */
  logoProps?: LogoProps;

  /** Whether the sidebar should have a minimum width. */
  minWidth?: boolean;

  /** The position of this component. */
  position?: "start" | "end";

  /** Whether to show the logo. */
  showLogo?: boolean;

  /** Logo (JSX) slot. */
  slotLogo?: React.ReactNode;

  /** Whether the sidebar should be sticky (default: true). */
  sticky?: boolean;
}>;

/**
 * Sidebar component, can be positioned at either ends of the screen, optionally with a Logo component.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  children,
  border = true,
  expandable = true,
  expanded = true,
  labelCollapse,
  labelExpand,
  logoProps,
  minWidth = true,
  position = "start",
  showLogo = false,
  slotLogo,
  sticky = true,
  ...props
}) => {
  const id = useId();
  const [transitionState, setTransitionState] = useState<boolean>(false);
  const [expandedState, setExpandedState] = useState<boolean>(expanded);
  const { logo: CustomLogo } = useContext(ConfigContext);
  const context = { expanded: expandedState };

  const _labelExpand = gettextFirst(
    labelExpand,
    TRANSLATIONS.LABEL_EXPAND,
    context,
  );

  const _labelCollapse = gettextFirst(
    labelCollapse,
    TRANSLATIONS.LABEL_COLLAPSE,
    context,
  );

  useEffect(() => {
    setExpandedState(expanded);
  }, [expanded]);

  const handleClick: React.MouseEventHandler = () => {
    setTransitionState(true);
    setExpandedState(!expandedState);
  };

  const handleTransitionEnd: React.TransitionEventHandler = (e) => {
    const target = e.target as HTMLElement;
    const isSideBar = target.classList?.contains("mykn-sidebar");
    isSideBar && setTransitionState(false);
  };

  const _logo = !showLogo
    ? null
    : slotLogo ||
      CustomLogo || (
        <Logo
          abbreviated={!(expandedState || transitionState || !expandable)}
          {...logoProps}
        />
      );
  return (
    <aside
      className={clsx("mykn-sidebar", `mykn-sidebar--position-${position}`, {
        "mykn-sidebar--border": border,
        "mykn-sidebar--sticky": sticky,
        "mykn-sidebar--min-width": minWidth,
      })}
      {...props}
      aria-expanded={expandedState}
      id={id}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="mykn-sidebar__header">
        {(_logo || expandable) && (
          <Card>
            {_logo && <Body>{_logo}</Body>}
            {expandable && (
              <Button
                className="mykn-sidebar__toggle"
                aria-controls={id}
                title={expandedState ? _labelCollapse : _labelExpand}
                size="xxs"
                pad={false}
                square
                variant="outline"
                onClick={handleClick}
              >
                <Outline.ChevronLeftIcon
                  flipX={
                    (position === "start" && !expandedState) ||
                    (position === "end" && expandedState)
                  }
                />
              </Button>
            )}
          </Card>
        )}
      </div>

      <div className="mykn-sidebar__body">
        <Card>{children}</Card>
      </div>
    </aside>
  );
};
