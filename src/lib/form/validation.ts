import { AttributeData } from "../data";
import { formatMessage } from "../i18n";
import { FormField } from "./typeguards";
import { parseFieldName } from "./utils";

export type Validator = (
  value: unknown,
  field: FormField,
  message?: string | undefined,
) => string | undefined;

/**
 * Validators whether `value` is set on `field` and `field` is required.
 * @param value
 * @param field
 * @param message
 */
export const validateRequired: Validator = (
  value,
  field,
  message = 'Field "{name}" is required',
) => {
  // Not required, don't validate.
  if (!field.required || value) {
    return;
  }

  // Return error message as no value is set.
  return formatMessage(message, {
    ...field,
    name: parseFieldName(field.name)[0],
  });
};

/**
 * Validates the form by running all fields through all validators.
 * @param values
 * @param fields
 * @param validators
 */
export const validateForm = (
  values: AttributeData,
  fields: FormField[],
  validators: Validator[] = [validateRequired],
) => {
  const errors = validators.reverse().reduce(
    (errors, validator) => ({
      ...errors,
      ...fields.reduce((acc, field) => {
        const [name] = parseFieldName(field.name) as [
          string,
          number | undefined,
        ];
        const value = values[name];

        // Validate array, multiple values.
        if (Array.isArray(value)) {
          // FIXME: this is fixes issue with `[]` value when using Formik.
          const formikHack = value.length > 0 ? value : [false];

          const results = formikHack.map((v) => validator(v || false, field));
          const errors = results.some(Boolean) ? results : undefined;
          return { ...acc, [name]: errors };
        }

        // Validate single value.
        return {
          ...acc,
          [name]: validator(value, field),
        };
      }, {}),
    }),
    {},
  );
  return Object.fromEntries(
    Object.entries(errors).filter(([, v]) => Boolean(v)),
  );
};

/**
 * Returns the correct error from `errors` for the specific `field` in `fields`.
 *
 *   - `field.name' may not match serialized name because a Formik array field name ("field[0]") may be used where the
 *     serialized structure uses an array as value ("field: ["This field is required"])
 *   - `errors[field.name]` may be an array and the correct entry should be returned.
 *
 * @param fields
 * @param errors
 * @param field
 */
export const getErrorFromErrors = (
  fields: FormField[],
  errors: Record<string, string | string[]>,
  field: FormField,
): string | undefined => {
  // Normalize (Formik array) name.
  const [name, formikIndex] = parseFieldName(field.name);

  // Get value from values.
  const error = name && errors[name];

  // Get error from array of errors
  if (Array.isArray(error)) {
    // Find specific index for error based on either Formik array name or matching specific field.
    const arrayIndex = formikIndex
      ? formikIndex
      : fields
          .filter((f) => f.name === field.name)
          .findIndex((f) => f === field);

    return error[arrayIndex];
  }

  return error;
};
