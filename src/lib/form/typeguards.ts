import {
  CheckboxProps,
  ChoiceFieldProps,
  InputProps,
  SelectProps,
} from "../../components";

export type FormField = InputProps | SelectProps;

/** Typeguard for CheckboxProps. */
export const isCheckbox = (props: FormField): props is CheckboxProps =>
  isInput(props) &&
  (props.type === "checkbox" ||
    typeof props.checked !== "undefined" ||
    typeof props.defaultChecked !== "undefined");

/**
 * Typeguard for InputProps.
 * TODO: KEEP IN SYNC WITH OTHER TYPEGUARDS!
 */
export const isInput = (props: FormField): props is InputProps =>
  !isChoiceField(props);

/** Typeguard for ChoiceFieldProps. */
export const isChoiceField = (props: FormField): props is ChoiceFieldProps =>
  // @ts-expect-error - Check if exists.
  props?.options;

/** Typeguard for ChoiceFieldProps. */
export const isCheckboxGroup = (props: FormField): props is ChoiceFieldProps =>
  // @ts-expect-error - Check if exists.
  isChoiceField(props) && props?.type === "checkbox";
