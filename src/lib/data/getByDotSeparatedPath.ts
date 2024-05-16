export const getByDotSeparatedPath = <T = unknown>(
  obj: Record<string, unknown>,
  path: string,
): T => {
  const nestedKeys = path.split(".");
  // @ts-expect-error - Type of acc is unknown here.
  return nestedKeys.reduce((acc, val) => acc?.[val], obj) as T;
};
