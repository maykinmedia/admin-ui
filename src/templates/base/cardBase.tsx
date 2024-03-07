import React from "react";

import { Card, CardProps } from "../../components";
import { Base, BaseProps } from "./base";

export type CardBaseProps = BaseProps & {
  /** Card props.*/
  cardProps?: CardProps;
};

/**
 * BodyBase template, renders children within card component.
 * @constructor
 */
export const CardBase: React.FC<CardBaseProps> = ({
  children,
  cardProps,
  ...props
}) => (
  <Base {...props}>
    <Card {...cardProps}>
      {children}
    </Card>
  </Base>
);
