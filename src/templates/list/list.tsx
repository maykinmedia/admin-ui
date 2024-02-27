import React, { useContext } from "react";

import {
  Body,
  Card,
  Column,
  DataGrid,
  DataGridProps,
  Grid,
  Logo,
  Page,
} from "../../components";
import { ConfigContext, NavigationContext } from "../../contexts";

export type ListProps = DataGridProps &
  React.PropsWithChildren<{
    /** Logo (JSX) slot. */
    slotLogo?: React.ReactNode;

    /** Primary navigation (JSX) slot. */
    slotPrimaryNavigation?: React.ReactNode;
  }>;

/**
 * List template
 * @constructor
 */
export const List: React.FC<ListProps> = ({
  children,
  slotLogo,
  slotPrimaryNavigation,
  ...props
}) => {
  const { logo: CustomLogo } = useContext(ConfigContext);
  const { primaryNavigation } = useContext(NavigationContext);

  return (
    <Page>
      <Grid>
        <Column span={12}>
          {slotLogo || CustomLogo || <Logo />}
          {slotPrimaryNavigation || primaryNavigation}
        </Column>

        <Column span={12}>
          {children}

          <Card>
            <Body>
              <DataGrid {...props} />
            </Body>
          </Card>
        </Column>
      </Grid>
    </Page>
  );
};
