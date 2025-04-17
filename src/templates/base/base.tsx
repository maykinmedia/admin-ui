import React, { useContext } from "react";

import {
  Column,
  ColumnProps,
  Container,
  Grid,
  GridProps,
  Navbar,
  Page,
  PageProps,
  Sidebar,
  Toolbar,
  ToolbarItem,
} from "../../components";
import { ConfigContext, NavigationContext } from "../../contexts";

export type BaseTemplateProps = React.PropsWithChildren & {
  /** Column props. */
  columnProps?: ColumnProps;

  /** Page props. */
  pageProps?: PageProps;

  /** Whether to limit the content width using a container. */
  container?: boolean;

  /** Whether to only output the page inner contents. */
  contentOnly?: boolean;

  /** Whether to wrap content in a grid. */
  grid?: boolean;

  /** Grid props. */
  gridProps?: GridProps;

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
  contentOnly,
  grid,
  gridProps,
  primaryNavigationItems = [],
  sidebarItems = [],
  slotPrimaryNavigation,
  slotSidebar,
}) => {
  const { templatesContentOnly = false, templatesGrid = true } =
    useContext(ConfigContext);
  const _contentOnly =
    typeof contentOnly !== "undefined" ? contentOnly : templatesContentOnly;

  const _grid = typeof grid !== "undefined" ? grid : templatesGrid;

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
        variant="primary"
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

  const content = _grid ? (
    <Grid {...gridProps} fullHeight={true}>
      <Column direction="row" span={12} {...columnProps}>
        {children}
      </Column>
    </Grid>
  ) : (
    children
  );

  const _content = container ? <Container>{content}</Container> : content;

  const page = (
    <Page {...pageProps}>
      {slotPrimaryNavigation || contextNavigation}
      {slotSidebar || contextSidebar}
      {_content}
    </Page>
  );
  return _contentOnly ? _content : page;
};
