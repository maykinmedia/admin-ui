import clsx from "clsx";
import React from "react";

import { useDataGridContext } from "./datagrid";

/**
 * DataGrid table, represents tabular: information presented in a two-dimensional table comprised of rows and columns
 * (fields) of cells containing data.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DataGridTable = <T extends object = object, F extends object = T>({
  children,
}: React.PropsWithChildren) => {
  const { tableLayout, titleId } = useDataGridContext<T, F>();

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
