import { slugify } from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { Children, ReactElement, isValidElement, useState } from "react";

import { Button } from "../button";
import "./tabs.scss";

export type TabsProps = React.PropsWithChildren<{
  onTabChange?: (activeTabIndex: number) => void;
  activeTabIndex?: number;
}>;

/**
 * A tabs component meant to allow for cycling through different content sections. Allows for passing custom react nodes as content for each tab.
 * @param tabs
 * @param onTabChange
 * @param activeTabIndex - The index of the currently active tab. If not provided, the component will manage its own state.
 * @param props
 * @constructor
 */

export const Tabs: React.FC<TabsProps> = ({
  onTabChange,
  activeTabIndex,
  children,
  ...props
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  const isControlled = activeTabIndex !== undefined;
  const activeTab = isControlled ? activeTabIndex : internalActiveTab;

  const handleTabClick = (index: number) => {
    if (!isControlled) {
      setInternalActiveTab(index);
    }
    if (onTabChange) {
      onTabChange(index);
    }
  };

  const tabs = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === Tab,
  ) as ReactElement<TabProps>[];

  return (
    <div className={clsx("mykn-tabs")} {...props}>
      <nav className="mykn-tabs__tablist" role="tablist">
        {tabs.map((tab, index) => {
          const slug = slugify(tab.props.label);
          const localId = tab.props.id || slug;

          return (
            <React.Fragment key={localId}>
              <Button
                active={activeTab === index}
                aria-controls={`tab-content-${localId}`}
                aria-selected={activeTab === index ? "true" : "false"}
                id={`tab-${localId}`}
                role="tab"
                variant="transparent"
                onClick={() => handleTabClick(index)}
              >
                {tab.props.label}
              </Button>
            </React.Fragment>
          );
        })}
      </nav>
      {tabs.map((tab, index) => {
        const slug = slugify(tab.props.label);
        const localId = tab.props.id || slug;

        return (
          <div
            key={localId}
            id={`tab-content-${localId}`}
            role="tabpanel"
            aria-labelledby={`tab-${localId}`}
            hidden={activeTab !== index}
            className="mykn-tabs__content"
          >
            {tab.props.children}
          </div>
        );
      })}
    </div>
  );
};

export type TabProps = React.PropsWithChildren<{
  label: string;
  id?: string;
}>;

/**
 * A tab component meant to be used as a child of the Tabs component. It is used to define the label and content of a tab.
 * @param label - The label of the tab
 * @param id - The id of the tab
 * @param children - The content of the tab
 */
export const Tab: React.FC<TabProps> = ({ children }) => {
  // Just a placeholder, as actual rendering does not happen here
  return <>{children}</>;
};
