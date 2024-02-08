/** Typeguard for boolean. */
export const isBool = (value: unknown): value is boolean =>
  typeof value === "boolean";

/** Typeguard for number. */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

/** Typeguard for string. */
export const isString = (value: unknown): value is string =>
  typeof value === "string";

/** An object with key/value pairs describing various attributes to be presented. */
export type AttributeData<T = Attribute> = Record<string, T>;

/** A value in `AttributeData`. */
export type Attribute = boolean | number | string | null;

/** Typeguard for null. */
export const isNull = (value: unknown): value is null => value === null;

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
    if (typeof valueA === "string" && typeof valueB === "string") {
      return multiplier * valueA.localeCompare(valueB);
    }

    return (
      multiplier *
      ((valueA as unknown as number) - (valueB as unknown as number))
    );
  });
};
