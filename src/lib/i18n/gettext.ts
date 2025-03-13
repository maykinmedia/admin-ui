import { MessageDescriptor } from "react-intl";

import { useIntl } from "./useIntl";

/**
 * Returns the translation for the first match, either `propLabel` or `message`.
 * Note: This function should be called in React context.
 *
 * @param propLabel - A string or undefined:
 *
 *  - If set to "" (empty string): "" is returned.
 *  - If set to any other string: a `MessageDescriptor` is created dynamically
 *    and formated using `intl.formatMessage()`.
 *  - if set to `undefined`: `message` is used as fallback and passed to
 *   `intl.formatMessage()`.
 *
 * @param message - A `MessageDescriptor` to use when `propLabel` is `undefined`.
 * @param context - Values to pass to `intl.formatMessage()`.
 */
export function gettextFirst(
  propLabel: string | undefined,
  message: MessageDescriptor,
  context?: object,
): string {
  switch (propLabel) {
    case "":
      return "";
    case undefined:
      return gettext(message, context);
    default:
      return gettext(
        { id: "mykn.lib.getTextFirst", defaultMessage: propLabel },
        context,
      );
  }
}

/**
 * Returns the translation for `message` using `intl.formatMessage()`.
 * Not: This function should be called in React context.
 *
 * @param message - A `MessageDescriptor` to pass to `intl.formatMessage()`.
 * @param context - Values to pass to `intl.formatMessage()`.
 */
export function gettext(message: MessageDescriptor, context?: object): string {
  const intl = useIntl();
  return intl.formatMessage(message, stringifyContext(context as object));
}

/**
 * Converts `context` (for use with `intl.formatMessage`) so that all values are
 * primitives.
 *
 * @param context - Key/value pairs to use in `formatMessage` calls.
 */
export function stringifyContext(
  context?: object,
): Record<string, string> | undefined {
  if (!context) return undefined;

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      new Object(value) === value ? value?.toString() : value,
    ]),
  );
}
