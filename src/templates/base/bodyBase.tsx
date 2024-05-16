import React from "react";

import { Body, BodyProps } from "../../components";
import { CardBaseTemplate, CardBaseTemplateProps } from "./cardBase";

export type BodyBaseTemplateProps = CardBaseTemplateProps & {
  bodyProps?: BodyProps;
};

/**
 * BodyBase template, renders children within body component.
 * @constructor
 */
export const BodyBaseTemplate: React.FC<BodyBaseTemplateProps> = ({
  children,
  bodyProps,
  ...props
}) => (
  <CardBaseTemplate {...props}>
    <Body {...bodyProps}>{children}</Body>
  </CardBaseTemplate>
);
