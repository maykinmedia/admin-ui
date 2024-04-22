import clsx from "clsx";
import React, { useContext, useEffect, useId, useState } from "react";

import { ConfigContext } from "../../contexts";
import { formatMessage, useIntl } from "../../lib";
import { Button } from "../button";
import { Card } from "../card";
import { Outline } from "../icon";
import { Logo, LogoProps } from "../logo";
import { Body } from "../typography";
import "./sidebar.scss";

export type SidebarProps = React.PropsWithChildren<{
  /** The position of this component. */
  position?: "start" | "end";

  /** Props to pass to (default) logo. */
  logoProps?: LogoProps;

  /** Whether this component is expanded. */
  expanded?: boolean;

  /** Whether this component can be expanded. */
  expandable?: boolean;

  /** An aria-label describing the expand action. */
  labelExpand?: string;

  /** An aria-label describing the collapse action. */
  labelCollapse?: string;

  /** Logo (JSX) slot. */
  slotLogo?: React.ReactNode;
}>;

/**
 * Sidebar component, can be positioned at either ends of the screen, optionally with a Logo component.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  children,
  expandable = true,
  expanded = true,
  logoProps,
  position = "start",
  slotLogo,
  labelExpand,
  labelCollapse,
  ...props
}) => {
  const id = useId();
  const [transitionState, setTransitionState] = useState<boolean>(false);
  const [expandedState, setExpandedState] = useState<boolean>(expanded);
  const { logo: CustomLogo } = useContext(ConfigContext);
  const intl = useIntl();
  const context = { expanded: expandedState };

  const _labelExpand = labelExpand
    ? formatMessage(labelExpand, { expanded: expandedState })
    : intl.formatMessage(
        {
          id: "mykn.components.Sidebar.expand",
          description:
            "mykn.components.Sidebar: An aria-label describing the expand action",
          defaultMessage: "Zijbalk uitklappen",
        },
        context,
      );

  const _labelCollapse = labelCollapse
    ? formatMessage(labelCollapse, { expanded: expandedState })
    : intl.formatMessage(
        {
          id: "mykn.components.Sidebar.collapse",
          description:
            "mykn.components.Sidebar: An aria-label describing the collapse action",
          defaultMessage: "Zijbalk inklappen",
        },
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

  const _logo = slotLogo || CustomLogo || (
    <Logo
      variant={
        expandedState || transitionState || !expandable ? "normal" : "compact"
      }
      {...logoProps}
    />
  );
  return (
    <aside
      className={clsx("mykn-sidebar", `mykn-sidebar--position-${position}`)}
      {...props}
      aria-expanded={expandedState}
      id={id}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="mykn-sidebar__header">
        {_logo && (
          <Card>
            <Body>{_logo}</Body>
            {expandable && (
              <Button
                className="mykn-sidebar__toggle"
                aria-controls={id}
                title={expandedState ? _labelCollapse : _labelExpand}
                size="xs"
                pad={false}
                rounded
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
