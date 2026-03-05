import React, { useId } from "react";

import { gettextFirst } from "../../../lib";
import { Input, InputProps } from "../input";
import { Label } from "../label";
import "./toggle.scss";
import { TRANSLATIONS } from "./toggle.translations";

export type ToggleProps = {
  /** The (optional) label to display next to the toggle. */
  children?: React.ReactNode;

  /** The label shown inside the track when the toggle is off. Defaults to "uit"/"off". */
  labelOff?: string;

  type?: "toggle";
} & InputProps;

/**
 * Toggle component, renders a toggle backed by a checkbox input.
 * The sliding dot covers the non-active state label inside the track.
 * Supports all standard form behaviors (serialization, onChange, checked, etc.).
 * @param children
 * @param labelOn
 * @param labelOff
 * @param props
 * @constructor
 */
export const Toggle: React.FC<ToggleProps> = ({
  children,
  labelOff,
  value,
  onChange,
  type = "toggle",
  ...props
}) => {
  const id = useId();
  const _id = props.id || id;

  const _labelOff = gettextFirst(labelOff, TRANSLATIONS.LABEL_OFF);

  return (
    <div className="mykn-toggle">
      <Input
        id={_id}
        pad={false}
        value={value ?? "true"}
        onChange={onChange}
        type={type}
        {...props}
        // data-label-off is used in before element to render _labelOff
        data-label-off={_labelOff}
      />
      {children && (
        <Label bold={false} htmlFor={_id}>
          {children}
        </Label>
      )}
    </div>
  );
};
