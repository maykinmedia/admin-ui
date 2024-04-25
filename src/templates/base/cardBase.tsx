import React from "react";

import {
  Breakout,
  Card,
  CardProps,
  Toolbar,
  ToolbarItem,
} from "../../components";
import { Base, BaseProps } from "./base";

export type CardBaseProps = BaseProps & {
  actions?: ToolbarItem[];

  /** When set to true, a breakout component is applied to remove the page padding to  the card. */
  breakout?: boolean;

  /** Card props.*/
  cardProps?: CardProps;
};

/**
 * BodyBase template, renders children within card component.
 * @constructor
 */
export const CardBase: React.FC<CardBaseProps> = ({
  actions,
  breakout = false,
  children,
  cardProps,
  ...props
}) => {
  const renderCard = () => (
    <Card {...cardProps}>
      {actions && (
        <Toolbar
          align="end"
          compact={true}
          pad={false}
          variant="transparent"
          items={actions.map((toolbarItem) => {
            const props = typeof toolbarItem === "string" ? {} : toolbarItem;
            return {
              pad: "h",
              variant: "transparent",
              ...props,
            };
          })}
        ></Toolbar>
      )}
      {children}
    </Card>
  );

  return (
    <Base {...props}>
      {breakout ? <Breakout>{renderCard()}</Breakout> : renderCard()}
    </Base>
  );
};
