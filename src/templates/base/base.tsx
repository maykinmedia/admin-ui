import React, { useContext } from "react";

import {
  Column,
  ColumnProps,
  Container,
  Grid,
  Logo,
  Page,
  PageProps,
} from "../../components";
import { ConfigContext, NavigationContext } from "../../contexts";

export type BaseProps = React.PropsWithChildren & {
  /** Column props. */
  columnProps?: ColumnProps;

  /** Page props. */
  pageProps?: PageProps;

  /** Whether to limit the content width using a container. */
  container?: boolean;

  /** Whether to show the primary navigation. */
  showHeader?: boolean;

  /** Breadcrumbs navigation (JSX) slot. */
  slotBreadcrumbs?: React.ReactNode;

  /** Logo (JSX) slot. */
  slotLogo?: React.ReactNode;

  /** Primary navigation (JSX) slot. */
  slotPrimaryNavigation?: React.ReactNode;

  /** Sidebar (JSX) slot. */
  slotSidebar?: React.ReactNode;
};

/**
 * Base template
 * @constructor
 */
export const Base: React.FC<BaseProps> = ({
  children,
  columnProps,
  pageProps,
  container = false,
  showHeader = true,
  slotBreadcrumbs,
  slotLogo,
  slotPrimaryNavigation,
  slotSidebar,
}) => {
  const { logo: CustomLogo } = useContext(ConfigContext);
  const { breadcrumbs, primaryNavigation } = useContext(NavigationContext);

  const renderContent = () => (
    <Grid>
      {showHeader && (
        <>
          <Column span={12}>
            {slotLogo || CustomLogo || <Logo />}
            {slotPrimaryNavigation || primaryNavigation}
          </Column>
          <Column span={12}>{slotBreadcrumbs || breadcrumbs}</Column>
        </>
      )}

      <Column span={slotSidebar ? 10 : 12} {...columnProps}>
        {children}
      </Column>

      {slotSidebar ? <Column span={2}>{slotSidebar}</Column> : undefined}
    </Grid>
  );

  return (
    <Page {...pageProps}>
      {container ? <Container>{renderContent()}</Container> : renderContent()}
    </Page>
  );
};
