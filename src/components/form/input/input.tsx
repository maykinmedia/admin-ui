import clsx from "clsx";
import React, { useEffect, useState } from "react";

import { eventFactory } from "../eventFactory";
import "./input.scss";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value"
> & {
  /** The variant (style) of the input. */
  variant?: "normal" | "transparent";

  /** Gets called when the value is changed */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  /** Input value. */
  value?: string | number;
};

/**
 * Input component
 * @param children
 * @param props
 * @constructor
 */
export const Input: React.FC<InputProps> = ({
  type = "text",
  value,
  variant = "normal",
  onChange,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [valueState, setValueState] = useState(value || "");

  /**
   * Syncs value state with value prop change.
   */
  useEffect(() => setValueState(value || ""), [value]);

  /**
   * Handles a change of value.
   * @param event
   */
  const _onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValueState(event.target.value);

    /*
     * Dispatch change event.
     *
     * A custom "change" event with `detail` set to the `event.target.value` is
     * dispatched on `input.current`.
     *
     * This aims to improve compatibility with various approaches to dealing
     * with forms.
     */
    const input = inputRef.current as HTMLInputElement;
    const detail = type === "file" ? input.files : event.target.value;
    const changeEvent = eventFactory("change", detail, true, false, false);
    input.dispatchEvent(changeEvent);
    onChange && onChange(event);
  };

  return (
    <input
      ref={inputRef}
      className={clsx("mykn-input", `mykn-input--variant-${variant}`)}
      type={type}
      value={valueState}
      onChange={_onChange}
      {...props}
    />
  );
};
