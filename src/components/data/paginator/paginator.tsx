import React, { useEffect, useRef, useState } from "react";

import { ucFirst } from "../../../lib";
import { formatMessage } from "../../../lib";
import { useIntl } from "../../../lib";
import { Button } from "../../button";
import { Option, Select, SelectProps } from "../../form";
import { Outline } from "../../icon";
import { Toolbar } from "../../toolbar";
import { P } from "../../typography";
import "./paginator.scss";

export type PaginatorProps = React.HTMLAttributes<HTMLElement> & {
  /** The total number of results (items not pages). */
  count: number;

  /** The current page. */
  page: number;

  /** The page size (items per page), required even if `pageSizeOptions` is not set. */
  pageSize: number;

  /** Indicates whether the spinner should be shown (requires `labelLoading`). */
  loading?: boolean;

  /** The options for the page size, can be omitted if no variable pages size is supported. */
  pageSizeOptions?: Option<number, number>[];

  /**
   * Gets called when the selected page is changed
   *
   * If a `Promise` is returned and `labelLoading` is set: a spinner will be
   * shown after during the "pending" state of the returned `Promise`.
   *
   * This callback is debounced every 300 milliseconds.
   */
  onPageChange?: (page: number) => Promise<unknown> | void;

  /** Gets called when the selected page size is changed. */
  onPageSizeChange?: (pageSize: number) => Promise<unknown> | void;

  /** The current page range (accessible) label. */
  labelCurrentPageRange?: string;

  /** The go to page (accessible) label. */
  labelGoToPage?: string;

  /**
   * The loading (accessible) label,
   * @see onPageChange
   */
  labelLoading?: string;

  /** The page size (accessible) label. */
  labelPageSize?: string;

  /** The pagination (accessible) label. */
  labelPagination?: string;

  /** The go to previous page (accessible) label. */
  labelPrevious?: string;

  /** The go to next page (accessible) label. */
  labelNext?: string;
};

/**
 * Paginator component, can be used to show and manipulate information about the
 * current page and pages in a set of object.
 *
 * The `onPageChange` callback is debounced and provided a mechanism for a
 * spinner to appear during load (see docs).
 */
export const Paginator: React.FC<PaginatorProps> = ({
  count,
  labelCurrentPageRange = "",
  labelGoToPage = "",
  labelPageSize = "",
  labelPagination = "",
  labelPrevious = "",
  labelNext = "",
  labelLoading = "",
  loading = undefined,
  page = 1,
  pageSize,
  pageSizeOptions = [],
  onPageChange,
  onPageSizeChange,
  ...props
}) => {
  const onPageChangeTimeoutRef = useRef<NodeJS.Timeout>();
  const [loadingState, setLoadingState] = useState(false);
  const [pageState, setPageState] = useState(page);
  const [pageSizeState, setPageSizeState] = useState(pageSize);

  const index = pageState - 1;
  const pageCount = Math.ceil(count / pageSizeState);
  const pageStart = index * pageSizeState + 1;
  const pageEnd = Math.min(pageStart + pageSizeState - 1, count);

  const context = {
    count,
    index,
    page: pageState,
    pageCount,
    pageStart,
    pageEnd,
    pageSize: pageSizeState,
  };

  const intl = useIntl();

  const _labelPagination = labelPagination
    ? formatMessage(labelPagination, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelPagination",
          description:
            "mykn.components.Paginator: The pagination (accessible) label",
          defaultMessage: "paginering",
        },
        context,
      );

  useEffect(() => setPageState(page), [page]);
  useEffect(() => setPageSizeState(pageSize), [pageSize]);

  /**
   * Gets called when the page size dropdown is changed.
   * @param event
   */
  const handlePageSizeChange: SelectProps["onChange"] = (event) => {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value);
    setPageSizeState(value);
    setPageState(1);
    onPageSizeChange && onPageSizeChange(value);
    emitPageChange(page);
  };

  /**
   * Gets called when the page input is changed.
   * @param page
   */
  const handlePageChange = (page: number) => {
    setPageState(page);

    clearTimeout(onPageChangeTimeoutRef.current);
    emitPageChange(page);
  };

  /**
   * Calles the debounce `onPageChange` callback.
   * @param page
   */
  const emitPageChange = (page: number) => {
    const handler = async () => {
      setLoadingState(true);
      await onPageChange?.(page);
      setLoadingState(false);
    };
    clearTimeout(onPageChangeTimeoutRef.current);
    onPageChangeTimeoutRef.current = setTimeout(handler, 300);
  };

  // `loading` takes precedence over `loadingState` (derived from Promise).
  const isLoading = typeof loading === "boolean" ? loading : loadingState;

  return (
    <nav
      className="mykn-paginator"
      aria-label={ucFirst(_labelPagination)}
      {...props}
    >
      <div className="mykn-paginator__section mykn-paginator__section--nav">
        <PaginatorNav
          count={count}
          currentPage={pageState}
          labelGoToPage={labelGoToPage}
          labelPrevious={labelPrevious}
          labelNext={labelNext}
          pageSize={pageSizeState}
          onPageSizeChange={handlePageChange}
        />
      </div>

      <div className="mykn-paginator__section mykn-paginator__section--meta">
        <PaginatorMeta
          count={count}
          page={pageState}
          pageSize={pageSizeState}
          labelCurrentPageRange={labelCurrentPageRange}
          labelLoading={labelLoading}
          loading={isLoading}
        />
      </div>

      <div className="mykn-paginator__section mykn-paginator__section--options">
        <PaginatorOptions
          labelPageSize={labelPageSize}
          pageSize={pageSizeState}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </nav>
  );
};

