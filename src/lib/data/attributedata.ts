import { ChoiceFieldProps } from "../../components";

/** An object with key/value pairs describing various attributes to be presented. */
export type AttributeData<T = Attribute> = Record<string, T>;

/** A value in `AttributeData`. */
export type Attribute = boolean | number | string | null;

/** A key in `AttributeData`. */
export type Field = keyof AttributeData;

/** A key in `AttributeData` annotated with its type. */
export type TypedField<T = Attribute> = {
  /** The field name. */
  name: Field;

  /** The field's values type. */
  type: T extends boolean
    ? "boolean"
    : T extends number
      ? "number"
      : T extends string
        ? "string"
        : T extends null
          ? "null"
          : unknown;

  /** Whether the field should be editable. */
  editable?: boolean;

  /** Used by DataGrid when editable=true. */
  options?: ChoiceFieldProps["options"];
};

/** A Django-admin like field_options definition. */
export type FieldOptions = {
  /** The fields to include in this fieldset/ */
  fields: Field[];

  /** When shown in a grid: the span to use for this fieldset. */
  span?: number;
};

/** A Django-admin like fieldset definition. */
export type FieldSet = [string | undefined, FieldOptions];

/**
 * Returns whether `value` is a primitive, acts as type guard for `<T = Attribute>` through generic.
 * @param value
 */
export const isPrimitive = <T = Attribute>(value: unknown): value is T =>
  Object(value) !== value;

/** Typeguard for boolean. */
export const isBool = (value: unknown): value is boolean =>
  typeof value === "boolean";

/** Typeguard for number. */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

/** Typeguard for string. */
export const isString = (value: unknown): value is string =>
  typeof value === "string";

/** Typeguard for null. */
export const isNull = (value: unknown): value is null => value === null;

/** Typeguard for undefined. */
export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

/**
 * Creates an array of new objects containing only the specified fields from the provided object,
 * based on the given fieldsets.
 *
 * @param object - The source object from which to select fields.
 * @param fieldsets - An array of fieldsets, each defining a group of fields to be selected from the object.
 *                    Each fieldset is represented as a tuple, where the first element is an optional name or label
 *                    for the fieldset, and the second element is an object containing the fields to be selected.
 *                    The fields to be selected are defined within the 'fields' property of the fieldset object.
 * @returns An array of new objects, each containing only the specified fields from the source object,
 *          based on the provided fieldsets.
 */
export const attributeDataByFieldsets = (
  object: AttributeData,
  fieldsets: FieldSet[],
): AttributeData[] =>
  fieldsets.map((f) => attributeDataByFields(object, f[1].fields));

/**
 * Creates a new object containing only the specified fields from the provided object.
 *
 * @param object - The source object from which to select fields.
 * @param fields - An array of keys representing the fields to be selected from the object.
 * @returns A new object containing only the specified fields from the source object.
 * @template AttributeData - The type of the source object.
 */
export const attributeDataByFields = (
  object: AttributeData,
  fields: (keyof AttributeData)[],
): AttributeData =>
  fields.reduce(
    (acc, val) => ({
      ...acc,
      [val]: object[val],
    }),
    {},
  );

/**
 * Converts `Array<Field , TypedField>` to `Field[]`.
 * @param optionallyTypedFields
 */
export const fieldsByTypedFields = (
  optionallyTypedFields: Array<Field | TypedField>,
): Field[] =>
  optionallyTypedFields.map((field) =>
    isPrimitive<Field>(field) ? field : (field.name as Field),
  );

/**
 * Converts `Array<Field , TypedField>` to `TypedField[]` by inspecting `attributeDataArray`.
 * @param optionallyTypedFields
 * @param attributeDataArray
 */
export const typedFieldByFields = (
  optionallyTypedFields: Array<Field | TypedField>,
  attributeDataArray: AttributeData[],
): TypedField[] => {
  return optionallyTypedFields.map((field) =>
    isPrimitive<Field>(field)
      ? {
          type: typeByAttributeDataArray(field, attributeDataArray),
          name: field,
        }
      : field,
  );
};

/**
 * Attempts to find `field`'s type based on its presence in a row in `attributeDataArray`.
 * @param field
 * @param attributeDataArray
 */
export const typeByAttributeDataArray = (
  field: Field,
  attributeDataArray: AttributeData<unknown>[],
): TypedField["type"] => {
  const validTypes = ["string", "number", "boolean", "null"];
  const fieldPopulatedRow = attributeDataArray.find(
    (a) => a[field] && validTypes.includes(typeof a[field]),
  );

  if (!fieldPopulatedRow) {
    return "null";
  }

  const fieldValue = fieldPopulatedRow[field];
  return typeof fieldValue as TypedField["type"];
};

/**
 * Sorts `objectList` by `field` based on `direction`.
 * @param objectList
 * @param field
 * @param direction can be "ASC" or "DESC".
 */
export const sortAttributeDataArray = <T = AttributeData>(
  objectList: T[],
  field: keyof T,
  direction: "ASC" | "DESC",
): T[] => {
  const multiplier = direction === "ASC" ? 1 : -1;

  return objectList.sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    // Use String.localeCompare for strings.
    if (typeof valueA === "string" || typeof valueB === "string") {
      return (
        multiplier *
        ((valueA || "") as string).localeCompare((valueB || "") as string)
      );
    }

    return (
      multiplier *
      ((valueA as unknown as number) - (valueB as unknown as number))
    );
  });
};
