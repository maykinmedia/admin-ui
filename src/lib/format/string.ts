/** Matches a URL. */
export const REGEX_URL = /https?:\/\/[^\s]+$/;

/**
 * Returns whether `string` is a link according to `REGEX_URL`.
 * @param string
 */
export const isLink = (string: string): boolean =>
  Boolean(string.match(REGEX_URL));

/**
 * Converts "field_name" to "FIELD NAME".
 * @param field
 */
export const field2Caption = (field: string): string =>
  String(field).replaceAll("_", " ").toUpperCase();

/**
 * Converts "Some object name" to "some-object-name".
 * @param input
 */
export const slugify = (input: string): string => {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word characters (excluding hyphens)
    .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};
