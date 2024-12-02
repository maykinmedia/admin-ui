import clsx from "clsx";
import React, { useContext } from "react";

import { DataGridContext } from "./datagrid";

/**
 * DataGrid scroll pane, contains the scrollable content.
 * @param children
 * @constructor
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DataGridScrollPane = <T extends object = object>({
  children,
}: React.PropsWithChildren) => {
  const { allowOverflowX } = useContext(DataGridContext);

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
