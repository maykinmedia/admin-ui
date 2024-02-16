import { InputProps, SelectProps } from "../../components";

export type FormField = InputProps | SelectProps;

/**
 * Typeguard for InputProps.
 * TODO: KEEP IN SYNC WITH OTHER TYPEGUARDS!
 **/
export const isInput = (props: FormField): props is InputProps =>
  !isSelect(props);

/** Typeguard for SelectProps. */
export const isSelect = (props: FormField): props is SelectProps =>
  Object.prototype.hasOwnProperty.call(props, "options");
