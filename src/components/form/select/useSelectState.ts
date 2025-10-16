import React, { useEffect, useMemo, useRef, useState } from "react";

import { Option } from "../choicefield";
import { eventFactory } from "../eventFactory";
import { LoadOptionsFn, SelectProps } from "./select";

export interface UseSelectStateProps {
  /** Either a static array or an async loader. */
  options: SelectProps["options"];
  /** Controlled selected value(s). Values are the source of truth. */
  value: string | number | Array<string | number> | null;
  /** Enable multi-select behavior. */
  multiple: boolean;
  /** Change callback, receives a native-like ChangeEvent dispatched on a hidden <select>. */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Blur callback, receives a native-like FocusEvent dispatched on a hidden <select>. */
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  /** If true, perform an initial empty-query fetch on mount/open. */
  fetchOnMount?: boolean;
  /** Debounce in ms for the query used with loadOptions and local filtering. */
  searchDebounceMs?: number;
  /** Minimum characters before non-empty async queries fire. */
  minSearchChars?: number;
}

type HiddenSelectValue = string | string[];

export interface UseSelectStateResult {
  /** Grouped state for clarity. */
  state: {
    /** Dropdown open state. */
    isOpen: boolean;
    /** Selected values (strings). */
    selectedValues: string[];
    /** Current options in view, from static or async source. */
    options: Option[];
    /** True while an async fetch is in flight. */
    isLoading: boolean;
    /** Current search input value. */
    search: string;
  };

  /** Grouped actions for clarity. */
  actions: {
    /** Control open state. */
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    /** Set search input value. */
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    /** Commit a selection by option index or clear when index is null. Dispatches a change event. */
    handleChange: (evt: React.UIEvent, index: number | null) => void;
    /** Dispatch a blur event to the hidden select. */
    handleBlur: (evt: React.FocusEvent) => void;
    /** Clear all selections and dispatch change. */
    clear: () => void;
    /** Remove one value (multi only) and dispatch change. No-op in single mode. */
    removeValue: (val: string) => void;
  };

  /** Helpers that avoid leaking internal maps. */
  meta: {
    /** Map from option value (or label fallback) to its first index. */
    getIndex: (v: string) => number | undefined;
    /** Map from option value (or label fallback) to its label. */
    getLabel: (v: string) => string;
  };

  /** Hidden native select props used for event dispatch and form compatibility. */
  hiddenSelectProps: {
    ref: React.RefObject<HTMLSelectElement | null>;
    value: HiddenSelectValue;
    multiple: boolean;
  };
}

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

/**
 * Select state and behaviors.
 *
 * Values are the source of truth. Indices are derived for UI navigation and styling.
 * Supports static and async options, debounced searching, and native-like events.
 */
