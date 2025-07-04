import { slugify, string2Title } from "@maykin-ui/client-common";
import React, { CSSProperties, useEffect, useRef } from "react";

import { useDataGridContext } from "./datagridcontext";
import { DataGridFilter } from "./datagridfilter";
import { DataGridHeadingCell } from "./datagridheadingcell";

/**
 * DataGrid table head, encapsulates a set of table rows, indicating that they
 * comprise the head of a table with information about the table's columns.
 */
export const DataGridTHead = <
  T extends object = object,
  F extends object = T,
>() => {
  const ref = useRef<HTMLTableSectionElement>(null);

  const {
    allowOverflowX,
    dataGridId,
    filterable,
    height,
    renderableFields,
    selectable,
    toolbarRef,
  } = useDataGridContext<T, F>();

  // Sticky fix
  useEffect(() => {
    stickyFix();
    window.addEventListener("resize", stickyFix);
    window.addEventListener("scroll", stickyFix);

    return () => {
      window.removeEventListener("resize", stickyFix);
      window.removeEventListener("scroll", stickyFix);
    };
  }, [ref.current, height]);

  /**
   * Fixes sticky behaviour due to `overflow-y: auto;` and `overflow-x: auto;`
   * combination not being compatible with native sticky in all cases.
   */
  const stickyFix = () => {
    if (!ref.current) {
      return;
    }

    const thead = ref.current;
    const table = thead.parentNode as HTMLTableElement;
    const scrollPane = table?.parentNode as HTMLDivElement;
    const previousSibling = scrollPane.previousSibling as HTMLDivElement | null;

    // Toolbar may not be rendered.
    const toolbar = previousSibling?.classList.contains(
      "mykn-datagrid__toolbar",
    )
      ? previousSibling
      : null;

    requestAnimationFrame(() => {
      const classOverflowX = "mykn-datagrid__scrollpane--overflow-x";
      const classOverflowY = "mykn-datagrid__scrollpane--overflow-y";

      // Reset.
      thead.style.top = "";
      scrollPane.classList.remove(classOverflowX);
      scrollPane.classList.remove(classOverflowY);

      // Active conditions.
      const isHeightSet = Boolean(height);
      const isHeight100Percent = height === "100%"; // (100)% is edge case.
      const isScrollX =
        allowOverflowX && scrollPane.scrollWidth > scrollPane.clientWidth;

      // Available fixes.
      const shouldOverflowX = !isHeightSet && isScrollX;
      const shouldOverflowY = isHeightSet;
      const shouldStickyFix = isHeight100Percent || (!height && isScrollX);

      // Apply overflow CSS rules using classes.
      scrollPane.classList.toggle(classOverflowX, shouldOverflowX);
      scrollPane.classList.toggle(classOverflowY, shouldOverflowY);

      // No need for fallback implementation as only `overflow-y: auto;` has to
      // be set.
      if (!shouldStickyFix) {
        return;
      }

      // Fix the sticky top behaviour.
      const boundingClientRect = thead.getBoundingClientRect();
      const boundingTop = boundingClientRect.top;

      // No possibility for fallback implementation as `thead` is not rendered
      // yet.
      if (!boundingTop) return;

      // Invert the negative offset caused by scrolling and push the position
      // in the opposite direction, then apply some compensation for the
      // existing offset.
      const compensation =
        boundingTop * -1 +
        (toolbar ? toolbar.clientHeight : 0) * (isHeight100Percent ? 1 : 2);
      thead.style.top = compensation + "px";
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
        {renderableFields.map((field) => {
          const fieldName = field.name.toString();
          const fieldSlug = slugify(fieldName);
          const fieldTitle = string2Title(fieldName);

          return (
            <DataGridHeadingCell<T, F>
              key={`${dataGridId}-heading-${fieldSlug}`}
              field={field}
            >
              {fieldTitle}
            </DataGridHeadingCell>
          );
        })}
      </tr>

      {/* Filters */}
      {filterable && <DataGridFilter<T, F> />}
    </thead>
  );
};
