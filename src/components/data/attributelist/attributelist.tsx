import React from "react";

import { Attribute, AttributeData } from "../../../lib/data/attributedata";
import { field2Title } from "../../../lib/format/string";
import { BoolProps } from "../../boolean";
import { H2 } from "../../typography";
import { Value } from "../value";
import "./attributelist.scss";

export type AttributeListProps = React.ComponentPropsWithoutRef<"div"> & {
  /** The fields in data to show. */
  fields?: Array<keyof AttributeData>;

  /** A title for the attribute list. */
  title?: string;
} & BoolPropsRequiredIfValueBool;

type BoolPropsRequiredIfValueBool = BoolValueProps | NotBoolValueProps;

// `value` can possibly be `boolean`, mandatory `boolProps`.
type BoolValueProps = {
  data: AttributeData;
  boolProps: Omit<BoolProps, "value">;
};

// `value` can not be `boolean`, optional `boolProps`.
type NotBoolValueProps = {
  data: AttributeData<Exclude<Attribute, boolean>>;
  boolProps?: Omit<BoolProps, "value">;
};

/**
 * AttributeList component
 * TODO: tooltip
 * @param boolProps
 * @param title
 * @param data
 * @param fields
 * @param props
 * @constructor
 */
export const AttributeList: React.FC<AttributeListProps> = ({
  boolProps,
  title = "",
  data = {},
  fields = Object.keys(data),
  ...props
}) => (
  <div className="mykn-attributelist" {...props}>
    {title && <H2>{title}</H2>}

    <dl className="mykn-attributelist__list">
      {fields.map((f) => (
        <AttributePair
          key={f}
          boolProps={boolProps as BoolProps}
          data={data}
          field={f}
        />
      ))}
    </dl>
  </div>
);

export type AttributePairProps = {
  data: AttributeData;
  field: keyof AttributeData;
} & BoolPropsRequiredIfValueBool;

/**
 * A single attribute in an AttributeList
 * @param boolProps
 * @param data
 * @param field
 * @constructor
 * @private
 */
export const AttributePair: React.FC<AttributePairProps> = ({
  boolProps,
  data,
  field,
}) => {
  return (
    <>
      <dt className="mykn-attributelist__key">{field2Title(field)}</dt>
      <dd className="mykn-attributelist__value">
        <Value value={data[field]} boolProps={boolProps as BoolProps} />
      </dd>
    </>
  );
};
