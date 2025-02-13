import { ChoiceFieldProps } from "../../components";
import { typeByDataArray } from "./data";
import { isPrimitive } from "./primitive";

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

/** A key in an object. */
export type Field<T extends object = object> = keyof T;

/** A key in object annotated with its type and optionally meta information. */
export type TypedField<T extends object = object> = {
  /** The field name. */
  name: Field<T> | string;

  /** The field's values type. */
  type: FieldType | string;

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

  /** Used by DataGrid to determine whether the field should be sortable. */
  sortable?: boolean;

  /**
   * The "lookup" (dot separated) to use for this field while filtering (e.g.
   * "._expand.zaaktype.omschrijving").
   */
  valueLookup?: string;

  /**
   * A function transforming `T` to a value.
   * This can be used to compute values dynamically.
   */
  valueTransform?: (value: T) => unknown;

  /** Used by AttributeTable/DataGrid when editable=true. */
  options?: ChoiceFieldProps["options"];

  /** Used by DataGrid to set column width. */
  width?: string;
};

/** Known options for TypedField["type"] */
export type FieldType =
  | "boolean"
  | "date"
  | "daterange"
  | "null"
  | "number"
  | "string"
  | "jsx";

/** A Django-admin like field_options definition. */
export type FieldOptions<T extends object = object> = {
  /** The fields to include in this fieldset. */
  fields: Field<T>[];

  /** When shown in an ItemGrid: the field to use as title. */
  title?: Field<T>;

  /** When shown in an AttributeGrid: the span to use for this fieldset. */
  span?: number;

  /** When shown in a Kanban: the component to render. */
  // eslint-disable-next-line
  component?: React.ComponentType<any>;
};

/** A Django-admin like fieldset definition. */
export type FieldSet<T extends object = object> = [
  string | undefined,
  FieldOptions<T>,
];

/**
 * Converts `Array<Field | TypedField>` to `TypedField[]` by inspecting `objectList`.
 * @param optionallyTypedFields
 * @param objectList
 * @param base
 */
export const fields2TypedFields = <T extends object>(
  optionallyTypedFields: Array<Field<T> | TypedField<T>>,
  objectList: T[],
  base?: Partial<TypedField<T>>,
): TypedField<T>[] =>
  optionallyTypedFields.map((field) =>
    Object.assign(
      { ...base } || {},
      isPrimitive<Field<T>>(field)
        ? {
            type: typeByDataArray<T>(field, objectList),
            name: field,
          }
        : field,
    ),
  );
