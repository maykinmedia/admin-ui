import { serializeElement, string2Title } from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";

import {
  Field,
  FieldErrors,
  FormValidator,
  TypedField,
  Validator,
  errors2errorsArray,
  field2FormField,
  field2TypedField,
  getErrorFromErrors,
  getFieldName,
  validateForm,
  validateRequired,
} from "../../../lib";
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

  /** Error messages, applied to automatically rendered field. */
  errors?: FieldErrors | Partial<Record<keyof T, string>>;

  /** The fields in object to show. */
  fields: Array<Field<T> | TypedField<T>>;

  /** A title for the attribute list. */
  title?: string;

  /** An optional id for the title. */
  titleId?: string;

  /** The number of columns to span for the title. */
  titleSpan?: number;

  /** A validation function. */
  validate?: FormValidator;

  /** If set, use this custom set of `Validator`s. */
  validators?: Validator[];

  /** Gets called when a value is edited. */
  onEdit?: (value: T) => void;
} & Pick<
    ValueEditableUnion<T>, // TODO: Drop of TypedField<,F>, test multiple valiators and getErrorFromErrors
    "editable" | "editing" | "labelEdit" | "onChange" | "formControlProps"
  >;

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
  editing,
  errors,
  fields = Object.keys(object) as Field<T>[],
  formControlProps,
  labelEdit,
  title = "",
  titleId,
  titleSpan,
  onBlur,
  onChange,
  onEdit,
  validate = validateForm,
  validators = [validateRequired],
  ...props
}: AttributeListProps<T>) => {
  const formFields = fields.map((field) => field2FormField<T>(field, [object]));

  const [errorsState, setErrorsState] = useState<
    FieldErrors<typeof formFields, typeof validators>
  >({});

  useEffect(() => {
    setErrorsState(errors2errorsArray(errors));
  }, [errors]);

  const renderTitle = title && <H3 id={titleId}>{string2Title(title)}</H3>;
  const isTitleAbove = titleSpan === 12;

  const handleChange = useCallback<React.ChangeEventHandler>(
    (e: React.ChangeEvent) => {
      const name = (e.target as HTMLInputElement).name;
      const value = serializeElement(e.target, { typed: true });
      const data = { ...object, [name]: value };
      const errors = validate(data, formFields, validators);
      setErrorsState(errors);

      onChange?.(e);
    },
    [object, validate, formFields, validators, onChange],
  );

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
          {fields.map((f, i) => {
            const fieldErrors = getErrorFromErrors(
              formFields,
              errorsState,
              formFields[i],
            );
            const message = fieldErrors?.join(", ");

            // FIXME ERROR
            return (
              <AttributePair<T>
                key={i}
                object={object}
                editable={editable}
                editing={editing}
                error={message}
                field={f}
                formControlProps={formControlProps}
                labelEdit={labelEdit}
                onBlur={onBlur}
                onChange={handleChange}
                onEdit={onEdit}
              />
            );
          })}
        </dl>
      </section>
    </div>
  );
};

export type AttributePairProps<T extends object = object> = {
  object: T;
  field: Field<T> | TypedField<T>;
  error?: string;
  onEdit?: (value: T) => void;
} & Pick<
  ValueEditableUnion,
  | "formControlProps"
  | "editable"
  | "editing"
  | "labelEdit"
  | "onBlur"
  | "onChange"
>;

/**
 * A single attribute in an AttributeList
 */
export const AttributePair = <T extends object = object>({
  object,
  field,
  formControlProps,
  editable,
  editing,
  error,
  labelEdit,
  onBlur,
  onChange,
  onEdit,
}: AttributePairProps<T>) => {
  const typedField = field2TypedField<T>(field, [object]);

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
        {string2Title(getFieldName(field).toString())}
      </dt>
      <dd className="mykn-attributelist__value">
        <Value
          editable={editable}
          editing={editing}
          error={error}
          field={typedField}
          formControlProps={{
            justify: "stretch",
            pad: false,
            ...formControlProps,
          }}
          labelEdit={labelEdit}
          value={object[typedField.name]}
          onBlur={handleBlur}
          onChange={onChange}
        />
      </dd>
    </div>
  );
};
