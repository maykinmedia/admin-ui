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
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { gettextFirst } from "../../../lib";
import { Button } from "../../button";
import { Outline, Solid } from "../../icon";
import { ChoiceFieldProps, Option } from "../choicefield";
import { Input } from "../input";
import "./select.scss";
import { TRANSLATIONS } from "./select.translations";
import { useSelectState } from "./useSelectState";

export type LoadOptionsFn = (
  inputValue: string,
  callback: (options: Option[]) => void,
) => void;

/**
 * Select component, aims to be compatible with native change event and FormData
 * serialization.
 * @param children
 * @param options
 * @param props
 * @constructor
 */
export type SelectProps = Omit<ChoiceFieldProps, "variant" | "options"> & {
  /** Component to use as icon. */
  icon?: React.ReactNode;
  /** Whether to apply padding. */
  pad?: boolean | "h" | "v";
  /** Placeholder text. */
  placeholder?: string;
  /** Can be set to `fit-content` to apply auto sizing based on content width. */
  inputSize?: "fit-content";
  /** The size. */
  size?: "xl" | "s" | "xs" | "xxs";

  /** Disabled state */
  disabled?: boolean;
  /** allow selecting more than one option */
  multiple?: boolean;
  /** The variant (style) of the form element. */
  variant?: "normal" | "primary" | "secondary" | "accent" | "transparent";
  /** Options for the select. Can be a function for async loading. */
  options: Option[] | LoadOptionsFn; // TODO: Cache async options? LRU? Research
  /** If true, fetch on mount rather than on open */
  fetchOnMount?: boolean;
  /** Debounce for search (ms). */
  searchDebounceMs?: number;
  /** Minimum characters before async search triggers. */
  minSearchChars?: number;

  /** i18n labels */
  labelClear?: string;
  labelNoOptions?: string;
  placeholderSearch?: string;
  ariaClearSearch?: string;
  ariaRemoveValue?: string;
  ariaLoading?: string;
};

/**
 * Select component, aims to be compatible with native change event and FormData
 * serialization.
 * @param children
 * @param options
 * @param props
 * @constructor
 */
