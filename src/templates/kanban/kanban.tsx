import React from "react";

import { Kanban as KanbanComponent, KanbanProps } from "../../components";
import { FieldSet } from "../../lib";
import { CardBaseTemplate } from "../base";
import { BodyBaseTemplateProps } from "../base/bodyBase";

export type KanbanTemplateProps<T extends object = object> =
  BodyBaseTemplateProps & {
    kanbanProps: KanbanProps<T>;
  };

/**
 * grid template
 * @constructor
 */
export const KanbanTemplate = <T extends object = object>({
  children,
  kanbanProps,
  ...props
}: KanbanTemplateProps<T>) => {
  const { objectList, objectLists, fieldset, fieldsets, groupBy, ...kbProps } =
    kanbanProps;

  return (
    <CardBaseTemplate {...props}>
      {children}
      {groupBy ? (
        <KanbanComponent<T>
          objectList={objectList as T[]}
          fieldset={fieldset as FieldSet<T>}
          groupBy={groupBy}
          {...kbProps}
        >
          {children}
        </KanbanComponent>
      ) : (
        <KanbanComponent<T>
          objectLists={objectLists as T[][]}
          fieldsets={fieldsets as FieldSet<T>[]}
          {...kbProps}
        >
          {children}
        </KanbanComponent>
      )}
    </CardBaseTemplate>
  );
};
