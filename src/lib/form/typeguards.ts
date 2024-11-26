import {
  CheckboxProps,
  ChoiceFieldProps,
  DatePickerProps,
  FormControlProps,
  InputProps,
  RadioProps,
  SelectProps,
} from "../../components";
import { DateInputProps } from "../../components/form/dateinput";
import { DateRangeInputProps } from "../../components/form/daterangeinput";

export type FormField =
  | DateInputProps
  | DateRangeInputProps
  | DatePickerProps
  | InputProps
  | SelectProps;

/**
 * Typeguard for CheckboxProps.
 */
export const isFormControl = (props: unknown): props is FormControlProps =>
  isCheckbox(props as CheckboxProps) ||
  isRadio(props as RadioProps) ||
  isDateInput(props as DateInputProps) ||
  isDatePicker(props as DatePickerProps) ||
  isChoiceField(props as ChoiceFieldProps) ||
  isInput(props as InputProps);

/** Typeguard for CheckboxProps. */
export const isCheckbox = (props: FormField): props is CheckboxProps =>
  _isInput(props) &&
  (props.type === "checkbox" ||
    typeof props.checked !== "undefined" ||
    typeof props.defaultChecked !== "undefined");

export const isRadio = (props: FormField): props is RadioProps =>
  _isInput(props) &&
  (props.type === "radio" ||
    typeof props.checked !== "undefined" ||
    typeof props.defaultChecked !== "undefined");

/** Typeguard for DateInputProps. */
export const isDateInput = (props: FormField): props is DateInputProps =>
  _isInput(props) && props.type === "date";

/** Typeguard for DateInputProps. */
export const isDateRangeInput = (
  props: FormField,
): props is DateRangeInputProps =>
  _isInput(props) && props.type === "daterange";

/** Typeguard for DatePickerProps. */
export const isDatePicker = (props: FormField): props is DatePickerProps =>
  _isInput(props) &&
  Boolean(props.type?.match("date") && props.type?.match("picker"));

/**
 * Typeguard for InputProps.
 * TODO: KEEP IN SYNC WITH OTHER TYPEGUARDS!
 */
export const isInput = (props: FormField): props is InputProps =>
  _isInput(props) &&
  !isCheckbox(props) &&
  !isDatePicker(props) &&
  !isRadio(props);

/** Typeguard for ChoiceFieldProps. */
export const isChoiceField = (props: FormField): props is ChoiceFieldProps =>
  // @ts-expect-error - Check if exists.
  props?.options;

/** Typeguard for ChoiceFieldProps. */
export const isCheckboxGroup = (props: FormField): props is ChoiceFieldProps =>
  isChoiceField(props) && props?.type === "checkbox";

export const isRadioGroup = (props: FormField): props is ChoiceFieldProps =>
  isChoiceField(props) && props?.type === "radio";

/**
 * Typeguard for InputProps.
 */
const _isInput = (props: FormField): props is InputProps =>
  !isChoiceField(props);
