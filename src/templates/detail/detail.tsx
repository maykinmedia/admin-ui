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
import { CardBaseTemplate } from "../base";
import { BodyBaseTemplateProps } from "../base/bodyBase";

export type DetailTemplateProps = BodyBaseTemplateProps & {
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
  <CardBaseTemplate {...props}>
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
  </CardBaseTemplate>
);
