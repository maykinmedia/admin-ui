import {
  isLink,
  serializeElement,
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
  getErrorFromErrors,
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
  renderableRowIndex: number;
};

/**
 * DataGrid (content) cell
 */
export const DataGridContentCell = <
  T extends object = object,
  F extends object = T,
>({
  field,
  renderableRowIndex,
}: DataGridContentCellProps<T, F>) => {
  const {
    aProps,
    badgeProps,
    boolProps,
    pProps,
    dataGridId,
    decorate,
    editable,
    editingState,
    errorsState,
    setErrorsState,
    fields,
    formFields,
    renderableRows,
    renderableFields = [],
    setEditingState,
    urlFields = DEFAULT_URL_FIELDS,
    validate,
    validators,
    onClick,
    onChange,
    onEdit,
  } = useDataGridContext<T, F>();
  const rowData = renderableRows[renderableRowIndex];
  const [pristine, setPristine] = useState<boolean>(true);

  const fieldEditable =
    typeof field.editable === "boolean" ? field.editable : editable;
  const fieldIndex = renderableFields.findIndex((f) => f.name === field.name);

  const urlField = urlFields.find((f) => rowData[f as keyof T]);
  const rowUrl = urlField ? rowData[urlField as keyof T] : null;

  // Resolve value either from:
  // - Value transform
  // - Value lookup
  // - Field name.
  const value = field.valueTransform
    ? field.valueTransform(rowData)
    : getByDotSeparatedPath(
        rowData,
        field.valueLookup || field.name.toString(),
      );

  const valueIsPrimitive = isPrimitive(value);

  const isImplicitLink = rowUrl && fieldIndex === 0 && !isLink(String(value));
  const link = isImplicitLink ? String(rowUrl) : "";

  const isEditingRow =
    typeof editingState === "boolean"
      ? editingState
      : editingState[0] === rowData;

  const isEditingField =
    typeof editingState === "boolean"
      ? editingState
      : isEditingRow && editingState[1] === renderableFields.indexOf(field);

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
      const name = (e.target as HTMLInputElement).name;
      const value = serializeElement(e.target, { typed: true });
      const data = { ...rowData, [name]: value };
      const errors = validate?.(data, formFields, validators || []) || {};

      const newErrorsState = errorsState.map((existingErrors, index) =>
        index === renderableRowIndex ? errors : existingErrors,
      );

      setErrorsState(newErrorsState);

      setPristine(false);
      onChange?.(e);
    },
    [
      rowData,
      validate,
      formFields,
      validators,
      setErrorsState,
      setPristine,
      onChange,
      pristine,
    ],
  );

  /**
   * Gets called when the <Value>'s <>FormControl> is blurred.
   */
  const handleBlur = useCallback<React.FocusEventHandler>(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const data = Object.assign(
        rowData,
        serializeFormElement(e.target.form as HTMLFormElement, {
          typed: true,
        }) as TypedSerializedFormData,
      );

      if (Array.isArray(editingState)) {
        setEditingState([null, null]);
      }
      !pristine && onEdit?.(data);
    },
    [rowData, pristine, onEdit],
  );

  const fieldErrors = getErrorFromErrors(
    formFields,
    errorsState[renderableRowIndex] || {},
    formFields[fields.indexOf(field)],
  );
  const message = fieldErrors?.join(", ");

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
          forceShowError: true,
          form: `${dataGridId}-editable-form-${renderableRowIndex}`,
          required: field.required,
        }}
        pProps={pProps}
        href={link}
        decorate={decorate}
        editing={isEditingField}
        error={message}
        field={field}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={handleClick}
      />
    </td>
  );
};
