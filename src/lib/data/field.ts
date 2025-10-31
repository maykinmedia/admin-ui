import { LoadOptionsFn, Option } from "../../components";
import { FormField, getFormFieldTypeByFieldType } from "../form";
import { typeByDataArray } from "./data";
import { isPrimitive } from "./primitive";

/**
 * The default URL fields,
 */
export const DEFAULT_URL_FIELDS = [
  "absolute_url",
  "get_absolute_url",
  "href",
  "get_href",
  "url",
  "get_url",
];

/** A key in an object. */
export type Field<T extends object = object> = keyof T;

/** A key in object annotated with its type and optionally meta information. */
export type TypedField<T extends object = object> = {
  /** The field name. */
  name: keyof T;

  /** The field's values type. */
  type: FieldType;

  /** Whether the field should be active by default. */
  active?: boolean;

  /** Whether the field should be editable. */
  editable?: boolean;

  /** Whether the field should be filterable. */
  filterable?: boolean;

  /**
   * The "lookup" (query parameter) to use for this field while filtering (e.g.
   * "omschrijving__icontains").
   */
  filterLookup?: string;

  /** The value for this field's filter. */
  filterValue?: string | number;

  /** Whether a value is required. */
  required?: boolean;

  /** Used by DataGrid to determine whether the field should be sortable. */
  sortable?: boolean;

  /**
   * The "lookup" (dot separated) to use for this field while filtering (e.g.
   * "._expand.zaaktype.omschrijving").
   */
  valueLookup?: string;

  /**
   * A function transforming `T` to a value.
   * This can be used to compute values dynamically.
   */
  valueTransform?: (value: T) => unknown;

  /** Used by AttributeTable/DataGrid when editable=true. */
  options?: Option[] | LoadOptionsFn;

  /** Whether it's a multiple choice field. Used by forms. */
  multiple?: boolean;

  /** The placeholder shown when there's no value */
  placeholder: string;

  /** Used by DataGrid to set column width. */
  width?: string;
};

/** Known options for TypedField["type"] */
export type FieldType =
  | "boolean"
  | "date"
  | "daterange"
  | "duration"
  | "null"
  | "number"
  | "string"
  | "text" // Similar to string but  when rendered uses <Textarea />.
  | "jsx";

/** A Django-admin like field_options definition. */
export type FieldOptions<T extends object = object> = {
  /** A `string[]` or `TypedField[]` containing the keys in to show data for. */
  fields: Array<Field<T> | TypedField<T>>;

  /** When shown in a Kanban: the component to render. */
  // eslint-disable-next-line
  component?: React.ComponentType<any>;

  /** When shown in an AttributeGrid: the number of columns to span for each field. */
  colSpan?: number;

  /** When shown in an AttributeGrid: the span to use for this fieldset. */
  span?: number;

  /** When shown in an ItemGrid: the field to use as title. */
  title?: Field<T>;

  /** When shown in an AttributeGrid: the number of columns to span for title. */
  titleSpan?: number;
};

/** A Django-admin like fieldset definition. */
export type FieldSet<T extends object = object> = [
  string | undefined,
  FieldOptions<T>,
];

/**
 * Converts an array of `Field` or `TypedField` into an array of `TypedField`.
 * Each element is normalized by inspecting the optional `objectList` and
 * extending with the optional `base` properties.
 *
 * @template T - The type of the source objects.
 * @param optionallyTypedFields - An array of field keys or typed field objects.
 * @param objectList - Optional array of source objects used to infer field types.
 * @param base - Optional base properties to merge into each resulting `TypedField`.
 * @returns An array of fully normalized `TypedField` objects.
 */
export function fields2TypedFields<T extends object>(
  optionallyTypedFields: Array<Field<T> | TypedField<T>>,
  objectList?: T[],
  base?: Partial<TypedField<T>>,
): TypedField<T>[] {
  return optionallyTypedFields.map((field) =>
    field2TypedField<T>(field, objectList, base),
  );
}

/**
 * Converts a single `Field` or `TypedField` into a `TypedField`.
 * If a primitive key is provided, its type is inferred from the optional `objectList`.
 * Any additional properties from `base` are merged into the resulting `TypedField`.
 *
 * @template T - The type of the source objects.
 * @param optionallyTypedField - A field key or a typed field object.
 * @param objectList - Optional array of source objects used to infer field types.
 * @param base - Optional base properties to merge into the resulting `TypedField`.
 * @returns A fully normalized `TypedField` object.
 */
export function field2TypedField<T extends object>(
  optionallyTypedField: Field<T> | TypedField<T>,
  objectList?: T[],
  base?: Partial<TypedField<T>>,
): TypedField<T> {
  return Object.assign(
    { ...base },
    isPrimitive<Field<T>>(optionallyTypedField)
      ? {
          type: typeByDataArray<T>(optionallyTypedField, objectList),
          name: optionallyTypedField,
        }
      : optionallyTypedField,
  );
}

/**
 * Converts a `Field` or `TypedField` into a `FormField` suitable for forms.
 * The field is first normalized to a `TypedField`, then mapped to form-specific properties.
 *
 * @template T - The type of the source objects.
 * @param optionallyTypedField - A field key or a typed field object.
 * @param objectList - Optional array of source objects used to infer field types.
 * @returns A `FormField` object with `name`, `type`, `options`, and `required` properties.
 */
export function field2FormField<T extends object>(
  optionallyTypedField: Field<T> | TypedField<T>,
  objectList?: T[],
): FormField {
  const typedField = field2TypedField<T>(optionallyTypedField, objectList);
  return {
    name: getFieldName(typedField)?.toString(),
    options: typedField.options,
    required: typedField.required,
    type: getFormFieldTypeByFieldType(typedField.type),
  };
}

/**
 * Retrieves the name of a field.
 *
 * - If the field is a primitive key (e.g., string, number, or symbol), returns it directly.
 * - If the field is a `TypedField`, returns its `.name` property.
 *
 * @template T - The type of the source object.
 * @param optionallyTypedField - A field key or a typed field object.
 * @returns The name of the field as a key.
 */
export function getFieldName<T extends object>(
  optionallyTypedField: Field<T> | TypedField<T>,
) {
  return isPrimitive(optionallyTypedField)
    ? optionallyTypedField
    : (optionallyTypedField as TypedField<T>).name;
}
