import clsx from "clsx";
import React, { useEffect, useId, useState } from "react";

import { formatMessage, useIntl } from "../../../lib";
import {
  AttributeData,
  isNull,
  sortAttributeDataArray,
} from "../../../lib/data/attributedata";
import { field2Caption, isLink } from "../../../lib/format/string";
import { BadgeProps } from "../../badge";
import { BoolProps } from "../../boolean";
import { Button } from "../../button";
import { Checkbox } from "../../form";
import { Outline } from "../../icon";
import { Toolbar } from "../../toolbar";
import { A, AProps, H3, P, PProps } from "../../typography";
import { Paginator, PaginatorProps } from "../paginator";
import { Value } from "../value";
import "./datagrid.scss";

/**
 * The default URL fields,
 * @see DataGridProps.urlFields
 */
const DEFAULT_URL_FIELDS = [
  "absolute_url",
  "get_absolute_url",
  "href",
  "get_href",
  "url",
  "get_url",
];

export type DataGridProps = {
  /** The object list (after pagination), only primitive types supported for now. */
  objectList: AttributeData[];

  /** A `string[]` containing the keys in `objectList` to show object for. */
  fields?: string[];

  /** Whether to allow sorting/the field to sort on. */
  sort?: boolean | string;

  /**
   *  A `string[]` containing the fields which should be used to detect the url
   *  of a row. Fields specified in this object won't be rendered, instead: the
   *  first (non url) field is rendered as link (`A`) with `href` set to the
   *  resolved url of the row.
   */
  urlFields?: string[];

  /** Props for A. */
  aProps?: Omit<AProps, "href">;

  /** Props for Badge. */
  badgeProps?: BadgeProps;

  /** Props for Bool. */
  boolProps?: Omit<BoolProps, "value">;

  /**
   * If set, the paginator is enabled.
   * @see {PaginatorPropsAliases}
   */
  paginatorProps?: PaginatorProps;

  /** Defaults to whether paginatorProps is set. */
  showPaginator?: boolean;

  /** Props for P. */
  pProps?: PProps;

  /** A title for the datagrid. */
  title?: string;

  /** Gets called when an object is selected. */
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    attributeData: DataGridProps["objectList"][number],
  ) => void;

  /** Gets called when the object list is sorted. */
  onSort?: (sort: string) => Promise<unknown> | void;
} & PaginatorPropsAliases &
  DataGridSelectableConditional;

type DataGridSelectableConditional =
  | DataGridSelectableTrueProps
  | DataGridSelectableFalseProps;

type DataGridSelectableTrueProps = {
  /** Whether checkboxes should be shown for every row. */
  selectable: true;
  /**
   * Gets called when a selection is made, receives two arguments:
   *
   * - rows: an array containing:
   *   - a single selected item (regular selection).
   *   - all items on page (select all).
   * - selected: boolean indicating whether the rows are selected (true) or deselected (false).
   */
  onSelect?: (rows: AttributeData[], selected: boolean) => void;

  /** Gets called when the selection is changed, receives all currently selected items. */
  onSelectionChange?: (rows: AttributeData[]) => void;

  /** The select item label. */
  labelSelect: string;

  /** The select all items label. */
  labelSelectAll: string;
};

type DataGridSelectableFalseProps = {
  /** Whether checkboxes should be shown for every row. */
  selectable?: false;
  /**
   * Gets called when a selection is made, receives two arguments:
   *
   * - rows: an array containing:
   *   - a single selected item (regular selection).
   *   - all items on page (select all).
   * - selected: boolean indicating whether the rows are selected (true) or deselected (false).
   */
  onSelect?: (rows: AttributeData[], selected: boolean) => void;

  /** Gets called when the selection is changed, receives all currently selected items. */
  onSelectionChange?: (rows: AttributeData[]) => void;

  /** The select item label. */
  labelSelect?: string;

  /** The select all items label. */
  labelSelectAll?: string;
};

