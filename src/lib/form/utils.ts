import { Attribute, AttributeData } from "../data/attributedata";
import { FormField } from "./typeguards";

export type SerializedFormData = Record<
  string,
  FormDataEntryValue | FormDataEntryValue[]
>;

/**
 * Basic `FormData` based serialization function.
 * Duplicate keys (input names) are merged into an `Array`.
 * @param form
 */
export const serializeForm = (form: HTMLFormElement): SerializedFormData => {
  const formData = new FormData(form);
  const entries = Array.from(formData.entries());

  return entries.reduce<
    Record<string, FormDataEntryValue | FormDataEntryValue[]>
  >((acc, [name, value]) => {
    const nameMultipleTimesInForm =
      form.querySelectorAll(`[name=${name}]`).length > 1;

    if (nameMultipleTimesInForm) {
      // Key is already set on (serialized) `acc`, replace it with an `Array`.
      const existingValue = acc[name];

      acc[name] = existingValue
        ? Array.isArray(existingValue)
          ? [...existingValue, value]
          : [existingValue, value]
        : [value];
    } else {
      // Key is not yet set in (serialized) `acc`, set it.
      acc[name] = value;
    }

    return acc;
  }, {});
};

/**
 * Returns the (JSX friendly) value for `field`.
 * @param fields
 * @param values
 * @param field
 */
export const getValueFromFormData = (
  fields: FormField[],
  values: AttributeData<Attribute | Attribute[]> | SerializedFormData,
  field: FormField,
): number | string | undefined => {
  // Support Formik array field names (field[1]).
  const [name, formikIndex] = parseFieldName(field.name);

  // Get value from values.
  const value = name && values[name];

  // Get value from array of values.
  if (Array.isArray(value)) {
    const arrayIndex = formikIndex
      ? formikIndex
      : fields
          .filter((f) => f.name === field.name)
          .findIndex((f) => f === field);

    const _value = value[arrayIndex];
    return attribute2Value(_value as Attribute);
  }

  return attribute2Value(value as Attribute);
};

/**
 * Converts Attribute to JSX friendly value.
 * @param value
 */
export const attribute2Value = (
  value: Attribute | undefined,
): number | string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  switch (typeof value) {
    case "boolean":
      return String(value);

    default:
      return value;
  }
};

/**
 * Parses `name` as Formik array field name (field[0]) to ["field", 0]. If `name` does not have such a format,
 * ["field", undefined] format will be used.
 * @param name
 */
export const parseFieldName = (
  name: string | undefined,
): [string | undefined, number | undefined] => {
  if (typeof name === "undefined") {
    return [undefined, undefined];
  }

  // Support Formik array field names (field[1]).
  const regexFormikArrayFieldName = /\[(\d)+\]/; // Matches field[1] syntax.
  const formikFieldNameMatch = name?.match(regexFormikArrayFieldName);

  // Normalize (Formik array) name.
  return formikFieldNameMatch
    ? [
        name?.replace(regexFormikArrayFieldName, ""),
        parseInt(formikFieldNameMatch[1]),
      ]
    : [name, undefined];
};
