import React, { useId } from "react";

import { Input, InputProps } from "../input";
import { Label } from "../label";
import "./checkbox.scss";

export type CheckboxProps = InputProps & {
  /** The (optional) label to display next to the checkbox. */
  children: React.ReactNode;
};

/**
 * Checkbox component
 * @param children
 * @param props
 * @constructor
 */
export const Checkbox: React.FC<CheckboxProps> = ({ children, ...props }) => {
  const id = useId();
  const _id = props.id || id;
  return (
    <div className="mykn-checkbox">
      <Input id={_id} {...props} type="checkbox" />
      {children && (
        <Label bold={false} htmlFor={_id}>
          {children}
        </Label>
      )}
    </div>
  );
};
