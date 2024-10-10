import React, { CSSProperties, useContext, useEffect, useRef } from "react";

import { field2Title } from "../../../lib";
import { DataGridContext, scrollPaneRef } from "./datagrid";
import { DataGridFilter } from "./datagridfilter";
import { DataGridHeadingCell } from "./datagridheadingcell";

/**
 * DataGrid table head, encapsulates a set of table rows, indicating that they
 * comprise the head of a table with information about the table's columns.
 */
export const DataGridTHead: React.FC = () => {
  const ref = useRef<HTMLTableSectionElement>(null);

  const {
    dataGridId,
    filterable,
    height,
    renderableFields,
    selectable,
    toolbarRef,
  } = useContext(DataGridContext);

  // Sticky fix
  useEffect(() => {
    stickyFix();
    window.addEventListener("resize", stickyFix);
    window.addEventListener("scroll", stickyFix);
    () => {
      window.removeEventListener("resize", stickyFix);
      window.addEventListener("scroll", stickyFix);
    };
  });

  /**
   * Fixes sticky behaviour due to `overflow-x: auto;` not being compatible
   * with native sticky in all cases.
   */
  const stickyFix = () => {
    if (!ref.current || !scrollPaneRef.current) {
      return;
    }

    const node = ref.current;
    const scrollPaneNode = scrollPaneRef.current;
    const indicator = "mykn-datagrid__scrollpane--overflow-x";

    // No need for fallback implementation, native behaviour should work if height is set of no overflow is applied..
    if (height || !scrollPaneNode?.classList?.contains(indicator)) {
      node.style.top = "";
      return;
    }

    requestAnimationFrame(() => {
      node.style.top = "";
      const computedStyle = getComputedStyle(node);
      const cssTop = parseInt(computedStyle.top);

      const boundingClientRect = node.getBoundingClientRect();
      const boundingTop = boundingClientRect.top;
      const compensation = boundingTop * -1 + cssTop * 2;

      node.style.top = compensation + "px";
    });
  };

  return (
    <thead
      ref={ref}
      className="mykn-datagrid__thead"
      role="rowgroup"
      style={
        {
          "--mykn-datagrid-thead-top-base": toolbarRef.current?.clientHeight
            ? toolbarRef.current?.clientHeight + "px"
            : undefined,
        } as unknown as CSSProperties
      }
    >
      {/* Captions */}
      <tr className="mykn-datagrid__row mykn-datagrid__row--header" role="row">
        {selectable && (
          <th className="mykn-datagrid__cell mykn-datagrid__cell--checkbox"></th>
        )}
        {renderableFields.map((field) => (
          <DataGridHeadingCell
            key={`${dataGridId}-heading-${field2Title(field.name, { lowerCase: false })}`}
            field={field}
          >
            {field2Title(field.name, { lowerCase: false })}
          </DataGridHeadingCell>
        ))}
      </tr>

      {/* Filters */}
      {filterable && <DataGridFilter />}
    </thead>
  );
};