/**
 * A subset of `PaginatorProps` that act as aliases.
 * @see {PaginatorProps}
 */
type PaginatorPropsAliases = {
  count?: PaginatorProps["count"];
  loading?: PaginatorProps["loading"];
  page?: PaginatorProps["page"];
  pageSize?: PaginatorProps["pageSize"];
  pageSizeOptions?: PaginatorProps["pageSizeOptions"];
  onPageChange?: PaginatorProps["onPageChange"];
  onPageSizeChange?: PaginatorProps["onPageSizeChange"];
};

/**
 * DataGrid component
 * @param aProps
 * @param badgeProps
 * @param boolProps
 * @param objectList
 * @param onSort
 * @param paginatorProps
 * @param fields
 * @param showPaginator
 * @param pProps
 * @param sort
 * @param selectable
 * @param title
 * @param urlFields
 * @param labelSelect
 * @param labelSelectAll
 * @param onSelect
 * @param onSelectionChange
 * @param count
 * @param loading
 * @param page
 * @param pageSize
 * @param pageSizeOptions
 * @param onClick
 * @param onPageChange
 * @param onPageSizeChange
 * @param props
 * @constructor
 */
export const DataGrid: React.FC<DataGridProps> = ({
  aProps,
  badgeProps,
  boolProps,
  objectList,
  fields = objectList?.length ? Object.keys(objectList[0]) : [],
  paginatorProps,
  showPaginator = Boolean(paginatorProps),
  pProps,
  sort,
  selectable = false,
  title = "",
  urlFields = DEFAULT_URL_FIELDS,
  labelSelect,
  labelSelectAll,
  onSelect,
  onSelectionChange,
  onSort,
  // Aliases
  count,
  loading,
  page,
  pageSize,
  pageSizeOptions,
  onClick,
  onPageChange,
  onPageSizeChange,
  ...props
}) => {
  const id = useId();
  const intl = useIntl();

  const [selectedState, setSelectedState] = useState<AttributeData[] | null>(
    null,
  );
  const [sortState, setSortState] = useState<
    [string, "ASC" | "DESC"] | undefined
  >();

  useEffect(() => {
    selectedState !== null &&
      onSelectionChange?.(selectedState as AttributeData[]);
  }, [selectedState]);

  useEffect(() => {
    if (typeof sort === "string") {
      setSortState([sort, "ASC"]); // TODO;
    }
  }, [sort]);

  const renderableFields = fields.filter((f) => !urlFields.includes(f));
  const sortField = sortState?.[0];
  const sortDirection = sortState?.[1];
  const titleId = title ? `${id}-caption` : undefined;

  const sortedObjectList =
    !onSort && sortField && sortDirection
      ? sortAttributeDataArray(objectList, sortField, sortDirection)
      : objectList || [];

  const allSelected =
    selectedState?.every((a) => sortedObjectList.includes(a)) &&
    sortedObjectList.every((a) => selectedState.includes(a));

  /**
   * Gets called when tha select all checkbox is clicked.
   */
  const handleSelectAll = () => {
    const value = allSelected ? [] : sortedObjectList;
    setSelectedState(value);
    onSelect?.(value, !allSelected);
  };

  const handleSelect = (attributeData: AttributeData) => {
    const currentlySelected = selectedState || [];
    const isAttributeDataCurrentlySelected =
      currentlySelected.includes(attributeData);

    setSelectedState(
      isAttributeDataCurrentlySelected
        ? [...currentlySelected].filter((a) => a !== attributeData)
        : [...currentlySelected, attributeData],
    );

    onSelect?.([attributeData], !isAttributeDataCurrentlySelected);
  };

  /**
   * Get called when a column is sorted.
   * @param field
   */
  const handleSort = (field: string) => {
    const newSortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortState([field, newSortDirection]);
    onSort && onSort(newSortDirection === "ASC" ? field : `-${field}`);
  };

  const contextSelectAll = {
    count: count,
    countPage: sortedObjectList.length,
    selected: selectedState?.length || 0,
    unselected: (count || 0) - (selectedState?.length || 0),
    unselectedPage: sortedObjectList.length - (selectedState?.length || 0),
  };

  /**
   * Renders a cell based on type of `rowData[field]`.
   * @param rowData
   * @param field
   */
  const renderCell = (rowData: AttributeData, field: string) => {
    const rowIndex = sortedObjectList.indexOf(rowData);
    const fieldIndex = renderableFields.indexOf(field);
    const page = paginatorProps?.page;
    const key = `sort-${sortField}${sortDirection}-page-${page}-row-$${rowIndex}-column-${fieldIndex}`;

    // Run assertions for aliased fields.
    if (showPaginator) {
      console.assert(
        count || paginatorProps?.count,
        "Either `count` or `paginatorProps.count` should be set when `showPaginator` is `true`.",
      );
      console.assert(
        page || paginatorProps?.page,
        "Either `page` or `paginatorProps.page` should be set when `showPaginator` is `true`.",
      );
      console.assert(
        pageSize || paginatorProps?.pageSize,
        "Either `pageSize` or `paginatorProps.pageSize` should be set when `showPaginator` is `true`.",
      );
    }

    return (
      <DataGridCell
        key={key}
        aProps={aProps}
        badgeProps={badgeProps}
        boolProps={boolProps}
        pProps={pProps}
        rowData={rowData}
        field={field}
        fields={fields}
        urlFields={urlFields}
        onClick={onClick}
      />
    );
  };

  return (
    <div className="mykn-datagrid" {...props}>
      {/* Caption */}
      <table
        className="mykn-datagrid__table"
        role="grid"
        aria-labelledby={titleId}
      >
        {title && (
          <caption className="mykn-datagrid__caption">
            <H3 id={titleId as string}>{title}</H3>
          </caption>
        )}

        {/* Headings */}
        <thead className="mykn-datagrid__head" role="rowgroup">
          <tr className="mykn-datagrid__row" role="row">
            {selectable && (
              <th
                className={clsx(
                  "mykn-datagrid__cell",
                  "mykn-datagrid__cell--header",
                  "mykn-datagrid__cell--checkbox",
                )}
              >
                <Checkbox
                  checked={allSelected || false}
                  onChange={handleSelectAll}
                  aria-label={
                    labelSelectAll
                      ? formatMessage(labelSelectAll, contextSelectAll)
                      : intl.formatMessage(
                          {
                            id: "mykn.components.DataGrid.labelSelectAll",
                            description:
                              "mykn.components.DataGrid: The select row (accessible) label",
                            defaultMessage: "(de)selecteer {countPage} rijen",
                          },
                          contextSelectAll as unknown as Record<string, string>,
                        )
                  }
                />
              </th>
            )}

            {renderableFields.map((field) => {
              const caption = field2Caption(field);
              const data = objectList?.[0]?.[field];
              const type = typeof data;
              const isSorted = sortField === field;

              return (
                <th
                  key={`${id}-heading-${String(caption)}`}
                  className={clsx(
                    "mykn-datagrid__cell",
                    "mykn-datagrid__cell--header",
                    {
                      [`mykn-datagrid__cell--type-${type}`]:
                        typeof data !== "undefined",
                    },
                  )}
                  role="columnheader"
                >
                  {sort ? (
                    <Button
                      active={isSorted}
                      bold
                      justify
                      muted
                      pad="h"
                      size="xs"
                      variant={"transparent"}
                      wrap={false}
                      onClick={() => handleSort(field)}
                    >
                      {caption}
                      {isSorted && sortDirection === "ASC" && (
                        <Outline.ChevronUpIcon />
                      )}
                      {isSorted && sortDirection === "DESC" && (
                        <Outline.ChevronDownIcon />
                      )}
                      {!isSorted && <Outline.ChevronUpDownIcon />}
                    </Button>
                  ) : (
                    <P bold muted size="xs">
                      {caption}
                    </P>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Cells */}
        <tbody className="mykn-datagrid__body" role="rowgroup">
          {sortedObjectList.map((rowData, index) => (
            <tr key={`${id}-row-${index}`} className="mykn-datagrid__row">
              {selectable && (
                <td
                  className={clsx(
                    "mykn-datagrid__cell",
                    `mykn-datagrid__cell--checkbox`,
                  )}
                >
                  <Checkbox
                    checked={selectedState?.includes(rowData) || false}
                    onChange={() => handleSelect(rowData)}
                    aria-label={
                      labelSelect
                        ? formatMessage(labelSelect, {
                            ...contextSelectAll,
                            ...rowData,
                          })
                        : intl.formatMessage(
                            {
                              id: "mykn.components.DataGrid.labelSelect",
                              description:
                                "mykn.components.DataGrid: The select row (accessible) label",
                              defaultMessage: "(de)selecteer rij",
                            },
                            {
                              ...contextSelectAll,
                              ...rowData,
                            } as unknown as Record<string, string>,
                          )
                    }
                  />
                </td>
              )}
              {renderableFields.map((field) =>
                renderCell(rowData, String(field)),
              )}
            </tr>
          ))}
        </tbody>

        {/* Paginator */}
        {showPaginator && (
          <tfoot className="mykn-datagrid__foot">
            <tr className="mykn-datagrid__row">
              <th
                className="mykn-datagrid__cell"
                colSpan={
                  selectable
                    ? renderableFields.length + 1
                    : renderableFields.length
                }
              >
                <Toolbar align="end" pad={true}>
                  <Paginator
                    count={count as number}
                    loading={loading}
                    page={page as number}
                    pageSize={pageSize as number}
                    pageSizeOptions={pageSizeOptions}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    {...paginatorProps}
                  />
                </Toolbar>
              </th>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export type DataGridCellProps = {
  aProps: DataGridProps["aProps"];
  badgeProps: DataGridProps["badgeProps"];
  boolProps: DataGridProps["boolProps"];
  pProps: DataGridProps["pProps"];
  rowData: AttributeData;
  field: string;
  fields: DataGridProps["fields"];
  urlFields: DataGridProps["urlFields"];
  onClick: DataGridProps["onClick"];
};

/**
 * DataGrid cell
 * @param aProps
 * @param badgeProps
 * @param boolProps
 * @param pProps
 * @param field
 * @param fields
 * @param rowData
 * @param urlFields
 * @param onClick
 * @constructor
 * @private
 */
export const DataGridCell: React.FC<DataGridCellProps> = ({
  aProps,
  badgeProps,
  boolProps,
  pProps,
  field,
  fields = [],
  rowData,
  urlFields = DEFAULT_URL_FIELDS,
  onClick,
}) => {
  const renderableFields = fields.filter((f) => !urlFields.includes(f));
  const fieldIndex = renderableFields.indexOf(field);
  const urlField = urlFields.find((f) => rowData[f]);
  const rowUrl = urlField ? rowData[urlField] : null;
  const value = rowData[field];
  const type = isNull(value) ? "null" : typeof value;

  const isImplicitLink = rowUrl && fieldIndex === 0 && !isLink(String(value));
  const link = isImplicitLink ? String(rowUrl) : "";

  return (
    <td
      className={clsx(
        "mykn-datagrid__cell",
        `mykn-datagrid__cell--type-${type}`,
      )}
      aria-description={field2Caption(field as string)}
    >
      {link && (
        <A
          href={link}
          aria-label={link}
          onClick={(e) => onClick && onClick(e, rowData)}
        >
          <Outline.ArrowTopRightOnSquareIcon />
        </A>
      )}
      <Value
        aProps={aProps}
        badgeProps={badgeProps}
        boolProps={boolProps as BoolProps}
        pProps={pProps}
        value={value}
      />
    </td>
  );
};
