import React from "react";

import { H2 } from "../../typography";
import { useDataGridContext } from "./datagrid";

/**
 * DataGrid header, shows title as either string or JSX.
 */
export const DataGridHeader = <
  T extends object = object,
  F extends object = T,
>() => {
  const { title, titleId } = useDataGridContext<T, F>();

  return (
    <header className="mykn-datagrid__header">
      {typeof title === "string" ? (
        <H2 id={titleId as string}>{title}</H2>
      ) : (
        title
      )}
    </header>
  );
};
