import { Field, FieldSet, FieldType, TypedField, getFieldName } from "./field";

/**
 * Creates an array of new objects containing only the specified fields from the provided object,
 * based on the given fieldsets.
 *
 * @param obj - The source object from which to select fields.
 * @param fieldsets - An array of fieldsets, each defining a group of fields to be selected from the object.
 *                    Each fieldset is represented as a tuple, where the first element is an optional name or label
 *                    for the fieldset, and the second element is an object containing the fields to be selected.
 *                    The fields to be selected are defined within the 'fields' property of the fieldset object.
 * @returns An array of new objects, each containing only the specified fields from the source object,
 *          based on the provided fieldsets.
 */
export const dataByFieldsets = <T extends object = object>(
  obj: T,
  fieldsets: FieldSet<T>[],
): T[] => fieldsets.map((f) => dataByFields(obj, f[1].fields));

/**
 * Creates a new object containing only the specified fields from the provided object.
 *
 * @param object - The source object from which to select fields.
 * @param fields - An array of keys representing the fields to be selected from the object.
 * @returns A new object containing only the specified fields from the source object.
 * @template T - The type of the source object.
 */
export const dataByFields = <T extends object = object>(
  object: T,
  fields: Array<Field<T> | TypedField<T>>,
): T => {
  return fields.reduce((acc, val) => {
    const key = getFieldName(val);

    if (!(key in object)) {
      return acc;
    }

    return {
      ...acc,
      [key]: object[key as keyof T],
    };
  }, {} as T);
};

/**
 * Attempts to find `field`'s type based on its presence in a row in `objectList`.
 * @param field
 * @param objectList
 * @returns FieldTypes
 */
export const typeByDataArray = <T extends object = object>(
  field: Field<T>,
  objectList: T[] = [],
): FieldType => {
  const validTypes = ["string", "number", "boolean", "null"];
  const fieldPopulatedRow = objectList.find(
    (a) => a[field] && validTypes.includes(typeof a[field]),
  );

  if (!fieldPopulatedRow) {
    return "null";
  }

  const fieldValue = fieldPopulatedRow[field];
  return typeof fieldValue as FieldType;
};

/**
 * Filters `objectList` by `data`
 * @param objectList
 * @param data
 */
export const filterDataArray = <T extends object = object>(
  objectList: T[],
  data: T | object,
): T[] => {
  return objectList.filter((obj) => {
    return Object.entries(obj).every(([key, attributeValue]) => {
      if (!(key in data)) return true;

      const filterValue = data[key as keyof typeof data];
      if (typeof filterValue === "undefined") return true;

      switch (typeof attributeValue) {
        case "undefined":
          if (filterValue) {
            return false;
          }
          break;
        case "boolean":
          if (attributeValue !== Boolean(filterValue as unknown)) {
            return false;
          }
          break;

        case "number":
          if (attributeValue !== Number(filterValue)) {
            return false;
          }
          break;

        case "string":
          if (
            !attributeValue
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          ) {
            return false;
          }
          break;
      }
      return true;
    });
  });
};

/**
 * Sorts `objectList` by `field` based on `direction`.
 * @param objectList
 * @param field
 * @param direction can be "ASC" or "DESC".
 */
export const sortDataArray = <T extends object>(
  objectList: T[],
  field: keyof T | string,
  direction: "ASC" | "DESC",
): T[] => {
  const multiplier = direction === "ASC" ? 1 : -1;

  return [...objectList].sort((a, b) => {
    const valueA = a[field as keyof T];
    const valueB = b[field as keyof T];

    // Handle undefined or null cases explicitly
    if (valueA == null || valueB == null) {
      return multiplier * (valueA == null ? -1 : 1);
    }

    // Use localeCompare for strings
    if (typeof valueA === "string" && typeof valueB === "string") {
      return multiplier * valueA.localeCompare(valueB);
    }

    // Numeric comparison for other types (assume numbers for simplicity)
    if (typeof valueA === "number" && typeof valueB === "number") {
      return multiplier * (valueA - valueB);
    }

    // Fall back to string comparison for other types
    return multiplier * String(valueA).localeCompare(String(valueB));
  });
};
