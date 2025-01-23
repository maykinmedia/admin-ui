// Define the structure of a single message descriptor
import { defineMessages } from "../../../lib";

export const TRANSLATIONS = defineMessages({
  REQUIRED_EXPLANATION: {
    id: "mykn.components.Form.requiredExplanation",
    description: "mykn.components.Form: The required explanation text",
    defaultMessage:
      "Verplichte velden zijn gemarkeerd met een sterretje ({requiredIndicator})",
  },
  REQUIRED_INDICATOR: {
    id: "mykn.components.Form.requiredIndicator",
    description: "mykn.components.Form: The required indicator (*)",
    defaultMessage: "*",
  },

  LABEL_REQUIRED: {
    id: "mykn.components.Form.labelRequired",
    description: "mykn.components.Form: The required (accessible) label",
    defaultMessage: "Veld {label} is verplicht",
  },

  LABEL_VALIDATION_ERROR_REQUIRED: {
    id: "mykn.components.Form.labelValidationErrorRequired",
    description: 'mykn.components.Form: The "required" validation error',
    defaultMessage: "Veld {label} is verplicht",
  },

  LABEL_SUBMIT: {
    id: "mykn.components.Form.labelSubmit",
    description: "mykn.components.Form: The submit form label",
    defaultMessage: "verzenden",
  },
});
