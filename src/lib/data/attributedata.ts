/** An object with key/value pairs describing various attributes to be presented. */
export type AttributeData<T = Attribute> = Record<string, T>;

/** A value in `AttributeData`. */
export type Attribute = boolean | number | string | null;

/** A key in `AttributeData`. */
export type Field = keyof AttributeData;

/** A Django-admin like field_options definition. */
export type FieldOptions = {
  /** The fields to include in this fieldset/ */
  fields: Field[];

  /** When shown in a grid: the span to use for this fieldset. */
  span?: number;
};

/** A Django-admin like fieldset definition. */
export type FieldSet = [string | undefined, FieldOptions];

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
 * Sorts `results` by `field` based on `direction`.
 * @param results
 * @param field
 * @param direction can be "ASC" or "DESC".
 */
export const sortAttributeDataArray = <T = AttributeData>(
  results: T[],
  field: keyof T,
  direction: "ASC" | "DESC",
): T[] => {
  const multiplier = direction === "ASC" ? 1 : -1;

  return results.sort((a, b) => {
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
