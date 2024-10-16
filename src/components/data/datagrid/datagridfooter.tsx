import React, { useContext } from "react";

import { Toolbar } from "../../toolbar";
import { Paginator } from "../paginator";
import { DataGridContext } from "./datagrid";

/**
 * DataGrid footer, shows paginator.
 */
export const DataGridFooter: React.FC = () => {
  const {
    count,
    loading,
    onPageChange,
    onPageSizeChange,
    page,
    pageSize,
    pageSizeOptions,
    paginatorProps,
  } = useContext(DataGridContext);

  return (
    <Toolbar pad={true} sticky="bottom">
      <Paginator
        count={count}
        loading={loading}
        page={page as number}
        pageSize={pageSize as number}
        pageSizeOptions={pageSizeOptions}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        {...paginatorProps}
      />
    </Toolbar>
  );
};