export function useSelectState({
  options,
  value,
  multiple,
  onChange,
  onBlur,
  fetchOnMount = false,
  searchDebounceMs = 250,
  minSearchChars = 2,
}: UseSelectStateProps): UseSelectStateResult {
  const loadOptions: LoadOptionsFn | undefined =
    typeof options === "function" ? options : undefined;

  // Hidden native select reference used for event dispatch and form compatibility.
  const hiddenRef = useRef<HTMLSelectElement>(null);

  const lastQueryRef = useRef<string>("");
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);

  const [isOpen, setIsOpen] = useState(false);

  const toStringArray = (value: UseSelectStateProps["value"]): string[] =>
    Array.isArray(value)
      ? value.map(String)
      : value != null
        ? [String(value)]
        : [];

  const [selectedValues, setSelectedValues] = useState<string[]>(
    toStringArray(value),
  );

  // Options and loading state
  const [optionsState, setOptionsState] = useState<Option[]>(
    loadOptions ? [] : (options as Option[]),
  );
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, searchDebounceMs);

  /** Mirror external value prop into internal selectedValues. */
  useEffect(() => {
    const next = toStringArray(value);
    setSelectedValues((prev) =>
      prev.length === next.length && prev.every((v, i) => v === next[i])
        ? prev
        : next,
    );
  }, [value]);

  /** Keep optionsState updated when not using async loading. */
  useEffect(() => {
    if (!loadOptions) setOptionsState(options as Option[]);
  }, [options, loadOptions]);

  useEffect(() => {
    if (!loadOptions) return;

    const searchQuery = debouncedSearch.trim();
    const shouldInitialFetch =
      (isOpen || fetchOnMount) && !hasLoadedRef.current;
    const shouldQuery =
      searchQuery.length >= (searchQuery ? minSearchChars : 0);
    const clearingToEmpty = searchQuery === "" && lastQueryRef.current !== "";

    if (!shouldInitialFetch && !shouldQuery && !clearingToEmpty) return;

    setIsLoading(true);
    const id = ++requestIdRef.current;
    const query = shouldInitialFetch ? "" : clearingToEmpty ? "" : searchQuery;

    loadOptions(query, (opts) => {
      if (id !== requestIdRef.current) return; // stale
      setOptionsState(opts);
      setIsLoading(false);
      hasLoadedRef.current = true;
      lastQueryRef.current = query;
    });
  }, [isOpen, fetchOnMount, debouncedSearch, minSearchChars, loadOptions]);

  /** Internal meta map for value -> { index, label }. */
  const valueMeta = useMemo(() => {
    const map = new Map<string, { index: number; label: string }>();
    optionsState.forEach((o, i) => {
      const key = String(o.value ?? o.label ?? "");
      const label = String(o.label ?? "");
      if (!map.has(key)) map.set(key, { index: i, label: label });
    });
    return map;
  }, [optionsState]);

  /** Convert an absolute index to its value, falling back to label when value is undefined. */
  const indexToValue = (i: number): string => {
    const option = optionsState[i];
    return option?.value != null
      ? String(option.value)
      : String(option?.label ?? "");
  };

  /**
   * Dispatch a blur event to the hidden select to mimic native inputs and notify external handlers.
   */
  const handleBlur = (event: React.FocusEvent): void => {
    event.preventDefault();
    setTimeout(() => {
      const blurEvent = eventFactory("blur", undefined, false, false, false);
      hiddenRef.current?.dispatchEvent(blurEvent);
      onBlur?.(blurEvent as unknown as React.FocusEvent<HTMLSelectElement>);
    });
  };

  /**
   * Toggle or set selection based on the given option index.
   * Pass null to clear. Always dispatches a change event on the hidden select.
   */
  const handleChange = (_evt: React.UIEvent, index: number | null): void => {
    const selectedValue = index !== null ? indexToValue(index) : null;

    if (multiple) {
      if (selectedValue === null) {
        setSelectedValues([]);
      } else {
        setSelectedValues((prev) =>
          prev.includes(selectedValue)
            ? prev.filter((v) => v !== selectedValue)
            : [...prev, selectedValue],
        );
      }
    } else {
      setSelectedValues(selectedValue ? [selectedValue] : []);
      setIsOpen(false);
    }

    const option = index !== null ? optionsState[index] : null;
    const element = hiddenRef.current;
    if (!element) return;

    setTimeout(() => {
      const changeEvent = eventFactory("change", option, true, false, false);
      element.dispatchEvent(changeEvent);
      onChange?.(
        changeEvent as unknown as React.ChangeEvent<HTMLSelectElement>,
      );
    });
  };

  /** Clear all selections and dispatch change. */
  const clear = (): void => {
    if (selectedValues.length === 0) return;
    setSelectedValues([]);
    const element = hiddenRef.current;
    if (!element) return;
    setTimeout(() => {
      const changeEvent = eventFactory("change", null, true, false, false);
      element.dispatchEvent(changeEvent);
      onChange?.(
        changeEvent as unknown as React.ChangeEvent<HTMLSelectElement>,
      );
    });
  };

  /** Remove one value (multi only) and dispatch change. */
  const removeValue = (val: string): void => {
    if (!multiple) return;
    const next = (prev: string[]) => prev.filter((v) => v !== val);
    setSelectedValues(next);
    const element = hiddenRef.current;
    if (!element) return;
    setTimeout(() => {
      const changeEvent = eventFactory("change", null, true, false, false);
      element.dispatchEvent(changeEvent);
      onChange?.(
        changeEvent as unknown as React.ChangeEvent<HTMLSelectElement>,
      );
    });
  };

  const hiddenValue: HiddenSelectValue = multiple
    ? selectedValues
    : (selectedValues[0] ?? "");

  return {
    state: {
      isOpen,
      selectedValues,
      options: optionsState,
      isLoading,
      search,
    },
    actions: {
      setIsOpen,
      setSearch,
      handleChange,
      handleBlur,
      clear,
      removeValue,
    },
    meta: {
      getIndex: (v: string) => valueMeta.get(v)?.index,
      getLabel: (v: string) => valueMeta.get(v)?.label ?? v,
    },
    hiddenSelectProps: {
      ref: hiddenRef,
      value: hiddenValue,
      multiple,
    },
  };
}
