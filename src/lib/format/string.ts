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

interface String2TitleOptions {
  addSpaces?: boolean;
  lowerCase?: boolean;
  ucFirst?: boolean;
  unHyphen?: boolean;
}

/**
 * Converts "field_name" to "Field name".
 * @param field
 * @param options
 */
export const string2Title = (
  field: string,
  options?: String2TitleOptions,
): string => {
  // Set default values for options using the spread operator
  const {
    addSpaces: addSpacesBool = true,
    lowerCase: lowerCaseBool = true,
    ucFirst: ucFirstBool = true,
    unHyphen: unHypenBool = true,
  } = options || {};

  let result = field;

  if (unHypenBool) {
    result = unHyphen(result); // Changed name to avoid conflict
  }

  if (addSpacesBool) {
    result = addSpaces(result); // Changed name to avoid conflict
  }

  if (lowerCaseBool) {
    result = result.toLowerCase();
  }

  if (ucFirstBool) {
    result = ucFirst(result); // Changed name to avoid conflict
  }

  return result;
};

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
