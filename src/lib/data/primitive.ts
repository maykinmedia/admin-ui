/** Supported primitive values. */
export type Primitive = boolean | number | string | null;

/**
 * Returns whether `value` is a primitive, acts as type guard for `<T = Attribute>` through generic.
 * @param value
 */
export const isPrimitive = <T = Primitive>(value: unknown): value is T =>
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
