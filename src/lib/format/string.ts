/** Matches a URL. */
export const REGEX_URL = /https?:\/\/[^\s]+$/;

/**
 * Returns whether `string` is a link according to `REGEX_URL`.
 * @param string
 */
export const isLink = (string: string): boolean =>
  Boolean(string.match(REGEX_URL));

/**
 * Converts "fieldName" to "field Name".
 * @param string
 */
export const addSpaces = (string: string) =>
  string.replaceAll(/(?<=[a-z])([A-Z])/g, (match) => " " + match);

/**
 * Converts "fieldName" to "Field name".
 * @param field
 */
export const field2Caption = (field: string): string =>
  ucFirst(unHyphen(addSpaces(field)));

/**
 * Converts "field_name" to "Field name".
 * @param field
 */
export const field2Title = (field: string): string =>
  ucFirst(addSpaces(unHyphen(field)).toLowerCase());

/**
 * Converts "Some object name" to "some-object-name".
 * @param string
 */
export const slugify = (string: string): string => {
  return string
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word characters (excluding hyphens)
    .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};

/**
 * Converts "some-hyphenated-or_underscored_string" to "some hyphenated or underscored string".
 * @param string
 */
export const unHyphen = (string: string): string => {
  return string
    .replaceAll("-", " ") // Replace hyphens with spaces
    .replaceAll("_", " ") // Replace underscores with spaces
    .replace(/  +/g, " "); // Replace multiple spaces with a single space
};

/**
 * Converts "some string" to "Some string"
 * @param string
 */
export const ucFirst = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);
