import React from "react";

import { AttributeGrid, AttributeGridProps } from "../../components";
import { BodyBase, BodyBaseProps } from "../base/bodyBase";

export type DetailProps = BodyBaseProps & {
  attributeGridProps: AttributeGridProps;
};

/**
 * Detail template
 * @constructor
 */
export const Detail: React.FC<DetailProps> = ({
  children,
  attributeGridProps,
  ...props
}) => (
  <BodyBase {...props}>
    {children}
    <AttributeGrid {...attributeGridProps} />
  </BodyBase>
);
