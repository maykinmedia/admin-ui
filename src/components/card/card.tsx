import clsx from "clsx";
import React from "react";

import { ButtonProps } from "../button";
import { Toolbar, ToolbarItem } from "../toolbar";
import { Body, H3 } from "../typography";
import "./card.scss";

export type CardProps = React.PropsWithChildren<{
  /** Buttons to use in the header. */
  actions?: ToolbarItem[];

  /** @deprecated: REMOVE IN 3.0 - Renamed to actions. */
  controls?: ButtonProps[];

  /** The (flex) direction. */
  direction?: React.CSSProperties["flexDirection"];

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
  actions = controls,
  children,
  direction = "column",
  fullHeight = false,
  title,
  ...props
}) => {
  // Controls is renamed to actions.
  if (controls && controls.length) {
    console.warn('mykn.components.Card: use of deprecated prop "controls"');
  }

  return (
    <div
      className={clsx("mykn-card", {
        "mykn-card--full-height": fullHeight,
        [`mykn-card--direction-${direction}`]: direction,
      })}
      {...props}
    >
      {(actions.length || title) && (
        <div className="mykn-card__header">
          <Body fullHeight>
            {typeof title === "string" ? <H3>{title}</H3> : title}
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
