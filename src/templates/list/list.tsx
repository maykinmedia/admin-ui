import React from "react";

import { DataGrid, DataGridProps, ToolbarItem } from "../../components";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type ListProps = BodyBaseProps & {
  objectList: DataGridProps["objectList"];
  fields?: DataGridProps["fields"];
  count?: DataGridProps["count"];
  dataGridProps?: DataGridProps;
  editable?: DataGridProps["editable"];
  loading?: DataGridProps["loading"];
  pageSize?: DataGridProps["pageSize"];
  pageSizeOptions?: DataGridProps["pageSizeOptions"];
  selected?: DataGridProps["selected"];
  sidebarItems?: ToolbarItem[];
  showPaginator?: DataGridProps["showPaginator"];
  showSidebar?: boolean;
  sort?: DataGridProps["sort"];
  title?: React.ReactNode;
  onChange?: DataGridProps["onChange"];
  onClick?: DataGridProps["onClick"];
  onEdit?: DataGridProps["onEdit"];
  onSelect?: DataGridProps["onSelect"];
  onSelectionChange?: DataGridProps["onSelectionChange"];
  onPageChange?: DataGridProps["onPageChange"];
  onPageSizeChange?: DataGridProps["onPageSizeChange"];
} & ListSelectableConditional;

type ListSelectableConditional =
  | ListSelectableTrueProps
  | ListSelectableFalseProps;

type ListSelectableTrueProps = {
  /** Whether checkboxes should be shown for every row. */
  selectable: true;

  /** The select item label. */
  labelSelect: string;

  /** The select all items label. */
  labelSelectAll: string;
};

type ListSelectableFalseProps = {
  /** Whether checkboxes should be shown for every row. */
  selectable?: false;

  /** The select item label. */
  labelSelect?: string;

  /** The select all items label. */
  labelSelectAll?: string;
};

/**
 * List template
 * @constructor
 */
export const List: React.FC<ListProps> = ({
  children,
  dataGridProps,
  editable,
  fields,
  objectList,
  count = objectList.length,
  loading,
  onChange,
  onClick,
  onEdit,
  onPageChange,
  onPageSizeChange,
  onSelect,
  onSelectionChange,
  pageSize,
  pageSizeOptions,
  showPaginator,
  selectable,
  selected,
  labelSelect,
  labelSelectAll,
  sort,
  title,
  ...props
}) => (
  <CardBase {...props}>
    {children}
    <DataGrid
      {...dataGridProps}
      count={count}
      editable={editable}
      onEdit={onEdit}
      fields={fields}
      loading={loading}
      objectList={objectList}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      showPaginator={showPaginator}
      selectable={selectable}
      selected={selected}
      title={title}
      labelSelect={labelSelect}
      labelSelectAll={labelSelectAll}
      onSelect={onSelect}
      onSelectionChange={onSelectionChange}
      sort={sort}
      onChange={onChange}
      onClick={onClick}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  </CardBase>
);
