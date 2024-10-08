import React, { useContext } from "react";

import { H2 } from "../../typography";
import { DataGridContext } from "./datagrid";

/**
 * DataGrid header, shows title as either string or JSX.
 */
export const DataGridHeader: React.FC = () => {
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
