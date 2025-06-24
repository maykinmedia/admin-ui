import { ucFirst } from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { gettextFirst, useIntl } from "../../../lib";
import { Button } from "../../button";
import { FormControl, Option, SelectProps } from "../../form";
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

  /** The label for the page */
  labelPageSelect?: string;

  /** The go to first page (accessible) label. */
  labelFirst?: string;

  /** The go to previous page (accessible) label. */
  labelPrevious?: string;

  /** The go to next page (accessible) label. */
  labelNext?: string;

  /** The go to last page (accessible) label. */
  labelLast?: string;
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
  labelPageSelect,
  labelFirst,
  labelLast,
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
  const [pageSizeState, setPageSizeState] = useState(pageSize);

  const pageCount = Math.ceil(count / pageSizeState);

  const [pageState, _setPageState] = useState(page);

  // Clamp pageState on update.
  const setPageState = useCallback(
    (page: number) => {
      _setPageState(Math.max(Math.min(page, pageCount), 1));
    },
    [pageCount],
  );

  const index = pageState - 1;
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

  const _labelFirst = gettextFirst(labelFirst, TRANSLATIONS.LABEL_FIRST, {
    ...context,
    page: 1,
  });

  const _labelPrevious = gettextFirst(
    labelPrevious,
    TRANSLATIONS.LABEL_PREVIOUS,
    { ...context, page: "{page}" },
  );

  const _labelNext = gettextFirst(labelNext, TRANSLATIONS.LABEL_NEXT, {
    ...context,
    page: "{page}",
  });

  const _labelLast = gettextFirst(labelLast, TRANSLATIONS.LABEL_LAST, {
    ...context,
    page: pageCount,
  });

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
      className={clsx("mykn-paginator", {
        "mykn-paginator--loading": isLoading,
      })}
      aria-label={ucFirst(_labelPagination)}
      {...props}
    >
      <h3 className="mykn-paginator__screenreader-only">Pagination</h3>
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

      <div className="mykn-paginator__section mykn-paginator__section--nav">
        <PaginatorNav
          count={count}
          currentPage={pageState}
          labelPageSelect={labelPageSelect}
          labelFirst={_labelFirst}
          labelLast={_labelLast}
          labelPrevious={_labelPrevious}
          labelNext={_labelNext}
          pageSize={pageSizeState}
          onPageSizeChange={handlePageChange}
        />
      </div>
    </nav>
  );
};

export type PaginatorNavProps = {
  count: number;
  currentPage: number;
  labelPageSelect?: string;
  labelFirst?: string;
  labelPrevious?: string;
  labelNext?: string;
  labelLast?: string;
  pageSize: number;
  onPageSizeChange: (page: number) => void;
};

export const PaginatorNav: React.FC<PaginatorNavProps> = ({
  count,
  currentPage = 1,
  labelPageSelect,
  labelFirst,
  labelPrevious,
  labelNext,
  labelLast,
  onPageSizeChange,
  pageSize,
}) => {
  const intl = useIntl();
  const pageCount = Math.ceil(count / pageSize);
  const previousPage = Math.max(0, currentPage - 1);
  const nextPage = currentPage + 1 > pageCount ? 0 : currentPage + 1;

  const _labelPageSelect = gettextFirst(
    labelPageSelect,
    TRANSLATIONS.LABEL_PAGE_SELECT,
    { page: currentPage },
  );

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= pageCount) {
      onPageSizeChange(value);
    }
  };

  return (
    <Toolbar
      align="space-between"
      directionResponsive={false}
      pad={false}
      variant="transparent"
    >
      <FormControl
        direction="horizontal"
        max={pageCount}
        label={_labelPageSelect}
        min={1}
        size="xs"
        type="number"
        value={currentPage}
        onChange={onChangeInput}
      />

      <div className="mykn-paginator__buttons">
        <Button
          aria-label={intl.formatMessage(
            { id: labelFirst, defaultMessage: labelFirst },
            { page: 1 },
          )}
          className="mykn-paginator__button mykn-paginator__button--page"
          size="xs"
          square
          variant="outline"
          onClick={() => onPageSizeChange(1)}
          disabled={currentPage === 1}
        >
          <Outline.ChevronDoubleLeftIcon />
        </Button>

        <Button
          className="mykn-paginator__button mykn-paginator__button--previous"
          disabled={!previousPage}
          size="xs"
          variant="outline"
          aria-label={intl.formatMessage(
            { id: labelPrevious, defaultMessage: labelPrevious },
            { page: previousPage },
          )}
          square
          wrap={false}
          onClick={() => onPageSizeChange(previousPage)}
        >
          <Outline.ChevronLeftIcon />
        </Button>

        <Button
          className="mykn-paginator__button mykn-paginator__button--next"
          disabled={!nextPage}
          size="xs"
          variant="outline"
          aria-label={intl.formatMessage(
            { id: labelNext, defaultMessage: labelNext },
            { page: nextPage },
          )}
          square
          wrap={false}
          onClick={() => onPageSizeChange(nextPage)}
        >
          <Outline.ChevronRightIcon />
        </Button>
        <Button
          aria-current={currentPage === pageCount}
          aria-label={intl.formatMessage(
            { id: labelLast, defaultMessage: labelLast },
            { page: pageCount },
          )}
          className="mykn-paginator__button mykn-paginator__button--page"
          size="xs"
          square
          variant="outline"
          onClick={() => onPageSizeChange(pageCount)}
          disabled={currentPage === pageCount}
        >
          <Outline.ChevronDoubleRightIcon />
        </Button>
      </div>
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
      {/* Hidden on mobile when loading. */}
      <P size="xs" title={ucFirst(_labelCurrentPageRange)}>
        {`${pageStart}-${pageEnd} / ${count}`}
      </P>
      {/* `_labelLoading` MUST be truthy in order to show the icon for a11y. */}
      {/* Only render icon if `loading` is truthy (save space on mobile). */}
      {Boolean(_labelLoading && loading) && (
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
      <FormControl
        direction="horizontal"
        showRequiredIndicator={false}
        label={ucFirst(_labelPageSize)}
        options={pageSizeOptions}
        required={true}
        inputSize="fit-content"
        size="xs"
        value={pageSize}
        onChange={onPageSizeChange}
      />
    </>
  );
};
