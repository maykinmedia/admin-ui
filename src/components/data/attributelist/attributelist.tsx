import { string2Title } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import { Field } from "../../../lib";
import { H3 } from "../../typography";
import { Value } from "../value";
import "./attributelist.scss";

export type AttributeListProps<T extends object = object> =
  React.ComponentPropsWithoutRef<"div"> & {
    /** The object to show object attributes of. */
    object: T;

    /** The number of columns to span for each field, 12 means 1 pair per row. */
    colSpan?: number;

    /** The fields in object to show. */
    fields?: Array<keyof T>;

    /** A title for the attribute list. */
    title?: string;

    /** An optional id for the title. */
    titleId?: string;

    /** The number of columns to span for the title. */
    titleSpan?: number;
  };

/**
 * AttributeList Component
 *
 * Shows key/value pairs, optionally grouped by `title`.
 *
 * @typeParam T - The shape of a single item.
 */
export const AttributeList = <T extends object = object>({
  colSpan,
  title = "",
  titleId,
  titleSpan,
  object = {} as T,
  fields = Object.keys(object) as Field<T>[],
  ...props
}: AttributeListProps<T>) => (
  <div
    className={clsx("mykn-attributelist", {
      [`mykn-attributelist--col-span-${colSpan}`]: colSpan,
      [`mykn-attributelist--title-span-${titleSpan}`]: titleSpan,
    })}
    {...props}
  >
    {title && <H3 id={titleId}>{string2Title(title)}</H3>}

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
    <div className="mykn-attributelist__pair">
      <dt className="mykn-attributelist__key">
        {string2Title(field.toString())}
      </dt>
      <dd className="mykn-attributelist__value">
        <Value value={object[field]} />
      </dd>
    </div>
  );
};
