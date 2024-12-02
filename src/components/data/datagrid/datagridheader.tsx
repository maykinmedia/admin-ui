import React, { useContext } from "react";

import { H2 } from "../../typography";
import { DataGridContext } from "./datagrid";

/**
 * DataGrid header, shows title as either string or JSX.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DataGridHeader = <T extends object = object>() => {
  const { title, titleId } = useContext(DataGridContext);

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
