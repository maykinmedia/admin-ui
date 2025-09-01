import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";

import { DataGridContentCell } from "./datagridcontentcell";
import { useDataGridContext } from "./datagridcontext";
import { DataGridSelectionCheckbox } from "./datagridselectioncheckbox";

/**
 * DataGrid table body, encapsulates a set of table rows indicating that they
 * comprise the body of a table's (main) data.
 */
export const DataGridTBody = <
  T extends object = object,
  F extends object = T,
>() => {
  const {
    dataGridRef,
    dataGridId,
    editingState,
    page,
    renderableFields,
    renderableRows,
    selectable,
    selectedRows,
    equalityChecker = (item1, item2) => item1 === item2,
    sortDirection,
    sortField,
  } = useDataGridContext<T, F>();

  return (
    <tbody className="mykn-datagrid__tbody" role="rowgroup">
      {renderableRows.map((rowData, renderableRowIndex) => {
        const isEditingRow =
          typeof editingState === "boolean"
            ? editingState
            : editingState[0] === rowData;

        return (
          <tr
            key={`${dataGridId}-row-${renderableRowIndex}`}
            className={clsx("mykn-datagrid__row", {
              "mykn-datagrid__row--selected": !!selectedRows.find((element) =>
                equalityChecker(element, rowData),
              ),
            })}
          >
            {Boolean(isEditingRow && dataGridRef.current) &&
              createPortal(
                <form
                  id={`${dataGridId}-editable-form-${renderableRowIndex}`}
                  onSubmit={(e) => e.preventDefault()}
                />,
                dataGridRef.current,
              )}

            {selectable && (
              <td
                className={clsx(
                  "mykn-datagrid__cell",
                  `mykn-datagrid__cell--checkbox`,
                )}
              >
                <DataGridSelectionCheckbox<T> rowData={rowData} />
              </td>
            )}
            {renderableFields.map((field) => (
              <DataGridContentCell<T>
                key={`sort-${sortField}${sortDirection}-page-${page}-row-${renderableRows.indexOf(rowData)}-column-${renderableFields.indexOf(field)}`}
                field={field}
                renderableRowIndex={renderableRowIndex}
              />
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};
