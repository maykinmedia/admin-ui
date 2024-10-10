import clsx from "clsx";
import React, { useContext } from "react";

import { AttributeData } from "../../../lib";
import { DataGridContext } from "./datagrid";
import { DataGridContentCell } from "./datagridcontentcell";
import { DataGridSelectionCheckbox } from "./datagridselectioncheckbox";

/**
 * DataGrid table body, encapsulates a set of table rows indicating that they
 * comprise the body of a table's (main) data.
 */
export const DataGridTBody: React.FC = () => {
  const {
    dataGridId,
    page,
    renderableFields,
    renderableRows,
    selectable,
    selectedRows,
    equalityChecker = (item1: AttributeData, item2: AttributeData) =>
      item1 === item2,
    sortDirection,
    sortField,
  } = useContext(DataGridContext);

  return (
    <tbody className="mykn-datagrid__tbody" role="rowgroup">
      {renderableRows.map((rowData, index) => (
        <tr
          key={`${dataGridId}-row-${index}`}
          className={clsx("mykn-datagrid__row", {
            "mykn-datagrid__row--selected": !!selectedRows.find((element) =>
              equalityChecker(element, rowData),
            ),
          })}
        >
          {selectable && (
            <td
              className={clsx(
                "mykn-datagrid__cell",
                `mykn-datagrid__cell--checkbox`,
              )}
            >
              <DataGridSelectionCheckbox rowData={rowData} />
            </td>
          )}
          {renderableFields.map((field) => (
            <DataGridContentCell
              key={`sort-${sortField}${sortDirection}-page-${page}-row-${renderableRows.indexOf(rowData)}-column-${renderableFields.indexOf(field)}`}
              field={field}
              rowData={rowData}
            />
          ))}
        </tr>
      ))}
    </tbody>
  );
};
