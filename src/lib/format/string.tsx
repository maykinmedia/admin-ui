/** Matches a URL. */
export const REGEX_URL = /https?:\/\/[^\s]+$/;

/**
 * Converts "field_name" to "FIELD NAME".
 * @param field
 */
export const field2Caption = (field: string): string =>
  String(field).replaceAll("_", " ").toUpperCase();

/**
 * Returns whether `string` is a link according to `REGEX_URL`.
 * @param string
 */
export const isLink = (string: string): boolean =>
  Boolean(string.match(REGEX_URL));
