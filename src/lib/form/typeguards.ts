import {
  CheckboxProps,
  ChoiceFieldProps,
  DatePickerProps,
  InputProps,
  SelectProps,
} from "../../components";

export type FormField = DatePickerProps | InputProps | SelectProps;

/** Typeguard for CheckboxProps. */
export const isCheckbox = (props: FormField): props is CheckboxProps =>
  _isInput(props) &&
  (props.type === "checkbox" ||
    typeof props.checked !== "undefined" ||
    typeof props.defaultChecked !== "undefined");

/** Typeguard for DatePickerProps. */
export const isDatePicker = (props: FormField): props is DatePickerProps =>
  _isInput(props) && Boolean(props.type?.match("date"));

/**
 * Typeguard for InputProps.
 * TODO: KEEP IN SYNC WITH OTHER TYPEGUARDS!
 */
export const isInput = (props: FormField): props is InputProps =>
  _isInput(props) && !isCheckbox(props) && !isDatePicker(props);

/** Typeguard for ChoiceFieldProps. */
export const isChoiceField = (props: FormField): props is ChoiceFieldProps =>
  // @ts-expect-error - Check if exists.
  props?.options;

/** Typeguard for ChoiceFieldProps. */
export const isCheckboxGroup = (props: FormField): props is ChoiceFieldProps =>
  isChoiceField(props) && props?.type === "checkbox";

/**
 * Typeguard for InputProps.
 */
const _isInput = (props: FormField): props is InputProps =>
  !isChoiceField(props);
