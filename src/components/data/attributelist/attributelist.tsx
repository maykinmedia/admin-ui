import React from "react";

import { Field, string2Title } from "../../../lib";
import { H3 } from "../../typography";
import { Value } from "../value";
import "./attributelist.scss";

export type AttributeListProps<T extends object = object> =
  React.ComponentPropsWithoutRef<"div"> & {
    /** The object to show object attributes of. */
    object: T;

    /** The fields in object to show. */
    fields?: Array<keyof T>;

    /** A title for the attribute list. */
    title?: string;

    /** An optional id for the title. */
    titleId?: string;
  };

/**
 * AttributeList Component
 *
 * Shows key/value pairs, optionally grouped by `title`.
 *
 * @typeParam T - The shape of a single item.
 */
export const AttributeList = <T extends object = object>({
  title = "",
  titleId,
  object = {} as T,
  fields = Object.keys(object) as Field<T>[],
  ...props
}: AttributeListProps<T>) => (
  <div className="mykn-attributelist" {...props}>
    {title && <H3 id={titleId}>{title}</H3>}

    <dl className="mykn-attributelist__list">
      {fields.map((f) => (
        <AttributePair<T> key={f.toString()} object={object} field={f} />
      ))}
    </dl>
  </div>
);

export type AttributePairProps<T extends object = object> = {
  object: T;
  field: keyof T;
};

/**
 * A single attribute in an AttributeList
 */
export const AttributePair = <T extends object = object>({
  object,
  field,
}: AttributePairProps<T>) => {
  return (
    <>
      <dt className="mykn-attributelist__key">
        {string2Title(field as string)}
      </dt>
      <dd className="mykn-attributelist__value">
        <Value value={object[field]} />
      </dd>
    </>
  );
};
