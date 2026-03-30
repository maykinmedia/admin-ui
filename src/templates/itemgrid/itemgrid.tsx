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
    {children}
    <Body padSize="s">{title && <H2>{title}</H2>}</Body>
    <Body padSize="s" />
    <ItemGrid fullHeight {...itemGridProps} paginatorProps={paginatorProps} />
  </CardBaseTemplate>
);
