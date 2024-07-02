import React, { useId } from "react";

import { Input, InputProps } from "../input";
import { Label } from "../label";
import "./radio.scss";

export type RadioProps = InputProps & {
  /** The (optional) label to display next to the checkbox. */
  children?: React.ReactNode;
};

/**
 * Radio component, similar to Input with type set to "radio" but allows children to be passed
 * to show an inline label.
 * @param children
 * @param props
 * @constructor
 */
export const Radio: React.FC<RadioProps> = ({ children, value, ...props }) => {
  const id = useId();
  const _id = props.id || id;
  const _props = value ? { ...props, value } : props;
  return (
    <div className="mykn-radio">
      <Input id={_id} {..._props} type="radio" />
      {children && (
        <Label bold={false} htmlFor={_id}>
          {children}
        </Label>
      )}
    </div>
  );
};
