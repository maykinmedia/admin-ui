import { deprecated } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import { StackCtx } from "../../stackctx";
import { eventFactory } from "../eventFactory";
import "./input.scss";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange"
> & {
  /** @deprecated: REMOVE IN 4.0 - Use suffix instead. */
  icon?: React.ReactNode;

  /** Component to use as suffix, e.g. an icon. */
  suffix?: React.ReactNode;

  /** Input label. */
  label?: string;

  /** Whether to apply padding. */
  pad?: boolean | "h" | "v";

  /** The size. */
  size?: "xl" | "s" | "xs" | "xxs";

  /** The size attribute. */
  inputSize?: number;

  /** Input value. */
  value?: string | number;

  /** The variant (style) of the input. */
  variant?: "normal" | "transparent";

  /** Gets called when the value is changed */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  /**
   * Invalid input fields get additional markup/styling and aria tags to indicate the
   * invalid state.
   */
  invalid?: boolean;
};

/**
 * Input component
 * @param children
 * @param props
 * @constructor
 */
export const Input: React.FC<InputProps> = ({
  icon,
  suffix = icon,
  label = "",
  pad = true,
  size = "s",
  inputSize,
  type = "text",
  value,
  variant = "normal",
  onChange,
  invalid,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  deprecated(
    Boolean(icon),
    "icon",
    `mykn.components.Input: icon prop is deprecated, use suffix instead`,
  );

  /**
   * Handles a change of value.
   * @param event
   */
  const _onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
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
    const value = type === "file" ? input.files : event.target.value;
    const changeEvent = eventFactory("change", value, true, false, false);
    input.dispatchEvent(changeEvent);
    onChange?.(event);
  };

  // Setting the value prop directly (even to undefined) results in events reflecting it's value as the input value.
  // For checkboxes, this is problematic as it loses the "on" | "off" values.
  // This conditionalizes the presence of the "value" props.
  const valueProps =
    type.toLowerCase() === "checkbox" ||
    type.toLowerCase() === "radio" ||
    type.toLowerCase() === "toggle"
      ? typeof value === "undefined"
        ? {}
        : {
            value: value,
          }
      : {
          value: value,
        };

  // Normalize input type "toggle" to type "checkbox".
  // This needs to happen because "toggle" is not a valid input type.
  const inputType = type === "toggle" ? "checkbox" : type;

  const input = (
    <input
      ref={inputRef}
      className={clsx(
        "mykn-input",
        `mykn-input--variant-${variant}`,
        `mykn-input--size-${size}`,
        {
          "mykn-input--pad-h": pad === true || pad === "h",
          "mykn-input--pad-v": pad === true || pad === "v",
          [`mykn-input--toggle`]: type == "toggle",
        },
      )}
      size={inputSize}
      type={inputType}
      onChange={_onChange}
      aria-label={label || undefined}
      aria-invalid={invalid}
      {...valueProps}
      {...props}
    />
  );

  return suffix ? (
    <StackCtx>
      {input}
      {suffix}
    </StackCtx>
  ) : (
    input
  );
};
