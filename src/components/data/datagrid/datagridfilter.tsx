import {
  debounce,
  invariant,
  serializeFormElement,
  string2Title,
} from "@maykin-ui/client-common";
import clsx from "clsx";
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  TypedField,
  TypedSerializedFormData,
  stringifyContext,
  useIntl,
} from "../../../lib";
import { FormControl } from "../../form";
import { Outline } from "../../icon";
import { useDataGridContext } from "./datagridcontext";
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

  const {
    dataGridId,
    filterTransform,
    labelFilterField,
    onFilter,
    renderableFields,
    selectable,
  } = useDataGridContext<T, F>();

  /**
   * Returns the filter state based on `renderableFields`.
   */
  const getFilterStateFromFields = () =>
    renderableFields.reduce<F>((acc, typedField) => {
      if (!typedField.filterable) return acc;
      const filterLookup = typedField.filterLookup || typedField.name;
      const filterValue = typedField.filterValue;

      if (
        filterValue &&
        Array.isArray(filterLookup) &&
        typedField.type === "daterange"
      ) {
        const filterValues = String(filterValue).split("/");
        invariant(
          filterValues.length === filterLookup.length,
          "Invalid filter configuration!",
        );

        const filter = String(filterValue)
          .split("/")
          .reduce((acc, val, i) => ({ ...acc, [filterLookup[i]]: val }), {});
        return { ...acc, ...filter };
      }
      return { ...acc, [filterLookup]: filterValue };
    }, {} as F);

  /**
   * Returns the filter value for single `field`.
   * @param field
   */
  const getFilterValue = (field: TypedField<T>) => {
    const lookup = field.filterLookup ?? field.name;
    return Object.hasOwn(filterState, lookup)
      ? (filterState[lookup as keyof typeof filterState] as string)
      : "";
  };

  const [filterState, setFilterState] = useState<F>(getFilterStateFromFields());

  // Sync `filterState` with `renderableFields`.
  useEffect(() => {
    setFilterState(getFilterStateFromFields());
  }, [renderableFields.map((r) => r.filterValue).join()]);

  /**
   * Dispatches filter values to `onFilter` prop.
   */
  const dispatchFilter = useCallback(
    (e: SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
      const input = e.target as HTMLInputElement;
      if (input.type !== "checkbox") {
        e.preventDefault();
      }

      const data = serializeFormElement<
        TypedSerializedFormData<keyof T & string>
      >(input.form as HTMLFormElement, {
        typed: true,
      });
      const _data = (filterTransform ? filterTransform(data) : data) as F;

      if (_data !== undefined) {
        onFilter(_data);
        return;
      }
    },
    [serializeFormElement, filterTransform, onFilter],
  );

  /**
   * Debounced version of `dispatchFilter`.
   */
  const debouncedDispatchFilter = useMemo(
    () => debounce(dispatchFilter, 550), // Backspace on MacOS might cause huge delay in input.
    [dispatchFilter],
  );

  /**
   * Gets called when a filter is changed.
   * @param e
   */
  const handleFilter: React.EventHandler<
    SyntheticEvent<HTMLInputElement | HTMLSelectElement>
  > = (e) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFilterState({
      ...filterState,
      [target.name]: target.value,
    });

    debouncedDispatchFilter(e);
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
        const placeholder = string2Title(field.name.toString());

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { options, valueTransform, ...context } = field;
        const _labelFilterField = intl.formatMessage(
          labelFilterField === undefined
            ? TRANSLATIONS.LABEL_FILTER_FIELD
            : // ??? Can't remember why, should have documented this.
              { id: new String() as string, defaultMessage: labelFilterField },
          stringifyContext(context),
        );

        return (
          <th
            key={`${dataGridId}-filter-${string2Title(field.name.toString())}`}
            className={clsx(
              "mykn-datagrid__cell",
              "mykn-datagrid__cell--filter",
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
                value={getFilterValue(field)}
                onChange={
                  field.type !== "boolean"
                    ? (
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLSelectElement
                        >,
                      ) => handleFilter(e)
                    : undefined
                }
                onClick={
                  field.type === "boolean"
                    ? (
                        e: React.MouseEvent<
                          HTMLInputElement | HTMLSelectElement
                        >,
                      ) => handleFilter(e)
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
