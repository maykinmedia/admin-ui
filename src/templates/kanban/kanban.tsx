import React from "react";

import { Kanban as KanbanComponent, KanbanProps } from "../../components";
import { AttributeData, FieldSet } from "../../lib";
import { CardBaseTemplate } from "../base";
import { BodyBaseTemplateProps } from "../base/bodyBase";

export type KanbanTemplateProps = BodyBaseTemplateProps & {
  kanbanProps: KanbanProps;
};

/**
 * grid template
 * @constructor
 */
export const KanbanTemplate: React.FC<KanbanTemplateProps> = ({
  children,
  kanbanProps,
  ...props
}) => {
  const { objectList, objectLists, fieldset, fieldsets, groupBy, ...kbProps } =
    kanbanProps;

  return (
    <CardBaseTemplate {...props}>
      {children}
      {kanbanProps.groupBy ? (
        <KanbanComponent
          objectList={objectList as AttributeData[]}
          fieldset={fieldset as FieldSet}
          groupBy={groupBy as string}
          {...kbProps}
        >
          {children}
        </KanbanComponent>
      ) : (
        <KanbanComponent
          objectLists={objectLists as AttributeData[][]}
          fieldsets={fieldsets as FieldSet[]}
          {...kbProps}
        >
          {children}
        </KanbanComponent>
      )}
    </CardBaseTemplate>
  );
};
