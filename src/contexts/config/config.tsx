import React, { createContext } from "react";

export type ConfigContextType = {
  /** Enables various debug utilities throughout this library.  */
  debug?: boolean;

  /** Overrides the logo throughout this library. */
  logo?: React.ReactNode;
};

/**
 * Can be set to override settings used throughout this library. Context provider should be optional and every value
 * should have a sane default. Components should also expose prop overrides.
 */
export const ConfigContext = createContext<ConfigContextType>({
  debug: false,
  logo: null,
});
