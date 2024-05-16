import React from "react";

import { DataGrid, DataGridProps, ToolbarItem } from "../../components";
import { CardBaseTemplate } from "../base";
import { BodyBaseTemplateProps } from "../base/bodyBase";

export type ListTemplateProps = BodyBaseTemplateProps & {
  dataGridProps: DataGridProps;
  sidebarItems?: ToolbarItem[];
};

/**
 * List template
 * @constructor
 */
export const ListTemplate: React.FC<ListTemplateProps> = ({
  children,
  dataGridProps,
  ...props
}) => (
  <CardBaseTemplate {...props}>
    {children}
    <DataGrid {...dataGridProps} />
  </CardBaseTemplate>
);
