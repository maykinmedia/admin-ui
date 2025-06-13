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
import clsx from "clsx";
import React, { MouseEventHandler, useEffect } from "react";

import { gettextFirst, ucFirst } from "../../../lib";
import { Button } from "../../button";
import { Outline, Solid } from "../../icon";
import { ChoiceFieldProps, Option } from "../choicefield";
import { eventFactory } from "../eventFactory";
import "./select.scss";
import { TRANSLATIONS } from "./translations";

export type SelectProps = ChoiceFieldProps & {
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

  /** The clear value (accessible) label. */
  labelClear?: string;

  /** Disabled state */
  disabled?: boolean;

  /** allow selecting more than one option */
  multiple?: boolean;
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
  options = [],
  onBlur,
  onChange,
  label,
  labelClear,
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
  ...props
}) => {
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

  const fakeInputRef = React.useRef<HTMLSelectElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

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
          });
        },
      }),
    ],
  });

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const { getReferenceProps } = useInteractions([dismiss, role, click]);

  useEffect(() => {
    let indices: number[] = [];
    if (multiple && Array.isArray(value)) {
      indices = options
        .map((o, i) =>
          o.selected ||
          o.value?.toString() ===
            value.find((v) => v.toString() === o.value?.toString())
            ? i
            : -1,
        )
        .filter((i) => i !== -1);
    } else {
      const idx = options.findIndex(
        (o) =>
          o.selected ||
          (o.value
            ? o.value.toString() === value?.toString()
            : o.label === value),
      );
      if (idx !== -1) indices = [idx];
    }
    setSelectedIndices(indices);
  }, [value, options, multiple]);

  /**
   * Handles a blur.
   * @param event
   */
  const handleBlur = (event: React.FocusEvent) => {
    event.preventDefault();
    setTimeout(() => {
      const blurEvent = eventFactory("blur", undefined, false, false, false);
      fakeInputRef?.current?.dispatchEvent(blurEvent);
      onBlur?.(blurEvent as unknown as React.FocusEvent<HTMLSelectElement>);
    });
  };

  /**
   * Handles a change of the selected (option) index.
   * @param _
   * @param index
   */
  const handleChange = (_: React.UIEvent, index: number | null) => {
    const selectedOption = index !== null ? options[index] : null;

    // Multiple select, add/remove.
    if (multiple && index !== null) {
      const next = selectedIndices.includes(index)
        ? selectedIndices.filter((i) => i !== index) // Remove
        : [...selectedIndices, index]; // Add
      setSelectedIndices(next);
    }

    // Single
    else {
      setSelectedIndices(index !== null ? [index] : []); // To array.
      setIsOpen(false);
    }

    /*
     * Dispatch change event.
     *
     * A custom "change" event created with `detail` set to the selected option.
     * The event is dispatched on `fakeInputRef.current` setting `target` to a
     * native select (which in itself can be used to obtain the value without
     * the use of events).
     *
     * This aims to improve compatibility with various approaches of dealing
     * with forms.
     *
     * NOTE: Dispatching is delayed to allow React to `fakeInputRef.current`
     * before dispatching.
     */
    const fakeInput = fakeInputRef.current as HTMLSelectElement;
    setTimeout(() => {
      const changeEvent = eventFactory(
        "change",
        selectedOption,
        true,
        false,
        false,
      );
      fakeInput.dispatchEvent(changeEvent);
      onChange &&
        onChange(
          changeEvent as unknown as React.ChangeEvent<HTMLSelectElement>,
        );
    });
  };

  const selectValue = multiple
    ? selectedIndices.map((i) => String(options[i].value) ?? options[i].label)
    : selectedIndices[0] !== undefined && selectedIndices[0] !== null
      ? options[selectedIndices[0]].value
      : "";

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
            "mykn-select--selected": selectedIndices.length > 0,
            [`mykn-select--input-size-${inputSize}`]: inputSize,
          },
          className,
        )}
        tabIndex={0}
        ref={refs.setReference}
        aria-autocomplete="none"
        title={label || undefined}
        aria-hidden={hidden}
        aria-disabled={disabled}
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
        {/* This is here for compatibility with native forms, as well as a providing a target for change events. */}
        <select
          ref={fakeInputRef}
          disabled={disabled}
          form={form}
          hidden
          id={id}
          multiple={multiple}
          name={name}
          value={selectValue}
          // Silence React value without onChange error as this is deliberate.
          onChange={() => {}}
        >
          {options.map((opt, i) =>
            selectedIndices.includes(i) ? (
              <option key={i} value={opt.value ?? opt.label}>
                {opt.label}
              </option>
            ) : null,
          )}
        </select>

        <div className="mykn-select__label">
          {selectedIndices.length > 0 ? (
            selectedIndices.map((i) => {
              if (multiple) {
                return (
                  <span key={i} className="mykn-select__pill">
                    {options[i]?.label}
                    <Button
                      aria-label={`Remove ${options[i]?.label}`}
                      className="mykn-select__pill-remove"
                      variant="transparent"
                      size="xs"
                      onClick={(e) => handleChange(e, i)}
                    >
                      <Outline.XMarkIcon />
                    </Button>
                  </span>
                );
              }
              return options[i]?.label;
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
            onClick={(e) => handleChange(e, null)}
          >
            <Outline.XCircleIcon />
          </button>
        )}
        {icon || <Solid.ChevronDownIcon />}
      </div>

      <SelectDropdown
        ref={refs.setFloating}
        activeIndex={activeIndex}
        selectedIndices={selectedIndices}
        context={context}
        floatingStyles={floatingStyles}
        handleChange={handleChange}
        open={isOpen}
        options={options}
        portalRoot={refs.reference.current as HTMLDivElement}
        setActiveIndex={setActiveIndex}
        setSelectedIndices={setSelectedIndices}
      />
    </>
  );
};

