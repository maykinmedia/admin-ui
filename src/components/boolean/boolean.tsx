import clsx from "clsx";
import React from "react";

import { Outline } from "../../components/icon";
import "./boolean.scss";

export type BooleanProps = {
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
 * Boolean component, shows a checkmark if `value` is `true`. If `value` is
 * `false` the icon is hidden, unless `explicit` is `true`.
 * @param children
 * @param props
 * @constructor
 */
export const Boolean: React.FC<BooleanProps> = ({
  explicit = false,
  value,
  labelTrue,
  labelFalse,
  ...props
}) => (
  <div
    className={clsx("mykn-boolean", `mykn-boolean--value-${value}`, {
      "mykn-boolean--explicit": explicit,
    })}
    {...props}
    title={value ? labelTrue : labelFalse}
  >
    {value && <Outline.CheckIcon />}
    {!value && explicit && <Outline.XMarkIcon />}
  </div>
);
