import React from "react";

import { ButtonLinkProps, ButtonProps } from "../../components";
import { formatMessage } from "../i18n";
import { AttributeData, FieldOptions, FieldSet } from "./attributedata";

export type GroupedAttributeDataProps = Omit<
  React.ComponentProps<"div">,
  "draggable" | "title" | "onClick"
> & {
  /** A title for the datagrid. */
  title?: React.ReactNode;

  /** A `Function` that is used to create the preview for an object. */
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;

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
   * @param attributeData
   */
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
} & GroupedAttributeDataConfigurationProps;

export type GroupedAttributeDataConfigurationProps =
  | GroupedAttributeDataFieldsetProps
  | GroupedAttributeDataGroupByProps;

/**
 * WHen using `fieldsets` / `objectLists` to define sections. The length of `fieldSets` and `objectLists` should match.
 */
export type GroupedAttributeDataFieldsetProps = {
  /** The field to sort by, if `undefined`: `fieldsets` and `objectLists` are used for manual segmentation. */
  groupBy?: never;

  /** The fieldsets to render. */
  fieldsets: FieldSet[];

  /** The object lists to show, each index should match `fieldsets` index. */
  objectLists: AttributeData[][];

  fieldset?: never;
  objectList?: never;
};

export type GroupedAttributeDataGroupByProps = {
  /**
   * The field to sort by, if specified: `fieldset` acts as base fieldset and `objectList` as list of objects to group.`.
   * The first item in `fieldset` (the label) may contain "{group}" placeholder which will be replaced by the matching
   * value.
   */
  groupBy: string;

  /** The fieldset to render. */
  fieldset: FieldSet;

  /** The objects to show. */
  objectList: AttributeData[];

  fieldsets?: never;
  objectLists?: never;
};

/**
 * Returns segments represented by `[Fieldset[], AttributeData[][]]`.
 */
export const getContextData = (
  groupBy?: string,
  fieldset?: FieldSet,
  fieldsets?: FieldSet[],
  objectList?: AttributeData[],
  objectLists?: AttributeData[][],
): [FieldSet[], AttributeData[][]] => {
  if (groupBy) {
    const fieldsetTemplate = fieldset?.[0] as string;
    const fieldsetOptions = fieldset?.[1] as FieldOptions;
    const groups = [...new Set((objectList || []).map((o) => o[groupBy]))].sort(
      (a, b) =>
        String(a).localeCompare(String(b), undefined, { numeric: true }),
    );

    const _fieldsets = groups.map<FieldSet>((g) => [
      fieldsetTemplate
        ? formatMessage(fieldsetTemplate, { group: g })
        : String(g),
      fieldsetOptions,
    ]);

    const _objectLists = groups.map((g) =>
      (objectList as AttributeData[]).filter((o) => o[groupBy] === g),
    );
    return [_fieldsets, _objectLists];
  }
  return [fieldsets as FieldSet[], objectLists as AttributeData[][]];
};
