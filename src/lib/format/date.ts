/**
 * Converts `value` to `Date` or `undefined`.
 * @param dateOrDateString
 */
export const value2Date = (dateOrDateString: Date | string | number) => {
  if (!dateOrDateString) return undefined;

  if (dateOrDateString instanceof Date && !isNaN(dateOrDateString.getTime())) {
    return dateOrDateString;
  }

  const date = new Date(dateOrDateString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Returns date `string` for the given `Date`.
 */
export const date2DateString = (dateObject: Date) => {
  const date = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();

  const DD = date.toString().padStart(2, "0");
  const MM = month.toString().padStart(2, "0");
  const YY = year.toString().padStart(4, "0");

  return `${YY}-${MM}-${DD}`;
};
