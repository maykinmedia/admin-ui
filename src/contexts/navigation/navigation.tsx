import React, { createContext } from "react";

export type NavigationContextType = {
  primaryNavigation: React.ReactNode;
};

/**
 * Can be set to provide menu's used throughout this library. Context provider should be optional and every value
 * should have a sane default. Components should also expose prop overrides.
 */
export const NavigationContext = createContext<NavigationContextType>({
  primaryNavigation: null,
});
