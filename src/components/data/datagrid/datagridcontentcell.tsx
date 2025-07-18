import {
  isLink,
  serializeFormElement,
  string2Title,
} from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { useState } from "react";

import {
  DEFAULT_URL_FIELDS,
  TypedField,
  TypedSerializedFormData,
  isPrimitive,
} from "../../../lib";
import { getByDotSeparatedPath } from "../../../lib/data/utils";
import { BoolProps } from "../../boolean";
import { Button } from "../../button";
import { FormControl } from "../../form";
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

  const isImplicitLink = rowUrl && fieldIndex === 0 && !isLink(String(value));
  const link = isImplicitLink ? String(rowUrl) : "";

  /**
   * Renders a button triggering the editing state.
   */
  const renderButton = () => (
    <Button
      align={
        field.type === "boolean" ||
        field.type === "number" ||
        field.type === "null"
          ? "end"
          : "start"
      }
      pad={field.type !== "boolean"}
      justify={true}
      variant="transparent"
      wrap={false}
      onClick={() => {
        setEditingState([rowData, fieldIndex]);
      }}
    >
      {renderValue()}
    </Button>
  );

  /**
   * Renders a form control for editing the fields value.
   */
  const renderFormControl = () => (
    <form
      id={`${dataGridId}-editable-form`}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormControl
        autoFocus
        key={"datagrid-editable"}
        name={field.name as string}
        defaultChecked={field.type === "boolean" ? Boolean(value) : undefined}
        options={field.options || undefined}
        type={field.type === "number" ? "number" : undefined}
        value={(value || "").toString()}
        form={`${dataGridId}-editable-form`}
        required={true}
        onChange={(e: React.ChangeEvent) => {
          setPristine(false);
          onChange?.(e);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
          const data = Object.assign(
            rowData,
            serializeFormElement<TypedSerializedFormData>(
              e.target.form as HTMLFormElement,
              {
                typed: true,
              },
            ),
          );
          !pristine && onEdit?.(data);
        }}
      />
    </form>
  );
  /**
   * Renders a hidden input allowing the form to serialize this fields data.
   */
  const renderHiddenInput = () => (
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
  );

  /**
   * Renders the value according to Value component
   */
  const renderValue = () => {
    // Support label from select
    const label = field.options?.find((o) => o.value === value)?.label;

    return (
      <Value
        aProps={aProps}
        badgeProps={badgeProps}
        boolProps={boolProps as BoolProps}
        pProps={pProps}
        href={link}
        decorate={decorate}
        value={label || (field.type === "boolean" ? Boolean(value) : value)}
        onClick={(e) => onClick?.(e, rowData)}
      />
    );
  };

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
      {valueIsPrimitive &&
        isEditingRow &&
        !isEditingField &&
        renderHiddenInput()}
      {valueIsPrimitive && isEditingField && renderFormControl()}
      {valueIsPrimitive && !isEditingField && fieldEditable && renderButton()}
      {!isEditingField && !fieldEditable && renderValue()}
    </td>
  );
};
