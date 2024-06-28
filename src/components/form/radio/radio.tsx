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
export const Radio: React.FC<RadioProps> = ({
  children,
  value,
  checked,
  ...props
}) => {
  const id = useId();
  const _id = props.id || id;
  return (
    <div className="mykn-radio">
      <Input id={_id} {...props} type="radio" value={value} checked={checked} />
      {children && (
        <Label bold={false} htmlFor={_id}>
          {children}
        </Label>
      )}
    </div>
  );
};
