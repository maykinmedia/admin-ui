import {
  FloatingContext,
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size,
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

import { Solid } from "../../icon";
import { eventFactory } from "../eventFactory";
import "./select.scss";

export type SelectProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Input name. */
  name: string;

  /** Can be used to generate `SelectOption` components from an array of objects. */
  options: Option[];

  /**
   * Get called when the selected option is changed
   *
   * A custom "change" event created with `detail` set to the selected option.
   * The event is dispatched on `fakeInputRef.current` setting `target` to a
   * native select (which in itself can be used to obtain the value without
   * the use of events).
   */
  onChange?: (event: Event) => void;

  /** Placeholder text. */
  placeholder?: string;

  value?: Option["value"] | null;
};

/**
 * A single (select) option, can be passed to `Select  as array.
 */
export type Option = {
  label: string;
  value?: React.OptionHTMLAttributes<HTMLOptionElement>["value"];
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
  name,
  options = [],
  onChange,
  placeholder = "",
  value = null,
  ...props
}) => {
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
      size({
        padding: 20,
      }),
    ],
  });

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const { getReferenceProps } = useInteractions([dismiss, role, click]);

  useEffect(() => {
    const index = options.findIndex((o) => o.value === value);
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
  const handleChange = (event: React.UIEvent, index: number) => {
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
      onChange && onChange(changeEvent);
    });
  };

  const selectedOptionLabel =
    selectedIndex !== null ? options[selectedIndex].label : undefined;

  const selectedOptionValue =
    selectedIndex !== null
      ? options[selectedIndex].value || selectedOptionLabel
      : "";

  return (
    <>
      <div
        className={clsx("mykn-select", {
          "mykn-select__label--selected": selectedIndex,
        })}
        tabIndex={0}
        ref={refs.setReference}
        aria-labelledby="select-label" // fixme
        aria-autocomplete="none"
        {...getReferenceProps()}
        {...props}
      >
        {/* This is here for compatibility with native forms, as well as a providing a target for change events. */}
        <select
          ref={fakeInputRef}
          name={name}
          value={selectedOptionValue}
          hidden={true}
        >
          {selectedOptionValue && (
            <option value={selectedOptionValue}>{selectedOptionLabel}</option>
          )}
        </select>

        <div className="mykn-select__label">
          {selectedOptionLabel || placeholder}
        </div>
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
  const listContentRef = React.useRef(options.map((o) => o.label));
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
