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
export const getValueFromFormData = <T extends object = object>(
  fields: FormField[],
  values: T,
  field: FormField,
) => {
  if (!field.name) return undefined;

  // Support Formik array field names (field[1]).
  const [name, formikIndex] = parseFieldName<T>(field.name);

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
    return data2Value(_value);
  }

  if (field.type === "checkbox") {
    return value;
  }

  return data2Value(value);
};

/**
 * Converts `data` to JSX friendly value.
 * @param data
 */
export function data2Value(data: unknown): number | string | undefined {
  if (data === null || data === undefined) {
    return "";
  }
  switch (typeof data) {
    case "boolean":
      return String(data);

    case "object":
      if (data instanceof Date) {
        return date2DateString(data);
      }
      // TODO: Investigate whether we should return "" here.
      return undefined;

    default:
      return isPrimitive<Exclude<Primitive, boolean | null | undefined>>(data)
        ? data
        : String(data || "");
  }
}

/**
 * Parses a field name that may include Formik array syntax (e.g., "field[0]") into a tuple.
 *
 * - If `name` includes array syntax, returns `[baseFieldName, index]`.
 * - Otherwise, returns `[name, undefined]`.
 *
 * @template T - The object type whose keys may appear as the (base) field name.
 * @param name - A string representing the field name. It may follow Formik array notation but doesn't have to.
 * @returns A tuple where:
 *   - The first element is the base field name as a key of `T`.
 *   - The second element is the array index if present, otherwise `undefined`.
 *
 * @example
 * parseFieldName<SomeForm>("emails[2]") // => ["emails", 2]
 * parseFieldName<SomeForm>("username")  // => ["username", undefined]
 * parseFieldName<SomeForm>("customName") // => ["customName", undefined]
 */
export const parseFieldName = <T extends object = Record<string, unknown>>(
  name: string,
): [keyof T, number | undefined] => {
  const regexFormikArrayFieldName = /\[(\d+)\]/; // Matches array syntax like [0], [1], etc.
  const formikFieldNameMatch = name?.match(regexFormikArrayFieldName);

  return formikFieldNameMatch
    ? [
        name.replace(regexFormikArrayFieldName, "") as keyof T,
        parseInt(formikFieldNameMatch[1]),
      ]
    : [name as keyof T, undefined];
};
