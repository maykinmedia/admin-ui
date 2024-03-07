import React from "react";

import { Body, BodyProps } from "../../components";
import { CardBase, CardBaseProps } from "./cardBase";

export type BodyBaseProps = CardBaseProps & {
  /** Body props. */
  bodyProps?: BodyProps;
};

/**
 * BodyBase template, renders children within body component.
 * @constructor
 */
export const BodyBase: React.FC<BodyBaseProps> = ({
  children,
  bodyProps,
  ...props
}) => (
  <CardBase {...props}>
    <Body {...bodyProps}>{children}</Body>
  </CardBase>
);
