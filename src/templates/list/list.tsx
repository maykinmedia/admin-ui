import React from "react";

import { DataGrid, DataGridProps } from "../../components";
import { CardBaseTemplate } from "../base";
import { BodyBaseTemplateProps } from "../base/bodyBase";

export type ListTemplateProps<
  T extends object = object,
  F extends object = T,
> = BodyBaseTemplateProps & {
  dataGridProps: DataGridProps<T, F>;
};

/**
 * List template
 * @constructor
 */
export const ListTemplate = <T extends object = object, F extends object = T>({
  children,
  dataGridProps,
  ...props
}: ListTemplateProps<T, F>) => (
  <CardBaseTemplate {...props}>
    {children}
    <DataGrid<T, F> {...dataGridProps} />
  </CardBaseTemplate>
);
