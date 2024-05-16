import React from "react";

import {
  AttributeGrid,
  AttributeGridProps,
  Body,
  DataGrid,
  DataGridProps,
  H2,
} from "../../components";
import { slugify } from "../../lib";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type DetailTemplateProps = BodyBaseProps & {
  attributeGridProps: AttributeGridProps;
  inlines?: DataGridProps[];
};

/**
 * Detail template
 * @constructor
 */
export const DetailTemplate: React.FC<DetailTemplateProps> = ({
  children,
  attributeGridProps,
  inlines = [],
  ...props
}) => (
  <CardBase {...props}>
    {children}
    <AttributeGrid generateTitleIds={true} {...attributeGridProps} />
    {inlines.map(({ title, ...props }, index) => {
      return (
        <Body key={typeof title === "string" ? title : index}>
          <H2 id={typeof title === "string" ? slugify(title) : undefined}>
            {title}
          </H2>
          <DataGrid key={index} {...props} />
        </Body>
      );
    })}
  </CardBase>
);
