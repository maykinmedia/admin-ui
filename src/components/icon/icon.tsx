import * as outlineHeroIcons from "@heroicons/react/24/outline";
import * as solidHeroIcons from "@heroicons/react/24/solid";
import clsx from "clsx";
import React from "react";

import "./icon.scss";

export type IconProps = React.SVGProps<SVGElement> & {
  /** Whether the icon should be hidden (preserving space). */
  hidden?: boolean;

  /** Whether the icon should spin. */
  spin?: boolean;

  /** Whether the icon should be flipped. */
  flipX?: boolean;
};

/**
 * Takes Object containing (Heroicons) React.FC components. Each component is
 * mapped to implement IconProps.
 * @param heroIcons e.g.: import * as heroIcons from "@heroicons/react/24/outline";
 */
const mapIcons = (heroIcons: { [index: string]: React.FC }) =>
  Object.fromEntries(
    Object.entries(heroIcons).map(([name, Component]) => {
      const Icon = ({ flipX, hidden, spin, ...props }: IconProps) => (
        <Component
          className={clsx("mykn-icon", {
            "mykn-icon--flip-x": flipX,
            "mykn-icon--hidden": hidden,
            "mykn-icon--spin": spin,
          })}
          {...(props as IconProps)}
        />
      );

      return [name, Icon];
    }),
  );

type OutlineType = {
  [i in keyof typeof outlineHeroIcons]: React.FC<IconProps>;
};
type SolidType = {
  [i in keyof typeof solidHeroIcons]: React.FC<IconProps>;
};

// @ts-expect-error - Hacky way of re-exporting types.
const Outline: OutlineType = mapIcons(outlineHeroIcons);

// @ts-expect-error - Hacky way of re-exporting types.
const Solid: SolidType = mapIcons(solidHeroIcons);

export { Outline, Solid };
