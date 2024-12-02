import React, { CSSProperties, useContext, useEffect, useRef } from "react";

import { string2Title } from "../../../lib";
import { DataGridContext, DataGridContextType } from "./datagrid";
import { DataGridFilter } from "./datagridfilter";
import { DataGridHeadingCell } from "./datagridheadingcell";

/**
 * DataGrid table head, encapsulates a set of table rows, indicating that they
 * comprise the head of a table with information about the table's columns.
 */
export const DataGridTHead = <T extends object = object>() => {
  const ref = useRef<HTMLTableSectionElement>(null);

  const thead = ref.current;
  const table = thead?.parentNode as HTMLTableElement | undefined;
  const scrollPane = table?.parentNode as HTMLDivElement | undefined;
  const toolbar = scrollPane?.previousSibling as HTMLDivElement | undefined;

  const {
    allowOverflowX,
    dataGridId,
    filterable,
    height,
    renderableFields,
    selectable,
    toolbarRef,
  } = useContext(DataGridContext) as DataGridContextType<T>;

  // Sticky fix
  useEffect(() => {
    stickyFix();
    window.addEventListener("resize", stickyFix);
    window.addEventListener("scroll", stickyFix);

    return () => {
      window.removeEventListener("resize", stickyFix);
      window.removeEventListener("scroll", stickyFix);
    };
  }, [ref.current, height, renderableFields]);

  /**
   * Fixes sticky behaviour due to `overflow-y: auto;` and `overflow-x: auto;`
   * combination not being compatible with native sticky in all cases.
   */
  const stickyFix = () => {
    if (!ref.current || !thead || !table || !scrollPane || !toolbar) {
      return;
    }

    requestAnimationFrame(() => {
      thead.style.top = "";

      const classOverflowX = "mykn-datagrid__scrollpane--overflow-x";
      const classOverflowY = "mykn-datagrid__scrollpane--overflow-y";

      // Active conditions.
      const isHeightSet = Boolean(height);
      const isHeight100Percent = height === "100%"; // (100)% is edge case.
      const isHeightExplicitlySet = isHeightSet && !isHeight100Percent;
      const isScrollX =
        allowOverflowX && scrollPane.scrollWidth - scrollPane.clientWidth > 20;

      // Available fixes.
      const shouldOverflowX = isScrollX && !isHeightExplicitlySet;
      const shouldOverflowY = isHeightExplicitlySet;
      const shouldStickyFix = shouldOverflowX;

      // Apply overflow CSS rules using classes.
      if (scrollPane.classList.contains(classOverflowX) !== shouldOverflowX) {
        scrollPane.classList.toggle(classOverflowX, shouldOverflowX);
      }
      if (scrollPane.classList.contains(classOverflowY) !== shouldOverflowY) {
        scrollPane.classList.toggle(classOverflowY, shouldOverflowY);
      }

      // No need for fallback implementation as only `overflow-y: auto;` has to
      // be set.
      if (!shouldStickyFix) return;

      // Fix the sticky top behaviour.
      thead.style.transform = "";
      const boundingClientRect = thead.getBoundingClientRect();
      const boundingTop = boundingClientRect.top;

      // No possibility for fallback implementation as `thead` is not rendered
      // yet.
      if (!boundingTop) return;

      // Invert the negative offset caused by scrolling and push the position
      // in the opposite direction, then apply some compensation for the
      // existing offset.
      const compensation = Math.max(
        boundingTop * -1 +
          (toolbar ? toolbar.clientHeight : 0) * (isHeight100Percent ? 1 : 2),
        0,
      );

      // No compensation.
      if (!compensation) return;

      thead.style.top = `${compensation}px`;
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
          <DataGridHeadingCell<T>
            key={`${dataGridId}-heading-${string2Title(field.name.toString(), { lowerCase: false })}`}
            field={field}
          >
            {string2Title(field.name.toString(), { lowerCase: false })}
          </DataGridHeadingCell>
        ))}
      </tr>

      {/* Filters */}
      {filterable && <DataGridFilter<T> />}
    </thead>
  );
};
