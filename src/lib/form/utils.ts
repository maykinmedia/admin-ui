import {
  Attribute,
  AttributeData,
  Primitive,
  isPrimitive,
} from "../data/attributedata";
import { date2DateString } from "../format";
import { FormField } from "./typeguards";

export type SerializedFormData = Record<
  string,
  Attribute | File | Array<Attribute | File>
>;

/**
 * Basic `FormData` based serialization function.
 * Duplicate keys (input names) are merged into an `Array`.
 * @param form
 * @param useTypedResults Whether the convert results to type inferred from input type (e.g. checkbox value will be boolean).
 */
export const serializeForm = (
  form: HTMLFormElement,
  useTypedResults = false,
): SerializedFormData => {
  const formData = new FormData(form);
  const entries = Array.from(formData.entries());

  const data = entries.reduce<SerializedFormData>((acc, [name, value]) => {
    const inputsMatchingName = [...form.elements].filter(
      (n) => n.getAttribute("name") === name,
    ) as Array<
      | HTMLButtonElement
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >;
    const nameMultipleTimesInForm = inputsMatchingName.length > 1;
    // Edge case: radio can possibly have more than one DOM element representing a single value.
    const isRadio = inputsMatchingName.every((i) => i.type === "radio");

    if (nameMultipleTimesInForm && !isRadio) {
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

  return useTypedResults ? typeSerializedFormData(form, data) : data;
};

/**
 * Converts values in `data` to the type implied by the associated form control in `form`.
 * @param form
 * @param data
 */
const typeSerializedFormData = (
  form: HTMLFormElement,
  data: SerializedFormData,
) => {
  // Work around for edge case where checkbox is not present in `data` when unchecked.
  // This builds an object with all form fields keys (including unchecked checkbox)
  // set to `undefined`, we can merge this with `data` later on to get a complete
  // data collection.
  //
  // TODO: We can possibly leverage `form.element` to optimize serialisation.
  const baseData = Object.fromEntries(
    Object.values(form.elements)
      .map((element) => {
        return element instanceof RadioNodeList
          ? (element[0] as Element | undefined)?.getAttribute("name")
          : element.getAttribute("name");
      })
      .filter((name): name is string => Boolean(name))
      .map((name): [string, undefined] => [name, undefined]),
  );

  // Merge `data` and baseData into `completeData`.
  const completeData: SerializedFormData = Object.assign(baseData, data);

  return Object.fromEntries(
    Object.entries(completeData).map(([key, value]) => {
      if (Array.isArray(value)) {
        const values = value.map((v, index) => {
          const constructor = getInputTypeConstructor(form, key, value, index);
          return constructor ? constructor(v) : v;
        });
        return [key, values];
      }

      const constructor = getInputTypeConstructor(form, key, value);
      const _value = constructor ? constructor(value) : value;
      return [key, _value];
    }),
  );
};

/**
 * Returns a Function providing a constructor for a typed value (e.g. input[type="number"] -> Number) at the `index`
 * occurrence of input matching `name` in `form`.
 * @param form
 * @param name
 * @param value
 * @param index
 */
export const getInputTypeConstructor = (
  form: HTMLFormElement,
  name: string,
  value: unknown | unknown[],
  index?: number,
) => {
  const type = getInputType(form, name, index);
  if (value === "") return () => null;

  switch (type) {
    case "date":
      return (value: string) => new Date(value);
    case "daterange":
      return (value: string) => {
        const values = value.split("/").map((value) => new Date(value));
        return values.length ? values : null;
      };
    case "number":
      return Number;
    case "checkbox":
      return Array.isArray(value) ? undefined : Boolean;
  }
};

/**
 * Returns the type of the `index` occurrence of input matching `name` in `form`.
 * @param form
 * @param name
 * @param index
 */
export const getInputType = (
  form: HTMLFormElement,
  name: string,
  index: number = 0,
) => {
  // FIXME: const inputs = form.elements.namedItem(name); ?
  const inputs = [...form.elements].filter(
    (n) => n.getAttribute("name") === name,
  ) as HTMLElement[];
  const input = inputs[index];
  return input?.dataset.myknType || input?.getAttribute("type");
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

    case "object":
      if (value instanceof Date) {
        return date2DateString(value);
      }
      break;

    default:
      return isPrimitive<Exclude<Primitive, boolean>>(value)
        ? value
        : String(value || "");
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
