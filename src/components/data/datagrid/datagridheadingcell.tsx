import clsx from "clsx";
import React, { useContext } from "react";

import { TypedField } from "../../../lib";
import { Button } from "../../button";
import { Outline } from "../../icon";
import { P } from "../../typography";
import { DataGridContext } from "./datagrid";

export type DataGridHeadingCellProps = React.PropsWithChildren<{
  field: TypedField;
}>;

/**
 * DataGrid (heading) cell
 */
export const DataGridHeadingCell: React.FC<DataGridHeadingCellProps> = ({
  children,
  field,
}) => {
  const { sortField, sortable, sortDirection, onSort } =
    useContext(DataGridContext);
  const isSorted = sortField === field.name;

  return (
    <th
      className={clsx("mykn-datagrid__cell", "mykn-datagrid__cell--header", [
        `mykn-datagrid__cell--type-${field.type}`,
      ])}
      role="columnheader"
    >
      {sortable ? (
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
