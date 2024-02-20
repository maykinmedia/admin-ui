import clsx from "clsx";
import React from "react";

import { Outline } from "../../components/icon";
import { ucFirst } from "../../lib/format/string";
import { useIntl } from "../../lib/i18n/useIntl";
import "./bool.scss";

export type BoolProps = {
  /** The value. */
  value: boolean;

  /** Show an icon, even if value is false. */
  explicit?: boolean;

  /** The accessible label when value is truthy. */
  labelTrue?: string;

  /** The accessible label when value is falsy. */
  labelFalse?: string;
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
  labelTrue = "",
  labelFalse = "",
  ...props
}) => {
  const intl = useIntl();
  const _labelTrue =
    labelTrue ||
    intl.formatMessage({
      id: "components.Bool.labelTrue",
      description: "components.Bool: The accessible label when value is truthy",
      defaultMessage: "ja",
    });
  const _labelFalse =
    labelFalse ||
    intl.formatMessage({
      id: "components.Bool.labelFalse",
      description: "components.Bool: The accessible label when value is falsy",
      defaultMessage: "nee",
    });

  return (
    <span
      className={clsx("mykn-bool", `mykn-bool--value-${value}`, {
        "mykn-bool--explicit": explicit,
      })}
      {...props}
      title={ucFirst(value ? _labelTrue : _labelFalse)}
      aria-label={ucFirst(value ? _labelTrue : _labelFalse)}
    >
      {value && <Outline.CheckIcon />}
      {!value && <Outline.XMarkIcon />}
    </span>
  );
};
