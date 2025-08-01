import React from "react";

import { CheckboxGroup, CheckboxGroupProps } from "../checkbox/checkboxgroup";
import { RadioGroup, RadioGroupProps } from "../radio";
import { Select, SelectProps } from "../select";

export type ChoiceFieldProps<
  Element = HTMLDivElement,
  FormElement = HTMLSelectElement,
> = Omit<React.HTMLAttributes<Element>, "onChange" | "value"> & {
  /** Can be used to generate `SelectOption` components from an array of objects. */
  options: Option[];

  /** The associated form's id. */
  form?: string;

  /** The (accessible) label .*/
  label?: string;

  /** Form element name. */
  name?: string;

  /** Whether a value is required. */
  required?: boolean;

  /** Form element type. */
  type?: string;

  /** Value of the form element */
  value?: Option["value"] | null;

  /** The variant (style) of the form element - omitted and replaced in Select. */
  variant?: "normal" | "transparent";

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

  /** Disabled state. */
  disabled?: boolean;
};
/**
 * A single (select) option, can be passed to `Select as array.
 */
export type Option<L = number | string, V = string | number | undefined> = {
  label: L;
  value?: V;

  /** (Managed) Checkbox/Select */
  selected?: boolean;

  /** Unmanaged checkbox */
  defaultChecked?: boolean;
};

/**
 * Component provided form element(s) for `options` based on `type`.
 * @param type
 * @param props
 * @constructor
 */
export const ChoiceField: React.FC<ChoiceFieldProps> = ({ type, ...props }) => {
  if (type === "checkbox") {
    return <CheckboxGroup {...(props as CheckboxGroupProps)}></CheckboxGroup>;
  }
  if (type === "radio") {
    return <RadioGroup {...(props as RadioGroupProps)}></RadioGroup>;
  }
  return <Select {...(props as SelectProps)} />;
};
