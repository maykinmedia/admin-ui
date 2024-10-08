// Define the structure of a single message descriptor
import { defineMessages } from "../../../lib";

export const TRANSLATIONS = defineMessages({
  LABEL_START_DATE: {
    id: "mykn.components.DateRangeInput.labelStartDate",
    description:
      "mykn.components.DateRangeInput: The start date (accessible) label",
    defaultMessage: "startdatum",
  },

  LABEL_END_DATE: {
    id: "mykn.components.DateRangeInput.labelEndDate",
    description:
      "mykn.components.DateRangeInput: The end date (accessible) label",
    defaultMessage: "einddatum",
  },
});
