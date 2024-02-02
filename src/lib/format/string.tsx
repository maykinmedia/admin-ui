/**
 * Converts "field_name" to "FIELD NAME".
 * @param field
 */
export const field2Caption = (field: string): string =>
  String(field).replaceAll("_", " ").toUpperCase();
