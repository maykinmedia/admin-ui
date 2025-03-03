import clsx from "clsx";
import React, { Children, ReactElement, isValidElement, useState } from "react";

import { slugify } from "../../lib/format/string";
import { Button } from "../button";
import "./tabs.scss";

export type TabsProps = React.PropsWithChildren<{
  onTabChange?: (activeTabIndex: number) => void;
}>;

/**
 * A tabs component meant to allow for cycling through different content sections. Allows for passing custom react nodes as content for each tab.
 * @param tabs
 * @param onTabChange
 * @param props
 * @constructor
 */
export const Tabs: React.FC<TabsProps> = ({
  onTabChange,
  children,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
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
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.props.id || slugify(tab.props.label)}>
            <Button
              active={activeTab === index}
              aria-controls={`tab-content-${tab.props.id || slugify(tab.props.label)}`}
              aria-selected={activeTab === index ? "true" : "false"}
              id={`tab-${tab.props.id || slugify(tab.props.label)}`}
              pad="h"
              role="tab"
              variant="transparent"
              onClick={() => handleTabClick(index)}
            >
              {tab.props.label}
            </Button>
          </React.Fragment>
        ))}
      </nav>
      {tabs.map((tab, index) => (
        <div
          key={tab.props.id}
          id={`tab-content-${tab.props.id || slugify(tab.props.label)}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.props.id || slugify(tab.props.label)}`}
          hidden={activeTab !== index}
          className="mykn-tabs__content"
        >
          {tab.props.children}
        </div>
      ))}
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
