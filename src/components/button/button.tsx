import clsx from "clsx";
import React from "react";

import "./button.scss";

export type ButtonProps = React.PropsWithChildren<{
  variant?: "primary" | "transparent";
}>;

/**
 * Higher-order component (HOC) applying button logic to WrappedComponent
 * @param WrappedComponent
 * @private
 */
const withButtonBehavior = <P extends ButtonProps>(
  WrappedComponent: React.ComponentType<P>,
) => {
  // Define the enhanced component
  const EnhancedButton: React.FC<P> = ({
    children,
    variant = "primary",
    ...props
  }) => {
    return (
      <WrappedComponent
        className={clsx("mykn-button", `mykn-button--variant-${variant}`)}
        {...(props as P)}
      >
        {children}
      </WrappedComponent>
    );
  };

  return EnhancedButton;
};

/**
 * Base template for Button component
 * @private
 */
const BaseButton: React.FC<
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  return <button {...props}>{props.children}</button>;
};

/**
 * Base template for ButtonLink component
 * @private
 */
const BaseButtonLink: React.FC<
  ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = (props) => {
  return <a {...props}>{props.children}</a>;
};

/**
 * Button component
 * @param children
 * @param type
 * @param props
 * @constructor
 */
export const Button = withButtonBehavior(BaseButton);

/**
 * Anchor (<a>) version of button component
 * @param children
 * @param type
 * @param props
 * @constructor
 */
export const ButtonLink = withButtonBehavior(BaseButtonLink);
