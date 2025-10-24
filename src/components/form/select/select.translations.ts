import { defineMessages } from "react-intl";

export const TRANSLATIONS = defineMessages({
  LABEL_CLEAR: {
    id: "mykn.components.Select.labelClear",
    description:
      "mykn.components.Select: Accessible label for the clear-value button",
    defaultMessage: "waarde Wissen",
  },

  PLACEHOLDER_SEARCH: {
    id: "mykn.components.Select.placeholderSearch",
    description:
      "mykn.components.Select: Placeholder text for the async search input",
    defaultMessage: "zoeken…",
  },

  ARIA_CLEAR_SEARCH: {
    id: "mykn.components.Select.ariaClearSearch",
    description:
      "mykn.components.Select: Accessible label for the clear-search button",
    defaultMessage: "zoekopdracht wissen",
  },

  ARIA_REMOVE_VALUE: {
    id: "mykn.components.Select.ariaRemoveValue",
    description:
      "mykn.components.Select: Accessible label for removing a selected value in multi-select",
    defaultMessage: "verwijder {value}",
  },

  ARIA_LOADING: {
    id: "mykn.components.Select.ariaLoading",
    description:
      "mykn.components.Select: Status text announced while options are loading",
    defaultMessage: "opties laden…",
  },

  LABEL_NO_OPTIONS: {
    id: "mykn.components.Select.labelNoOptions",
    description:
      "mykn.components.Select: Message shown when no options match the search",
    defaultMessage: "geen resultaten",
  },
});
