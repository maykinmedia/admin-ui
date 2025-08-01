import clsx from "clsx";
import React from "react";

import { P } from "../typography";
import "./iconinitials.scss";

export type IconInitialsProps = React.HTMLAttributes<HTMLParagraphElement> & {
  // Name should be the First and Last name
  name: string;
  // FIXME: Consistency
  size?: "sm" | "md" | "lg";
};

/**
 * IconInitials component. Used to display an icon to show initial letters.
 * @param initials
 * @param size
 * @param props
 * @constructor
 */
export const IconInitials: React.FC<IconInitialsProps> = ({
  name,
  size = "sm",
  ...props
}) => {
  const getInitials = (name: string): string => {
    // Trim the name and split it into an array of words
    const nameParts = name.trim().split(" ");

    // Get the first letter of the first name
    const firstInitial = nameParts[0].charAt(0).toUpperCase();

    // If there's only one word in the name, return just the first initial
    if (nameParts.length === 1) {
      return firstInitial;
    }

    // Otherwise, get the first letter of the last name (or last word in the name)
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

    // Combine the initials
    return firstInitial + lastInitial;
  };

  return (
    <P
      className={clsx(
        "mykn-iconinitials",
        size && `mykn-iconinitials--${size}`,
      )}
      aria-label={name}
      as={"span"}
      {...props}
    >
      {getInitials(name)}
    </P>
  );
};
