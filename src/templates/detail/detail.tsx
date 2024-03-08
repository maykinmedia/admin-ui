import React from "react";

import { AttributeGrid, AttributeGridProps } from "../../components";
import { BodyBase, BodyBaseProps } from "../base/bodyBase";

export type DetailProps = BodyBaseProps & {
  attributeGridProps?: Partial<AttributeGridProps>;
  object: AttributeGridProps["object"];
  fieldsets: AttributeGridProps["fieldsets"];
};

/**
 * Detail template
 * @constructor
 */
export const Detail: React.FC<DetailProps> = ({
  children,
  attributeGridProps,
  object,
  fieldsets,
  ...props
}) => (
  <BodyBase {...props}>
    {children}
    <AttributeGrid
      {...attributeGridProps}
      object={object}
      fieldsets={fieldsets}
    />
  </BodyBase>
);
