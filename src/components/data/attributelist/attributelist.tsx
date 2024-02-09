import React from "react";

import { AttributeData } from "../../../lib/data/attributedata";
import { field2Title } from "../../../lib/format/string";
import { H2 } from "../../typography";
import { Value } from "../value";
import "./attributelist.scss";

export type AttributeListProps = React.ComponentPropsWithoutRef<"div"> & {
  data: AttributeData;

  /** The fields in data to show. */
  fields?: Array<keyof AttributeData>;

  /** A title for the attribute list. */
  title?: string;
};

/**
 * AttributeList component
 * TODO: tooltip
 * @param title
 * @param data
 * @param fields
 * @param props
 * @constructor
 */
export const AttributeList: React.FC<AttributeListProps> = ({
  title = "",
  data = {},
  fields = Object.keys(data),
  ...props
}) => (
  <div className="mykn-attributelist" {...props}>
    {title && <H2>{title}</H2>}

    <dl className="mykn-attributelist__list">
      {fields.map((f) => (
        <AttributePair key={f} data={data} field={f} />
      ))}
    </dl>
  </div>
);

export type AttributePairProps = {
  data: AttributeData;
  field: keyof AttributeData;
};

/**
 * A single attribute in an AttributeList
 * @param boolProps
 * @param data
 * @param field
 * @constructor
 * @private
 */
export const AttributePair: React.FC<AttributePairProps> = ({
  data,
  field,
}) => {
  return (
    <>
      <dt className="mykn-attributelist__key">{field2Title(field)}</dt>
      <dd className="mykn-attributelist__value">
        <Value value={data[field]} />
      </dd>
    </>
  );
};
