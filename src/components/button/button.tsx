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

  /** Whether the text should be presented in a lighter color. */
  muted?: boolean;

  /** Whether to apply padding to the button. */
  pad?: boolean | "h" | "v";

  /** The size of the text. */
  size?: "s" | "xs";

  /** Whether the button should be rendered in a square shape. */
  square?: boolean;

  /** The variant (style) of the button. */
  variant?: "primary" | "secondary" | "outline" | "transparent";

  /** Whether wrapping should be allowed. */
  wrap?: boolean;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  BaseButtonProps;

export type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  BaseButtonProps;

/**
 * Button component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      active = false,
      align = "center",
      bold = false,
      className,
      justify = false,
      muted = false,
      pad = true,
      size = "s",
      square = false,
      variant = "primary",
      wrap = true,
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
            "mykn-button--muted": muted,
            "mykn-button--pad-h": pad === true || pad === "h",
            "mykn-button--pad-v": pad === true || pad === "v",
            "mykn-button--square": square,
            "mykn-button--wrap": wrap,
          },
          className,
        )}
        {...props}
      >
        {props.children}
      </button>
    );
  },
);
Button.displayName = "Button";

/**
 * Button (link) )component
 */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      active = false,
      align = "center",
      bold = false,
      className,
      justify = false,
      muted = false,
      pad = true,
      size = "s",
      square = false,
      variant = "primary",
      wrap = true,
      ...props
    },
    ref,
  ) => {
    return (
      <a
        ref={ref as LegacyRef<HTMLAnchorElement>}
        className={
          (clsx(
            "mykn-button",
            `mykn-button--align-${align}`,
            `mykn-button--size-${size}`,
            `mykn-button--variant-${variant}`,
            {
              "mykn-button--active": active,
              "mykn-button--bold": bold,
              "mykn-button--justify": justify,
              "mykn-button--muted": muted,
              "mykn-button--pad-h": pad === true || pad === "h",
              "mykn-button--pad-v": pad === true || pad === "v",
              "mykn-button--square": square,
              "mykn-button--wrap": wrap,
            },
          ),
          className)
        }
        {...props}
      >
        {props.children}
      </a>
    );
  },
);
ButtonLink.displayName = "ButtonLink";