export type PaginatorNavProps = {
  count: number;
  currentPage: number;
  labelGoToPage: string;
  labelPrevious?: string;
  labelNext?: string;
  pageSize: number;
  onPageSizeChange: (page: number) => void;
};

export const PaginatorNav: React.FC<PaginatorNavProps> = ({
  count,
  currentPage = 1,
  labelGoToPage,
  labelNext,
  labelPrevious,
  onPageSizeChange,
  pageSize,
}) => {
  const intl = useIntl();

  const maxOffset = 2;
  const pageCount = Math.ceil(count / pageSize);

  const previousPage = Math.max(0, currentPage - 1);
  const nextPage = currentPage + 1 > pageCount ? 0 : currentPage + 1;

  const startRange = Math.min(maxOffset, previousPage);
  const endRange = Math.min(maxOffset, pageCount - currentPage);

  const startPages =
    startRange > 0
      ? new Array(startRange)
          .fill(0)
          .map((_, i) => currentPage - (i + 1))
          .reverse()
      : [];
  const endPages =
    endRange > 0
      ? new Array(endRange).fill(0).map((_, i) => currentPage + i + 1)
      : [];

  const pages = [...startPages, currentPage, ...endPages];

  const context = {
    count,
    currentPage,
    pageCount,
    pageSize,
    previousPage,
    nextPage,
  };

  const _labelPrevious = labelPrevious
    ? formatMessage(labelPrevious, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelPrevious",
          description:
            "mykn.components.Paginator: The go to previous page (accessible) label",
          defaultMessage: "vorige",
        },
        context,
      );

  const _labelNext = labelNext
    ? formatMessage(labelNext, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelNext",
          description:
            "mykn.components.Paginator: The go to next page (accessible) label",
          defaultMessage: "volgende",
        },
        context,
      );

  const _labelGoToPage = labelGoToPage
    ? formatMessage(labelGoToPage, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelGoToPage",
          description:
            "mykn.components.Paginator: The go to page (accessible) label",
          defaultMessage: "naar pagina {page}",
        },
        context,
      );

  return (
    <Toolbar directionResponsive={false} pad={false} variant="transparent">
      <Button
        className="mykn-paginator__button mykn-paginator__button--previous"
        disabled={!previousPage}
        size="xs"
        variant="outline"
        wrap={false}
        onClick={() => onPageSizeChange(previousPage)}
      >
        <Outline.ChevronLeftIcon />
        {ucFirst(_labelPrevious)}
      </Button>

      {startPages.length > 0 && !startPages.includes(1) && (
        <>
          <Button
            active={currentPage === 1}
            aria-label={formatMessage(_labelGoToPage, { page: 1 })}
            aria-current={currentPage === 1}
            className="mykn-paginator__button mykn-paginator__button--page"
            size="xs"
            square
            variant="outline"
            onClick={() => onPageSizeChange(1)}
          >
            1
          </Button>
          {!startPages.includes(2) && (
            <Button
              aria-hidden
              className="mykn-paginator__ellipsis"
              disabled
              size="xs"
              square
              variant="outline"
            >
              …
            </Button>
          )}
        </>
      )}

      {pages.map((page) => {
        return (
          <Button
            key={page}
            active={currentPage === page}
            aria-current={currentPage === page}
            aria-label={formatMessage(_labelGoToPage, { page })}
            className="mykn-paginator__button mykn-paginator__button--page"
            size="xs"
            square
            variant="outline"
            onClick={() => onPageSizeChange(page)}
          >
            {page}
          </Button>
        );
      })}

      {endPages.length > 0 && !endPages.includes(pageCount) && (
        <>
          {!endPages.includes(pageCount - 1) && (
            <Button
              aria-hidden
              className="mykn-paginator__ellipsis"
              disabled
              size="xs"
              square
              variant="outline"
            >
              …
            </Button>
          )}
          <Button
            active={currentPage === pageCount}
            aria-current={currentPage === pageCount}
            aria-label={formatMessage(_labelGoToPage, { page: pageCount })}
            className="mykn-paginator__button mykn-paginator__button--page"
            size="xs"
            square
            variant="outline"
            onClick={() => onPageSizeChange(pageCount)}
          >
            {pageCount}
          </Button>
        </>
      )}

      <Button
        className="mykn-paginator__button mykn-paginator__button--next"
        disabled={!nextPage}
        size="xs"
        variant="outline"
        wrap={false}
        onClick={() => onPageSizeChange(nextPage)}
      >
        {ucFirst(_labelNext)}
        <Outline.ChevronRightIcon />
      </Button>
    </Toolbar>
  );
};

