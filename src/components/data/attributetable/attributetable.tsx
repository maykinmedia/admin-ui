import React from "react";

import {
  Attribute,
  AttributeData,
  LabeledAttributeData,
  field2Title,
  isPrimitive,
} from "../../../lib";
import { Value } from "../value";
import "./attributetable.scss";

export type AttributeTableProps = {
  object?: AttributeData;
  labeledObject?: LabeledAttributeData;
  fields?: Array<keyof LabeledAttributeData | keyof AttributeData>;
};

export type AttributeTableRowProps = {
  object?: AttributeData;
  labeledObject?: LabeledAttributeData;
  field: keyof LabeledAttributeData | keyof AttributeData;
};

export const AttributeTable: React.FC<AttributeTableProps> = ({
  object = {},
  labeledObject = {},
  fields = Object.keys(object).concat(Object.keys(labeledObject)),
  ...props
}) => (
  <div className="mykn-attributetable" {...props}>
    {fields.map((field) => (
      <AttributeTableRow
        key={field}
        field={field}
        object={object}
        labeledObject={labeledObject}
      />
    ))}
  </div>
);

export const AttributeTableRow: React.FC<AttributeTableRowProps> = ({
  object = {},
  labeledObject = {},
  field,
}) => {
  const fieldInObject = Object.keys(object).includes(field);
  let value = fieldInObject ? object[field] : labeledObject[field].value;

  if (isPrimitive(value) || value === null) {
    value = <Value value={value as Attribute} />;
  }

  const label = fieldInObject ? field2Title(field) : labeledObject[field].label;

  return (
    <div className="mykn-attributetable__row">
      <div className="mykn-attributetable__cell mykn-attributetable__key">
        {label}
      </div>
      <div className="mykn-attributetable__cell">{value}</div>
    </div>
  );
};
