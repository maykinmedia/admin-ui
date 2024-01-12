import * as outlineHeroIcons from "@heroicons/react/24/outline";
import * as solidHeroIcons from "@heroicons/react/24/solid";
import React from "react";

import "./icon.scss";

export type IconProps = React.SVGProps<SVGElement> & {
  /** The aria-label to set on the SVG element. */
  label: string;

  /** Gets passed as props. */
  [index: string]: unknown;
};

/**
 * Takes Object containing (Heroicons) React.FC components. Each component is
 * mapped to implement IconProps.
 * @param heroIcons e.g.: import * as heroIcons from "@heroicons/react/24/outline";
 */
const mapIcons = (heroIcons: { [index: string]: React.FC }) =>
  Object.fromEntries(
    Object.entries(heroIcons).map(([name, Component]) => {
      const Icon = ({ label, ...props }: IconProps) => (
        <Component
          className="mykn-icon"
          aria-label={label}
          {...(props as IconProps)}
        />
      );

      return [name, Icon];
    }),
  );

const Outline = mapIcons(outlineHeroIcons);
const Solid = mapIcons(solidHeroIcons);

export { Outline, Solid };
