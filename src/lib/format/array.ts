/**
 * Returns `value` as `Array`.
 *  - If `value` is `undefined`, do nothing.
 *  - If `value` is already an `Array`, return it directly.
 *  - return `[value]` otherwise.
 * @param value
 */
export const forceArray = <T = unknown>(
  value: T | T[],
): Array<T> | undefined => {
  // If value is undefined, do nothing.
  if (typeof value === "undefined") {
    return undefined;
  }

  // If `value` is already an `Array`, return it directly, return `[value]` otherwise.
  return Array.isArray(value) ? value : [value];
};