export const Select: React.FC<SelectProps> = ({
  className,
  icon,
  id,
  hidden,
  name,
  options,
  onBlur,
  onChange,
  label,
  pad = true,
  placeholder = "",
  required = false,
  size = "s",
  inputSize,
  value = null,
  variant = "normal",
  form,
  disabled = false,
  multiple = false,
  fetchOnMount = false,
  searchDebounceMs = 250,
  minSearchChars = 2,
  labelClear,
  labelNoOptions,
  placeholderSearch,
  ariaClearSearch,
  ariaLoading,
  ariaRemoveValue,
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
          // Override floating ui behavior for remove/close buttons.
          if (target.classList.contains("mykn-icon")) {
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
              const opt = optionsState.find(
                (o) => String(o.value ?? o.label) === String(val),
              );
              const labelText = opt?.label ?? val;

              if (multiple) {
                return (
                  <span key={val} className="mykn-select__pill">
                    {labelText}
                    <Button
                      aria-label={ucFirst(
                        gettextFirst(
                          ariaRemoveValue,
                          TRANSLATIONS.ARIA_REMOVE_VALUE,
                          { value: String(labelText) },
                        ),
                      )}
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
              return labelText;
            })
          ) : (
            <span className="mykn-select__placeholder">{placeholder}</span>
          )}
        </div>
        {!required && (
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
        ref={refs.setFloating}
        activeIndex={activeIndex}
        context={context}
        floatingStyles={floatingStyles}
        handleChange={handleChange}
        open={isOpen}
        options={optionsState}
        portalRoot={refs.reference.current as HTMLDivElement}
        setActiveIndex={setActiveIndex}
        isLoading={isLoading}
        isAsync={isAsync}
        search={search}
        setSearch={setSearch}
        selectedValues={selectedValues}
        getIndex={getIndex}
        labelNoOptions={_labelNoOptions}
        placeholderSearch={_placeholderSearch}
        ariaClearSearch={_ariaClearSearch}
        ariaLoading={_ariaLoading}
      />
    </>
  );
};

export type SelectDropdownProps = React.PropsWithChildren<{
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  context: FloatingContext;
  floatingStyles: React.CSSProperties;
  open: boolean;
  options: Option[];
  portalRoot: HTMLElement;
  handleChange: (event: React.UIEvent, index: number) => void;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  isLoading?: boolean;
  isAsync: boolean;
  search: string;
  setSearch: (s: string) => void;
  selectedValues: string[];
  getIndex: (v: string) => number | undefined;
  labelNoOptions: string;
  placeholderSearch: string;
  ariaClearSearch: string;
  ariaLoading: string;
}>;

/**
 * Base select dropdown component.
 * @param activeIndex
 * @param selectedIndices
 * @param context
 * @param floatingStyles
 * @param forwardedRef
 * @param handleChange
 * @param open
 * @param options
 * @param portalRoot
 * @param setActiveIndex
 * @param isAsync
 * @param isLoading
 * @param setSearch
 * @param search
 * @param selectedValues
 * @param getIndex
 * @param placeholderSearch
 * @param ariaClearSearch
 * @param ariaLoading
 * @param labelNoOptions
 * @private
 * @constructor
 */
const BaseSelectDropdown: React.FC<SelectDropdownProps> = ({
  activeIndex,
  context,
  floatingStyles,
  forwardedRef,
  handleChange,
  open,
  options = [],
  portalRoot,
  setActiveIndex,
  isAsync,
  isLoading,
  setSearch,
  search,
  selectedValues,
  getIndex,
  labelNoOptions,
  placeholderSearch,
  ariaClearSearch,
  ariaLoading,
}) => {
  const isTypingRef = useRef(false);
  const nodeRef = useRef<HTMLDivElement[]>([]);

  const listRef = useRef<string[]>([]);
  useEffect(() => {
    listRef.current = options.map((o) => String(o.label ?? ""));
  }, [options]);

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

  const onClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    handleChange(event, index);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter" || (event.key === " " && !isTypingRef.current)) {
      event.preventDefault();
      handleChange(event, index);
    }
  };

  return (
    open && (
      <FloatingPortal root={portalRoot}>
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={forwardedRef}
            className="mykn-select__dropdown"
            role="listbox"
            style={floatingStyles}
          >
            {isAsync && (
              <div className="mykn-select__search">
                <Input // TODO: investigate custom input inside of the dropdown input itself rather than separate
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={ucFirst(placeholderSearch)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearch("");
                      e.stopPropagation();
                    }
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex(0);
                    }
                    // Prevent typeahead from intercepting typing in the input.
                    if (
                      e.key.length === 1 ||
                      e.key === "Backspace" ||
                      e.key === "Delete"
                    ) {
                      e.stopPropagation();
                    }
                  }}
                />
                <Button
                  type="button"
                  className="mykn-select__search-clear"
                  aria-label={ucFirst(ariaClearSearch)}
                  variant="transparent"
                  size="xs"
                  onClick={() => {
                    setSearch("");
                    setActiveIndex(0);
                  }}
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
                <div
                  className="mykn-select__no-results"
                  role="status"
                  aria-live="polite"
                >
                  {ucFirst(labelNoOptions)}
                </div>
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
                      onClick: (e) => onClick(e, i),
                      onKeyDown: (e) => onKeyDown(e, i),
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
  selected?: boolean;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
};

/**
 * Base select option component
 * @param active
 * @param selected
 * @param children
 * @param forwardedRef
 * @param props
 * @private
 * @constructor
 */
const BaseSelectOption: React.FC<OptionProps> = ({
  active = false,
  selected = false,
  children,
  forwardedRef,
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
