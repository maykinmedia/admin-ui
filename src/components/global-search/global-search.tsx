import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDebounce } from "../../hooks";
import { Input } from "../form";
import { Outline } from "../icon";
import { A, P } from "../typography";
import { Ol } from "../typography/ol";
import "./global-search.scss";

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
  /** Placeholder text shown inside the search input. Defaults to `"Search"` */
  placeholder?: string;

  /** Async function called with the current query string, expected to return a list of {@link SearchResult} items */
  search: (query: string) => Promise<SearchResult[]>;

  /** Called when the user selects a result, receives the result's `href` */
  onNavigate?: (href: string) => void;

  /** Additional CSS class name(s) applied to the root element */
  className?: string;

  /** Called when the user presses `Escape` or otherwise requests to close the search panel */
  onClose?: () => void;

  /** Initial value for the search input. Defaults to `""` */
  initialQuery?: string;

  /** Delay in milliseconds before the search function is called after the user stops typing. Defaults to `250` */
  debounceMs?: number;

  /** Text displayed when the search returns no results. Defaults to `"No results"` */
  noResultsLabel?: string;

  /** Displayed for the loading (aria) label */
  loadingLabel?: string;

  /** Labels for the keyboard shortcut hints at the bottom of the panel */
  keyboardLabels?: {
    select?: string;
    navigate?: string;
    close?: string;
  };
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
  placeholder = "Search",
  search,
  onNavigate,
  className,
  onClose,
  initialQuery = "",
  debounceMs = 250,
  noResultsLabel = "No results",
  loadingLabel = "Loading",
  keyboardLabels = {},
}) => {
  const {
    select = "Select",
    navigate = "Navigate",
    close = "Close",
  } = keyboardLabels;

  const [query, setQuery] = useState<string>(initialQuery);
  const debouncedQuery = useDebounce<string>(query, debounceMs);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const requestToken = useMemo(() => ({ id: 0 }), []);

  const nextRequestId = useCallback(() => {
    return ++requestToken.id;
  }, [requestToken]);

  useEffect(() => {
    itemsRef.current[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useEffect(() => {
    let mounted = true;
    const q = debouncedQuery.trim();
    const thisRequest = nextRequestId();

    setLoading(true);

    search(q)
      .then((res) => {
        if (!mounted || thisRequest !== requestToken.id) return;
        setResults(res);
        setSelected(0);
        setIsDirty(true);
      })
      .finally(() => {
        if (!mounted || thisRequest !== requestToken.id) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, search, requestToken, nextRequestId]);

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
            placeholder={placeholder}
            aria-label={placeholder}
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
            <Outline.ArrowPathIcon spin={true} aria-label={loadingLabel} />
          )}

          {showNoResults && (
            <P className="mykn-global-search__no-results">{noResultsLabel}</P>
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
            <P>{select}</P>
          </div>
          <div className="mykn-global-search__keyboard-item">
            <P bold>
              <Outline.ArrowUpIcon />
            </P>
            <P bold>
              <Outline.ArrowDownIcon />
            </P>
            <P>{navigate}</P>
          </div>
          <div className="mykn-global-search__keyboard-item">
            <P bold>esc</P>
            <P>{close}</P>
          </div>
        </div>
      </div>
    </div>
  );
};
