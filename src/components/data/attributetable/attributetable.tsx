import React from "react";

import { AttributeData } from "../../../lib";
import { field2Title } from "../../../lib/format/string";
import { Value } from "../value";
import "./attributetable.scss";

export type AttributeTableProps = {
  object: AttributeData;
  fields?: Array<keyof AttributeData>;
};

export type AttributeTableRowProps = {
  object: AttributeData;
  field: keyof AttributeData;
};

export const AttributeTable: React.FC<AttributeTableProps> = ({
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

export const AttributeTableRow: React.FC<AttributeTableRowProps> = ({
  object,
  field,
}) => (
  <div className="mykn-attributetable__row">
    <div className="mykn-attributetable__cell mykn-attributetable__key">
      {field2Title(field)}
    </div>
    <div className="mykn-attributetable__cell">
      <Value value={object[field]} />
    </div>
  </div>
);
