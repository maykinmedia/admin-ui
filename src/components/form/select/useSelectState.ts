import React, { useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "../../../hooks";
import { isPrimitive } from "../../../lib";
import { Option } from "../choicefield";
import { eventFactory } from "../eventFactory";
import { LoadOptionsFn, SelectProps } from "./select";

export type UseSelectStateProps = {
  /** Either a static array or an async loader. */
  options: SelectProps["options"];
  /** Controlled selected value(s). Values are the source of truth. */
  value: Option["value"] | Option | Array<Option["value"] | Option> | null;
  /** Enable multi-select behavior. */
  multiple: boolean;

  /** If true, perform an initial empty-query fetch on mount/open. */
  fetchOnMount?: boolean;
  /** Minimum characters before non-empty async queries fire. */
  minSearchChars?: number;
  /** Debounce in ms for the query used with loadOptions and local filtering. */
  searchDebounceMs?: number;

  /** Blur callback, receives a native-like FocusEvent dispatched on a hidden <select>. */
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  /** Change callback, receives a native-like ChangeEvent dispatched on a hidden <select>. */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

type HiddenSelectValue = string | string[];

export type UseSelectStateResult = {
  state: {
    /** True while an async fetch is in flight. */
    isLoading: boolean;
    /** Dropdown open state. */
    isOpen: boolean;
    /** Current options in view, from static or async source. */
    options: Option[];
    /** Current search input value. */
    search: string;
    /** Selected values (strings). */
    selectedValues: string[];
  };

  actions: {
    /** Clear all selections and dispatch change. */
    clear: () => void;
    /** Dispatch a blur event to the hidden select. */
    handleBlur: (evt: React.FocusEvent) => void;
    /** Commit a selection by option index or clear when index is null. Dispatches a change event. */
    handleChange: (evt: React.UIEvent, index: number | null) => void;
    /** Remove one value (multi only) and dispatch change. No-op in single mode. */
    removeValue: (val: string) => void;
    /** Control open state. */
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    /** Set search input value. */
    setSearch: React.Dispatch<React.SetStateAction<string>>;
  };

  meta: {
    /** Map from option value (or label fallback) to its first index. */
    getIndex: (v: string) => number | undefined;
    /** Map from option value (or label fallback) to its label. */
    getLabel: (v: string) => string;
  };

  hiddenSelectProps: {
    /** Whether multiple selection is enabled. */
    multiple: boolean;
    /** Ref to the hidden native select element. */
    ref: React.RefObject<HTMLSelectElement | null>;
    /** Current hidden select value(s). */
    value: HiddenSelectValue;
  };
};

/**
 * Select state and behaviors.
 *
 * Values are the source of truth. Indices are derived for UI navigation and styling.
 * Supports static and async options, debounced searching, and native-like events.
 */
export function useSelectState({
  options,
  value = null,
  multiple,
  fetchOnMount = false,
  minSearchChars = 2,
  searchDebounceMs = 250,
  onBlur,
  onChange,
}: UseSelectStateProps): UseSelectStateResult {
  const loadOptions: LoadOptionsFn | undefined =
    typeof options === "function" ? options : undefined;

  // Hidden native select reference used for event dispatch and form compatibility.
  const hiddenRef = useRef<HTMLSelectElement>(null);

  const lastQueryRef = useRef<string>("");
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);
  /** Cache for value tof label that survives option list changes. */
  const labelCacheRef = useRef<Map<string, string>>(new Map());

  const [isOpen, setIsOpen] = useState(false);

  /** Normalize value prop to string array for internal use. */
  const valueOrValuesToStringArray = (
    valueProp: UseSelectStateProps["value"],
  ): string[] => {
    if (valueProp == null) return [];

    const values = Array.isArray(valueProp) ? valueProp : [valueProp];

    return values
      .map(normalizeValue)
      .filter((v): v is string => typeof v === "string" && v.trim() !== "");
  };

  /** Normalize value prop to value for internal use. */
  const normalizeValue = (valueProp: Option["value"] | Option | null) => {
    if (valueProp === null || valueProp === undefined) return null;
    if (isPrimitive(valueProp)) return String(valueProp).trim();
    return String(valueProp.value).trim();
  };

  const initialFromOptions = !Array.isArray(options)
    ? null
    : (options.find((option) => option.selected)?.value ??
      options.find((option) => option.selected)?.label ??
      null);

  const [selectedValues, setSelectedValues] = useState<string[]>(
    valueOrValuesToStringArray(value ?? initialFromOptions),
  );

  const [optionsState, setOptionsState] = useState<Option[]>(
    loadOptions ? [] : (options as Option[]),
  );
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, searchDebounceMs);

  /** Mirror external value prop into internal selectedValues. */
  useEffect(() => {
    if (value !== null) {
      const next = valueOrValuesToStringArray(value);
      setSelectedValues((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next,
      );
    }
  }, [value]);

  /** Keep optionsState updated when not using async loading. Also learn labels from current options. */
  useEffect(() => {
    if (!loadOptions) setOptionsState(options as Option[]);
    const source = loadOptions ? optionsState : (options as Option[]);
    for (const option of source) {
      const key = String(option.value ?? option.label ?? "");
      const label = String(option.label ?? key);
      if (key && label) labelCacheRef.current.set(key, label);
    }
  }, [options, optionsState, loadOptions]);

  /**
   * Handle async option loading on open, mount, search change, or clearing.
   *
   * Conditions:
   * - Initial fetch when opened or on mount if fetchOnMount is true and not yet loaded.
   * - Search query length meets minSearchChars.
   * - Clearing search to empty when last query was non-empty.
   */
  useEffect(() => {
    if (!loadOptions) return;

    const searchQuery = debouncedSearch.trim();
    const shouldInitialFetch =
      (isOpen || fetchOnMount) && !hasLoadedRef.current;
    const shouldQuery = isOpen && searchQuery.length >= minSearchChars;
    const clearingToEmpty =
      isOpen && searchQuery === "" && lastQueryRef.current !== "";

    if (!shouldInitialFetch && !shouldQuery && !clearingToEmpty) return;

    setIsLoading(true);
    const id = ++requestIdRef.current;
    const query = shouldInitialFetch ? "" : clearingToEmpty ? "" : searchQuery;

    loadOptions(query)
      .then((opts) => {
        if (id !== requestIdRef.current) return;
        setOptionsState(opts);
        setIsLoading(false);
        hasLoadedRef.current = true;
        lastQueryRef.current = query;

        for (const option of opts) {
          const key = String(option.value ?? option.label ?? "");
          const label = String(option.label ?? key);
          if (key && label) labelCacheRef.current.set(key, label);
        }
      })
      .catch(() => {
        if (id !== requestIdRef.current) return;
        setOptionsState([]);
        setIsLoading(false);
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

    // Cache the label at the moment of selection
    if (selectedValue != null && index !== null) {
      const selectedLabel = String(optionsState[index]?.label ?? selectedValue);
      labelCacheRef.current.set(String(selectedValue), selectedLabel);
    }

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
      isLoading,
      isOpen,
      options: optionsState,
      search,
      selectedValues,
    },
    actions: {
      clear,
      handleBlur,
      handleChange,
      removeValue,
      setIsOpen,
      setSearch,
    },
    meta: {
      getIndex: (v: string) => valueMeta.get(v)?.index,
      getLabel: (v: string) => {
        // If value contains options, attempt to resolve the value based on them.
        if (Array.isArray(value)) {
          const options = value.filter((v): v is Option => !isPrimitive(v));
          const option = options.find((o) => o.value === v);
          if (option?.label) return option.label.toString();
        }

        // Use the cache to resolve seen labels.
        return labelCacheRef.current.get(v) ?? valueMeta.get(v)?.label ?? v;
      },
    },
    hiddenSelectProps: {
      multiple,
      ref: hiddenRef,
      value: hiddenValue,
    },
  };
}
