import React, { useContext } from "react";

import {
  Column,
  ColumnProps,
  Container,
  Grid,
  Logo,
  Page,
} from "../../components";
import { ConfigContext, NavigationContext } from "../../contexts";

export type BaseProps = Partial<ColumnProps> &
  React.PropsWithChildren<{
    /** Whether to limit the content width using a container. */
    container?: boolean;

    /** Whether to show the primary navigation. */
    showHeader?: boolean;

    /** Logo (JSX) slot. */
    slotLogo?: React.ReactNode;

    /** Primary navigation (JSX) slot. */
    slotPrimaryNavigation?: React.ReactNode;
  }>;

/**
 * Base template
 * @constructor
 */
export const Base: React.FC<BaseProps> = ({
  children,
  container = false,
  showHeader = true,
  slotLogo,
  slotPrimaryNavigation,
  ...props
}) => {
  const { logo: CustomLogo } = useContext(ConfigContext);
  const { primaryNavigation } = useContext(NavigationContext);

  const renderContent = () => (
    <Grid>
      {showHeader && (
        <Column span={12}>
          {slotLogo || CustomLogo || <Logo />}
          {slotPrimaryNavigation || primaryNavigation}
        </Column>
      )}

      <Column span={12} {...props}>
        {children}
      </Column>
    </Grid>
  );

  return (
    <Page>
      {container ? <Container>{renderContent()}</Container> : renderContent()}
    </Page>
  );
};
