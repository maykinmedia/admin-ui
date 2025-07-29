import { serializeElement, string2Title } from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { useCallback } from "react";

import { Field, TypedField, field2TypedField } from "../../../lib";
import { H3 } from "../../typography";
import { Value, ValueEditableUnion } from "../value";
import "./attributelist.scss";

export type AttributeListProps<T extends object = object> = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "onChange"
> & {
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

  /** Gets called when a value is edited. */
  onEdit?: (value: T) => void;
} & Omit<ValueEditableUnion, "editing" | "field" | "onEdit">;

/**
 * AttributeList Component
 *
 * Shows key/value pairs, optionally grouped by `title`.
 *
 * @typeParam T - The shape of a single item.
 */
export const AttributeList = <T extends object = object>({
  colSpan,
  object = {} as T,
  editable,
  fields = Object.keys(object) as Field<T>[],
  labelEdit,
  title = "",
  titleId,
  titleSpan,
  onBlur,
  onChange,
  onEdit,
  ...props
}: AttributeListProps<T>) => {
  const renderTitle = title && <H3 id={titleId}>{string2Title(title)}</H3>;
  const isTitleAbove = titleSpan === 12;

  return (
    <div
      className={clsx("mykn-attributelist", {
        [`mykn-attributelist--col-span-${colSpan}`]: colSpan,
        [`mykn-attributelist--title-span-${titleSpan}`]: !!title,
      })}
      {...props}
    >
      {title && isTitleAbove && (
        <header className="mykn-attributelist__header">{renderTitle}</header>
      )}

      <section className="mykn-attributelist__body">
        {title && !isTitleAbove && renderTitle}

        <dl className="mykn-attributelist__list">
          {fields.map((f) => (
            <AttributePair<T>
              key={f.toString()}
              object={object}
              editable={editable}
              field={f}
              labelEdit={labelEdit}
              onBlur={onBlur}
              onChange={onChange}
              onEdit={onEdit}
            />
          ))}
        </dl>
      </section>
    </div>
  );
};

export type AttributePairProps<T extends object = object> = {
  object: T;
  field: Field<T> | TypedField<T, keyof T>;
  onEdit?: (value: T) => void;
} & Omit<ValueEditableUnion, "editing" | "field" | "onEdit">;

/**
 * A single attribute in an AttributeList
 */
export const AttributePair = <T extends object = object>({
  object,
  field,
  editable,
  labelEdit,
  onBlur,
  onChange,
  onEdit,
}: AttributePairProps<T>) => {
  const typedField = field2TypedField<T, keyof T>(field, [object]);

  /**
   * Gets called when the <Value>'s <FormControl> is blurred.
   */
  const handleBlur = useCallback<React.FocusEventHandler>(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const data = {
        ...object,
        [typedField.name]: serializeElement(e.target),
      };
      onEdit?.(data);
      onBlur?.(e);
    },
    [object, typedField, onEdit, onBlur],
  );

  return (
    <div className="mykn-attributelist__pair">
      <dt className="mykn-attributelist__key">
        {string2Title(field.toString())}
      </dt>
      <dd className="mykn-attributelist__value">
        <Value
          editable={editable}
          field={typedField}
          labelEdit={labelEdit}
          value={object[typedField.name]}
          onBlur={handleBlur}
          onChange={onChange}
        />
      </dd>
    </div>
  );
};
