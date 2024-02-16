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
import React, { useEffect } from "react";

import { ucFirst } from "../../../lib/format/string";
import { formatMessage } from "../../../lib/i18n/formatmessage";
import { useIntl } from "../../../lib/i18n/useIntl";
import { Outline, Solid } from "../../icon";
import { eventFactory } from "../eventFactory";
import "./select.scss";

export type SelectProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  /** Can be used to generate `SelectOption` components from an array of objects. */
  options: Option[];

  /** Select label. */
  label?: string;

  /** Select name. */
  name?: string;

  /**
   * Gets called when the selected option is changed
   *
   * A custom "change" event created with `detail` set to the selected option.
   * The event is dispatched on `fakeInputRef.current` setting `target` to a
   * native select (which in itself can be used to obtain the value without
   * the use of events).
   */
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;

  /** Placeholder text. */
  placeholder?: string;

  /** Whether a value is required, a required select can't be cleared. */
  required?: boolean;

  /** Can be set to `fit-content` to apply auto sizing based on content width. */
  size?: "fit-content";

  value?: Option["value"] | null;

  /** The variant (style) of the input. */
  variant?: "normal" | "transparent";

  /** The clear value (accessible) label. */
  labelClear?: string;
};

/**
 * A single (select) option, can be passed to `Select  as array.
 */
export type Option<
  L = number | string,
  V = React.OptionHTMLAttributes<HTMLOptionElement>["value"],
> = {
  label: L;
  value?: V;
  selected?: React.OptionHTMLAttributes<HTMLOptionElement>["selected"]; // TODO
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
  id,
  name,
  options = [],
  onChange,
  label = "",
  labelClear = "",
  placeholder = "",
  required = false,
  size,
  value = null,
  variant = "normal",
  ...props
}) => {
  const intl = useIntl();
  const i18nContext = {
    name: name || "",
    placeholder: placeholder,
    required,
    value: (Array.isArray(value) ? value.join(", ") : value) as string,
    variant,
  };
  const _labelClear = labelClear
    ? formatMessage(labelClear, i18nContext)
    : intl.formatMessage({
        description: "components.Select: The clear value (accessible) label",
        defaultMessage: "waarde wissen",
      });

  const fakeInputRef = React.useRef<HTMLSelectElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

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
      }),
    ],
  });

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const { getReferenceProps } = useInteractions([dismiss, role, click]);

  useEffect(() => {
    const index = options.findIndex((o) =>
      o.value ? o.value === value : o.label === value,
    );

    if (index === -1) {
      return;
    }
    setSelectedIndex(index);
  }, [value]);

  /**
   * Handles a change of the selected (option) index.
   * @param event
   * @param index
   */
  const handleChange = (event: React.UIEvent, index: number | null) => {
    const selectedOption = index !== null ? options[index] : null;

    setSelectedIndex(index);
    setIsOpen(false);

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

  const selectedOptionLabel =
    selectedIndex !== null ? options[selectedIndex].label : undefined;

  const selectedOptionValue =
    selectedIndex !== null
      ? Object.prototype.hasOwnProperty.call(options[selectedIndex], "value")
        ? options[selectedIndex].value
        : selectedOptionLabel
      : "";

  return (
    <>
      <div
        className={clsx("mykn-select", `mykn-select--variant-${variant}`, {
          "mykn-select--selected": selectedIndex,
          [`mykn-select--size-${size}`]: size,
        })}
        tabIndex={0}
        ref={refs.setReference}
        title={label || undefined}
        aria-autocomplete="none"
        {...getReferenceProps()}
        {...props}
      >
        {/* This is here for compatibility with native forms, as well as a providing a target for change events. */}
        <select
          id={id}
          ref={fakeInputRef}
          name={name}
          defaultValue={selectedOptionValue}
          hidden={true}
          aria-label=""
        >
          {(selectedOptionValue && (
            <option value={selectedOptionValue}>{selectedOptionLabel}</option>
          )) || <option value=""></option>}
        </select>

        <div className="mykn-select__label">
          {selectedOptionLabel || placeholder}
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
        <Solid.ChevronDownIcon />
      </div>

      <FloatingPortal root={refs.reference.current as HTMLDivElement}>
        <SelectDropdown
          ref={refs.setFloating}
          activeIndex={activeIndex}
          selectedIndex={selectedIndex}
          context={context}
          floatingStyles={floatingStyles}
          handleChange={handleChange}
          open={isOpen}
          options={options}
          setActiveIndex={setActiveIndex}
          setSelectedIndex={setSelectedIndex}
        />
      </FloatingPortal>
    </>
  );
};

export type SelectDropdownProps = React.PropsWithChildren<{
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  context: FloatingContext;
  open: boolean;
  floatingStyles: React.CSSProperties;
  handleChange: (event: React.UIEvent, index: number) => void;
  options: Option[];
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
}>;

/**
 * Base select dropdown component.
 * @param activeIndex
 * @param selectedIndex
 * @param context
 * @param floatingStyles
 * @param forwardedRef
 * @param handleChange
 * @param open
 * @param options
 * @param setActiveIndex
 * @param setSelectedIndex
 * @private
 * @constructor
 */
const BaseSelectDropdown: React.FC<SelectDropdownProps> = ({
  activeIndex,
  selectedIndex,
  context,
  floatingStyles,
  forwardedRef,
  handleChange,
  open,
  options = [],
  setActiveIndex,
  setSelectedIndex,
}) => {
  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const listContentRef = React.useRef(options.map((o) => String(o.label)));
  const isTypingRef = React.useRef(false);

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
  });

  const typeahead = useTypeahead(context, {
    listRef: listContentRef,
    activeIndex,
    selectedIndex,
    onMatch: open ? setActiveIndex : setSelectedIndex,
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
   * Index "click" event handler.
   * @param event
   * @param index
   */
  const onClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    handleChange(event, index);
  };

  /**
   * Indexed "keydown" event handler.
   * @param event
   * @param index
   */
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleChange(event, index);
    }

    if (event.key === " " && !isTypingRef.current) {
      event.preventDefault();
      handleChange(event, index);
    }
  };

  /**
   * Renders the `SelectOption` components
   */
  const renderOptions = () =>
    options.map(({ label }, i) => (
      <SelectOption
        key={label}
        ref={(node) => {
          listRef.current[i] = node;
        }}
        active={i === activeIndex}
        selected={i === selectedIndex}
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
      <FloatingPortal>
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
