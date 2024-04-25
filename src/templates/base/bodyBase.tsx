import React, { useContext } from "react";

import {
  Body,
  BodyProps,
  BreadcrumbItem,
  Breadcrumbs,
  BreadcrumbsProps,
} from "../../components";
import { NavigationContext } from "../../contexts";
import { CardBase, CardBaseProps } from "./cardBase";

export type BodyBaseProps = CardBaseProps & {
  breadcrumbItems?: BreadcrumbItem[];
  breadcrumbsProps?: BreadcrumbsProps;
  bodyProps?: BodyProps;
};

/**
 * BodyBase template, renders children within body component.
 * @constructor
 */
export const BodyBase: React.FC<BodyBaseProps> = ({
  breadcrumbItems = [],
  breadcrumbsProps,
  children,
  bodyProps,
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
      <Body {...bodyProps}>{children}</Body>
    </CardBase>
  );
};
