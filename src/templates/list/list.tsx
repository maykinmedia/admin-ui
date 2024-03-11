import React from "react";

import {
  DataGrid,
  DataGridProps,
  Form,
  FormProps,
  H1,
  Toolbar,
} from "../../components";
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
  onClick?: DataGridProps["onClick"];
  onPageChange?: DataGridProps["onPageChange"];
  onPageSizeChange?: DataGridProps["onPageSizeChange"];

  /** Allows a page title to be specified. */
  title?: React.ReactNode;

  /** Allows a form to be added next to the title. */
  formProps?: FormProps;
};

/**
 * List template
 * @constructor
 */
export const List: React.FC<ListProps> = ({
  children,
  dataGridProps,
  fields,
  formProps,
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
    {Boolean(title || formProps) && (
      <Toolbar align="space-between" pad={true} variant="transparent">
        {title && <H1>{title}</H1>}
        {formProps && <Form direction="horizontal" {...formProps} />}
      </Toolbar>
    )}
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
      onClick={onClick}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  </CardBase>
);
