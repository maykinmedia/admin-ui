import React, { useContext } from "react";

import {
  Column,
  ColumnProps,
  Container,
  Grid,
  Navbar,
  Page,
  PageProps,
  Sidebar,
  Toolbar,
  ToolbarItem,
} from "../../components";
import { NavigationContext } from "../../contexts";

export type BaseTemplateProps = React.PropsWithChildren & {
  /** Column props. */
  columnProps?: ColumnProps;

  /** Page props. */
  pageProps?: PageProps;

  /** Whether to limit the content width using a container. */
  container?: boolean;

  /** Primary navigation items. */
  primaryNavigationItems?: ToolbarItem[];

  /** Sidebar items. */
  sidebarItems?: ToolbarItem[];

  /** Primary navigation (JSX) slot. */
  slotPrimaryNavigation?: React.ReactNode;

  /** Sidebar (JSX) slot. */
  slotSidebar?: React.ReactNode;
};

/**
 * Base template
 * @constructor
 */
export const BaseTemplate: React.FC<BaseTemplateProps> = ({
  children,
  columnProps,
  pageProps,
  container = false,
  primaryNavigationItems = [],
  sidebarItems = [],
  slotPrimaryNavigation,
  slotSidebar,
}) => {
  const {
    primaryNavigation,
    primaryNavigationItems: _primaryNavigationItems,
    sidebar,
    sidebarItems: _sidebarItems,
  } = useContext(NavigationContext);

  const contextNavigation =
    primaryNavigation ||
    (primaryNavigationItems.length || _primaryNavigationItems?.length ? (
      <Navbar
        items={
          primaryNavigationItems.length
            ? primaryNavigationItems
            : _primaryNavigationItems
        }
      />
    ) : null);

  const contextSidebar =
    sidebar ||
    (sidebarItems.length || _sidebarItems?.length ? (
      <Sidebar expanded>
        <Toolbar
          align="space-between"
          direction="vertical"
          pad={true}
          items={(sidebarItems.length ? sidebarItems : _sidebarItems) || []}
          variant="transparent"
        />
      </Sidebar>
    ) : null);

  const content = (
    <Grid>
      <Column direction="row" span={12} {...columnProps}>
        {slotPrimaryNavigation || contextNavigation}
        {slotSidebar || contextSidebar}
        {children}
      </Column>
    </Grid>
  );

  return (
    <Page {...pageProps}>
      {container ? <Container>{content}</Container> : content}
    </Page>
  );
};
