import clsx from "clsx";
import React from "react";

import { useDataGridContext } from "./datagridcontext";

/**
 * DataGrid scroll pane, contains the scrollable content.
 * @param children
 * @constructor
 */
export const DataGridScrollPane = <
  T extends object = object,
  F extends object = T,
>({
  children,
}: React.PropsWithChildren) => {
  const { allowOverflowX } = useDataGridContext<T, F>();

  return (
    <div
      className={clsx("mykn-datagrid__scrollpane", {
        "mykn-datagrid__scrollpane--allow-overflow-x": allowOverflowX,
      })}
    >
      {children}
    </div>
  );
};
