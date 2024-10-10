import clsx from "clsx";
import React, { useContext } from "react";

import { DataGridContext } from "./datagrid";

/**
 * DataGrid table, represents tabular: information presented in a two-dimensional table comprised of rows and columns
 * (fields) of cells containing data.
 */
export const DataGridTable: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { tableLayout, titleId } = useContext(DataGridContext);

  return (
    <table
      className={clsx("mykn-datagrid__table", {
        [`mykn-datagrid__table--layout-${tableLayout}`]: tableLayout,
      })}
      role="grid"
      aria-labelledby={titleId}
    >
      {children}
    </table>
  );
};
