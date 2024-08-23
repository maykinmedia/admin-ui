// Define the structure of a single message descriptor
import { defineMessages } from "../../../lib";

export const TRANSLATIONS = defineMessages({
  LABEL_FILTER_FIELD: {
    id: "mykn.components.DataGrid.labelFilterField",
    description:
      "mykn.components.DataGrid: The filter field (accessible) label",
    defaultMessage: 'filter veld "{name}"',
  },

  LABEL_SAVE_FIELD_SELECTION: {
    id: "mykn.components.DataGrid.labelSaveFieldSelection",
    description: "mykn.components.Modal: The datagrid save selection label",
    defaultMessage: "kolommen opslaan",
  },

  LABEL_SELECT: {
    id: "mykn.components.DataGrid.labelSelect",
    description: "mykn.components.DataGrid: The select row (accessible) label",
    defaultMessage: "(de)selecteer rij",
  },

  LABEL_SELECT_ALL: {
    id: "mykn.components.DataGrid.labelSelectAll",
    description: "mykn.components.DataGrid: The select row (accessible) label",
    defaultMessage: "(de)selecteer {countPage} rijen",
  },

  LABEL_SELECT_ALL_PAGES: {
    id: "mykn.components.DataGrid.labelSelectAllPages",
    description:
      "mykn.components.DataGrid: The select all pages (accessible) label",
    defaultMessage: "(de)selecteer {pages} pagina's",
  },

  LABEL_SELECT_FIELDS: {
    id: "mykn.components.DataGrid.labelSelectFields",
    description: "mykn.components.Modal: The datagrid select fields label",
    defaultMessage: "selecteer kolommen",
  },
});
