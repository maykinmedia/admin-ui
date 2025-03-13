import { defineMessages } from "react-intl";

export const TRANSLATIONS = defineMessages({
  LABEL_PAGINATION: {
    id: "mykn.components.Paginator.labelPagination",
    description: "mykn.components.Paginator: The pagination (accessible) label",
    defaultMessage: "paginering",
  },
  LABEL_PREVIOUS: {
    id: "mykn.components.Paginator.labelPrevious",
    description:
      "mykn.components.Paginator: The go to previous page (accessible) label",
    defaultMessage: "vorige",
  },
  LABEL_NEXT: {
    id: "mykn.components.Paginator.labelNext",
    description:
      "mykn.components.Paginator: The go to next page (accessible) label",
    defaultMessage: "volgende",
  },
  LABEL_GO_TO_PAGE: {
    id: "mykn.components.Paginator.labelGoToPage",
    description: "mykn.components.Paginator: The go to page (accessible) label",
    defaultMessage: "naar pagina {page}",
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
