import clsx from "clsx";
import React from "react";

import { Outline } from "../../components/icon";
import "./bool.scss";

export type BoolProps = {
  /** The accessible label when value is true. */
  labelTrue: string;

  /** The accessible label when value is false. */
  labelFalse: string;

  /** The value. */
  value: boolean;

  /** Show an icon, even if value is false. */
  explicit?: boolean;
};

/**
 * Bool component, shows a checkmark if `value` is `true`. If `value` is
 * `false` the icon is hidden, unless `explicit` is `true`.
 * @param children
 * @param props
 * @constructor
 */
export const Bool: React.FC<BoolProps> = ({
  explicit = false,
  value,
  labelTrue,
  labelFalse,
  ...props
}) => (
  <span
    className={clsx("mykn-bool", `mykn-bool--value-${value}`, {
      "mykn-bool--explicit": explicit,
    })}
    {...props}
    title={value ? labelTrue : labelFalse}
    aria-label={value ? labelTrue : labelFalse}
  >
    {value && <Outline.CheckIcon />}
    {!value && <Outline.XMarkIcon />}
  </span>
);
