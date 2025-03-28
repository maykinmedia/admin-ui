import React, { useEffect, useRef, useState } from "react";

import { gettextFirst, ucFirst, useIntl } from "../../../lib";
import { Button } from "../../button";
import { Option, Select, SelectProps } from "../../form";
import { Outline } from "../../icon";
import { Toolbar } from "../../toolbar";
import { P } from "../../typography";
import "./paginator.scss";
import { TRANSLATIONS } from "./translations";

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
  labelCurrentPageRange,
  labelGoToPage,
  labelPageSize,
  labelPagination,
  labelPrevious,
  labelNext,
  labelLoading,
  loading = undefined,
  page = 1,
  pageSize,
  pageSizeOptions = [],
  onPageChange,
  onPageSizeChange,
  ...props
}) => {
  const onPageChangeTimeoutRef = useRef<NodeJS.Timeout>(undefined);
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

  const _labelPagination = gettextFirst(
    labelPagination,
    TRANSLATIONS.LABEL_PAGINATION,
    context,
  );

  const _labelGoToPage = gettextFirst(
    labelGoToPage,
    TRANSLATIONS.LABEL_GO_TO_PAGE,
    { ...context, page: "{page}" },
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
          labelGoToPage={_labelGoToPage}
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

  const _labelPrevious = gettextFirst(
    labelPrevious,
    TRANSLATIONS.LABEL_PREVIOUS,
    context,
  );

  const _labelNext = gettextFirst(labelNext, TRANSLATIONS.LABEL_NEXT, context);

  const _labelGoToPage = gettextFirst(
    labelGoToPage,
    TRANSLATIONS.LABEL_GO_TO_PAGE,
    { ...context, page: "{page}" },
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
            aria-label={intl.formatMessage(
              { id: _labelGoToPage, defaultMessage: _labelGoToPage },
              { page: 1 },
            )}
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
        const ariaLabel = intl.formatMessage(
          { id: _labelGoToPage, defaultMessage: _labelGoToPage },
          { page },
        );

        return (
          <Button
            key={page}
            active={currentPage === page}
            aria-current={currentPage === page}
            aria-label={ariaLabel}
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
            aria-label={intl.formatMessage(
              { id: _labelGoToPage, defaultMessage: _labelGoToPage },
              { page: pageCount },
            )}
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

  const _labelCurrentPageRange = gettextFirst(
    labelCurrentPageRange,
    TRANSLATIONS.LABEL_CURRENT_PAGE_RANGE,
    context,
  );

  const _labelLoading = gettextFirst(
    labelLoading,
    TRANSLATIONS.LABEL_LOADING,
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
  if (pageSizeOptions.length === 0) {
    return;
  }

  const context = {
    pageSize,
  };

  const _labelPageSize = gettextFirst(
    labelPageSize,
    TRANSLATIONS.LABEL_PAGE_SIZE,
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
