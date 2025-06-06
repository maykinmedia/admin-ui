import { defineMessages } from "react-intl";

export const TRANSLATIONS = defineMessages({
  LABEL_PAGINATION: {
    id: "mykn.components.Paginator.labelPagination",
    description: "mykn.components.Paginator: The pagination (accessible) label",
    defaultMessage: "paginering",
  },
  LABEL_PAGE_SELECT: {
    id: "mykn.components.Paginator.labelPageSelect",
    description: "mykn.components.Paginator: The page (accessible) label",
    defaultMessage: "Pagina",
  },
  LABEL_FIRST: {
    id: "mykn.components.Paginator.labelFirst",
    description:
      "mykn.components.Paginator: The go to first page (accessible) label",
    defaultMessage: "Ga naar de eerste pagina (pagina {page})",
  },
  LABEL_PREVIOUS: {
    id: "mykn.components.Paginator.labelPrevious",
    description:
      "mykn.components.Paginator: The go to previous page (accessible) label",
    defaultMessage: "Ga naar de vorige pagina (pagina {page})",
  },
  LABEL_NEXT: {
    id: "mykn.components.Paginator.labelNext",
    description:
      "mykn.components.Paginator: The go to next page (accessible) label",
    defaultMessage: "Ga naar de volgende pagina (pagina {page})",
  },
  LABEL_LAST: {
    id: "mykn.components.Paginator.labelLast",
    description:
      "mykn.components.Paginator: The go to last page (accessible) label",
    defaultMessage: "Ga naar de laatste pagina (pagina {page})",
  },
  LABEL_CURRENT_PAGE_RANGE: {
    id: "mykn.components.Paginator.labelCurrentPageRange",
    description:
      "mykn.components.Paginator: The current page range (accessible) label",
    defaultMessage:
      "resultaat {pageStart} t/m {pageEnd} van {pageCount} pagina's",
  },
  LABEL_LOADING: {
    id: "mykn.components.Paginator.labelLoading",
    description: "mykn.components.Paginator: The loading (accessible) label",
    defaultMessage: "bezig met laden...",
  },
  LABEL_PAGE_SIZE: {
    id: "mykn.components.Paginator.labelPageSize",
    description: "mykn.components.Paginator: The page size (accessible) label",
    defaultMessage: "aantal resultaten",
  },
});
