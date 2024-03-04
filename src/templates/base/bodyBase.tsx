import React from "react";

import { Body, BodyProps } from "../../components";
import { CardBase } from "./cardBase";

export type BodyBaseProps = BodyProps &
  React.PropsWithChildren<{
    /** Logo (JSX) slot. */
    slotLogo?: React.ReactNode;

    /** Primary navigation (JSX) slot. */
    slotPrimaryNavigation?: React.ReactNode;
  }>;

/**
 * BodyBase template, renders children within body component.
 * @constructor
 */
export const BodyBase: React.FC<BodyBaseProps> = ({
  children,
  slotLogo,
  slotPrimaryNavigation,
  ...props
}) => (
  <CardBase slotLogo={slotLogo} slotPrimaryNavigation={slotPrimaryNavigation}>
    <Body {...props}>{children}</Body>
  </CardBase>
);
