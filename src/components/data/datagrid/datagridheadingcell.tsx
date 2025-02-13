import clsx from "clsx";
import React from "react";

import { TypedField } from "../../../lib";
import { Button } from "../../button";
import { Outline } from "../../icon";
import { P } from "../../typography";
import { useDataGridContext } from "./datagrid";

export type DataGridHeadingCellProps<
  T extends object = object,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  F extends object = T,
> = React.PropsWithChildren<{
  field: TypedField<T>;
}>;

/**
 * DataGrid (heading) cell
 */
export const DataGridHeadingCell = <
  T extends object = object,
  F extends object = T,
>({
  children,
  field,
}: DataGridHeadingCellProps<T, F>) => {
  const { sortField, sortDirection, onSort } = useDataGridContext<T, F>();
  const isSorted = sortField === field.name;

  return (
    <th
      className={clsx("mykn-datagrid__cell", "mykn-datagrid__cell--header", [
        `mykn-datagrid__cell--type-${field.type}`,
      ])}
      role="columnheader"
      style={field.width ? { width: field.width } : {}}
    >
      {field.sortable ? (
        <Button
          active={isSorted}
          align="space-between"
          bold={isSorted}
          justify={true}
          muted
          pad={false}
          size="xs"
          variant={"transparent"}
          wrap={false}
          onClick={() => onSort(field)}
        >
          {children}
          {isSorted && sortDirection === "ASC" && <Outline.ChevronUpIcon />}
          {isSorted && sortDirection === "DESC" && <Outline.ChevronDownIcon />}
          {!isSorted && <Outline.ChevronUpDownIcon />}
        </Button>
      ) : (
        <P muted size="xs">
          {children}
        </P>
      )}
    </th>
  );
};
