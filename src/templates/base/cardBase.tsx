import React from "react";

import { Card, CardProps, Toolbar, ToolbarItem } from "../../components";
import { Base, BaseProps } from "./base";

export type CardBaseProps = BaseProps & {
  actions?: ToolbarItem[];

  /** Card props.*/
  cardProps?: CardProps;
};

/**
 * BodyBase template, renders children within card component.
 * @constructor
 */
export const CardBase: React.FC<CardBaseProps> = ({
  actions,
  children,
  cardProps,
  ...props
}) => (
  <Base {...props}>
    <Card {...cardProps}>
      {actions && (
        <Toolbar
          align="end"
          compact={true}
          pad={false}
          variant="transparent"
          items={actions.map((toolbarItem) => ({
            pad: "h",
            variant: "transparent",
            ...toolbarItem,
          }))}
        ></Toolbar>
      )}
      {children}
    </Card>
  </Base>
);
