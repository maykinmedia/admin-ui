import React from "react";

import {
  AttributeGrid,
  AttributeGridProps,
  Body,
  DataGrid,
  DataGridProps,
  H2,
  Toolbar,
  ToolbarItem,
} from "../../components";
import { slugify } from "../../lib";
import { BodyBase, BodyBaseProps } from "../base/bodyBase";

export type DetailProps = BodyBaseProps & {
  attributeGridProps?: Partial<AttributeGridProps>;
  object: AttributeGridProps["object"];
  fieldsets: AttributeGridProps["fieldsets"];
  showSidebar?: boolean;
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
  showSidebar = true,
  inlines = [],
  ...props
}) => {
  const attributeGridSidebarItems: ToolbarItem[] = fieldsets
    .filter((fieldset) => fieldset[0])
    .map((fieldset) => ({
      children: fieldset[0],
      href: `#${slugify(fieldset[0] || "")}`,
      pad: "h",
      variant: "transparent",
      textDecoration: "none",
    }));

  const inlinesSidebarItems: ToolbarItem[] = inlines
    .filter((datagridProps) => datagridProps.title)
    .map((datagridProps) => ({
      children: datagridProps.title,
      href: `#${slugify(datagridProps.title as string)}`,
      pad: "h",
      variant: "transparent",
      textDecoration: "none",
    }));

  const sidebarItems = [...attributeGridSidebarItems, ...inlinesSidebarItems];

  return (
    <BodyBase
      slotSidebar={
        showSidebar && (
          <Toolbar
            direction="vertical"
            items={sidebarItems}
            sticky="top"
            variant="transparent"
          />
        )
      }
      {...props}
    >
      {children}
      <AttributeGrid
        generateTitleIds={true}
        {...attributeGridProps}
        object={object}
        fieldsets={fieldsets}
      />
      {inlines.map(({ title, ...props }, index) => {
        return (
          <Body key={title}>
            <H2 id={title && slugify(title)}>{title}</H2>
            <DataGrid key={index} {...props} />
          </Body>
        );
      })}
    </BodyBase>
  );
};
