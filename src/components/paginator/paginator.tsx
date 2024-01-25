import React, { useEffect, useRef, useState } from "react";

import { formatMessage } from "../../lib/i18n/formatMessage";
import { Button } from "../button";
import { Input, Option, Select, SelectProps } from "../form";
import { Outline } from "../icon";
import { P } from "../typography";
import "./paginator.scss";

export type PaginatorProps = {
  /** The total number of results (items not pages). */
  count: number;

  /** The current page. */
  page: number;

  /** The page size (items per page), required even if `pageSizeOptions` is not set. */
  pageSize: number;

  /** The current page range (accessible) label. */
  labelCurrentPageRange: string;

  /** The go to page (accessible) label. */
  labelGoToPage: string;

  /** The page size (accessible) label. */
  labelPageSize: string;

  /** The go to previous page (accessible) label. */
  labelPrevious: string;

  /** The go to next page (accessible) label. */
  labelNext: string;

  /** The options for the page size, can be omitted if no variable pages size is supported. */
  pageSizeOptions?: Option<number, number>[];

  /**
   * The loading (accessible) label,
   * @see onPageChange
   */
  labelLoading?: string;

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
};

/**
 * Paginator component, can be used to show and manipulate information about the
 * current page and pages in a set of data.
 *
 * The `onPageChange` callback is debounced and provided a mechanism for a
 * spinner to appear during load (see docs).
 *
 * All labels that are passed to this component may contain the following
 * placeholders:
 *
 * - {count}
 * - {index}
 * - {page}
 * - {pageCount}
 * - {pageStart}
 * - {pageEnd}
 * - {pageSize}
 *
 * @param children
 * @param props
 * @constructor
 */
export const Paginator: React.FC<PaginatorProps> = ({
  count,
  labelCurrentPageRange = "{pageStart} - {pageEnd} of {pageCount}",
  labelGoToPage = "Go to",
  labelPageSize = "Show rows",
  labelPrevious = "Go to previous page",
  labelNext = "Go to next page",
  labelLoading,
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

  useEffect(() => setPageState(page), [page]);
  useEffect(() => setPageSizeState(pageSize), [pageSize]);

  /**
   * Denounces onPageChange callback.
   */
  useEffect(() => {
    const handler = () => {
      if (!onPageChange) {
        return;
      }
      const result = onPageChange(pageState);
      if (result) {
        setLoadingState(true);
      }
      Promise.resolve(result).finally(() => setLoadingState(false));
    };

    onPageChangeTimeoutRef.current &&
      clearTimeout(onPageChangeTimeoutRef.current);

    onPageChangeTimeoutRef.current = setTimeout(handler, 300);

    return () => clearTimeout(onPageChangeTimeoutRef.current);
  }, [pageState]);

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
  };

  /**
   * Gets called when the page input is changed.
   * @param event
   */
  const handlePageChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const value = parseInt(event.target.value);
    const sanitizedValue = Math.max(Math.min(value, pageCount), 1);
    setPageState(sanitizedValue);
  };

  /**
   * Gets called when the previous button is changed.
   */
  const handlePrevious: React.MouseEventHandler<HTMLButtonElement> = () => {
    const sanitizedValue = Math.max(pageState - 1, 1);
    setPageState(sanitizedValue);
  };

  /**
   * Gets called when the page input is changed.
   */
  const handleNext: React.MouseEventHandler<HTMLButtonElement> = () => {
    const sanitizedValue = Math.min(pageState + 1, pageCount);
    setPageState(sanitizedValue);
  };

  return (
    <nav className="mykn-paginator" {...props}>
      {pageSizeOptions.length > 0 && (
        <>
          <P>{formatMessage(labelPageSize, context)}</P>
          <Select
            options={pageSizeOptions}
            required={true}
            size="fit-content"
            value={pageSizeState}
            onChange={handlePageSizeChange}
          />
        </>
      )}

      <P>{formatMessage(labelGoToPage, context)}</P>
      <Input
        min={1}
        max={pageCount}
        size={String(pageCount).length}
        type="number"
        value={pageState}
        onChange={handlePageChange}
      ></Input>

      <P>{formatMessage(labelCurrentPageRange, context)}</P>
      <Button
        square
        variant="outline"
        aria-label={labelPrevious}
        onClick={handlePrevious}
      >
        <Outline.ChevronLeftIcon />
      </Button>
      <Button
        square
        variant="outline"
        aria-label={labelNext}
        onClick={handleNext}
      >
        <Outline.ChevronRightIcon />
      </Button>

      {labelLoading && (
        <Outline.ArrowPathIcon
          spin={true}
          aria-hidden={!loadingState}
          aria-label={loadingState ? labelLoading : ""}
          hidden={!loadingState}
        />
      )}
    </nav>
  );
};
