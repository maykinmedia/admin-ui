import { useContext } from "react";
import { IntlContext, createIntl } from "react-intl";

import en from "./compiled/en.json";
import nl from "./compiled/nl.json";
import { Messages } from "./types";

/*
  IMPORTANT!
  ==========

  Admin-ui needs to support the following scenarios:

  - An application with extensive internationalization support
    (using react-intl).

  - An application with basic internationalization using translated labels
    passed as props.

  - No internationalization (default messages only).

  The default behaviour of react-intl's `useIntl` hook is to throw en exception
  if `<IntlProvider>` does not exist in the component ancestry. This only suits
  the first case but not he second or third.

  TO avoid this problem a custom version of the `useIntl` hook is exposed that
  does not throw an exception if `<IntlProvider>` does not exist, instead it will
  create an "intl" using `createIntl()`.
 */

/**
 * Returns the default messages for `locale`.
 * this is returned by custom (`useIntl`) if `IntlContext` is not available.
 * This prevents error when `IntlProvider` is not used.
 */
export const getDefaultMessages = (locale: string): Messages => {
  switch (locale) {
    case "en":
      return en;
    default:
      return nl;
  }
};

/**
 * Custom hook returning "intl" object.
 * Adds default values for missing messages, remains compatible with `<IntlProvider/>`
 * Bypasses `invariantIntlContext` in react-intl.
 */
export const useIntl = (locale = document?.documentElement?.lang || "nl") => {
  const context = useContext(IntlContext) || { messages: {} };
  const messages: Messages = {
    ...getDefaultMessages(locale),
    ...context.messages,
  };

  return createIntl({
    fallbackOnEmptyString: false,
    locale,
    messages,
    // Errors get silenced since we allow props to be passed as message which are
    // not in messages, and thus wil result in "Missing message" error.
    onError: (e) => {
      if (e.code === "MISSING_TRANSLATION") {
        return;
      }
      // Log all other errors.
      console.error(e);
    },
  });
};
