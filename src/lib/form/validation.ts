import { forceArray } from "@maykin-ui/client-common";

import { FormField } from "./typeguards";
import { parseFieldName } from "./utils";

//
// Types.
//

/**
 * Function type for validating a form.
 *
 * @template T - The type of form values.
 * @template F - The array of form fields.
 *
 * Takes the form values, form fields, and an array of validators, and returns
 * a `FieldErrors` object mapping field names to their validation errors.
 */
export type FormValidator = <T extends object, const F extends FormField[]>(
  values: T,
  fields: F,
  validators: Validator[],
) => FieldErrors<F, typeof validators>;

/**
 * A generic validator function type for form fields.
 *
 * @template DefaultMessage - The default error message to use if validation fails. Defaults to `string`.
 *
 * Provides two call signatures:
 * 1. With a custom message (`Message`) – returns `Message | undefined`.
 * 2. Without a message – returns `DefaultMessage | undefined`.
 *
 * @example
 * ```ts
 * const DEFAULT_ERROR = "Validation failed" as const;
 *
 * // Abstract validator using a default literal message
 * const validateField: Validator<typeof DEFAULT_ERROR> = (value, field, message = DEFAULT_ERROR) => {
 *   // Example validation logic: value must be truthy if field is required
 *   if (!field.required || value) return undefined;
 *   return message;
 * };
 *
 * const someField = { required: true } as FormField;
 *
 * // Using validator without a custom message
 * const result1 = validateField(undefined, someField);
 * // result1 inferred as "Validation failed" | undefined
 *
 * // Using validator with a custom literal message
 * const result2 = validateField(undefined, someField, "Custom error" as const);
 * // result2 inferred as "Custom error" | undefined
 * ```
 */
export type Validator<DefaultMessage extends string = string> = {
  <Message = DefaultMessage>(
    value: unknown,
    field: FormField,
    message: Message,
  ): Message | undefined;

  (value: unknown, field: FormField): DefaultMessage | undefined;
};

/**
 * Maps form field names to their validation error messages.
 *
 * @template F - Array of form fields.
 * @template V - Array of validators.
 *
 * For each field:
 * - If the field value is a single item, its error is an array of validator return types.
 * - If the field value is an array, its error is an array of arrays of validator return types
 *   (one array of errors per element in the value array).
 */
export type FieldErrors<
  F extends FormField[] = FormField[],
  V extends Validator[] = [Validator],
> = {
  [K in Exclude<F[number]["name"], undefined>]?: V[number] extends Validator
    ? ValidatorReturn<V[number]>[] | ValidatorReturn<V[number]>[][]
    : string[] | string[][];
};

/**
 * Extracts the literal type returned by a validator.
 * Returns `M | undefined` if `V` is `Validator<M>`, otherwise `string | undefined`.
 */
type ValidatorReturn<V extends Validator> =
  V extends Validator<infer M> ? M | undefined : string | undefined;

//
// Implementation.
//

export const DEFAULT_VALIDATION_ERROR_REQUIRED =
  "Dit veld is verplicht" as const;

/**
 * Validator that checks whether a value is set for a required field.
 *
 * Returns the provided `message` or `DEFAULT_VALIDATION_ERROR_REQUIRED` if validation fails.
 * Returns `undefined` if the field is not required or a value is present.
 */
export const validateRequired: Validator<
  typeof DEFAULT_VALIDATION_ERROR_REQUIRED
> = (
  value: unknown | unknown[],
  field: FormField,
  message = DEFAULT_VALIDATION_ERROR_REQUIRED,
) => {
  if (!field.required) return;

  const isChoiceField = "options" in field;
  const isCheckbox = field.type === "checkbox";

  const hasValue =
    Array.isArray(value) && (isChoiceField || isCheckbox)
      ? value.some(Boolean)
      : Boolean(value);

  return hasValue ? undefined : message;
};

/**
 * Validates a form by running each field's value through all provided validators.
 *
 * Behavior:
 * - For scalar values: returns an array of validator results.
 * - For array values: returns an array of arrays of validator results (one per item).
 *
 * Produces the full, detailed `FieldErrors` structure.
 * To collapse these into representative error messages, use {@link getErrorFromErrors}.
 *
 * @template T - The object type representing form values.
 * @template F - The tuple/array type of form fields.
 *
 * @param values - The current form values, keyed by field name.
 * @param fields - The metadata definitions for each form field.
 * @param validators - An optional list of validators to run for each field.
 * @returns A `FieldErrors` object mapping field names to their corresponding validation errors.
 */
export const validateForm: FormValidator = <
  T extends object,
  const F extends FormField[],
