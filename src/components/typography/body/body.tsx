import clsx from "clsx";
import React from "react";

import "./body.scss";

export type BodyProps = React.ComponentProps<"div"> & {
  /** Additional class names. */
  className?: string;

  /** Whether to allow overflow scrolling. */
  allowScroll?: undefined | boolean | "h" | "v";

  /** Whether to use `height 100%;`. */
  fullHeight?: boolean;

  /** @deprecated REMOVE IN 3.0 - Renamed to fullHeight. */
  stretch?: boolean;
};

/**
 * Provides styling (e.g. margins) for a group of (typographic) components.
 * Can be used in various components to provide padding.
 */
export const Body: React.FC<BodyProps> = ({
  allowScroll,
  children,
  className,
  stretch,
  fullHeight = false,
  ...props
}) => {
  // Stretch is renamed to fullHeight.
  if (typeof stretch !== "undefined") {
    console.warn('mykn.components.Body: use of deprecated prop "stretch"');
  }

  return (
    <div
      className={clsx(
        "mykn-body",
        {
          "mykn-body--full-height": fullHeight || stretch,
          "mykn-body--allow-scroll-h":
            allowScroll === true || allowScroll === "h",
          "mykn-body--allow-scroll-v":
            allowScroll === true || allowScroll === "v",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
