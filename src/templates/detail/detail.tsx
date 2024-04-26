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

export type DetailProps = BodyBaseProps & {
  object: AttributeGridProps["object"];
  attributeGridProps?: Partial<AttributeGridProps>;
  fieldsets: AttributeGridProps["fieldsets"];
  title?: React.ReactNode;
  inlines?: DataGridProps[];
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
  title,
  inlines = [],
  ...props
}) => (
  <CardBase {...props}>
    {children}
    <AttributeGrid
      generateTitleIds={true}
      {...attributeGridProps}
      object={object}
      fieldsets={fieldsets}
      title={title}
    />
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
