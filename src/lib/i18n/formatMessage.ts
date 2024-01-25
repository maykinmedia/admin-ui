/**
 * Replaces placeholders in the given template with corresponding values from the context.
 * TODO: Decide on future implementation.
 *
 * @param template - The input template containing placeholders in the format {key}.
 * @param context - An object with key-value pairs to replace the placeholders in the template.
 * @returns {string} - The formatted string with replaced placeholders.
 *
 * @example
 * const template = "Hello, {name}! Your score is {score}.";
 * const context = { name: "John", score: 85 };
 * const formattedMessage = formatMessage(template, context);
 * // Result: "Hello, John! Your score is 85."
 */
export const formatMessage = (
  template: string,
  context: Record<string, number | string>,
): string => {
  return Object.entries(context).reduce((acc, [key, value]) => {
    return acc.replace(`{${key}}`, String(value));
  }, template);
};
