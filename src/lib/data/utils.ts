/**
 * Retrieves a value from a nested object using a dot-separated path.
 *
 * @template T The expected type of the returned value.
 * @param obj The object to retrieve the value from.
 * @param path A dot-separated string representing the path to the desired value.
 *             For example, "key1.key2.key3" will retrieve `obj['key1']['key2']['key3']`.
 * @returns The value at the specified path within the object, cast to type `T`.
 *          Returns `undefined` if any part of the path is undefined.
 *
 * @example
 * const data = { user: { profile: { name: "Alice" } } };
 * const name = getByDotSeparatedPath<string>(data, "user.profile.name"); // "Alice"
 *
 * @example
 * const missingValue = getByDotSeparatedPath(data, "user.address.city"); // undefined
 */
export const getByDotSeparatedPath = <T = unknown>(
  obj: object,
  path: string,
): T => {
  const nestedKeys = path.split(".");
  // @ts-expect-error - Type of acc is unknown here.
  return nestedKeys.reduce((acc, val) => acc?.[val], obj) as T;
};
