import clsx from "clsx";
import React, { useId, useState } from "react";

import {
  Field,
  TypedField,
  string2Title,
  typedFieldByFields,
  useIntl,
} from "../../../lib";
import { Button } from "../../button";
import { Form, FormControl, FormProps } from "../../form";
import { Value } from "../value";
import "./attributetable.scss";

export type AttributeTableProps<T extends object = object> = {
  object?: T;
  // TODO: Deprecate?
  labeledObject?: Record<string, { label: string; value: unknown }>;
  editable?: boolean;
  fields?: Field<T>[] | TypedField<T>[];
  formProps?: FormProps;
  labelCancel?: string;
  labelEdit?: string;
  valign?: "middle" | "start";
};

export const AttributeTable = <T extends object = object>({
  object = {} as T,
  labeledObject = {},
  editable = false,
  fields = Object.keys(object).concat(Object.keys(labeledObject)) as Field<T>[],
  formProps,
  labelCancel,
  labelEdit,
  valign = "middle",
  ...props
}: AttributeTableProps<T>) => {
  const intl = useIntl();
  const [isFormOpenState, setIsFormOpenState] = useState(false);
  const typedFields = typedFieldByFields(fields, [object]);

  const _labelCancel = labelCancel
    ? labelCancel
    : intl.formatMessage({
        id: "mykn.components.AttributeTable.labelCancel",
        description: "mykn.components.AttributeTable: The cancel label",
        defaultMessage: "Annuleren",
      });

  const renderTable = () => {
    return editable ? (
      <Form
        fieldsetClassName="mykn-attributetable__body"
        showActions={isFormOpenState}
        secondaryActions={[
          {
            children: _labelCancel,
            variant: "secondary",
            onClick: () => setIsFormOpenState(false),
          },
        ]}
        {...formProps}
      >
        {renderRows()}
      </Form>
    ) : (
      <div className="mykn-attributetable__body">{renderRows()}</div>
    );
  };

  const renderRows = () =>
    typedFields.map((field) => (
      <AttributeTableRow<T>
        key={field.name.toString()}
        editable={editable}
        field={field}
        isFormOpen={isFormOpenState}
        object={object}
        labeledObject={labeledObject}
        labelEdit={labelEdit}
        onClick={() => setIsFormOpenState(true)}
      />
    ));

  return (
    <div
      className={clsx(
        "mykn-attributetable",
        `mykn-attributetable--valign-${valign}`,
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
  labeledObject?: Record<string, { label: string; value: unknown }>;
  field: TypedField<T>;
  isFormOpen: boolean;
  labelEdit?: string;
  onClick: React.MouseEventHandler;
};

export const AttributeTableRow = <T extends object = object>({
  editable = false,
  field,
  isFormOpen,
  object = {} as T,
  labeledObject = {},
  labelEdit,
  onClick,
}: AttributeTableRowProps<T>) => {
  const id = useId();
  const intl = useIntl();
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

  const _labelEdit = labelEdit
    ? labelEdit
    : intl.formatMessage(
        {
          id: "mykn.components.AttributeTable.labelEdit",
          description:
            "mykn.components.AttributeTable: The edit value (accessible) label",
          defaultMessage: 'Bewerk "{label}"',
        },
        { ...field, label: label || field.name },
      );

  /**
   * Renders the value (if not already a React.ReactNode).
   */
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
        defaultChecked={
          field.type === "boolean" ? Boolean(rawValue) : undefined
        }
        hidden={!isEditing}
        name={name.toString()}
        options={field.options}
        required={true}
        type={field.type === "number" ? "number" : undefined}
        value={rawValue?.toString()}
      />
    );
  };

  return (
    <>
      <div className="mykn-attributetable__cell mykn-attributetable__cell--key">
        {isEditing ? <label htmlFor={`${id}_input`}>{label}</label> : label}
      </div>
      <div className="mykn-attributetable__cell mykn-attributetable__cell--value">
        {(!editable || !isEditing) && renderValue()}
        {editable && renderInput()}
      </div>
    </>
  );
};
