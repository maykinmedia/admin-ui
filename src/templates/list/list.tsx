import React from "react";

import { DataGrid, DataGridProps } from "../../components";
import { BodyBase } from "../base/bodyBase";

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
}) => (
  <BodyBase slotLogo={slotLogo} slotPrimaryNavigation={slotPrimaryNavigation}>
    {children}
    <DataGrid {...props} />
  </BodyBase>
);
