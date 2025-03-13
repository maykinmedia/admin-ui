import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import {
  createMessageDescriptor,
  serializeForm,
  string2Title,
  stringifyContext,
  useIntl,
} from "../../../lib";
import { FormControl } from "../../form";
import { Outline } from "../../icon";
import { useDataGridContext } from "./datagrid";
import { TRANSLATIONS } from "./translations";

/**
 * DataGrid filter, encapsulates a set of FormControl's allowing the user to
 * filter items on the grid.
 */
export const DataGridFilter = <
  T extends object = object,
  F extends object = T,
>() => {
  const intl = useIntl();
  const onFilterTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const {
    dataGridId,
    filterTransform,
    labelFilterField,
    onFilter,
    renderableFields,
    selectable,
  } = useDataGridContext<T, F>();

  const [filterState, setFilterState] = useState<F>();

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

  /**
   * Gets called when a filter is changed.
   * @param e
   */
  const handleFilter: React.EventHandler<
    React.SyntheticEvent<HTMLInputElement>
  > = (e) => {
    const input = e.target as HTMLInputElement;
    if (input.type !== "checkbox") {
      e.preventDefault();
    }

    const data = serializeForm<keyof T & string>(
      input.form as HTMLFormElement,
      true,
    );
    const _data = filterTransform ? filterTransform(data) : data;

    // Reset page on filter (length of dataset may change).
    setFilterState(_data as unknown as F);
  };

  return (
    <tr className="mykn-datagrid__row mykn-datagrid__row--filter" role="row">
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
        const placeholder = string2Title(field.name.toString(), {
          lowerCase: false,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { options, valueTransform, ...context } = field;
        const _labelFilterField = intl.formatMessage(
          createMessageDescriptor(
            labelFilterField,
            TRANSLATIONS.LABEL_FILTER_FIELD,
          ),
          stringifyContext(context),
        );
        return (
          <th
            key={`${dataGridId}-filter-${string2Title(field.name.toString(), { lowerCase: false })}`}
            className={clsx(
              "mykn-datagrid__cell",
              "mykn-datagrid__c" + "ell--filter",
            )}
            style={field.width ? { width: field.width } : {}}
          >
            {field.filterable !== false && (
              <FormControl
                aria-label={_labelFilterField}
                icon={
                  !field.options &&
                  field.type !== "boolean" &&
                  field.type !== "daterange" && <Outline.MagnifyingGlassIcon />
                }
                form={`${dataGridId}-filter-form`}
                name={field.filterLookup || field.name.toString()}
                options={field.options}
                min={!field.options && field.type === "number" ? 0 : undefined}
                pad={field.type === "daterange" ? "v" : undefined}
                placeholder={placeholder}
                type={field.type === "boolean" ? "checkbox" : field.type}
                value={field.filterValue}
                onChange={
                  field.type !== "boolean"
                    ? (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilter(e)
                    : undefined
                }
                onClick={
                  field.type === "boolean"
                    ? (e: React.MouseEvent<HTMLInputElement>) => {
                        handleFilter(e);
                      }
                    : undefined
                }
              />
            )}
          </th>
        );
      })}
    </tr>
  );
};
