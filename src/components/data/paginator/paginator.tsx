import React, { useEffect, useRef, useState } from "react";

import { ucFirst } from "../../../lib/format/string";
import { formatMessage } from "../../../lib/i18n/formatmessage";
import { useIntl } from "../../../lib/i18n/useIntl";
import { Button } from "../../button";
import { Input, Option, Select, SelectProps } from "../../form";
import { Outline } from "../../icon";
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

  const _labelGoToPage = labelGoToPage
    ? formatMessage(labelGoToPage, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Paginator.labelGoToPage",
          description:
            "mykn.components.Paginator: The go to page (accessible) label",
          defaultMessage: "naar pagina",
        },
        context,
      );

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

  // `loading` takes precedence over `loadingState` (derived from Promise).
  const isLoading = typeof loading === "boolean" ? loading : loadingState;

  return (
    <nav
      className="mykn-paginator"
      aria-label={ucFirst(_labelPagination)}
      {...props}
    >
      <div className="mykn-paginator__section mykn-paginator__section--form">
        {_labelLoading && (
          <Outline.ArrowPathIcon
            spin={true}
            aria-hidden={!isLoading}
            aria-label={isLoading ? ucFirst(_labelLoading) : ""}
            hidden={!isLoading}
          />
        )}

        {pageSizeOptions.length > 0 && (
          <>
            <P>{ucFirst(_labelPageSize)}</P>
            <Select
              options={pageSizeOptions}
              required={true}
              size="fit-content"
              value={pageSizeState}
              variant="transparent"
              onChange={handlePageSizeChange}
            />
          </>
        )}

        <P>{ucFirst(_labelGoToPage)}</P>
        <Input
          min={1}
          max={pageCount}
          size={String(pageCount).length}
          type="number"
          value={pageState}
          variant="transparent"
          onChange={handlePageChange}
        ></Input>
      </div>

      <div className="mykn-paginator__section mykn-paginator__section--navigate">
        <P>{ucFirst(_labelCurrentPageRange)}</P>
        <Button
          square
          variant="outline"
          aria-label={ucFirst(_labelPrevious)}
          onClick={handlePrevious}
        >
          <Outline.ChevronLeftIcon />
        </Button>
        <Button
          square
          variant="outline"
          aria-label={ucFirst(_labelNext)}
          onClick={handleNext}
        >
          <Outline.ChevronRightIcon />
        </Button>
      </div>
    </nav>
  );
};
