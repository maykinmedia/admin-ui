import React from "react";

import { Kanban as KanbanComponent } from "../../components";
import { AttributeData, FieldSet } from "../../lib";
import { GroupedAttributeDataConfigurationProps } from "../../lib/data/groupedattributedata";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type KanbanProps = BodyBaseProps & {
  /** Kanban props. */
  kanbanProps?: KanbanProps;

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
} & GroupedAttributeDataConfigurationProps;

/**
 * grid template
 * @constructor
 */
export const Kanban: React.FC<KanbanProps> = ({
  children,
  fieldset,
  fieldsets,
  groupBy,
  objectList,
  objectLists,
  renderPreview,
  title,
  urlFields,
  onClick,
  ...props
}) => (
  <CardBase {...props}>
    {children}
    {groupBy ? (
      <KanbanComponent
        objectList={objectList}
        fieldset={fieldset}
        groupBy={groupBy}
        renderPreview={renderPreview}
        title={title}
        urlFields={urlFields}
        onClick={onClick}
      >
        {children}
      </KanbanComponent>
    ) : (
      <KanbanComponent
        objectLists={objectLists as AttributeData[][]}
        fieldsets={fieldsets as FieldSet[]}
        renderPreview={renderPreview}
        title={title}
        urlFields={urlFields}
        onClick={onClick}
      >
        {children}
      </KanbanComponent>
    )}
  </CardBase>
);
