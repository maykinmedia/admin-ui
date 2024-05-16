import React from "react";

import { Kanban as KanbanComponent } from "../../components";
import { AttributeData, FieldSet } from "../../lib";
import { GroupedAttributeDataConfigurationProps } from "../../lib/data/groupedattributedata";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type KanbanTemplateProps = BodyBaseProps & {
  /** If set, items are `draggable` allowing the user to rearrange them (across) columns). */
  draggable?: boolean;

  /** A `Function` that is used to create the preview for an object. */
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;

  /** A title for the list grid. */
  title?: React.ReactNode;

  /**
   *  A `string[]` containing the fields which should be used to detect the url
   *  of a row. Fields specified in this object won't be rendered, instead: the
   *  first (non url) field is rendered as link (`A`) with `href` set to the
   *  resolved url of the row.
   */
  urlFields?: string[];

  /**
   * Gets called when a button is clicked.
   * @param event
   * @param attributeData
   */
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;

  /** Get called when the fieldsets change. */
  onFieldsetsChange?: (fieldsts: FieldSet[]) => void;

  /** Get called when the objectLists change. */
  onObjectListsChange?: (objectLists: AttributeData[][]) => void;

  /** Kanban props. */
  kanbanProps?: KanbanTemplateProps;

  /** Get called when an object is dropped onto a column. */
  onObjectChange?: (
    object: AttributeData,
    fromIndex: number,
    toIndex: number,
  ) => void;
} & GroupedAttributeDataConfigurationProps;

/**
 * grid template
 * @constructor
 */
export const KanbanTemplate: React.FC<KanbanTemplateProps> = ({
  children,
  draggable,
  fieldset,
  fieldsets,
  groupBy,
  kanbanProps,
  objectList,
  objectLists,
  renderPreview,
  title,
  urlFields,
  onClick,
  onFieldsetsChange,
  onObjectListsChange,
  onObjectChange,
  ...props
}) => (
  <CardBase {...props}>
    {children}
    {groupBy ? (
      <KanbanComponent
        draggable={draggable}
        objectList={objectList}
        fieldset={fieldset}
        groupBy={groupBy}
        renderPreview={renderPreview}
        title={title}
        urlFields={urlFields}
        onClick={onClick}
        onFieldsetsChange={onFieldsetsChange}
        onObjectListsChange={onObjectListsChange}
        onObjectChange={onObjectChange}
        {...(kanbanProps as Record<string, unknown>)}
      >
        {children}
      </KanbanComponent>
    ) : (
      <KanbanComponent
        draggable={draggable}
        objectLists={objectLists as AttributeData[][]}
        fieldsets={fieldsets as FieldSet[]}
        renderPreview={renderPreview}
        title={title}
        urlFields={urlFields}
        onClick={onClick}
        onFieldsetsChange={onFieldsetsChange}
        onObjectListsChange={onObjectListsChange}
        onObjectChange={onObjectChange}
        {...(kanbanProps as Record<string, unknown>)}
      >
        {children}
      </KanbanComponent>
    )}
  </CardBase>
);
