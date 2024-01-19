/**
 * Creates a `CustomEvent` of `type` with detail set to `detail`.
 * @param type The event type (e.g. `"change"`).
 * @param detail A value describing the event detail (e.g. `{ name: "school": value: "ee6a7af7-650d-499b-8e32-58a52ffdb7bc"}` or an `HTMLInputElement`).
 * @param bubbles Whether the event bubbles up through the DOM tree or not.
 * @param cancelable Whether the event can be canceled, and therefore prevented as if the event never happened.
 * @param composed Whether or not the event will propagate across the shadow DOM boundary into the standard DOM.
 */
export const eventFactory = <T = Record<string, unknown>>(
  type: string,
  detail: T,
  bubbles = true,
  cancelable = false,
  composed = false,
): CustomEvent<T> => {
  const customEvent = new CustomEvent<T>(type, {
    bubbles,
    cancelable,
    composed,
    detail: detail,
  });

  return customEvent;
};
