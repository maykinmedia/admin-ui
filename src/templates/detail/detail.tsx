import React, { useContext } from "react";

import {
  AttributeGrid,
  AttributeGridProps,
  Body,
  BreadcrumbItem,
  Breadcrumbs,
  BreadcrumbsProps,
  DataGrid,
  DataGridProps,
  H2,
} from "../../components";
import { NavigationContext } from "../../contexts";
import { slugify } from "../../lib";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type DetailProps = BodyBaseProps & {
  object: AttributeGridProps["object"];
  breadcrumbItems?: BreadcrumbItem[];
  breadcrumbsProps?: BreadcrumbsProps;
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
  breadcrumbItems = [],
  breadcrumbsProps,
  children,
  attributeGridProps,
  object,
  fieldsets,
  title,
  inlines = [],
  ...props
}) => {
  const { breadcrumbs, breadcrumbItems: _breadcrumbItems } =
    useContext(NavigationContext);

  const contextBreadcrumbs =
    breadcrumbs ||
    (breadcrumbItems.length || _breadcrumbItems?.length ? (
      <Breadcrumbs
        items={
          (breadcrumbItems.length ? breadcrumbItems : _breadcrumbItems) || []
        }
        {...breadcrumbsProps}
      />
    ) : null);
  return (
    <CardBase {...props}>
      {contextBreadcrumbs && <Body>{contextBreadcrumbs}</Body>}
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
};
