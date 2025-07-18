import clsx from "clsx";
import React from "react";

import { ButtonProps } from "../button";
import { Toolbar, ToolbarItem } from "../toolbar";
import { Body, H3 } from "../typography";
import "./card.scss";

export type CardProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
> & {
  /** Buttons to use in the header. */
  actions?: ToolbarItem[];

  /** Border around the card. */
  border?: boolean;

  /** @deprecated: REMOVE IN 3.0 - Renamed to actions. */
  controls?: ButtonProps[];

  /** The (flex) direction. */
  direction?: React.CSSProperties["flexDirection"];

  /** Whether to use `height 100%;`. */
  fullHeight?: boolean;

  /** Justification method. */
  justify?:
    | "start"
    | "end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";

  /** A title for the card. */
  title?: string | React.ReactNode;

  /** asTitle, a component to use as the title. */
  asTitle?: React.ElementType;
};

/**
 * Card component
 */
export const Card: React.FC<CardProps> = ({
  controls = [],
  border = false,
  className,
  actions = controls,
  children,
  direction = "column",
  justify,
  fullHeight = false,
  title,
  asTitle: TitleComponent = H3,
  ...props
}) => {
  // Controls is renamed to actions.
  if (controls && controls.length) {
    console.warn('mykn.components.Card: use of deprecated prop "controls"');
  }

  return (
    <div
      className={clsx(
        "mykn-card",
        {
          "mykn-card--full-height": fullHeight,
          "mykn-card--border": border,
          [`mykn-card--direction-${direction}`]: direction,
          [`mykn-card--justify-${justify}`]: justify,
        },
        className,
      )}
      {...props}
    >
      {(actions.length || title) && (
        <div className="mykn-card__header">
          <Body fullHeight>
            {typeof title === "string" ? (
              <TitleComponent>{title}</TitleComponent>
            ) : (
              title
            )}
          </Body>
          {Boolean(actions?.length) && (
            <Toolbar
              align="end"
              directionResponsive={false}
              size="fit-content"
              pad="h"
              items={actions}
            />
          )}
        </div>
      )}
      {children}
    </div>
  );
};