export type PaginatorMetaProps = {
  count: number;
  labelCurrentPageRange?: string;
  labelLoading?: string;
  loading: boolean;
  page: number;
  pageSize: number;
};

export const PaginatorMeta: React.FC<PaginatorMetaProps> = ({
  count,
  labelCurrentPageRange,
  labelLoading,
  loading,
  page,
  pageSize,
}) => {
  const intl = useIntl();

  const index = page - 1;
  const pageCount = Math.ceil(count / pageSize);
  const pageStart = index * pageSize + 1;
  const pageEnd = Math.min(pageStart + pageSize - 1, count);

  const context = {
    count,
    index,
    loading,
    page,
    pageCount,
    pageStart,
    pageEnd,
    pageSize,
  };

  const _labelCurrentPageRange = labelCurrentPageRange
    ? formatMessage(labelCurrentPageRange, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelCurrentPageRange",
          description:
            "mykn.components.Paginator: The current page range (accessible) label",
          defaultMessage:
            "resultaat {pageStart} t/m {pageEnd} van {pageCount} pagina's",
        },
        context,
      );

  const _labelLoading = labelLoading
    ? formatMessage(labelLoading, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelLoading",
          description:
            "mykn.components.Paginator: The loading (accessible) label",
          defaultMessage: "bezig met laden...",
        },
        context,
      );

  return (
    <>
      <P size="xs" title={ucFirst(_labelCurrentPageRange)}>
        {`${pageStart}-${pageEnd} / ${count}`}
      </P>
      {_labelLoading && (
        <Outline.ArrowPathIcon
          spin={true}
          aria-hidden={!loading}
          aria-label={loading ? ucFirst(_labelLoading) : ""}
          hidden={!loading}
        />
      )}
    </>
  );
};

export type PaginatorOptionsProps = {
  labelPageSize?: string;
  onPageSizeChange: React.ChangeEventHandler;
  pageSize: number;
  pageSizeOptions: Option<number, number>[];
};

export const PaginatorOptions: React.FC<PaginatorOptionsProps> = ({
  labelPageSize,
  onPageSizeChange,
  pageSize,
  pageSizeOptions = [],
}) => {
  const intl = useIntl();

  if (pageSizeOptions.length === 0) {
    return;
  }

  const context = {
    pageSize,
  };

  const _labelPageSize = labelPageSize
    ? formatMessage(labelPageSize, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelPageSize",
          description:
            "mykn.components.Paginator: The page size (accessible) label",
          defaultMessage: "aantal resultaten",
        },
        context,
      );

  return (
    <>
      <P size="xs">{ucFirst(_labelPageSize)}</P>
      <Select
        options={pageSizeOptions}
        required={true}
        inputSize="fit-content"
        size="xs"
        value={pageSize}
        variant="transparent"
        onChange={onPageSizeChange}
      />
    </>
  );
};
