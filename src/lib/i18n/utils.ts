import { MessageDescriptor } from "react-intl";

/**
 * Creates a `MessageDescriptor` for `messages` if it's truthy, returns `undefined`
 * otherwise.
 *
 * @param args
 *
 *  - message: The messages to wrap in a `MessageDescriptor`.
 *  - fallback: fallback MessageDescriptor if `message===undefined`
 *
 *  @return MessageDescriptor
 */
export function createMessageDescriptor(
  ...args:
    | [message: string]
    | [message: string | undefined, fallback: MessageDescriptor]
): MessageDescriptor {
  const [message, fallback] = args;
  if (typeof message !== "undefined") {
    // Trick react-intl into ignoring empty id by using complex String type.
    const id = message || (new String() as string);
    return { id, defaultMessage: message };
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
