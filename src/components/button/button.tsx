import clsx from "clsx";
import React, { LegacyRef } from "react";

import "./button.scss";

type BaseButtonProps = {
  active?: boolean;
  square?: boolean;
  variant?: "primary" | "outline" | "transparent";
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  BaseButtonProps;

export type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  BaseButtonProps;

/**
 * Button component
 * @param active
 * @param variant
 * @param square
 * @param props
 * @constructor
 */
export const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ active, square = false, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref as LegacyRef<HTMLButtonElement>}
        className={clsx("mykn-button", `mykn-button--variant-${variant}`, {
          "mykn-button--active": active,
          "mykn-button--square": square,
        })}
        {...props}
      >
        {props.children}
      </button>
    );
  },
);
Button.displayName = "Button";

/**
 * Button component
 * @param active
 * @param square
 * @param variant
 * @constructor
 */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ active, square, variant, ...props }, ref) => {
    return (
      <a
        ref={ref as LegacyRef<HTMLAnchorElement>}
        className={clsx("mykn-button", `mykn-button--variant-${variant}`, {
          "mykn-button--active": active,
          "mykn-button--square": square,
        })}
        {...props}
      >
        {props.children}
      </a>
    );
  },
);
ButtonLink.displayName = "ButtonLink";
