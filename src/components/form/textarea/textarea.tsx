import clsx from "clsx";
import React from "react";

import { StackCtx } from "../../stackctx";
import { eventFactory } from "../eventFactory";
import "./textarea.scss";

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "value" | "onChange"
> & {
  /** Component to use as icon. */
  icon?: React.ReactNode;

  /** Textarea label. */
  label?: string;

  /** Whether to apply padding. */
  pad?: boolean | "h" | "v";

  /** The size. */
  size?: "xl" | "s" | "xs" | "xxs";

  /** Form element type. */
  type?: "textarea";

  /** Textarea value. */
  value?: string | number;

  /** The variant (style) of the textarea. */
  variant?: "normal" | "transparent";

  /** Gets called when the value is changed */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

/**
 * Textarea component
 * @param children
 * @param props
 * @constructor
 */
export const Textarea: React.FC<TextareaProps> = ({
  icon,
  label = "",
  pad = true,
  size = "s",
  variant = "normal",
  onChange,
  ...props
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  /**
   * Handles a change of value.
   * @param event
   */
  const _onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    /*
     * Dispatch change event.
     *
     * A custom "change" event with `detail` set to the `event.target.value` is
     * dispatched on `textarea.current`.
     *
     * This aims to improve compatibility with various approaches to dealing
     * with forms.
     */
    const textarea = textareaRef.current as HTMLTextAreaElement;
    const value = event.target.value;
    const changeEvent = eventFactory("change", value, true, false, false);
    textarea.dispatchEvent(changeEvent);
    onChange && onChange(event);
  };

  const textarea = (
    <textarea
      ref={textareaRef}
      className={clsx(
        "mykn-textarea",
        `mykn-textarea--variant-${variant}`,
        `mykn-textarea--size-${size}`,
        {
          "mykn-textarea--pad-h": pad === true || pad === "h",
          "mykn-textarea--pad-v": pad === true || pad === "v",
        },
      )}
      onChange={_onChange}
      aria-label={label || undefined}
      {...props}
    />
  );

  return icon ? (
    <StackCtx>
      {textarea}
      {icon}
    </StackCtx>
  ) : (
    textarea
  );
};
