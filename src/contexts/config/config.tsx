import React, { createContext } from "react";

export type ConfigContextType = {
  /** Enables various debug utilities throughout this library.  */
  debug?: boolean;

  /** Whether to only output the page inner contents in templates. */
  templatesContentOnly?: boolean;

  /** Whether to wrap contents of templates in a grid. */
  templatesGrid?: boolean;

  /** Overrides the logo throughout this library. */
  logo?: React.ReactNode;
};

/**
 * Can be set to override settings used throughout this library. Context provider should be optional and every value
 * should have a sane default. Components should also expose prop overrides.
 */
export const ConfigContext = createContext<ConfigContextType>({
  debug: false,
  templatesContentOnly: false,
  templatesGrid: true,
  logo: null,
});
