import { Primitive, isPrimitive } from "../data";
import { date2DateString } from "../format";
import { FormField } from "./typeguards";

export type SerializedFormData<T extends string = string> =
  | UnTypedSerializedFormData<T>
  | TypedSerializedFormData<T>;

export type UnTypedSerializedFormData<T extends string = string> = Record<
  T,
  FormDataEntryValue | FormDataEntryValue[]
>;

export type TypedSerializedFormData<T extends string = string> = Record<
  T,
  TypedFormDataEntryValue | TypedFormDataEntryValue[]
>;

export type TypedFormDataEntryValue =
  | FormDataEntryValue
  | FormDataEntryValue[]
  | boolean
  | number
  | Date
  | [Date, Date];

/**
 * Returns the (JSX friendly) value for `field`.
 * @param fields
 * @param values
 * @param field
 */
export const getValueFromFormData = <
  T extends SerializedFormData = SerializedFormData,
>(
  fields: FormField[],
  values: T,
  field: FormField,
): number | string | undefined => {
  // Support Formik array field names (field[1]).
  const [name, formikIndex] = parseFieldName(field.name);

  // Get value from values.
  const value = name && values[name as keyof T];

  // Get value from array of values.
  if (Array.isArray(value)) {
    const arrayIndex = formikIndex
      ? formikIndex
      : fields
          .filter((f) => f.name === field.name)
          .findIndex((f) => f === field);

    const _value = value[arrayIndex];
    return data2Value(_value);
  }

  return data2Value(value);
};

/**
 * Converts `data` to JSX friendly value.
 * @param data
 */
export const data2Value = (data: unknown): number | string | undefined => {
  if (data === null || data === undefined) {
    return undefined;
  }
  switch (typeof data) {
    case "boolean":
      return String(data);

    case "object":
      if (data instanceof Date) {
        return date2DateString(data);
      }
      break;

    default:
      return isPrimitive<Exclude<Primitive, boolean>>(data)
        ? data
        : String(data || "");
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
