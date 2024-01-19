import clsx from "clsx";
import React, { LegacyRef } from "react";

import "./button.scss";

type BaseButtonProps = {
  variant?: "primary" | "transparent";
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  BaseButtonProps;

export type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  BaseButtonProps;

/**
 * Button component
 * @param variant
 * @param props
 * @constructor
 */
export const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref as LegacyRef<HTMLButtonElement>}
        className={clsx("mykn-button", `mykn-button--variant-${variant}`)}
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
 * @param variant
 * @param props
 * @constructor
 */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ variant, ...props }, ref) => {
    return (
      <a
        ref={ref as LegacyRef<HTMLAnchorElement>}
        className={clsx("mykn-button", `mykn-button--variant-${variant}`)}
        {...props}
      >
        {props.children}
      </a>
    );
  },
);
ButtonLink.displayName = "ButtonLink";
