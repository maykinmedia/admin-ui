import React from "react";

import { DataGrid, DataGridProps, ToolbarItem } from "../../components";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type ListTemplateProps = BodyBaseProps & {
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
  <CardBase {...props}>
    {children}
    <DataGrid {...dataGridProps} />
  </CardBase>
);
