import clsx from "clsx";
import React from "react";

import "./page.scss";

export type PageProps = React.PropsWithChildren<{
  /** Vertical alignment of page content. */
  valign?: "start" | "middle";

  /** Whether to apply padding to the page. */
  pad?: boolean | "h" | "v";

  /** A background image */
  backgroundImageUrl?: string;

  /** The background image opacity */
  backgroundOverlayOpacity?: number;
}>;

/**
 * Provides the base theme for a page.
 */
export const Page: React.FC<PageProps> = ({
  children,
  pad = false,
  valign,
  backgroundImageUrl,
  backgroundOverlayOpacity = 0.5,
  ...props
}) => {
  return (
    <div
      className={clsx("mykn-page", {
        [`mykn-page--valign-${valign}`]: valign,
        "mykn-page--pad-h": pad === true || pad === "h",
        "mykn-page--pad-v": pad === true || pad === "v",
      })}
      {...props}
    >
      {backgroundImageUrl && (
        <BackgroundImage
          backgroundImageUrl={backgroundImageUrl}
          backgroundOverlayOpacity={backgroundOverlayOpacity}
        />
      )}
      {children}
    </div>
  );
};

export type BackgroundImageProps = React.PropsWithChildren<{
  backgroundImageUrl: string;
  backgroundOverlayOpacity: number;
}>;

/**
 * BackgroundImage component
 * @param children
 * @param props
 * @constructor
 */
const BackgroundImage: React.FC<BackgroundImageProps> = ({
  backgroundImageUrl,
  backgroundOverlayOpacity,
}) => (
  <div className="mykn-background-image">
    <div
      className="mykn-background-image__background"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    />
    <div
      className="mykn-background-image__overlay"
      style={{ opacity: backgroundOverlayOpacity }}
    />
  </div>
);
