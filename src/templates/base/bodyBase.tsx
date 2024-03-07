import React from "react";

import { Body, BodyProps } from "../../components";
import { CardBase } from "./cardBase";

export type BodyBaseProps = BodyProps &
  React.PropsWithChildren<{
    /** Breadcrumbs navigation (JSX) slot. */
    slotBreadcrumbs?: React.ReactNode;

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
  slotBreadcrumbs,
  slotLogo,
  slotPrimaryNavigation,
  ...props
}) => (
  <CardBase
    slotBreadcrumbs={slotBreadcrumbs}
    slotLogo={slotLogo}
    slotPrimaryNavigation={slotPrimaryNavigation}
  >
    <Body {...props}>{children}</Body>
  </CardBase>
);
