import React, { useContext } from "react";

import { formatMessage } from "./formatmessage";
import { MessageDescriptor } from "./types";

/*
  IMPORTANT!
  ==========

  This UI library needs to support the following scenarios:

  - An application with extensive internationalization support
    (using react-intl).

  - An application with basic internationalization using translated labels
    passed as props.

  - No internalisation (default messages only).

  The default behaviour of react-intl's `useIntl` hook is to throw en exception
  if `<IntlProvider>` does not exist in the component ancestry. This only suits
  the first case but not he second or third.

  The React rules of hooks (https://react.dev/warnings/invalid-hook-call-warning)
  prevent us from conditionally calling hooks (or catching exceptions raised by
  them), we therefore cant rely on the react-intl `useIntl` hook.

  We avoid this problem by implementing our own version of `useIntl` which does
  not throw an exception if `IntlContext` is `<IntlProvider>` does not exist
  (`IntlContext` is `null`) but instead will return a minimal `FALLBACK_INTL`
  which still allows the default message to be used with a similar
  `formatMessage` call.
 */

// Optionally import react-intl
let IntlContext: React.Context<Intl> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const reactIntl = require("react-intl");
  IntlContext = reactIntl.IntlContext;
} catch (e) {
  // "react-intl" not installed.
}

// Redefine (minimal) react-intl types.
type MessageContext = Record<string, unknown>;

type Intl = {
  formatMessage: (
    descriptor: MessageDescriptor,
    context?: MessageContext,
  ) => string;
};

/**
 * Minimal object mimicking parts of IntlContext use throughout the library,
 * this is returned by custom (`useIntl`) if `IntlContext` is not available.
 * This prevents error when `IntlProvider` is not used.
 */
const getLocalizedFallbackIntl = (
  locale = document?.documentElement?.lang || "nl",
): Intl => {
  return {
    formatMessage: (
      descriptor: MessageDescriptor,
      context: MessageContext = {},
    ) => {
      let messages: Record<string, string> = {};
      try {
        if (locale === "nl") {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          messages = require("./compiled/nl");
        } else {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          messages = require("./compiled/en");
        }
      } catch (e) {
        console.warn(e);
      }

      // Fix cases where module and not values were imported.
      if (messages.default) {
        messages = messages.default as unknown as Record<string, string>;
      }
      const message = messages[descriptor.id as string];
      return formatMessage(message, context);
    },
  };
};

/**
 * Custom hook returning either `IntlContext` value (if available) or
 * `FALLBACK_INTL`. This prevents error when `IntlProvider` is not used.
 */
export const useIntl = (locale?: string) => {
  // Not breaking "rules of hooks" here, as dependencies should not change during runtime.
  const context: Intl = IntlContext
    ? useContext(IntlContext as React.Context<Intl>) // return `IntlContext` if react-intl is installed.
    : getLocalizedFallbackIntl(locale); // default if react-intl is not installed.

  return context || getLocalizedFallbackIntl(locale); // default if `context` is `null
};
