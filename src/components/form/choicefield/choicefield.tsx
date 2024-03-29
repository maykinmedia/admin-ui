import React from "react";

import { CheckboxGroup, CheckboxGroupProps } from "../checkbox/checkboxgroup";
import { Select, SelectProps } from "../select";

export type ChoiceFieldProps<
  Element = HTMLDivElement,
  FormElement = HTMLSelectElement,
> = Omit<React.HTMLAttributes<Element>, "onChange"> & {
  /** Can be used to generate `SelectOption` components from an array of objects. */
  options: Option[];

  /** Form element name. */
  name?: string;

  /** Gets called when the input is blurred. */
  onBlur?: React.FormEventHandler<FormElement>;

  /**
   *
   * A custom "change" event created with `detail` set to the selected option.
   * The event is dispatched on `fakeInputRef.current` setting `target` to a
   * native select (which in itself can be used to obtain the value without
   * the use of events).
   */
  onChange?: React.ChangeEventHandler<FormElement>;

  value?: Option["value"] | null;

  /** The variant (style) of the form element. */
  variant?: "normal" | "transparent";
};
/**
 * A single (select) option, can be passed to `Select as array.
 */
export type Option<L = number | string, V = string | number | undefined> = {
  label: L;
  value?: V;
  selected?: React.OptionHTMLAttributes<HTMLOptionElement>["selected"]; // TODO
};

/**
 * Component provided form element(s) for `options` based on `type`.
 * @param type
 * @param props
 * @constructor
 */
export const ChoiceField: React.FC<
  ChoiceFieldProps & {
    /** Can be set to `checkbox` to render as checkbox group. */
    type?: "checkbox" | "select";
  }
> = ({ type, ...props }) => {
  if (type === "checkbox") {
    return <CheckboxGroup {...(props as CheckboxGroupProps)}></CheckboxGroup>;
  }
  return <Select {...(props as SelectProps)} />;
};
