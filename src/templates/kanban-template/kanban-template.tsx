import React from "react";

import { Kanban as KanbanComponent, KanbanProps } from "../../components";
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
  return (
    <CardBaseTemplate {...props}>
      {children}
      <KanbanComponent {...kanbanProps} />
    </CardBaseTemplate>
  );
};
