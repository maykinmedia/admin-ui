import React from "react";

import {
  AttributeGrid,
  AttributeGridProps,
  Body,
  DataGrid,
  DataGridProps,
  H2,
  Sidebar,
  Toolbar,
  ToolbarItem,
} from "../../components";
import { slugify } from "../../lib";
import { CardBase } from "../base";
import { BodyBaseProps } from "../base/bodyBase";

export type DetailProps = BodyBaseProps & {
  attributeGridProps?: Partial<AttributeGridProps>;
  object: AttributeGridProps["object"];
  fieldsets: AttributeGridProps["fieldsets"];
  sidebarItems?: ToolbarItem[];
  showSidebar?: boolean;
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
  pageProps,
  sidebarItems = [],
  showHeader,
  showSidebar = sidebarItems.length > 0,
  slotSidebar,
  title,
  inlines = [],
  ...props
}) => {
  const _showSidebar = slotSidebar || showSidebar;
  const _showHeader =
    typeof showHeader === "boolean" ? showHeader : !_showSidebar;

  return (
    <CardBase
      pageProps={{ pad: !_showSidebar, ...pageProps }}
      showHeader={_showHeader}
      slotSidebar={
        slotSidebar ||
        (showSidebar && (
          <Sidebar expanded>
            <Toolbar
              align="space-between"
              direction="vertical"
              pad={true}
              items={sidebarItems}
              variant="transparent"
            />
          </Sidebar>
        ))
      }
      {...props}
    >
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
