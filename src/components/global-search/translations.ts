import { defineMessages } from "react-intl";

export const TRANSLATIONS = defineMessages({
  LABEL_PLACEHOLDER: {
    id: "mykn.components.GlobalSearch.labelPlaceholder",
    description: "mykn.components.GlobalSearch: The search input placeholder",
    defaultMessage: "Zoeken",
  },
  LABEL_NO_RESULTS: {
    id: "mykn.components.GlobalSearch.labelNoResults",
    description:
      "mykn.components.GlobalSearch: The text shown when no results are found",
    defaultMessage: "Geen resultaten",
  },
  LABEL_LOADING: {
    id: "mykn.components.GlobalSearch.labelLoading",
    description: "mykn.components.GlobalSearch: The loading (accessible) label",
    defaultMessage: "Bezig met laden...",
  },
  LABEL_SELECT: {
    id: "mykn.components.GlobalSearch.labelSelect",
    description:
      "mykn.components.GlobalSearch: The keyboard hint label for selecting a result",
    defaultMessage: "Selecteren",
  },
  LABEL_NAVIGATE: {
    id: "mykn.components.GlobalSearch.labelNavigate",
    description:
      "mykn.components.GlobalSearch: The keyboard hint label for navigating results",
    defaultMessage: "Navigeren",
  },
  LABEL_CLOSE: {
    id: "mykn.components.GlobalSearch.labelClose",
    description:
      "mykn.components.GlobalSearch: The keyboard hint label for closing the panel",
    defaultMessage: "Sluiten",
  },
});
