import { MessageDescriptor } from "react-intl";

/**
 * Creates a `MessageDescriptor` for `messages` if it's truthy, returns `undefined`
 * otherwise.
 *
 * @param message - The messages to wrap in a `MessageDescriptor`.
 * @param fallback
 */
export function createMessageDescriptor(
  ...args:
    | [message: string]
    | [message: string | undefined, fallback: MessageDescriptor]
): MessageDescriptor {
  const [message, fallback] = args;
  if (typeof message !== "undefined") {
    return { id: message, defaultMessage: message };
  }
  return fallback!;
}

/**
 * Converts `context` (for use with `intl.formatMessage`) so that all values are `string`.
 *
 * @param context - Key/value pairs to use in `formatMessage` calls.
 */
export function stringifyContext(context: object): Record<string, string> {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      value?.toString() || "",
    ]),
  );
}
