import {
  FloatingContext,
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { ucFirst } from "@maykin-ui/client-common";
import clsx from "clsx";
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { gettextFirst } from "../../../lib";
import { Button } from "../../button";
import { Outline, Solid } from "../../icon";
import { P } from "../../typography";
import { ChoiceFieldProps, Option } from "../choicefield";
import { Input } from "../input";
import "./select.scss";
import { TRANSLATIONS } from "./select.translations";
import { useSelectState } from "./useSelectState";

export type LoadOptionsFn = (inputValue: string) => Promise<Option[]>;

/**
 * Select component, aims to be compatible with native change event and FormData
 * serialization.
 * @param children
 * @param options
 * @param props
 * @constructor
 */
export type SelectProps = Omit<ChoiceFieldProps, "variant" | "options"> & {
  /** Options for the select. Can be a function for async loading. */
  options: Option[] | LoadOptionsFn; // TODO: Cache async options? LRU? Research

  /** Can be set to `fit-content` to apply auto sizing based on content width. */
  inputSize?: "fit-content";
  /** Component to use as icon. */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** allow selecting more than one option */
  multiple?: boolean;
  /** Whether to apply padding. */
  pad?: boolean | "h" | "v";
  /** Placeholder text. */
  placeholder?: string;
  /** The size. */
  size?: "xl" | "s" | "xs" | "xxs";
  /** The variant (style) of the form element. */
  variant?: "normal" | "primary" | "secondary" | "accent" | "transparent";
  /** Value of the form element */
  value?: Option["value"] | Option | Array<Option["value"] | Option> | null;
  /** If true, fetch on mount rather than on open */
  fetchOnMount?: boolean;
  /** Minimum characters before async search triggers. */
  minSearchChars?: number;
  /** Debounce for search (ms). */
  searchDebounceMs?: number;

  /** i18n labels */
  ariaClearSearch?: string;
  ariaLoading?: string;
  ariaRemoveValue?: string;
  labelClear?: string;
  labelNoOptions?: string;
  placeholderSearch?: string;
};

/**
 * Select component, aims to be compatible with native change event and FormData
 * serialization.
 * @param options
 * @param className
 * @param disabled
 * @param form
 * @param hidden
 * @param icon
 * @param id
 * @param inputSize
 * @param label
 * @param multiple
 * @param name
 * @param pad
 * @param placeholder
 * @param required
 * @param size
 * @param variant
 * @param value
 * @param fetchOnMount
 * @param minSearchChars
 * @param searchDebounceMs
 * @param ariaClearSearch
 * @param ariaLoading
 * @param ariaRemoveValue
 * @param labelClear
 * @param labelNoOptions
 * @param placeholderSearch
 * @param onBlur
 * @param onChange
 * @param props
 * @constructor
 */
export const Select: React.FC<SelectProps> = ({
  options,
  className,
  disabled = false,
  form,
  hidden,
  icon,
  id,
  inputSize,
  label,
  multiple = false,
  name,
  pad = true,
  placeholder = "",
  required = false,
  size = "s",
  value = null,
  variant = "normal",
  fetchOnMount = false,
  minSearchChars = 2,
  searchDebounceMs = 250,
  ariaClearSearch,
  ariaLoading,
  ariaRemoveValue,
  labelClear,
  labelNoOptions,
  placeholderSearch,
  onBlur,
  onChange,
  ...props
}) => {
  const isAsync = typeof options === "function";

  const i18nContext = {
    name: name || "",
    placeholder: placeholder,
    required,
    value: (Array.isArray(value) ? value.join(", ") : value) as string,
    variant,
  };

  const _labelClear = gettextFirst(
    labelClear,
    TRANSLATIONS.LABEL_CLEAR,
    i18nContext,
  );
  const _labelNoOptions = gettextFirst(
    labelNoOptions,
    TRANSLATIONS.LABEL_NO_OPTIONS,
    i18nContext,
  );
  const _placeholderSearch = gettextFirst(
    placeholderSearch,
    TRANSLATIONS.PLACEHOLDER_SEARCH,
    i18nContext,
  );
  const _ariaClearSearch = gettextFirst(
    ariaClearSearch,
    TRANSLATIONS.ARIA_CLEAR_SEARCH,
    i18nContext,
  );
  const _ariaLoading = gettextFirst(
    ariaLoading,
    TRANSLATIONS.ARIA_LOADING,
    i18nContext,
  );
  const _ariaRemoveValue = ucFirst(
    gettextFirst(ariaRemoveValue, TRANSLATIONS.ARIA_REMOVE_VALUE),
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const {
    state: { isOpen, selectedValues, options: optionsState, isLoading, search },
    actions: {
      setIsOpen,
      setSearch,
      handleChange,
      handleBlur,
      clear,
      removeValue,
    },
    meta: { getIndex, getLabel },
    hiddenSelectProps,
  } = useSelectState({
    options,
    value,
    multiple,
    onChange,
    onBlur,
    fetchOnMount,
    searchDebounceMs,
    minSearchChars,
  });

  // Floating UI
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip(),
      sizeMiddleware({
        padding: 20,
        apply({ availableWidth, availableHeight, elements }) {
          // Change styles, e.g.
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(0, availableWidth)}px`,
            maxHeight: `${Math.max(0, availableHeight)}px`,
            ["--mykn-select-dropdown-max-h"]: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
    ],
  });

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const { getReferenceProps } = useInteractions([dismiss, role, click]);

  const { onMouseDown, ...referenceProps } = getReferenceProps();

  return (
    <>
      <div
        className={clsx(
          "mykn-select",
          `mykn-select--variant-${variant} mykn-select--size-${size}`,
          {
            "mykn-select--multiple": multiple,
            "mykn-select--pad-h": pad === true || pad === "h",
            "mykn-select--pad-v": pad === true || pad === "v",
            "mykn-select--selected": selectedValues.length > 0,
            [`mykn-select--input-size-${inputSize}`]: inputSize,
          },
          className,
        )}
        tabIndex={0}
        ref={refs.setReference}
        aria-autocomplete="none"
        aria-disabled={disabled}
        aria-hidden={hidden}
        title={label || undefined}
        onBlur={handleBlur}
        {...referenceProps}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;

          // If clicking clear button, always force close
          if (target.closest(".mykn-select__clear")) {
            e.stopPropagation();
            setIsOpen(false);
            return;
          }

          (onMouseDown as MouseEventHandler)(e);
        }}
        {...props}
      >
        {/* This is here for compatibility with native forms, as well as providing a target for change events. */}
        <select
          {...hiddenSelectProps}
          disabled={disabled}
          form={form}
          hidden
          id={id}
          name={name}
          // Silence React value without onChange error as this is deliberate.
          onChange={() => {}}
        >
          {multiple
            ? selectedValues.map((val) => (
                <option key={val} value={val}>
                  {getLabel(val)}
                </option>
              ))
            : selectedValues[0] != null && (
                <option value={selectedValues[0]}>
                  {getLabel(selectedValues[0])}
                </option>
              )}
        </select>

        <div className="mykn-select__label">
          {selectedValues.length > 0 ? (
            selectedValues.map((val) => {
              const label = getLabel(val);

              if (multiple) {
                return (
                  <span key={val} className="mykn-select__pill">
                    {label}
                    <Button
                      aria-label={_ariaRemoveValue.replace("{value}", label)} // Fixme: using gettextFirst causes possibly inconsistent hook count here.
                      className="mykn-select__pill-remove"
                      variant="transparent"
                      size="xs"
                      onClick={() => {
                        const idx = getIndex(String(val));
                        if (idx != null) {
                          handleChange({} as React.UIEvent, idx);
                        } else {
                          removeValue(String(val));
                        }
                      }}
                    >
                      <Outline.XMarkIcon />
                    </Button>
                  </span>
                );
              }
              return label;
            })
          ) : (
            <span className="mykn-select__placeholder">{placeholder}</span>
          )}
        </div>
        {!required && selectedValues.length > 0 && (
          <button
            className="mykn-select__clear"
            type="button"
            aria-label={ucFirst(_labelClear)}
            onClick={() => clear()}
          >
            <Outline.XCircleIcon />
          </button>
        )}
        {icon || <Solid.ChevronDownIcon />}
      </div>

      <SelectDropdown
        activeIndex={activeIndex}
        context={context}
        floatingStyles={floatingStyles}
        getIndex={getIndex}
        isAsync={isAsync}
        open={isOpen}
        options={optionsState}
        portalRoot={refs.reference.current as HTMLDivElement}
        search={search}
        selectedValues={selectedValues}
        setActiveIndex={setActiveIndex}
        setSearch={setSearch}
        ariaClearSearch={_ariaClearSearch}
        ariaLoading={_ariaLoading}
        labelNoOptions={_labelNoOptions}
        placeholderSearch={_placeholderSearch}
        handleChange={handleChange}
        ref={refs.setFloating}
        isLoading={isLoading}
      />
    </>
  );
};

export type SelectDropdownProps = React.PropsWithChildren<{
  activeIndex: number | null;
  context: FloatingContext;
  floatingStyles: React.CSSProperties;
  getIndex: (v: string) => number | undefined;
  isAsync: boolean;
  open: boolean;
  options: Option[];
  portalRoot: HTMLElement;
  search: string;
  selectedValues: string[];
  setActiveIndex: (index: number | null) => void;
  setSearch: (s: string) => void;
  ariaClearSearch: string;
  ariaLoading: string;
  labelNoOptions: string;
  placeholderSearch: string;
  handleChange: (event: React.UIEvent, index: number) => void;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  isLoading?: boolean;
}>;

/**
 * Base select dropdown component.
 * @param activeIndex
 * @param context
 * @param floatingStyles
 * @param getIndex
 * @param isAsync
 * @param open
 * @param options
 * @param portalRoot
 * @param search
 * @param selectedValues
 * @param setActiveIndex
 * @param setSearch
 * @param ariaClearSearch
 * @param ariaLoading
 * @param labelNoOptions
 * @param placeholderSearch
 * @param handleChange
 * @param forwardedRef
 * @param isLoading
 * @private
 * @constructor
 */
const BaseSelectDropdown: React.FC<SelectDropdownProps> = ({
  activeIndex,
  context,
  floatingStyles,
  getIndex,
  isAsync,
  open,
  options = [],
  portalRoot,
  search,
  selectedValues,
  setActiveIndex,
  setSearch,
  ariaClearSearch,
  ariaLoading,
  labelNoOptions,
  placeholderSearch,
  handleChange,
  forwardedRef,
  isLoading,
}) => {
  const isTypingRef = useRef(false);
  const nodeRef = useRef<HTMLDivElement[]>([]);

  const listRef = useRef<string[]>([]);

  useEffect(() => {
    listRef.current = options.map((o) => String(o.label ?? ""));
  }, [options]);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const inputWasFocusedRef = useRef(false);

  const focusSearchInput = () => {
    const el = searchContainerRef.current?.querySelector("input");
    el?.focus();
  };

  useEffect(() => {
    if (open && isAsync) {
      queueMicrotask(focusSearchInput);
    }
  }, [open, isAsync]);

  // if input was focused before, re-focus after options change or loading flips
  useEffect(() => {
    if (open && isAsync && inputWasFocusedRef.current) {
      queueMicrotask(focusSearchInput);
    }
  }, [open, isAsync, options, isLoading]);

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const selectedIndices = useMemo(
    () =>
      selectedValues
        .map((v) => getIndex(String(v)))
        .filter((i): i is number => i != null),
    [selectedValues, getIndex],
  );

  const listNav = useListNavigation(context, {
    listRef: nodeRef,
    activeIndex,
    selectedIndex: selectedIndices[0] ?? null,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef,
    activeIndex,
    selectedIndex: selectedIndices[0] ?? null,
    onMatch: (matchIndex) => {
      setActiveIndex(matchIndex);
    },
    onTypingChange(isTyping) {
      isTypingRef.current = isTyping;
    },
  });

  const { getFloatingProps, getItemProps } = useInteractions([
    dismiss,
    role,
    listNav,
    typeahead,
    click,
  ]);

  /**
   * Handles mouse clicks on an option.
   *
   * @param event
   * @param index
   * @return void
   */
  const handleOptionClick = useCallback(
    (event: React.MouseEvent, index: number) => {
      event.preventDefault();
      handleChange(event, index);
    },
    [handleChange],
  );

  /**
   * Handles keyboard interactions for option elements inside the dropdown.
   *
   * @param event
   * @param index
   * @return void
   */
  const handleOptionKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (
        event.key === "Enter" ||
        (event.key === " " && !isTypingRef.current)
      ) {
        event.preventDefault();
        handleChange(event, index);
        return;
      }
    },
    [handleChange],
  );

  /**
   * Handles key presses within the async search input.
   *
   * @param e
   * @return void
   */
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Escape":
          setSearch("");
          e.stopPropagation();
          break;

        case "ArrowDown":
          e.preventDefault();
          setActiveIndex(0);
          break;

        case "Backspace":
        case "Delete":
          e.stopPropagation();
          break;

        default:
          if (e.key.length === 1) e.stopPropagation();
          break;
      }
    },
    [setSearch, setActiveIndex],
  );

  const handleClearSearch = useCallback(() => {
    setSearch("");
    focusSearchInput();
  }, [setSearch]);

  return (
    open && (
      <FloatingPortal root={portalRoot}>
        <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
          <div
            ref={forwardedRef}
            className="mykn-select__dropdown"
            role="listbox"
            style={floatingStyles}
          >
            {isAsync && (
              <div className="mykn-select__search" ref={searchContainerRef}>
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={ucFirst(placeholderSearch)}
                  onKeyDown={handleInputKeyDown}
                  onFocus={() => {
                    inputWasFocusedRef.current = true;
                  }}
                  onBlur={() => {
                    inputWasFocusedRef.current = false;
                  }}
                />
                <Button
                  type="button"
                  className="mykn-select__search-clear"
                  aria-label={ucFirst(ariaClearSearch)}
                  variant="transparent"
                  size="xs"
                  onClick={handleClearSearch}
                >
                  <Outline.XMarkIcon />
                </Button>
              </div>
            )}

            <div className="mykn-select__options" {...getFloatingProps()}>
              {isLoading ? (
                <div
                  className="mykn-select__loading"
                  role="status"
                  aria-live="polite"
                  aria-label={ucFirst(ariaLoading)}
                >
                  <Outline.ArrowPathIcon spin={true} aria-hidden="true" />
                </div>
              ) : options.length === 0 ? (
                <P
                  className="mykn-select__no-results"
                  role="status"
                  aria-live="polite"
                  muted
                >
                  {ucFirst(labelNoOptions)}
                </P>
              ) : (
                options.map(({ label, value }, i) => (
                  <SelectOption
                    key={value ?? i}
                    ref={(node) => {
                      if (node) nodeRef.current[i] = node;
                    }}
                    active={i === activeIndex}
                    selected={selectedIndices.includes(i)}
                    tabIndex={i === activeIndex ? 0 : -1}
                    {...getItemProps({
                      onClick: (e) => handleOptionClick(e, i),
                      onKeyDown: (e) => handleOptionKeyDown(e, i),
                    })}
                  >
                    {label}
                  </SelectOption>
                ))
              )}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    )
  );
};

/**
 * Select dropdown component
 * Wraps `BaseSelectDropdown` with `React.forwardRef`.
 * @private
 */
const SelectDropdown = React.forwardRef<HTMLDivElement, SelectDropdownProps>(
  (props, ref) => <BaseSelectDropdown forwardedRef={ref} {...props} />,
);

export type OptionProps = React.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  selected?: boolean;
};

/**
 * Base select option component
 * @param active
 * @param children
 * @param forwardedRef
 * @param selected
 * @param props
 * @private
 * @constructor
 */
const BaseSelectOption: React.FC<OptionProps> = ({
  active = false,
  children,
  forwardedRef,
  selected = false,
  ...props
}) => (
  <div
    ref={forwardedRef}
    className={clsx("mykn-option", {
      "mykn-option--active": active,
    })}
    aria-selected={selected}
    {...props}
  >
    {children}
  </div>
);

/**
 * Select option component
 * Wraps `BaseSelectOption` with `React.forwardRef`.
 * @private
 */
export const SelectOption = React.forwardRef<HTMLDivElement, OptionProps>(
  ({ children, ...props }, ref) => (
    <BaseSelectOption forwardedRef={ref} {...props}>
      {children}
    </BaseSelectOption>
  ),
);
