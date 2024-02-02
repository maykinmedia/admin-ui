import clsx from "clsx";
import React, { useId } from "react";

import { field2Caption, isLink } from "../../lib/format/string";
import { Badge, BadgeProps } from "../badge";
import { Boolean, BooleanProps } from "../boolean";
import { Outline } from "../icon";
import { Paginator, PaginatorProps } from "../paginator";
import { Toolbar } from "../toolbar";
import { A, AProps, H3, P } from "../typography";
import "./datagrid.scss";

export type RowData = Record<string, boolean | number | string | null>;

export type DataGridProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "results"
> & {
  /** The results (after pagination), only primitive types supported for now. */
  results: RowData[];

  /** A `string[]` containing the keys in `results` to show data for. */
  fields?: string[];

  /**
   *  A `string[]` containing the fields which should be used to detect the url
   *  of a row. Fields specified in this array won't be rendered, instead: the
   *  first (non url) field is rendered as link (`A`) with `href` set to the
   *  resolved url of the row.
   */
  urlFields?: string[];

  /** Props for A. */
  aProps?: Omit<AProps, "href">;

  /** Props for Badge. */
  badgeProps?: BadgeProps;

  /** Props for Boolean. */
  booleanProps?: Omit<BooleanProps, "value">;

  /** If set, the paginator is enabled. */
  paginatorProps?: PaginatorProps;

  /** A title for the datagrid. */
  title?: string;
};

/**
 * DataGrid component
 * @param aProps
 * @param badgeProps
 * @param booleanProps
 * @param paginatorProps
 * @param results
 * @param fields
 * @param title
 * @param urlFields
 * @param props
 * @constructor
 */
export const DataGrid: React.FC<DataGridProps> = ({
  aProps,
  badgeProps,
  booleanProps,
  results,
  fields = results?.length ? Object.keys(results[0]) : [],
  paginatorProps,
  title = "",
  urlFields = [
    "absolute_url",
    "get_absolute_url",
    "href",
    "get_href",
    "url",
    "get_url",
  ],
  ...props
}) => {
  const id = useId();
  const renderableFields = fields.filter((f) => !urlFields.includes(f));
  const captions = renderableFields.map(field2Caption);
  const titleId = title ? `${id}-caption` : undefined;

  /**
   * Renders a cell based on type of `rowData[field]`.
   * @param rowData
   * @param field
   * @param index
   */
  const renderCell = (rowData: RowData, field: string, index: number) => {
    const fieldIndex = renderableFields.indexOf(field);
    const urlField = urlFields.find((f) => isLink(String(rowData[f])));
    const rowUrl = urlField ? rowData[urlField] : null;
    const data = rowData[field];
    const type = typeof data;

    // Explicit link: passed as URL without being set as urlField.
    const isExplicitLink = isLink(String(data));

    // Implicit link: first column and `rowUrl` resolved using `urlFields`.
    const isImplicitLink = rowUrl && fieldIndex === 0;

    // If isExplicitLink is truthy, link should be data (data is a link).
    // If isImplicitLink is truthy, link should be rowUrl (rowUrl is resolved URL of row).
    // Otherwise, link should be an empty string (no link was resolved).
    const link = isExplicitLink
      ? String(data)
      : isImplicitLink
        ? String(rowUrl)
        : "";

    let contents: React.ReactNode = data;
    switch (type) {
      case "boolean":
        contents = (
          <Boolean {...(booleanProps as BooleanProps)} value={!!data} />
        );
        break;
      case "number":
        contents = <Badge {...(badgeProps as BadgeProps)}>{data}</Badge>;
    }

    return (
      <td
        className={clsx(
          "mykn-datagrid__cell",
          `mykn-datagrid__cell--type-${type}`,
        )}
        aria-description={field2Caption(field as string)}
        key={`${id}-row-${index}-${String(field)}`}
      >
        {isExplicitLink ? (
          <A href={link} target="_blank" {...aProps}>
            {contents}
          </A>
        ) : (
          <>
            {isImplicitLink ? (
              <P>
                <A href={link} aria-label={link}>
                  <Outline.ArrowTopRightOnSquareIcon />
                </A>
                &nbsp;
                {contents}
              </P>
            ) : (
              <P>{contents}</P>
            )}
          </>
        )}
      </td>
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
            {captions.map((caption) => (
              <th
                key={`${id}-heading-${String(caption)}`}
                className="mykn-datagrid__cell mykn-datagrid__cell--header"
                role="columnheader"
              >
                <P bold muted size="xs">
                  {caption}
                </P>
              </th>
            ))}
          </tr>
        </thead>

        {/* Cells */}
        <tbody className="mykn-datagrid__body" role="rowgroup">
          {results.map((rowData, index) => (
            /**
             * FIXME: This effectively still uses index as keys which might lead to issues.
             * @see {@link https://react.dev/learn/rendering-lists#rules-of-keys|Rules of keys}
             */
            <tr key={`${id}-row-${index}`} className="mykn-datagrid__row">
              {renderableFields.map((field) =>
                renderCell(rowData, String(field), index),
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
