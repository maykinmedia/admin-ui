import React from "react";

import "./background-image.scss";

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
export const BackgroundImage: React.FC<BackgroundImageProps> = ({
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
