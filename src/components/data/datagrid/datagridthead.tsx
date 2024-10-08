import clsx from "clsx";
import React, {
  CSSProperties,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AttributeData,
  field2Title,
  formatMessage,
  serializeForm,
  useIntl,
} from "../../../lib";
import { FormControl } from "../../form";
import { Outline } from "../../icon";
import { DataGridContext, scrollPaneRef } from "./datagrid";
import { DataGridHeadingCell } from "./datagridheadingcell";
import { TRANSLATIONS } from "./translations";

/**
 * DataGrid table head, encapsulates a set of table rows, indicating that they
 * comprise the head of a table with information about the table's columns.
 */
export const DataGridTHead: React.FC = () => {
  const intl = useIntl();
  const onFilterTimeoutRef = useRef<NodeJS.Timeout>();
  const ref = useRef<HTMLTableSectionElement>(null);
  const [filterState, setFilterState] = useState<AttributeData>();

  const {
    dataGridId,
    filterable,
    filterTransform,
    height,
    labelFilterField,
    onFilter,
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

  // Debounce filter
  useEffect(() => {
    const handler = () => {
      // No filter state.
      if (filterState === undefined) {
        return;
      }
      onFilter(filterState || {});
    };
    onFilterTimeoutRef.current && clearTimeout(onFilterTimeoutRef.current);
    onFilterTimeoutRef.current = setTimeout(handler, 300);
  }, [filterState]);

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
      {filterable && (
        <tr
          className="mykn-datagrid__row mykn-datagrid__row--filter"
          role="row"
        >
          {selectable && (
            <th
              className={clsx(
                "mykn-datagrid__cell",
                "mykn-datagrid__cell--filter",
                "mykn-datagrid__cell--checkbox",
              )}
            ></th>
          )}
          {renderableFields.map((field) => {
            const placeholder = field2Title(field.name, { lowerCase: false });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { options, valueTransform, ...context } = field;

            const _labelFilterField = labelFilterField
              ? formatMessage(labelFilterField, context)
              : intl.formatMessage(TRANSLATIONS.LABEL_FILTER_FIELD, context);

            return (
              <th
                key={`${dataGridId}-filter-${field2Title(field.name, { lowerCase: false })}`}
                className={clsx(
                  "mykn-datagrid__cell",
                  "mykn-datagrid__c" + "ell--filter",
                )}
                style={field.width ? { width: field.width } : {}}
              >
                {field.filterable !== false && (
                  <FormControl
                    aria-label={_labelFilterField}
                    icon={!field.options && <Outline.MagnifyingGlassIcon />}
                    form={`${dataGridId}-filter-form`}
                    name={field.filterLookup || field.name}
                    options={field.options}
                    min={
                      !field.options && field.type === "number" ? 0 : undefined
                    }
                    pad={field.type === "daterange" ? "v" : undefined}
                    placeholder={placeholder}
                    type={field.type}
                    value={field.filterValue}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLSelectElement
                      >,
                    ) => {
                      e.preventDefault();
                      const data = serializeForm(
                        e.target.form as HTMLFormElement,
                      ) as AttributeData;
                      const _data = filterTransform
                        ? filterTransform(data)
                        : data;

                      // Reset page on filter (length of dataset may change).
                      setFilterState(_data);
                    }}
                  />
                )}
              </th>
            );
          })}
        </tr>
      )}
    </thead>
  );
};
