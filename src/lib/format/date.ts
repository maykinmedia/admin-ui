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
 * Formats a given `Date` object as a date string.
 *
 * @param dateObject - The `Date` instance to format.
 * @param format - The output format: `"YYYYMMDD"` (default) or `"DDMMYYYY"`.
 *   - `"YYYYMMDD"` → returns `"YYYY-MM-DD"`
 *   - `"DDMMYYYY"` → returns `"DD-MM-YYYY"`
 * @returns The formatted date string with zero-padded day and month.
 */
export const date2DateString = (
  dateObject: Date,
  format: "YYYYMMDD" | "DDMMYYYY" = "YYYYMMDD",
) => {
  const date = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();

  const DD = date.toString().padStart(2, "0");
  const MM = month.toString().padStart(2, "0");
  const YY = year.toString().padStart(4, "0");

  switch (format) {
    case "DDMMYYYY":
      return `${DD}-${MM}-${YY}`;
  }
  return `${YY}-${MM}-${DD}`;
};
