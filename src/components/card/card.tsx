import clsx from "clsx";
import React from "react";

import { Button, ButtonProps } from "../button";
import { Toolbar } from "../toolbar";
import { Body, H1 } from "../typography";
import "./card.scss";

export type CardProps = React.PropsWithChildren<{
  /** Buttons to use in the cards' header. */
  controls?: ButtonProps[];

  /** Whether to use `height 100%;`. */
  fullHeight?: boolean;

  /** A title for the card. */
  title?: string | React.ReactNode;
}>;

/**
 * Card component
 */
export const Card: React.FC<CardProps> = ({
  controls = [],
  children,
  fullHeight,
  title,
  ...props
}) => (
  <div
    className={clsx("mykn-card", { "mykn-card--full-height": fullHeight })}
    {...props}
  >
    {(controls.length || title) && (
      <div className="mykn-card__header">
        <Body stretch>
          {typeof title === "string" ? <H1>{title}</H1> : title}
        </Body>
        {Boolean(controls?.length) && (
          <Toolbar align="end" size="fit-content" pad="h">
            {controls.map((buttonProps, index) => (
              <Button key={buttonProps.id || index} {...buttonProps} />
            ))}
          </Toolbar>
        )}
      </div>
    )}
    {children}
  </div>
);
