import React, { useId, useState } from "react";

import {
  AttributeData,
  Field,
  LabeledAttributeData,
  TypedField,
  field2Title,
  typedFieldByFields,
  useIntl,
} from "../../../lib";
import { Button } from "../../button";
import { Form, FormControl, FormProps } from "../../form";
import { Value } from "../value";
import "./attributetable.scss";

export type AttributeTableProps = {
  editable?: boolean;
  formProps?: FormProps;
  object?: AttributeData;
  labeledObject?: LabeledAttributeData;
  labelEdit?: string;
  labelCancel?: string;
  fields?: Field[] | TypedField[];
};

export const AttributeTable: React.FC<AttributeTableProps> = ({
  editable = false,
  object = {},
  labeledObject = {},
  fields = Object.keys(object).concat(Object.keys(labeledObject)),
  formProps,
  labelEdit,
  labelCancel,
  ...props
}) => {
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
      <AttributeTableRow
        key={field.name}
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
    <div className="mykn-attributetable" {...props}>
      {renderTable()}
    </div>
  );
};

export type AttributeTableRowProps = {
  editable?: boolean;
  object?: AttributeData;
  labeledObject?: LabeledAttributeData;
  field: TypedField;
  isFormOpen: boolean;
  labelEdit?: string;
  onClick: React.MouseEventHandler;
};

export const AttributeTableRow: React.FC<AttributeTableRowProps> = ({
  editable = false,
  field,
  isFormOpen,
  object = {},
  labeledObject = {},
  labelEdit,
  onClick,
}) => {
  const id = useId();
  const intl = useIntl();
  const [isEditingState, setIsEditingState] = useState(false);
  const name = field.name;
  const fieldInObject = Object.keys(object).includes(name);
  const label = fieldInObject ? field2Title(name) : labeledObject[name].label;
  const rawValue = fieldInObject ? object[name] : labeledObject[name].value;
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
        name={name}
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
