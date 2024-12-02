import React from "react";

import { ButtonLinkProps, ButtonProps } from "../../components";
import { formatMessage } from "../i18n";
import { FieldOptions, FieldSet } from "./field";

export type GroupedDataProps<T extends object = object> = Omit<
  React.ComponentProps<"div">,
  "draggable" | "title" | "onClick"
> & {
  /** A title for the datagrid. */
  title?: React.ReactNode;

  /** A `Function` that is used to create the preview for an object. */
  renderPreview?: (data: T) => React.ReactNode;

  /**
   *  A `string[]` containing the fields which should be used to detect the url
   *  of a row. Fields specified in this object won't be rendered, instead: the
   *  first (non url) field is rendered as link (`A`) with `href` set to the
   *  resolved url of the row.
   */
  urlFields?: string[];

  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;

  /**
   * Gets called when a button is clicked.
   * @param event
   * @param data
   */
  onClick?: (event: React.MouseEvent, data: T) => void;
} & GroupedDataConfigurationProps<T>;

export type GroupedDataConfigurationProps<T extends object = object> =
  | GroupedDataFieldsetProps<T>
  | GroupedDataGroupByProps<T>;

/**
 * WHen using `fieldsets` / `objectLists` to define sections. The length of `fieldSets` and `objectLists` should match.
 */
export type GroupedDataFieldsetProps<T extends object = object> = {
  /** The field to sort by, if `undefined`: `fieldsets` and `objectLists` are used for manual segmentation. */
  groupBy?: never;

  /** The fieldsets to render. */
  fieldsets: FieldSet<T>[];

  /** The object lists to show, each index should match `fieldsets` index. */
  objectLists: T[][];

  fieldset?: never;
  objectList?: never;
};

export type GroupedDataGroupByProps<T extends object = object> = {
  /**
   * The field to sort by, if specified: `fieldset` acts as base fieldset and `objectList` as list of objects to group.`.
   * The first item in `fieldset` (the label) may contain "{group}" placeholder which will be replaced by the matching
   * value.
   */
  groupBy: keyof T;

  /** The fieldset to render. */
  fieldset: FieldSet<T>;

  /** The objects to show. */
  objectList: T[];

  fieldsets?: never;
  objectLists?: never;
};

/**
 * Returns segments represented by `[Fieldset[], T[][]]`.
 */
export const getContextData = <T extends object = object>(
  groupBy?: keyof T,
  fieldset?: FieldSet<T>,
  fieldsets?: FieldSet<T>[],
  objectList?: T[],
  objectLists?: T[][],
): [FieldSet<T>[], T[][]] => {
  if (groupBy) {
    const fieldsetTemplate = fieldset?.[0] as string;
    const fieldsetOptions = fieldset?.[1] as FieldOptions<T>;
    const groups = [...new Set((objectList || []).map((o) => o[groupBy]))].sort(
      (a, b) =>
        String(a).localeCompare(String(b), undefined, { numeric: true }),
    );

    const _fieldsets = groups.map<FieldSet<T>>((g) => [
      fieldsetTemplate
        ? formatMessage(fieldsetTemplate, { group: g })
        : String(g),
      fieldsetOptions,
    ]);

    const _objectLists = groups.map((g) =>
      (objectList as T[]).filter((o) => o[groupBy] === g),
    );
    return [_fieldsets, _objectLists];
  }
  return [fieldsets as FieldSet[], objectLists as T[][]];
};
