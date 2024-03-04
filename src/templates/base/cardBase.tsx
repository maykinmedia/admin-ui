import React from "react";

import { Card, CardProps } from "../../components";
import { Base } from "./base";

export type CardBaseProps = CardProps &
  React.PropsWithChildren<{
    /** Logo (JSX) slot. */
    slotLogo?: React.ReactNode;

    /** Primary navigation (JSX) slot. */
    slotPrimaryNavigation?: React.ReactNode;
  }>;

/**
 * BodyBase template, renders children within card component.
 * @constructor
 */
export const CardBase: React.FC<CardBaseProps> = ({
  children,
  slotLogo,
  slotPrimaryNavigation,
  ...props
}) => (
  <Base slotLogo={slotLogo} slotPrimaryNavigation={slotPrimaryNavigation}>
    <Card {...props}>{children}</Card>
  </Base>
);
