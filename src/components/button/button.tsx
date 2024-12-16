import clsx from "clsx";
import React, { LegacyRef } from "react";

import "./button.scss";

type BaseButtonProps = {
  active?: boolean;

  /** Aligns the contents based on the current direction. */
  align?: "start" | "center" | "end" | "space-between";

  /** Whether the text should be presented bold. */
  bold?: boolean;

  /** Additional class names. */
  className?: string;

  /** Whether the buttons width should be set to 100%. */
  justify?: boolean;

  /** Whether to set a minimum width of the button. */
  minWidth?: boolean;

  /** Whether the text should be presented in a lighter color. */
  muted?: boolean;

  /** Whether to apply padding to the button. */
  pad?: boolean | "h" | "v";

  /** Whether to the button should be rounded. */
  rounded?: boolean;

  /** The size. */
  size?: "xl" | "s" | "xs" | "xxs";

  /** Whether the button should be rendered in a square shape. */
  square?: boolean;

  /** The variant (style) of the button. */
  variant?:
    | "secondary"
    | "primary"
    | "outline"
    | "transparent"
    | "info"
    | "success"
    | "warning"
    | "danger";

  /** Whether wrapping should be allowed. */
  wrap?: boolean;

  /** Get called when the button is clicked. */
  onClick?: React.MouseEventHandler;
};

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> &
  BaseButtonProps;

export type ButtonLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick"
> &
  BaseButtonProps & {
    disabled?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      active = false,
      align = "center",
      bold = false,
      className,
      justify = false,
      minWidth = false,
      muted = false,
      pad = true,
      rounded = false,
      size = "s",
      square = false,
      variant = "secondary",
      wrap = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref as LegacyRef<HTMLButtonElement>}
        className={clsx(
          "mykn-button",
          `mykn-button--align-${align}`,
          `mykn-button--size-${size}`,
          `mykn-button--variant-${variant}`,
          {
            "mykn-button--active": active,
            "mykn-button--bold": bold,
            "mykn-button--justify": justify,
            "mykn-button--min-width": minWidth,
            "mykn-button--muted": muted,
            "mykn-button--pad-h": pad === true || pad === "h",
            "mykn-button--pad-v": pad === true || pad === "v",
            "mykn-button--rounded": rounded,
            "mykn-button--square": square,
            "mykn-button--wrap": wrap,
          },
          className,
        )}
        onClick={(e) => onClick?.(e)}
        {...props}
      >
        {props.children}
      </button>
    );
  },
);
Button.displayName = "Button";

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      active = false,
      align = "center",
      bold = false,
      className,
      disabled,
      justify = false,
      minWidth = false,
      muted = false,
      pad = true,
      size = "s",
      square = false,
      variant = "secondary",
      wrap = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <a
        ref={ref as LegacyRef<HTMLAnchorElement>}
        aria-disabled={disabled}
        className={clsx(
          "mykn-button",
          `mykn-button--align-${align}`,
          `mykn-button--size-${size}`,
          `mykn-button--variant-${variant}`,
          {
            "mykn-button--active": active,
            "mykn-button--bold": bold,
            "mykn-button--disabled": disabled,
            "mykn-button--justify": justify,
            "mykn-button--min-width": minWidth,
            "mykn-button--muted": muted,
            "mykn-button--pad-h": pad === true || pad === "h",
            "mykn-button--pad-v": pad === true || pad === "v",
            "mykn-button--square": square,
            "mykn-button--wrap": wrap,
          },
          className,
        )}
        onClick={(e) => onClick?.(e)}
        {...props}
      >
        {props.children}
      </a>
    );
  },
);
ButtonLink.displayName = "ButtonLink";
