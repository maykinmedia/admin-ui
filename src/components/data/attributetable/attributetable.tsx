import { string2Title } from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { useId, useState } from "react";

import {
  Field,
  SerializedFormData,
  TypedField,
  fields2TypedFields,
  gettextFirst,
} from "../../../lib";
import { Button } from "../../button";
import { Form, FormControl, FormProps } from "../../form";
import { Value } from "../value";
import "./attributetable.scss";
import { TRANSLATIONS } from "./translations";

export type AttributeTableProps<T extends object = object> = {
  /** The object. */
  object?: T;

  // TODO: Deprecate?
  labeledObject?: Record<string, { label: React.ReactNode; value: unknown }>;

  /**
   * Whether values should be made editable, default is determined by whether any of `fields` is a `TypedField` and has
   * `editable` set.
   */
  editable?: boolean;

  /** A `string[]` or `TypedField[]` containing the keys in `objectList` to show value for. */
  fields?: Field<T>[] | TypedField<T>[];

  /** Props for Form. */
  formProps?: FormProps<Record<keyof T, SerializedFormData[string]>>;

  /** The cancel label. */
  labelCancel?: string;

  /** The edit value (accessible) label. */
  labelEdit?: string;

  /** Vertical alignment of contents. */
  valign?: "middle" | "start";

  /** Whether a compact layout should be used. */
  compact?: boolean;

  /** Whether wrapping should be allowed. */
  wrap?: boolean;
};

/**
 * AttributeTable Component
 *
 * Shows key/value pairs.
 * @see DataGrid for more advanced table layout.
 *
 * @typeParam T - The shape of a single item.
 */
export const AttributeTable = <T extends object = object>({
  object = {} as T,
  labeledObject = {},
  editable = false,
  fields = Object.keys(object).concat(Object.keys(labeledObject)) as Field<T>[],
  formProps,
  labelCancel,
  labelEdit,
  valign = "middle",
  compact = false,
  wrap = false,
  ...props
}: AttributeTableProps<T>) => {
  const [isFormOpenState, setIsFormOpenState] = useState(false);
  const typedFields = fields2TypedFields(fields, [object], { editable });
  const _editable = Boolean(typedFields.find((f) => f.editable));

  const _labelCancel = gettextFirst(labelCancel, TRANSLATIONS.LABEL_CANCEL);

  const renderTable = () => {
    return _editable ? (
      <Form<Record<keyof T, SerializedFormData[string]>>
        showRequiredExplanation={false}
        fieldsetClassName="mykn-attributetable__body"
        showActions={isFormOpenState}
        secondaryActions={[
          {
            children: _labelCancel,
            variant: "secondary",
            onClick: () => setIsFormOpenState(false),
          },
        ]}
        toolbarProps={{ overrideItemProps: true }}
        {...formProps}
      >
        {renderRows()}
      </Form>
    ) : (
      <div
        className={clsx("mykn-attributetable__body", {
          "mykn-attributetable--compact": compact,
        })}
      >
        {renderRows()}
      </div>
    );
  };

  const renderRows = () =>
    typedFields.map((field) => (
      <AttributeTableRow<T>
        key={field.name.toString()}
        editable={_editable}
        field={field}
        isFormOpen={isFormOpenState}
        object={object}
        labeledObject={labeledObject}
        labelEdit={labelEdit}
        compact={compact}
        onClick={() => setIsFormOpenState(true)}
      />
    ));

  return (
    <div
      role="table"
      className={clsx(
        "mykn-attributetable",
        `mykn-attributetable--valign-${valign}`,
        { "mykn-attributetable--compact": compact },
        { "mykn-attributetable--wrap": wrap },
      )}
      {...props}
    >
      {renderTable()}
    </div>
  );
};

export type AttributeTableRowProps<T extends object = object> = {
  editable?: boolean;
  object?: T;
  // TODO: Deprecate in favor of using TypedField for labels in the future?
  labeledObject?: Record<string, { label: React.ReactNode; value: unknown }>;
  field: TypedField<T>;
  isFormOpen: boolean;
  labelEdit?: string;
  onClick: React.MouseEventHandler;
  compact?: boolean;
};

export const AttributeTableRow = <T extends object = object>({
  editable = false,
  field,
  isFormOpen,
  object = {} as T,
  labeledObject = {},
  labelEdit,
  compact = false,
  onClick,
}: AttributeTableRowProps<T>) => {
  const id = useId();
  const [isEditingState, setIsEditingState] = useState(false);
  const name = field.name;
  const fieldInObject = Object.keys(object).includes(name.toString());
  const label = fieldInObject
    ? string2Title(name.toString())
    : labeledObject[name as string].label;
  const rawValue = fieldInObject
    ? object[name as keyof T]
    : labeledObject[name as string].value;
  const isEditing = isFormOpen && isEditingState;

  const handleCLick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    setIsEditingState(true);
    onClick(e);
  };

  const _labelEdit = gettextFirst(labelEdit, TRANSLATIONS.LABEL_EDIT, {
    ...field,
    label: label || field.name,
  });

  const renderValue = () => {
    return editable ? (
      <Button
        variant="transparent"
        pad={false}
        onClick={handleCLick}
        aria-label={_labelEdit}
      >
        {renderDisplayValue()}
      </Button>
    ) : (
      renderDisplayValue()
    );
  };

  const renderDisplayValue = () => {
    return <Value value={rawValue} />;
  };

  const renderInput = () => {
    return (
      <FormControl
        id={`${id}_input`}
        pad="h"
        defaultChecked={
          field.type === "boolean" ? Boolean(rawValue) : undefined
        }
        hidden={!isEditing}
        name={name.toString()}
        options={field.options}
        required={true}
        type={field.type === "number" ? "number" : undefined}
        defaultValue={rawValue?.toString()}
      />
    );
  };

  return (
    <div
      className={clsx("mykn-attributetable__row", {
        "mykn-attributetable--compact": compact,
      })}
      role="row"
    >
      <div
        className={clsx(
          "mykn-attributetable__cell",
          "mykn-attributetable__cell--key",
          { "mykn-attributetable--compact": compact },
        )}
        role="cell"
      >
        {isEditing ? <label htmlFor={`${id}_input`}>{label}</label> : label}
      </div>
      <div
        className={clsx(
          "mykn-attributetable__cell",
          "mykn-attributetable__cell--value",
          { "mykn-attributetable--compact": compact },
        )}
      >
        {(!editable || !isEditing) && renderValue()}
        {editable && renderInput()}
      </div>
    </div>
  );
};
