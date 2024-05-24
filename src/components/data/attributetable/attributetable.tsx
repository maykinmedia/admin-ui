import React, { ReactNode } from "react";

import { Attribute } from "../../../lib";
import { Value } from "../value";
import "./attributetable.scss";

export type ValueType = ReactNode;
export type LabelType = string | ReactNode;
export type FieldData = {
  label: LabelType;
  value: ValueType;
};
export type ObjectData<T = FieldData> = Record<string, T>;

export type ObjectTableProps = {
  object: ObjectData;
  fields?: Array<keyof ObjectData>;
};

export type ObjectTableRowProps = {
  object: ObjectData;
  field: keyof ObjectData;
};

export const AttributeTable: React.FC<ObjectTableProps> = ({
  object = {},
  fields = Object.keys(object),
  ...props
}) => (
  <div className="mykn-attributetable" {...props}>
    {fields.map((field) => (
      <AttributeTableRow key={field} field={field} object={object} />
    ))}
  </div>
);

export const AttributeTableRow: React.FC<ObjectTableRowProps> = ({
  object,
  field,
}) => {
  let value = object[field].value;
  if (
    ["boolean", "number", "string"].includes(typeof value) ||
    value === null
  ) {
    value = <Value value={value as Attribute} />;
  }

  return (
    <div className="mykn-attributetable__row">
      <div className="mykn-attributetable__cell mykn-attributetable__key">
        {object[field].label}
      </div>
      <div className="mykn-attributetable__cell">{value}</div>
    </div>
  );
};
