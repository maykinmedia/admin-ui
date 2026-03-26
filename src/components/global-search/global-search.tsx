import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "../../hooks";
import { gettextFirst } from "../../lib";
import { Input } from "../form";
import { Outline } from "../icon";
import { A, P } from "../typography";
import { Ol } from "../typography/ol";
import "./global-search.scss";
import { TRANSLATIONS } from "./translations";

export type SearchResult = {
  /** The main label displayed for this result */
  title: React.ReactNode;

  /** The URL this result links to, used for navigation */
  href: string;

  /** Optional secondary text shown below the title */
  subtitle?: React.ReactNode;

  /** Optional group name used to visually cluster related results together */
  group?: string;

  /** Optional icon displayed to the left of the result. Defaults to a chevron icon */
  icon?: React.ReactNode;
};

export type GlobalSearchProps = {
  /** Async function called with the current query string, expected to return a list of {@link SearchResult} items. Receives an {@link AbortSignal} that is aborted when a newer search is triggered */
  search: (
    query: string,
    options: { signal: AbortSignal },
  ) => Promise<SearchResult[]>;

  /** Additional CSS class name(s) applied to the root element */
  className?: string;

  /** Delay in milliseconds before the search function is called after the user stops typing. Defaults to `250` */
  debounceMs?: number;

  /** Initial value for the search input. Defaults to `""` */
  initialQuery?: string;

  /** Labels for the keyboard shortcut hints at the bottom of the panel */
  keyboardLabels?: {
    select?: string;
    navigate?: string;
    close?: string;
  };

  /** Displayed for the loading (aria) label */
  loadingLabel?: string;

  /** Text displayed when the search returns no results */
  noResultsLabel?: string;

  /** Placeholder text shown inside the search input */
  placeholder?: string;

  /** Called when the user presses `Escape` or otherwise requests to close the search panel */
  onClose?: () => void;

  /** Called when the user selects a result, receives the result's `href` */
  onNavigate?: (href: string) => void;
};

/**
 * A keyboard-navigable, grouped search panel
 *
 * Renders a search input that calls the provided `search` function as the user
 * types (debounced), then displays the results grouped by their `group` field
 *
 * @example
 * <GlobalSearch
 *   placeholder="Search..."
 *   search={async (q) => fetchResults(q)}
 *   onNavigate={(href) => router.push(href)}
 *   onClose={() => setOpen(false)}
 * />
 */
export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder,
  search,
  onNavigate,
  className,
  onClose,
  initialQuery = "",
  debounceMs = 250,
  noResultsLabel,
  loadingLabel,
  keyboardLabels = {},
}) => {
  const _placeholder = gettextFirst(
    placeholder,
    TRANSLATIONS.LABEL_PLACEHOLDER,
  );
  const _noResultsLabel = gettextFirst(
    noResultsLabel,
    TRANSLATIONS.LABEL_NO_RESULTS,
  );
  const _loadingLabel = gettextFirst(loadingLabel, TRANSLATIONS.LABEL_LOADING);
  const _select = gettextFirst(
    keyboardLabels.select,
    TRANSLATIONS.LABEL_SELECT,
  );
  const _navigate = gettextFirst(
    keyboardLabels.navigate,
    TRANSLATIONS.LABEL_NAVIGATE,
  );
  const _close = gettextFirst(keyboardLabels.close, TRANSLATIONS.LABEL_CLOSE);

  const [query, setQuery] = useState<string>(initialQuery);
  const debouncedQuery = useDebounce<string>(query, debounceMs);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    itemsRef.current[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const q = debouncedQuery.trim();
    setLoading(true);

    search(q, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;
        setResults(res);
        setSelected(0);
        setIsDirty(true);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    const order: string[] = [];
    for (const r of results) {
      const key = r.group ?? "default";
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)!.push(r);
    }
    return { map, order };
  }, [results]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, Math.max(0, results.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(0, s - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const chosen = results[selected];
        if (chosen) onNavigate?.(chosen.href);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, selected, onNavigate, onClose]);

  const showSpinner = loading && !isDirty;
  const showNoResults = !loading && isDirty && results.length === 0;

  return (
    <div className={clsx("mykn-global-search", className)}>
      <div className="mykn-global-search__panel">
        <div className="mykn-global-search__input">
          <Input
            icon={<Outline.MagnifyingGlassIcon />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder={_placeholder}
            aria-label={_placeholder}
          />
        </div>

        <div
          className={clsx("mykn-global-search__results", {
            "mykn-global-search__results--empty": showNoResults || showSpinner,
          })}
          role="region"
          aria-live="polite"
          aria-busy={loading}
        >
          {showSpinner && (
            <Outline.ArrowPathIcon spin={true} aria-label={_loadingLabel} />
          )}

          {showNoResults && (
            <P className="mykn-global-search__no-results">{_noResultsLabel}</P>
          )}

          <Ol listStyle="none" inline={false}>
            {grouped.order.map((groupName) => {
              const items = grouped.map.get(groupName) ?? [];
              return (
                <li key={groupName} className="mykn-global-search__group">
                  <P className="mykn-global-search__group-header" bold>
                    {groupName}
                  </P>
                  <ul
                    className="mykn-global-search__list"
                    role="listbox"
                    aria-label={groupName}
                  >
                    {items.map((r) => {
                      const absoluteIndex = results.indexOf(r);
                      const isSelected = absoluteIndex === selected;
                      return (
                        <li
                          key={r.href + absoluteIndex}
                          ref={(el) => {
                            itemsRef.current[absoluteIndex] = el;
                          }}
                          className={clsx("mykn-global-search__item", {
                            "mykn-global-search__item--selected": isSelected,
                          })}
                          onClick={() => onNavigate?.(r.href)}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <A
                            href={r.href}
                            textDecoration="none"
                            onClick={(e) => e.preventDefault()}
                          >
                            <div className="mykn-global-search__item-content">
                              {r.icon ?? <Outline.ChevronRightIcon />}
                              <div className="mykn-global-search__item-body">
                                <P className="mykn-global-search__item-title">
                                  {r.title}
                                </P>
                                {r.subtitle && (
                                  <P className="mykn-global-search__item-subtitle">
                                    {r.subtitle}
                                  </P>
                                )}
                              </div>
                              <div
                                className="mykn-global-search__item-go"
                                aria-hidden
                              >
                                <Outline.ArrowTurnDownLeftIcon />
                              </div>
                            </div>
                          </A>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </Ol>
        </div>

        <div className="mykn-global-search__keyboard">
          <div className="mykn-global-search__keyboard-item">
            <P bold>
              <Outline.ArrowTurnDownLeftIcon />
            </P>
            <P>{_select}</P>
          </div>
          <div className="mykn-global-search__keyboard-item">
            <P bold>
              <Outline.ArrowUpIcon />
            </P>
            <P bold>
              <Outline.ArrowDownIcon />
            </P>
            <P>{_navigate}</P>
          </div>
          <div className="mykn-global-search__keyboard-item">
            <P bold>esc</P>
            <P>{_close}</P>
          </div>
        </div>
      </div>
    </div>
  );
};
