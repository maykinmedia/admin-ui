import React from "react";

import { Card, CardProps } from "../../components";
import { Base } from "./base";

export type CardBaseProps = CardProps &
  React.PropsWithChildren<{
    /** Breadcrumbs navigation (JSX) slot. */
    slotBreadcrumbs?: React.ReactNode;

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
  slotBreadcrumbs,
  slotLogo,
  slotPrimaryNavigation,
  ...props
}) => (
  <Base
    slotBreadcrumbs={slotBreadcrumbs}
    slotLogo={slotLogo}
    slotPrimaryNavigation={slotPrimaryNavigation}
  >
    <Card {...props}>{children}</Card>
  </Base>
);