export type SelectDropdownProps = React.PropsWithChildren<{
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  selectedIndices: number[];
  setSelectedIndices: (prev: (prev: number[]) => number[]) => void;
  context: FloatingContext;
  floatingStyles: React.CSSProperties;
  open: boolean;
  options: Option[];
  portalRoot: HTMLElement;
  handleChange: (event: React.UIEvent, index: number) => void;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
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
 * @param setSelectedIndices
 * @private
 * @constructor
 */
const BaseSelectDropdown: React.FC<SelectDropdownProps> = ({
  activeIndex,
  selectedIndices,
  context,
  floatingStyles,
  forwardedRef,
  handleChange,
  open,
  options = [],
  portalRoot,
  setActiveIndex,
  setSelectedIndices,
}) => {
  const isTypingRef = React.useRef(false);
  const nodeRef = React.useRef<HTMLDivElement[]>([]);

  const listRef = React.useRef<string[]>([]);
  useEffect(() => {
    listRef.current = options.map(({ label }) => label.toString());
  }, [options]);

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef: nodeRef,
    activeIndex,
    selectedIndex: selectedIndices[0] ?? null,
    onNavigate: setActiveIndex,
  });

  const typeahead = useTypeahead(context, {
    listRef: listRef,
    activeIndex,
    selectedIndex: selectedIndices[0] ?? null,
    onMatch: (index) => {
      if (open) {
        setActiveIndex(index);
      } else {
        toggleSelection(index);
      }
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

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const onClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    toggleSelection(index);
    handleChange(event, index);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter" || (event.key === " " && !isTypingRef.current)) {
      event.preventDefault();
      toggleSelection(index);
      handleChange(event, index);
    }
  };

  /**
   * Renders the `SelectOption` components
   */
  const renderOptions = () =>
    options.map(({ label, value }, i) => (
      <SelectOption
        key={`${label}-${value || label}`}
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
    ));

  return (
    open && (
      <FloatingPortal root={portalRoot}>
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={forwardedRef}
            className="mykn-select__dropdown"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {renderOptions()}
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
 * Select option  component
 * Wraps `BaseSelectOption` with `React.forwardRef`
 * @private
 */
export const SelectOption = React.forwardRef<HTMLDivElement, OptionProps>(
  ({ children, ...props }, ref) => (
    <BaseSelectOption forwardedRef={ref} {...props}>
      {children}
    </BaseSelectOption>
  ),
);
