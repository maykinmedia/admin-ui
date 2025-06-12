import React from "react";

import { Paginator } from "../paginator";
import { useDataGridContext } from "./datagridcontext";

/**
 * DataGrid footer, shows paginator.
 */
export const DataGridFooter = <
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends object = object,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  F extends object = T,
>() => {
  const {
    count,
    loading,
    onPageChange,
    onPageSizeChange,
    page,
    pageSize,
    pageSizeOptions,
    paginatorProps,
  } = useDataGridContext<T, F>();

  return (
    <div className="mykn-datagrid__footer">
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
    </div>
  );
};
