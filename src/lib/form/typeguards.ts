import { ChoiceFieldProps, InputProps, SelectProps } from "../../components";

export type FormField = InputProps | SelectProps;

/**
 * Typeguard for InputProps.
 * TODO: KEEP IN SYNC WITH OTHER TYPEGUARDS!
 **/
export const isInput = (props: FormField): props is InputProps =>
  !isChoiceField(props);

/** Typeguard for ChoiceFieldProps. */
export const isChoiceField = (props: FormField): props is ChoiceFieldProps =>
  Object.prototype.hasOwnProperty.call(props, "options");

/** Typeguard for ChoiceFieldProps. */
export const isCheckboxGroup = (props: FormField): props is ChoiceFieldProps =>
  isChoiceField(props) &&
  Object.hasOwn(props, "type") &&
  // @ts-expect-error - "type" is set.
  props.type === "checkbox";
