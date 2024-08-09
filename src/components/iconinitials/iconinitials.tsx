import React from "react";

import "./iconinitials.scss";

export type IconInitialsProps = React.HTMLAttributes<HTMLDivElement> & {
  initials: string;
  size?: string;
  fontSize?: string;
};

/**
 * IconInitials component. Used to display an icon to show initial letters.
 * @param initials
 * @param props
 * @constructor
 */
export const Iconinitials: React.FC<IconInitialsProps> = ({
  initials,
  size = "2em",
  fontSize,
  ...props
}) => {
  const calculatedFontSize = fontSize ? fontSize : `calc(${size} * 0.5)`;
  return (
    <div
      className={"mykn-iconinitials"}
      style={{
        width: size,
        height: size,
        fontSize: calculatedFontSize,
        lineHeight: size,
      }}
      {...props}
    >
      {initials}
    </div>
  );
};