>(
  values: T,
  fields: F,
  validators: Validator[] = [],
): FieldErrors<F, typeof validators> => {
  const errors: FieldErrors<F, typeof validators> = {};

  const runValidators = (
    value: unknown,
    field: FormField,
  ): ValidatorReturn<(typeof validators)[number]>[] | undefined => {
    const results = validators.map((v) => v(value, field)).filter(Boolean);
    return results.length ? results : undefined;
  };

  for (const field of fields) {
    if (!field.name) continue;
    const [name, formikIndex] = parseFieldName<typeof errors>(field.name);
    const value = values[name as unknown as keyof T];

    const valueIsArray = Array.isArray(value);
    const valueIsFormikArray = typeof formikIndex === "number";
    const assumeArray = valueIsArray || valueIsFormikArray;
    const isChoiceField = "options" in field;

    // Deal with array of fields (not array of values).
    // Errors will be `string[][]`.
    if (assumeArray && !isChoiceField) {
      // Deal with possibly uninitialized values when using Formik.
      // Prepopulate empty array.
      const _value =
        !valueIsArray && valueIsFormikArray
          ? fields
              .filter((f) => f.name && parseFieldName(f.name)[0] === name)
              .map((f) => f.value || "")
          : (value as keyof T & Array<unknown>);

      const fieldErrors = _value?.map((item, i) => {
        // Different items may map to different field definitions with the same name
        const indexedField = fields.filter((f) => f.name === field.name)[
          typeof formikIndex === "number"
            ? 0 // If Formik index is set, only one field matches.
            : i // If no formik index is set, multiple fields with the same name may exist.
        ];
        return runValidators(item, indexedField);
      }) as ValidatorReturn<(typeof validators)[number]>[][];

      // Check if errors are present.
      if (fieldErrors.some(Boolean)) {
        errors[name] = fieldErrors;
      }
      // Deal with single field.
      // Errors will be `string[][]`.
    } else {
      const fieldError = runValidators(value, field);
      if (fieldError) {
        errors[name] = fieldError;
      }
    }
  }

  return errors;
};

/**
 * Retrieves a normalized error message for a specific field from a `FieldErrors`-like object.
 *
 * This function is intended to be used with the output of {@link validateForm}.
 * It handles both single-value errors and array-of-errors (e.g., Formik-style array fields),
 * returning a single error message string for the given field if one exists.
 *
 * @param fields - The array of form field definitions.
 * @param errors - An object mapping field names to their errors. Each value can be:
 *                 - a string (single error)
 *                 - an array of strings (multiple errors per field)
 * @param field - The specific field whose error should be retrieved.
 * @returns A single error message string for the field, or `undefined` if no error exists.
 */
export const getErrorFromErrors = <
  F extends FormField[] = FormField[],
  V extends Validator[] = [Validator],
>(
  fields: F,
  errors: FieldErrors<F, V>,
  field: F[number],
): ValidatorReturn<V[number]>[] | undefined => {
  if (!field.name) {
    return;
  }

  const [name, formikIndex] = parseFieldName<typeof errors>(field.name);
  const errorArray = errors[field.name as keyof typeof errors];

  // Formik style field name.
  if (typeof formikIndex === "number") {
    if (errorArray) {
      return errorArray as ValidatorReturn<V[number]>[];
    }
    const _errors = errors[name]?.[formikIndex];
    if (_errors) {
      return _errors as ValidatorReturn<V[number]>[];
    }
  }

  if (errorArray && errorArray.length) {
    if (errorArray.some((e) => Array.isArray(e))) {
      // Find specific index for error.
      const arrayIndex = fields
        .filter((f) => f.name === name)
        .findIndex((f) => f === field);

      return errorArray[arrayIndex] as ValidatorReturn<V[number]>[];
    } else {
      return errorArray as ValidatorReturn<V[number]>[];
    }
  }
};

/**
 * Normalizes a record of error messages into a record of error arrays.
 *
 * This ensures that every field maps to an array of error strings,
 * which simplifies downstream validation or form handling logic.
 *
 * @typeParam T - The object shape whose keys represent error fields.
 * @param record - A record mapping keys of `T` to a single error message.
 * @returns A record mapping the same keys to arrays of error messages.
 *
 * @example
 * ```ts
 * const errors = { username: "Required", email: "Invalid" };
 * const result = errors2errorsArray<typeof errors>(errors);
 * // result: { username: ["Required"], email: ["Invalid"] }
 * ```
 */
export const errors2errorsArray = <T extends object>(
  record?: FieldErrors | Partial<Record<keyof T, string | string[]>>,
): Partial<Record<keyof T, string[]>> =>
  ((record &&
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, forceArray(value)]),
    )) ||
    {}) as Partial<Record<keyof T, string[]>>;
