/**
 * Sorts `results` by `field` based on `direction`.
 * @param results
 * @param field
 * @param direction can be "ASC" or "DESC".
 */
export const sortData = <T = Record<string, boolean | number | string>>(
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
