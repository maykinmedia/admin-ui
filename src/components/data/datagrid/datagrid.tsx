import clsx from "clsx";
import React, { useEffect, useId, useState } from "react";

import {
  AttributeData,
  isNull,
  sortAttributeDataArray,
} from "../../../lib/data/attributedata";
import { field2Caption, isLink } from "../../../lib/format/string";
import { BadgeProps } from "../../badge";
import { BoolProps } from "../../boolean";
import { Button } from "../../button";
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
  /** The results (after pagination), only primitive types supported for now. */
  results: AttributeData[];

  /** A `string[]` containing the keys in `results` to show data for. */
  fields?: string[];

  /** Whether to allow sorting/the field to sort on. */
  sort?: boolean | string;

  /**
   *  A `string[]` containing the fields which should be used to detect the url
   *  of a row. Fields specified in this data won't be rendered, instead: the
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

  /** If set, the paginator is enabled. */
  paginatorProps?: PaginatorProps;

  /** Props for P. */
  pProps?: PProps;

  /** A title for the datagrid. */
  title?: string;

  onSort?: (sort: string) => Promise<unknown> | void;
};

/**
 * DataGrid component
 * @param aProps
 * @param badgeProps
 * @param boolProps
 * @param onSort
 * @param paginatorProps
 * @param results
 * @param fields
 * @param pProps
 * @param sort
 * @param title
 * @param urlFields
 * @param props
 * @constructor
 */
export const DataGrid: React.FC<DataGridProps> = ({
  aProps,
  badgeProps,
  boolProps,
  results,
  fields = results?.length ? Object.keys(results[0]) : [],
  paginatorProps,
  pProps,
  sort,
  title = "",
  urlFields = DEFAULT_URL_FIELDS,
  onSort,
  ...props
}) => {
  const id = useId();
  const [sortState, setSortState] = useState<
    [string, "ASC" | "DESC"] | undefined
  >();

  useEffect(() => {
    if (typeof sort === "string") {
      setSortState([sort, "ASC"]); // TODO;
    }
  }, [sort]);

  const renderableFields = fields.filter((f) => !urlFields.includes(f));
  const sortField = sortState?.[0];
  const sortDirection = sortState?.[1];
  const titleId = title ? `${id}-caption` : undefined;

  const sortedResults =
    !onSort && sortField && sortDirection
      ? sortAttributeDataArray(results, sortField, sortDirection)
      : results;

  /**
   * Get called when a column is sorted.
   * @param field
   */
  const handleSort = (field: string) => {
    const newSortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortState([field, newSortDirection]);
    onSort && onSort(newSortDirection === "ASC" ? field : `-${field}`);
  };

  /**
   * Renders a cell based on type of `rowData[field]`.
   * @param rowData
   * @param field
   */
  const renderCell = (rowData: AttributeData, field: string) => {
    const rowIndex = sortedResults.indexOf(rowData);
    const fieldIndex = renderableFields.indexOf(field);
    const page = paginatorProps?.page;
    const key = `sort-${sortField}${sortDirection}-page-${page}-row-$${rowIndex}-column-${fieldIndex}`;

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
            {renderableFields.map((field) => {
              const caption = field2Caption(field);
              const data = results?.[0]?.[field];
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
          {sortedResults.map((rowData, index) => (
            <tr key={`${id}-row-${index}`} className="mykn-datagrid__row">
              {renderableFields.map((field) =>
                renderCell(rowData, String(field)),
              )}
            </tr>
          ))}
        </tbody>

        {/* Paginator */}
        {paginatorProps && (
          <tfoot className="mykn-datagrid__foot">
            <tr className="mykn-datagrid__row">
              <th
                className="mykn-datagrid__cell"
                colSpan={renderableFields.length}
              >
                <Toolbar align="end" padH={true}>
                  <Paginator {...paginatorProps} />
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
}) => {
  const renderableFields = fields.filter((f) => !urlFields.includes(f));
  const fieldIndex = renderableFields.indexOf(field);
  const urlField = urlFields.find((f) => isLink(String(rowData[f])));
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
        <A href={link} aria-label={link}>
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