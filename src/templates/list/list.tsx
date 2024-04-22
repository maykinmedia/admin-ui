import React from "react";

import {
  Body,
  DataGrid,
  DataGridProps,
  ErrorMessage,
  ErrorMessageProps,
  Form,
  FormProps,
  H2,
  Sidebar,
  Toolbar,
  ToolbarItem,
} from "../../components";
import { forceArray } from "../../lib";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type ListProps = BodyBaseProps & {
  objectList: DataGridProps["objectList"];
  fields?: DataGridProps["fields"];
  count?: DataGridProps["count"];
  dataGridProps?: DataGridProps;
  editable?: DataGridProps["editable"];
  errorMessageProps?: ErrorMessageProps;
  errors?: ErrorMessageProps["children"] | ErrorMessageProps["children"][];
  loading?: DataGridProps["loading"];
  pageSize?: DataGridProps["pageSize"];
  pageSizeOptions?: DataGridProps["pageSizeOptions"];
  showPaginator?: DataGridProps["showPaginator"];
  showSidebar?: boolean;
  selected?: DataGridProps["selected"];
  sidebarItems?: ToolbarItem[];
  sort?: DataGridProps["sort"];
  onChange?: DataGridProps["onChange"];
  onClick?: DataGridProps["onClick"];
  onEdit?: DataGridProps["onEdit"];
  onSelect?: DataGridProps["onSelect"];
  onSelectionChange?: DataGridProps["onSelectionChange"];
  onPageChange?: DataGridProps["onPageChange"];
  onPageSizeChange?: DataGridProps["onPageSizeChange"];

  /** Allows a page title to be specified. */
  title?: React.ReactNode;

  /** Allows a form to be added next to the title. */
  formProps?: FormProps;
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
  errorMessageProps,
  errors = [],
  fields,
  formProps,
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
  pageProps,
  pageSize,
  pageSizeOptions,
  sidebarItems = [],
  showHeader,
  showPaginator,
  showSidebar = sidebarItems.length > 0,
  selectable,
  selected,
  slotSidebar,
  labelSelect,
  labelSelectAll,
  sort,
  title,
  ...props
}) => {
  const _errors = forceArray(errors);
  const _showSidebar = slotSidebar || showSidebar;
  const _showHeader =
    typeof showHeader === "boolean" ? showHeader : !_showSidebar;

  return (
    <CardBase
      pageProps={{ pad: !showSidebar, ...pageProps }}
      showHeader={_showHeader}
      slotSidebar={
        slotSidebar ||
        (showSidebar && (
          <Sidebar expanded>
            <Toolbar
              align="space-between"
              direction="vertical"
              pad={true}
              items={sidebarItems}
              variant="transparent"
            />
          </Sidebar>
        ))
      }
      {...props}
    >
      {_errors && _errors.length > 0 && (
        <Body>
          {_errors.map((e) => (
            <ErrorMessage key={String(e)} {...errorMessageProps}>
              {e}
            </ErrorMessage>
          ))}
        </Body>
      )}
      {children}
      {Boolean(title || formProps) && (
        <Toolbar align="space-between" pad={true} sticky="top">
          {title && <H2>{title}</H2>}
          {formProps && (
            <Form
              direction="horizontal"
              toolbarProps={{ pad: false }}
              {...formProps}
            />
          )}
        </Toolbar>
      )}
      {/* @ts-expect-error - presumable unable to detect selectable=true option for DataGrid.*/}
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
};
