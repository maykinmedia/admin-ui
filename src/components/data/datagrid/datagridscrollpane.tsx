import clsx from "clsx";
import React, { useContext } from "react";

import { DataGridContext } from "./datagrid";

/**
 * DataGrid scroll pane, contains the scrollable content.
 * @param children
 * @constructor
 */
export const DataGridScrollPane: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
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
