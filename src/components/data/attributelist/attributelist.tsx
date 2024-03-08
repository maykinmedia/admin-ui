import React from "react";

import { AttributeData } from "../../../lib/data/attributedata";
import { field2Title } from "../../../lib/format/string";
import { H2 } from "../../typography";
import { Value } from "../value";
import "./attributelist.scss";

export type AttributeListProps = React.ComponentPropsWithoutRef<"div"> & {
  /** The object to show object attributes of. */
  object: AttributeData;

  /** The fields in object to show. */
  fields?: Array<keyof AttributeData>;

  /** A title for the attribute list. */
  title?: string;

  /** An optional id for the title. */
  titleId?: string;
};

/**
 * AttributeList component, shows multiple `fields` in `object`.
 * TODO: tooltip
 * @param title
 * @param titleId
 * @param data
 * @param fields
 * @param props
 * @constructor
 */
export const AttributeList: React.FC<AttributeListProps> = ({
  title = "",
  titleId,
  object = {},
  fields = Object.keys(object),
  ...props
}) => (
  <div className="mykn-attributelist" {...props}>
    {title && <H2 id={titleId}>{title}</H2>}

    <dl className="mykn-attributelist__list">
      {fields.map((f) => (
        <AttributePair key={f} object={object} field={f} />
      ))}
    </dl>
  </div>
);

export type AttributePairProps = {
  object: AttributeData;
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
  object,
  field,
}) => {
  return (
    <>
      <dt className="mykn-attributelist__key">{field2Title(field)}</dt>
      <dd className="mykn-attributelist__value">
        <Value value={object[field]} />
      </dd>
    </>
  );
};
