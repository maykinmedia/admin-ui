import React, { createContext } from "react";

import { BreadcrumbItem, ToolbarItem } from "../../components";

export type NavigationContextType = {
  breadcrumbs?: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  primaryNavigation?: React.ReactNode;
  primaryNavigationItems?: ToolbarItem[];
  sidebar?: React.ReactNode;
  sidebarItems?: ToolbarItem[];
};

/**
 * Can be set to provide menu's used throughout this library. Context provider should be optional and every value
 * should have a sane default. Components should also expose prop overrides.
 */
export const NavigationContext = createContext<NavigationContextType>({
  breadcrumbs: null,
  breadcrumbItems: [],
  primaryNavigation: null,
  primaryNavigationItems: [],
  sidebar: null,
  sidebarItems: [],
});
