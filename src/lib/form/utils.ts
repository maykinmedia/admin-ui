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
  >((acc, [key, value]) => {
    if (Object.prototype.hasOwnProperty.call(acc, key)) {
      // Key is already set on (serialized) `acc`, replace it with an `Array`.
      const existingValue = acc[key];

      acc[key] = Array.isArray(existingValue)
        ? [...existingValue, value]
        : [existingValue, value];
    } else {
      // Key is not yet set in (serialized) `acc`, set it.
      acc[key] = value;
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
  const regexFormikArrayFieldName = /\[(\d)+\]/; // Matches field[1] syntax.
  const formikFieldNameMatch = field.name?.match(regexFormikArrayFieldName);

  // Get value from values.
  const value =
    field.name && Object.prototype.hasOwnProperty.call(values, field.name)
      ? values[field.name]
      : formikFieldNameMatch
        ? values[(field.name as string).replace(regexFormikArrayFieldName, "")] // Get name from Formik name.
        : undefined;

  // Get value from array of values.
  if (Array.isArray(value)) {
    const arrayIndex = formikFieldNameMatch
      ? parseInt(formikFieldNameMatch[1])
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
 * Returns the (JSX friendly) value for `field`.
 * @param fields
 * @param errors
 * @param field
 */
export const getErrorFromErrors = (
  fields: FormField[],
  errors: Record<string, string | string[]>,
  field: FormField,
): string | undefined => {
  // Support Formik array field names (field[1]).
  const regexFormikArrayFieldName = /\[(\d)+\]/; // Matches field[1] syntax.
  const formikFieldNameMatch = field.name?.match(regexFormikArrayFieldName);

  // Get value from values.
  const error =
    field.name && Object.prototype.hasOwnProperty.call(errors, field.name)
      ? errors[field.name]
      : formikFieldNameMatch
        ? errors[(field.name as string).replace(regexFormikArrayFieldName, "")] // Get name from Formik name.
        : undefined;

  // Get value from array of values.
  if (Array.isArray(error)) {
    const arrayIndex = formikFieldNameMatch
      ? parseInt(formikFieldNameMatch[1])
      : fields
          .filter((f) => f.name === field.name)
          .findIndex((f) => f === field);

    const _value = error[arrayIndex];
    return _value;
  }

  return error;
};
