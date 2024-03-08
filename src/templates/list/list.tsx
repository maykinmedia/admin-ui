import React from "react";

import { DataGrid, DataGridProps } from "../../components";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type ListProps = BodyBaseProps & {
  dataGridProps?: Partial<DataGridProps>;
  objectList: DataGridProps["objectList"];
  fields: DataGridProps["fields"];
};

/**
 * List template
 * @constructor
 */
export const List: React.FC<ListProps> = ({
  children,
  dataGridProps,
  objectList,
  fields,
  ...props
}) => (
  <CardBase {...props}>
    {children}
    <DataGrid {...dataGridProps} objectList={objectList} fields={fields} />
  </CardBase>
);
