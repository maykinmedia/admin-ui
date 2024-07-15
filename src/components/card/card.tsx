import React from "react";

import { Button, ButtonProps } from "../button";
import { Toolbar } from "../toolbar";
import { Body, H1 } from "../typography";
import "./card.scss";

export type CardProps = React.PropsWithChildren<{
  controls?: ButtonProps[];
  title?: string | React.ReactNode;
}>;

/**
 * Card component
 */
export const Card: React.FC<CardProps> = ({
  controls = [],
  children,
  title,
  ...props
}) => (
  <div className="mykn-card" {...props}>
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
