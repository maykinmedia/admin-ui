import React from "react";

import { DataGrid, DataGridProps } from "../../components";
import { BodyBase, BodyBaseProps } from "../base/bodyBase";

export type ListProps = BodyBaseProps & {
  dataGridProps: DataGridProps;
};

/**
 * List template
 * @constructor
 */
export const List: React.FC<ListProps> = ({
  children,
  dataGridProps,
  ...props
}) => (
  <BodyBase {...props}>
    {children}
    <DataGrid {...dataGridProps} />
  </BodyBase>
);
