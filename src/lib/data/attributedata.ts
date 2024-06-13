import React, { ReactNode } from "react";

import { ChoiceFieldProps } from "../../components";

/**
 * The default URL fields,
 */
export const DEFAULT_URL_FIELDS = [
  "absolute_url",
  "get_absolute_url",
  "href",
  "get_href",
  "url",
  "get_url",
];

/** An object with key/value pairs describing various attributes to be presented. */
export type AttributeData<T = Attribute> = Record<string, T>;

/** An attribute with its corresponding label */
export type LabeledAttribute = {
  label: string | ReactNode;
  value: Attribute | ReactNode;
};

// TODO: Deprecate in favor of using TypedField for labels in the future?
export type LabeledAttributeData<T = LabeledAttribute> = Record<string, T>;

/** A value in `AttributeData`. */
export type Attribute = boolean | number | string | null;

/** A key in `AttributeData`. */
export type Field = keyof (AttributeData | LabeledAttributeData);

/** A key in `AttributeData` annotated with its type. */
export type TypedField<T = Attribute> = {
  /** The field name. */
  name: Field;

  /** The field's values type. */
  type: T extends boolean
    ? "boolean"
    : T extends number
      ? "number" | "date" | "daterange"
      : T extends string
        ? "string" | "date" | "daterange"
        : T extends null
          ? "null"
          : unknown;

  /** Whether the field should be active by default. */
  active?: boolean;

  /** Whether the field should be editable. */
  editable?: boolean;

  /** Whether the field should be filterable. */
  filterable?: boolean;

  /**
   * The "lookup" (query parameter) to use for this field while filtering (e.g.
   * "omschrijving__icontains").
   */
  filterLookup?: string;

  /** The value for this field's filter. */
  filterValue?: string | number;

  /**
   * The "lookup" (dot separated) to use for this field while filtering (e.g.
   * "._expand.zaaktype.omschrijving").
   */
  valueLookup?: string;

  /**
   * A function transforming `AttributeData` to an attribute.
   * This can be used to computed values dynamically.
   */
  valueTransform?: (value: AttributeData) => Attribute;

  /** Used by DataGrid when editable=true. */
  options?: ChoiceFieldProps["options"];
};

/** A Django-admin like field_options definition. */
export type FieldOptions = {
  /** The fields to include in this fieldset. */
  fields: Field[];

  /** When shown in an ItemGrid: the field to use as title. */
  title?: Field;

  /** When shown in an AttributeGrid: the span to use for this fieldset. */
  span?: number;

  /** When shown in a Kanban: the component to render. */
  // eslint-disable-next-line
  component?: React.ComponentType<any>;
};

/** A Django-admin like fieldset definition. */
export type FieldSet = [string | undefined, FieldOptions];

/**
 * Returns whether `value` is a primitive, acts as type guard for `<T = Attribute>` through generic.
 * @param value
 */
export const isPrimitive = <T = Attribute>(value: unknown): value is T =>
  Object(value) !== value;

/** Typeguard for boolean. */
export const isBool = (value: unknown): value is boolean =>
  typeof value === "boolean";

/** Typeguard for number. */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

/** Typeguard for string. */
export const isString = (value: unknown): value is string =>
  typeof value === "string";

/** Typeguard for null. */
export const isNull = (value: unknown): value is null => value === null;

/** Typeguard for undefined. */
export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

/**
 * Creates an array of new objects containing only the specified fields from the provided object,
 * based on the given fieldsets.
 *
 * @param object - The source object from which to select fields.
 * @param fieldsets - An array of fieldsets, each defining a group of fields to be selected from the object.
 *                    Each fieldset is represented as a tuple, where the first element is an optional name or label
 *                    for the fieldset, and the second element is an object containing the fields to be selected.
 *                    The fields to be selected are defined within the 'fields' property of the fieldset object.
 * @returns An array of new objects, each containing only the specified fields from the source object,
 *          based on the provided fieldsets.
 */
export const attributeDataByFieldsets = (
  object: AttributeData,
  fieldsets: FieldSet[],
): AttributeData[] =>
  fieldsets.map((f) => attributeDataByFields(object, f[1].fields));

/**
 * Creates a new object containing only the specified fields from the provided object.
 *
 * @param object - The source object from which to select fields.
 * @param fields - An array of keys representing the fields to be selected from the object.
 * @returns A new object containing only the specified fields from the source object.
 * @template AttributeData - The type of the source object.
 */
export const attributeDataByFields = (
  object: AttributeData,
  fields: (keyof AttributeData)[],
): AttributeData =>
  fields.reduce(
    (acc, val) => ({
      ...acc,
      [val]: object[val],
    }),
    {},
  );

/**
 * Converts `Array<Field , TypedField>` to `TypedField[]` by inspecting `attributeDataArray`.
 * @param optionallyTypedFields
 * @param attributeDataArray
 * @param base
 */
export const typedFieldByFields = (
  optionallyTypedFields: Array<Field | TypedField>,
  attributeDataArray: AttributeData[],
  base?: Partial<TypedField>,
): TypedField[] =>
  optionallyTypedFields.map((field) =>
    Object.assign(
      { ...base } || {},
      isPrimitive<Field>(field)
        ? {
            type: typeByAttributeDataArray(field, attributeDataArray),
            name: field,
          }
        : field,
    ),
  );

/**
 * Attempts to find `field`'s type based on its presence in a row in `attributeDataArray`.
 * @param field
 * @param attributeDataArray
 */
export const typeByAttributeDataArray = (
  field: Field,
  attributeDataArray: AttributeData<unknown>[],
): TypedField["type"] => {
  const validTypes = ["string", "number", "boolean", "null"];
  const fieldPopulatedRow = attributeDataArray.find(
    (a) => a[field] && validTypes.includes(typeof a[field]),
  );

  if (!fieldPopulatedRow) {
    return "null";
  }

  const fieldValue = fieldPopulatedRow[field];
  return typeof fieldValue as TypedField["type"];
};

/**
 * Filters `objectList` by `data`
 * @param objectList
 * @param data
 */
export const filterAttributeDataArray = <T = AttributeData>(
  objectList: T[],
  data: Record<keyof T, Attribute>,
): T[] => {
  return objectList.filter((attributeData) => {
    for (const key in data) {
      const attributeValue = attributeData[key];
      const filterValue = data[key];

      switch (typeof attributeValue) {
        case "undefined":
          if (filterValue) {
            return false;
          }
          break;
        case "boolean":
          if (attributeValue !== Boolean(filterValue)) {
            return false;
          }
          break;

        case "number":
          if (attributeValue !== Number(filterValue)) {
            return false;
          }
          break;

        case "string":
          if (!attributeValue.includes(String(filterValue))) {
            return false;
          }
          break;
      }

      return true;
    }
  });
};

/**
 * Sorts `objectList` by `field` based on `direction`.
 * @param objectList
 * @param field
 * @param direction can be "ASC" or "DESC".
 */
export const sortAttributeDataArray = <T = AttributeData>(
  objectList: T[],
  field: keyof T,
  direction: "ASC" | "DESC",
): T[] => {
  const multiplier = direction === "ASC" ? 1 : -1;

  return objectList.sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    // Use String.localeCompare for strings.
    if (typeof valueA === "string" || typeof valueB === "string") {
      return (
        multiplier *
        ((valueA || "") as string).localeCompare((valueB || "") as string)
      );
    }

    return (
      multiplier *
      ((valueA as unknown as number) - (valueB as unknown as number))
    );
  });
};
