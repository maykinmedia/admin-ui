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
 * List Template
 *
 * Uses a `DataGrid` to render a list of data within `CardBaseTemplate`.
 *
 * @typeParam T - The shape of a single data row.
 * @typeParam F - If the shape of the filtered returned by `filterTransform`
 */
export const ListTemplate = <T extends object = object, F extends object = T>({
  children,
  dataGridProps,
  ...props
}: ListTemplateProps<T, F>) => (
  <CardBaseTemplate {...props}>
    {children}
    <DataGrid<T, F> height="100%" {...dataGridProps} />
  </CardBaseTemplate>
);
