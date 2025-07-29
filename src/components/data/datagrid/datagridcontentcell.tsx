import {
  isLink,
  serializeFormElement,
  string2Title,
} from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { useCallback, useState } from "react";

import {
  DEFAULT_URL_FIELDS,
  TypedField,
  TypedSerializedFormData,
  getByDotSeparatedPath,
  isPrimitive,
} from "../../../lib";
import { BoolProps } from "../../boolean";
import { Value } from "../value";
import { useDataGridContext } from "./datagridcontext";

export type DataGridContentCellProps<
  T extends object = object,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  F extends object = T,
> = {
  field: TypedField<T>;
  rowData: T;
};

/**
 * DataGrid (content) cell
 */
export const DataGridContentCell = <
  T extends object = object,
  F extends object = T,
>({
  field,
  rowData,
}: DataGridContentCellProps<T, F>) => {
  const {
    aProps,
    badgeProps,
    boolProps,
    pProps,
    dataGridId,
    decorate,
    editable,
    editingFieldIndex,
    editingRow,
    renderableFields = [],
    setEditingState,
    urlFields = DEFAULT_URL_FIELDS,
    onClick,
    onChange,
    onEdit,
  } = useDataGridContext<T, F>();
  const [pristine, setPristine] = useState<boolean>(true);

  const fieldEditable =
    typeof field.editable === "boolean" ? field.editable : editable;
  const fieldIndex = renderableFields.findIndex((f) => f.name === field.name);
  const isEditingRow = editingRow === rowData;
  const isEditingField =
    isEditingRow && editingFieldIndex === renderableFields.indexOf(field);
  const urlField = urlFields.find((f) => rowData[f as keyof T]);
  const rowUrl = urlField ? rowData[urlField as keyof T] : null;
  const resolvedValue = getByDotSeparatedPath(
    rowData,
    field.valueLookup || field.name.toString(),
  );

  const value = field.valueTransform?.(rowData) || resolvedValue;
  const valueIsPrimitive = isPrimitive(value);
  const label = field.options?.find((o) => o.value === value)?.label;

  const isImplicitLink = rowUrl && fieldIndex === 0 && !isLink(String(value));
  const link = isImplicitLink ? String(rowUrl) : "";

  /**
   * Gets called when the <Value> is clicked.
   */
  const handleClick = useCallback<React.MouseEventHandler>(
    (e) => {
      setEditingState([rowData, fieldIndex]);
      onClick?.(e, rowData);
    },
    [rowData, fieldIndex, onClick],
  );

  /**
   * Gets called when the <Value>'s <>FormControl> is changed.
   */
  const handleChange = useCallback<React.ChangeEventHandler>(
    (e) => {
      setPristine(false);
      onChange?.(e);
    },
    [pristine, onChange],
  );

  /**
   * Gets called when the <Value>'s <>FormControl> is blurred.
   */
  const handleBlur = useCallback<React.FocusEventHandler>(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const data = Object.assign(
        rowData,
        serializeFormElement<TypedSerializedFormData>(
          e.target.form as HTMLFormElement,
          {
            typed: true,
          },
        ),
      );
      setEditingState([null, null]);
      !pristine && onEdit?.(data);
    },
    [rowData, pristine, onEdit],
  );

  return (
    <td
      className={clsx(
        "mykn-datagrid__cell",
        `mykn-datagrid__cell--type-${field.type}`,
        {
          "mykn-datagrid__cell--editable": fieldEditable,
          "mykn-datagrid__cell--editing": isEditingField,
          "mykn-datagrid__cell--link": link,
        },
      )}
      aria-description={string2Title(field.name.toString())}
    >
      {isEditingRow && isEditingField && (
        <form
          id={`${dataGridId}-editable-form`}
          onSubmit={(e) => e.preventDefault()}
        />
      )}

      {valueIsPrimitive && isEditingRow && !isEditingField && (
        <input
          defaultChecked={field.type === "boolean" ? Boolean(value) : undefined}
          defaultValue={value?.toString() || ""}
          form={`${dataGridId}-editable-form`}
          hidden
          name={field.name.toString()}
          type={
            field.type === "boolean"
              ? "checkbox"
              : field.type === "number"
                ? "number"
                : undefined
          }
        />
      )}

      <Value
        aProps={aProps}
        badgeProps={badgeProps}
        boolProps={{ explicit: editable, ...(boolProps as BoolProps) }}
        formControlProps={{
          form: `${dataGridId}-editable-form`,
          required: true,
        }}
        pProps={pProps}
        href={link}
        decorate={decorate}
        editable={editable}
        editing={isEditingField}
        field={field}
        value={label || (field.type === "boolean" ? Boolean(value) : value)}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={handleClick}
      />
    </td>
  );
};
