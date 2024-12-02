import React from "react";

import { DataGrid, DataGridProps } from "../../components";
import { CardBaseTemplate } from "../base";
import { BodyBaseTemplateProps } from "../base/bodyBase";

export type ListTemplateProps<T extends object = object> =
  BodyBaseTemplateProps & {
    dataGridProps: DataGridProps<T>;
  };

/**
 * List template
 * @constructor
 */
export const ListTemplate = <T extends object = object>({
  children,
  dataGridProps,
  ...props
}: ListTemplateProps<T>) => (
  <CardBaseTemplate {...props}>
    {children}
    <DataGrid<T> {...dataGridProps} />
  </CardBaseTemplate>
);
