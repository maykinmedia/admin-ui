import React from "react";

import { DataGrid, DataGridProps } from "../../components";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type ListProps = BodyBaseProps & {
  objectList: DataGridProps["objectList"];
  fields?: DataGridProps["fields"];
  count?: DataGridProps["count"];
  dataGridProps?: Partial<DataGridProps>;
  loading?: DataGridProps["loading"];
  pageSize?: DataGridProps["pageSize"];
  pageSizeOptions?: DataGridProps["pageSizeOptions"];
  showPaginator?: DataGridProps["showPaginator"];
  sort?: DataGridProps["sort"];
  title?: DataGridProps["title"];
  onClick?: DataGridProps["onClick"];
  onPageChange?: DataGridProps["onPageChange"];
  onPageSizeChange?: DataGridProps["onPageSizeChange"];
};

/**
 * List template
 * @constructor
 */
export const List: React.FC<ListProps> = ({
  children,
  dataGridProps,
  fields,
  objectList,
  count = objectList.length,
  loading,
  onClick,
  onPageChange,
  onPageSizeChange,
  pageSize,
  pageSizeOptions,
  showPaginator,
  sort,
  title,
  ...props
}) => (
  <CardBase {...props}>
    {children}
    <DataGrid
      {...dataGridProps}
      count={count}
      fields={fields}
      loading={loading}
      objectList={objectList}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      showPaginator={showPaginator}
      sort={sort}
      title={title}
      onClick={onClick}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  </CardBase>
);
