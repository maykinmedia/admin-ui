import React, { useId } from "react";

import { Input, InputProps } from "../input";
import { Label } from "../label";
import "./checkbox.scss";

export type CheckboxProps = InputProps & {
  /** The (optional) label to display next to the checkbox. */
  children?: React.ReactNode;
};

/**
 * Checkbox component, similar to Input with type set to "checkbox" but allows children to be passed
 * to show an inline label.
 * @param children
 * @param props
 * @constructor
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  value,
  ...props
}) => {
  const id = useId();
  const _id = props.id || id;
  const _props = value ? { ...props, value } : props;
  return (
    <div className="mykn-checkbox">
      <Input id={_id} {..._props} type="checkbox" />
      {children && (
        <Label bold={false} htmlFor={_id}>
          {children}
        </Label>
      )}
    </div>
  );
};
