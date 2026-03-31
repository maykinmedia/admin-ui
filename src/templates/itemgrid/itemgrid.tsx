import React from "react";

import {
  Body,
  H2,
  ItemGrid,
  ItemGridProps,
  PaginatorProps,
} from "../../components";
import { CardBaseTemplate, CardBaseTemplateProps } from "../base";

export type ItemGridTemplateProps = CardBaseTemplateProps & {
  /** Title to display above the item grid */
  title?: React.ReactNode;

  /** Optional slot rendered below the title (e.g. a count or description) */
  children?: React.ReactNode;

  /** ItemGrid props */
  itemGridProps: ItemGridProps;

  /** Paginator props, when set renders a paginator */
  paginatorProps?: PaginatorProps;
};

/**
 * Uses an `ItemGrid` to render a grid of items within `CardBaseTemplate`
 */
export const ItemGridTemplate: React.FC<ItemGridTemplateProps> = ({
  children,
  title,
  itemGridProps,
  paginatorProps,
  ...props
}) => (
  <CardBaseTemplate {...props}>
    <Body padSize="s">{title && <H2>{title}</H2>}</Body>
    {children && <Body padSize="s">{children}</Body>}
    <ItemGrid fullHeight {...itemGridProps} paginatorProps={paginatorProps} />
  </CardBaseTemplate>
);
