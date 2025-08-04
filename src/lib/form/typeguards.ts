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
import { TextareaProps } from "../../components/form/textarea";
import { FieldType } from "../data";

export type FormField =
  | CheckboxProps
  | RadioProps
  | ChoiceFieldProps
  | DateInputProps
  | DateRangeInputProps
  | DatePickerProps
  | InputProps
  | SelectProps
  | TextareaProps;

/**
 * Return the <FormControl /> type basd on the `fieldType`.
 * @param fieldType
 */
export function getFormFieldTypeByFieldType(fieldType: "boolean"): "checkbox";
export function getFormFieldTypeByFieldType(fieldType: "date"): "date";
export function getFormFieldTypeByFieldType(
  fieldType: "daterange",
): "daterange";
export function getFormFieldTypeByFieldType(fieldType: "number"): "number";
export function getFormFieldTypeByFieldType(fieldType: "string"): "text";
export function getFormFieldTypeByFieldType(fieldType: "text"): "textarea";
export function getFormFieldTypeByFieldType(fieldType: "null"): "text";
export function getFormFieldTypeByFieldType(fieldType: "jsx"): "text";
export function getFormFieldTypeByFieldType(
  fieldType: FieldType,
): FormControlProps["type"];
export function getFormFieldTypeByFieldType(
  fieldType: FieldType,
): FormControlProps["type"] {
  switch (fieldType) {
    case "boolean":
      return "checkbox";
    case "date":
    case "daterange":
    case "number":
      return fieldType;
    case "text":
      return "textarea";

    case "string":
    default:
      return "text";
  }
}

/**
 * Typeguard for CheckboxProps.
 */
export const isFormControl = (props: unknown): props is FormControlProps =>
  isCheckbox(props as CheckboxProps) ||
  isRadio(props as RadioProps) ||
  isDateInput(props as DateInputProps) ||
  isDatePicker(props as DatePickerProps) ||
  isChoiceField(props as ChoiceFieldProps) ||
  isTextarea(props as TextareaProps) ||
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
 */
export const isTextarea = (props: FormField): props is TextareaProps =>
  props.type === "textarea" || "cols" in props || "rows" in props;

/**
 * Typeguard for InputProps.
 * TODO: KEEP IN SYNC WITH OTHER TYPEGUARDS!
 */
export const isInput = (props: FormField): props is InputProps =>
  _isInput(props) &&
  !isCheckbox(props) &&
  !isDatePicker(props) &&
  !isRadio(props) &&
  !isTextarea(props);

/**
 * Typeguard for InputProps.
 * TODO: KEEP IN SYNC WITH OTHER TYPEGUARDS!
 */
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
